import { expect, test } from "@playwright/test";

const PUBLIC_ENDPOINTS = [
  "/api/installer-count",
  "/api/search",
  "/api/feedback",
] as const;

const EXPECTED_OPERATION_IDS = [
  "getInstallerCount",
  "searchDocs",
  "submitFeedback",
  "feedbackCorsPreflight",
] as const;

const EXPECTED_ERROR_CODES = [
  "forbidden_origin",
  "invalid_client",
  "payload_too_large",
  "rate_limited",
  "invalid_payload",
  "delivery_unavailable",
  "delivery_failed",
  "upstream_unavailable",
] as const;

test.describe("/openapi.json public contract", () => {
  test("serves deterministic JSON with only the approved public surface", async ({
    page,
  }) => {
    // page.request inherits the config baseURL, unlike the bare request fixture.
    const response = await page.request.get("/openapi.json");
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers["content-type"]).toMatch(/application\/json/);
    expect(headers["cache-control"]).toMatch(/public/);
    expect(headers["cache-control"]).toMatch(/s-maxage=86400/);

    const doc = (await response.json()) as {
      openapi: string;
      servers: Array<{ url: string }>;
      info: { contact: { email: string } };
      paths: Record<string, Record<string, { operationId: string }>>;
      components: {
        schemas: { ApiError: { properties: { code: { enum: string[] } } } };
      };
    };

    // Deterministic output: a second fetch returns byte-identical JSON.
    const again = await page.request.get("/openapi.json");
    expect(await again.text()).toBe(await response.text());

    // OpenAPI 3.1 document pointing at the canonical production origin.
    expect(doc.openapi).toBe("3.1.0");
    expect(doc.servers[0].url).toBe("https://www.trysynara.com");
    expect(doc.info.contact.email).toBe("feedback@trysynara.com");

    // Every approved public route is documented and nothing else is.
    const paths = doc.paths;
    expect(Object.keys(paths).sort()).toEqual([...PUBLIC_ENDPOINTS].sort());
    for (const endpoint of PUBLIC_ENDPOINTS) {
      expect(paths[endpoint]).toBeTruthy();
    }

    // Operation ids are unique and the full expected set is present.
    const operationIds = Object.values(paths)
      .flatMap((pathItem) => Object.values(pathItem))
      .map((operation) => operation.operationId)
      .sort();
    expect(operationIds).toEqual([...EXPECTED_OPERATION_IDS].sort());

    // The error enum is derived from the stable phase-4 code set.
    const errorEnum = doc.components.schemas.ApiError.properties.code.enum;
    expect([...errorEnum].sort()).toEqual([...EXPECTED_ERROR_CODES].sort());

    // The private webhook and secret-dependent details stay out of the contract.
    const serialized = JSON.stringify(doc);
    expect(serialized).not.toMatch(/inbound-email/);
    expect(serialized).not.toMatch(/svix|webhook[_-]?secret|RESEND|api[_ -]?key/i);
  });
});
