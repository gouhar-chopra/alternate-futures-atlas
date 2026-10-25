import { describe, expect, it } from "vitest";
import { simulationFailure } from "@/lib/simulate-errors";

describe("Managed Gateway failures", () => {
  it("reports invalid managed credentials as configuration, not network", () => {
    expect(simulationFailure({ statusCode: 401 }).code).toBe("not_configured");
  });
  it("preserves the safe credit remedy", () => {
    expect(simulationFailure({ statusCode: 402, responseBody: JSON.stringify({ message: "Add AI credits to continue." }) })).toEqual({ ok: false, code: "credits", message: "Add AI credits to continue." });
  });
  it("preserves a denial rather than mislabeling it as a credit shortage", () => {
    expect(simulationFailure({ statusCode: 403, responseBody: JSON.stringify({ error: { message: "Provider access denied for this workspace." } }) }).message).toBe("Provider access denied for this workspace.");
  });
  it("treats an unavailable endpoint as configuration", () => {
    expect(simulationFailure({ statusCode: 404 }).code).toBe("not_configured");
  });
  it("does not return credentials from error responses", () => {
    expect(simulationFailure({ statusCode: 401, responseBody: JSON.stringify({ message: "Authorization: Bearer secret-value" }) }).message).not.toContain("secret-value");
  });
});