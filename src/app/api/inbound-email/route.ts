// FILE: api/inbound-email/route.ts
// Purpose: Verifies Resend inbound webhooks and forwards the public feedback alias privately.
// Layer: App Router route handler (Node.js runtime)
// Depends on: Resend and server-only webhook/forwarding configuration.

import { apiError } from "@/lib/agentHttp";

import { Resend } from "resend";

export const runtime = "nodejs";

const FEEDBACK_ADDRESS = "feedback@trysynara.com";
const FORWARD_FROM = `Synara Feedback <${FEEDBACK_ADDRESS}>`;

function jsonResponse(body: { error?: string; ok?: boolean; ignored?: boolean }, status: number): Response {
  if (body.error) {
    const code = status === 400 ? "INVALID_WEBHOOK_SIGNATURE" : status === 503 ? "WEBHOOK_UNAVAILABLE" : "WEBHOOK_FORWARD_FAILED";
    const hint = status === 400 ? "Only Resend may call this endpoint; provide a valid signed webhook." : "The maintainer must check inbound email configuration and provider availability.";
    return apiError(code, body.error, hint, status);
  }
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
    },
  });
}

function normalizedAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim().toLowerCase();
}

export async function POST(request: Request): Promise<Response> {
  try {
    return await handleWebhook(request);
  } catch (error) {
    console.error("[inbound-email] webhook failed", error);
    return jsonResponse({ error: "Feedback email could not be forwarded." }, 502);
  }
}

async function handleWebhook(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_INBOUND_API_KEY?.trim();
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  const forwardTo = process.env.SYNARA_FEEDBACK_FORWARD_TO_EMAIL?.trim();
  if (!apiKey || !webhookSecret || !forwardTo) {
    return jsonResponse({ error: "Inbound feedback delivery is not configured." }, 503);
  }

  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) {
    return jsonResponse({ error: "Missing webhook signature." }, 400);
  }

  const resend = new Resend(apiKey);
  const payload = await request.text();
  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret,
    });
  } catch {
    return jsonResponse({ error: "Invalid webhook signature." }, 400);
  }

  if (event.type !== "email.received") {
    return jsonResponse({ ok: true, ignored: true }, 200);
  }

  const isFeedbackRecipient = event.data.to.some(
    (recipient) => normalizedAddress(recipient) === FEEDBACK_ADDRESS,
  );
  const isForwardingLoop = normalizedAddress(event.data.from) === normalizedAddress(forwardTo);
  if (!isFeedbackRecipient || isForwardingLoop) {
    return jsonResponse({ ok: true, ignored: true }, 200);
  }

  const { error } = await resend.emails.receiving.forward(
    {
      emailId: event.data.email_id,
      from: FORWARD_FROM,
      to: forwardTo,
    },
    {
      idempotencyKey: `synara-feedback-forward/${event.data.email_id}`,
    },
  );
  if (error) {
    console.error("[inbound-email] forwarding failed", {
      emailId: event.data.email_id,
      reason: error.message,
    });
    return jsonResponse({ error: "Feedback email could not be forwarded." }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}
