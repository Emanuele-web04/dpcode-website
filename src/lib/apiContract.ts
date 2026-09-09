export const API_METHODS: Record<string, readonly string[]> = {
  "/api": ["GET", "HEAD", "OPTIONS"],
  "/api/search": ["GET", "HEAD", "OPTIONS"],
  "/api/installer-count": ["GET", "HEAD", "OPTIONS"],
  "/api/feedback": ["POST", "OPTIONS"],
  // Provider-signed service callback; not a public agent operation.
  "/api/inbound-email": ["POST", "OPTIONS"],
};

export const DIAGNOSTIC_FIELDS = [
  "appVersion", "submittedAt", "provider", "model", "projectKind",
  "environmentMode", "runtimeMode", "interactionMode", "sessionStatus",
  "latestTurnState", "messageCount", "activityCount", "hasPendingApproval",
  "hasPendingUserInput", "hasThreadError", "userAgent", "platform", "language", "viewport",
] as const;
