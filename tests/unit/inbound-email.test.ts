import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";
import { POST } from "../../src/app/api/inbound-email/route";

const secret = Buffer.from("local-test-secret-no-production-access").toString("base64");
function signedRequest(event: object) {
  const body = JSON.stringify(event); const id = "msg_local_test"; const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac("sha256", Buffer.from(secret, "base64")).update(`${id}.${timestamp}.${body}`).digest("base64");
  return new Request("https://www.trysynara.com/api/inbound-email", { method: "POST", body, headers: { "svix-id": id, "svix-timestamp": timestamp, "svix-signature": `v1,${signature}` } });
}

test("private webhook errors remain JSON and signed callbacks keep their behavior", async t => {
  const keys = ["RESEND_INBOUND_API_KEY", "RESEND_WEBHOOK_SECRET", "SYNARA_FEEDBACK_FORWARD_TO_EMAIL"];
  const previous = keys.map(k => process.env[k]); const oldFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = oldFetch; keys.forEach((k, i) => { if (previous[i] === undefined) delete process.env[k]; else process.env[k] = previous[i]; }); });
  keys.forEach(k => delete process.env[k]);
  async function error(response: Response, status: number, code: string) {
    assert.equal(response.status, status); const body = await response.json();
    assert.equal(body.code, code); assert.equal(body.error, body.message); assert.ok(body.hint);
    assert.match(response.headers.get("content-type")!, /application\/json/);
  }
  globalThis.fetch = async () => { throw new Error("No real email delivery allowed in this test"); };
  await error(await POST(signedRequest({ type: "ignored" })), 503, "WEBHOOK_UNAVAILABLE");
  process.env.RESEND_INBOUND_API_KEY = "re_local_test"; process.env.RESEND_WEBHOOK_SECRET = `whsec_${secret}`; process.env.SYNARA_FEEDBACK_FORWARD_TO_EMAIL = "owner@example.invalid";
  await error(await POST(new Request("https://www.trysynara.com/api/inbound-email", { method: "POST", body: "{}" })), 400, "INVALID_WEBHOOK_SIGNATURE");
  const invalid = signedRequest({ type: "ignored" }); invalid.headers.set("svix-signature", "v1,invalid");
  await error(await POST(invalid), 400, "INVALID_WEBHOOK_SIGNATURE");
  const ignored = await POST(signedRequest({ type: "email.delivered" })); assert.equal(ignored.status, 200); assert.deepEqual(await ignored.json(), { ok: true, ignored: true });
  const event = { type: "email.received", data: { to: ["feedback@trysynara.com"], from: "writer@example.invalid", email_id: "email_local_test" } };
  const loop = await POST(signedRequest({ ...event, data: { ...event.data, from: "owner@example.invalid" } })); assert.deepEqual(await loop.json(), { ok: true, ignored: true });
  globalThis.fetch = async () => Response.json({ message: "Mock upstream failure", name: "application_error" }, { status: 500 });
  await error(await POST(signedRequest(event)), 502, "WEBHOOK_FORWARD_FAILED");
  // A valid signature over an unexpected payload must not escape as HTML/500.
  await error(await POST(signedRequest({ type: "email.received", data: {} })), 502, "WEBHOOK_FORWARD_FAILED");
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/emails/receiving/")) return Response.json({ subject: "Test feedback", raw: { download_url: "https://example.invalid/mock.eml" } });
    if (url.endsWith("/mock.eml")) return new Response("From: writer@example.invalid\r\nTo: feedback@trysynara.com\r\nSubject: Test feedback\r\n\r\nTest message");
    assert.equal(url, "https://api.resend.com/emails");
    return Response.json({ id: "mock-forward-id" });
  };
  const forwarded = await POST(signedRequest(event)); assert.equal(forwarded.status, 200); assert.deepEqual(await forwarded.json(), { ok: true });
});
