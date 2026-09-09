import assert from "node:assert/strict";
import test from "node:test";
import { POST, OPTIONS } from "../../src/app/api/feedback/route";
import { DIAGNOSTIC_FIELDS } from "../../src/lib/apiContract";
import { OPENAPI } from "../../src/lib/openapi";
import Ajv2020 from "ajv/dist/2020";

const validateError = new Ajv2020().compile(OPENAPI.components.schemas.Error);
const feedback = { category: null, details: "A user-requested test report.", diagnostics: Object.fromEntries(DIAGNOSTIC_FIELDS.map(f => [f, null])) };
let requestId = 0;
function request(body: string = JSON.stringify(feedback), headers: Record<string, string> = {}) {
  return new Request("https://www.trysynara.com/api/feedback", { method: "POST", body, headers: {
    "content-type": "application/json", "x-synara-feedback": "1", "x-forwarded-for": `test-${++requestId}`, ...headers,
  } });
}
async function expectError(response: Response, status: number, code: string) {
  assert.equal(response.status, status);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.json(); assert.ok(validateError(body), JSON.stringify(validateError.errors));
  assert.equal(body.code, code); assert.equal(body.error, body.message);
}

test("feedback validation, origins, size limits and preflight remain compatible", async () => {
  await expectError(await POST(request(undefined, { "x-synara-feedback": "0" })), 400, "INVALID_FEEDBACK");
  await expectError(await POST(request("{")), 400, "INVALID_FEEDBACK");
  await expectError(await POST(request(JSON.stringify({ ...feedback, diagnostics: {} }))), 400, "INVALID_FEEDBACK");
  await expectError(await POST(request(JSON.stringify({ ...feedback, details: " " }))), 400, "INVALID_FEEDBACK");
  await expectError(await POST(request(undefined, { origin: "https://untrusted.example" })), 403, "ORIGIN_NOT_ALLOWED");
  await expectError(await POST(request(" ".repeat(65537))), 413, "PAYLOAD_TOO_LARGE");
  await expectError(await POST(request(undefined, { "content-length": "65537" })), 413, "PAYLOAD_TOO_LARGE");
  for (const origin of ["synara://app", "http://localhost:3000", "http://127.0.0.1:8080", "http://[::1]:8000"]) {
    const response = OPTIONS(new Request("https://www.trysynara.com/api/feedback", { headers: { origin } }));
    assert.equal(response.status, 204); assert.equal(response.headers.get("access-control-allow-origin"), origin);
  }
  await expectError(OPTIONS(new Request("https://www.trysynara.com/api/feedback", { headers: { origin: "https://untrusted.example" } })), 403, "ORIGIN_NOT_ALLOWED");
});

test("feedback delivery and retry errors use the documented schema without sending email", async t => {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.RESEND_API_KEY; const oldTo = process.env.SYNARA_FEEDBACK_TO_EMAIL;
  t.after(() => { globalThis.fetch = oldFetch; for (const [key, value] of [["RESEND_API_KEY", oldKey], ["SYNARA_FEEDBACK_TO_EMAIL", oldTo]]) { if (value === undefined) delete process.env[key!]; else process.env[key!] = value; } });
  delete process.env.RESEND_API_KEY; delete process.env.SYNARA_FEEDBACK_TO_EMAIL;
  globalThis.fetch = async () => { throw new Error("Unexpected network request"); };
  await expectError(await POST(request()), 503, "DELIVERY_UNAVAILABLE");
  process.env.RESEND_API_KEY = "test-key"; process.env.SYNARA_FEEDBACK_TO_EMAIL = "test@example.invalid";
  globalThis.fetch = async () => Response.json({ message: "Mock provider failure" }, { status: 500 });
  await expectError(await POST(request()), 502, "DELIVERY_FAILED");
  globalThis.fetch = async () => { throw new Error("Mock network failure"); };
  await expectError(await POST(request()), 502, "DELIVERY_FAILED");
  let sends = 0;
  globalThis.fetch = async () => { sends++; return Response.json({ id: "mock-delivery-id" }); };
  const success = await POST(request()); assert.equal(success.status, 200); assert.deepEqual(await success.json(), { ok: true });
  for (let i = 0; i < 5; i++) assert.equal((await POST(request(undefined, { "x-forwarded-for": "limited-test" }))).status, 200);
  const limited = await POST(request(undefined, { "x-forwarded-for": "limited-test" }));
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  await expectError(limited, 429, "RATE_LIMITED"); assert.equal(sends, 6);
});
