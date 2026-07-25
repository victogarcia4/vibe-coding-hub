import { describe, it, expect } from "vitest";
import { createEmptyBriefing } from "../engine/schema";
import { recommendVibeTools, recommendDatabases, recommendDeployPlatform } from "../engine/stackRules";

describe("Stack Scoring Engine", () => {
  it("should provide ranked Vibe Tool recommendations with explicit rationale", () => {
    const briefing = createEmptyBriefing();
    briefing.identity.projectType = "saas";
    briefing.capabilities.selected = ["auth", "payments", "realtime", "cron", "llm"];

    const rec = recommendVibeTools(briefing);

    expect(rec.top3.length).toBe(3);
    expect(rec.top3[0].score).toBeGreaterThan(0);
    expect(rec.top3[0].reasons.length).toBeGreaterThan(0);
  });

  it("should recommend relational database for complex data entities", () => {
    const briefing = createEmptyBriefing();
    briefing.capabilities.selected = ["auth", "payments"];
    briefing.data.entities = [
      { name: "User", keyFields: ["id", "email"], sensitivity: "pii" },
      { name: "Order", keyFields: ["id", "user_id"], sensitivity: "payments" },
      { name: "Product", keyFields: ["id", "price"], sensitivity: "none" },
    ];

    const rec = recommendDatabases(briefing);

    expect(rec.top3.length).toBeGreaterThan(0);
    expect(rec.top3[0].id).toMatch(/supabase|neon/);
  });

  it("should recommend Vercel for serverless API routes and cron jobs", () => {
    const briefing = createEmptyBriefing();
    briefing.capabilities.selected = ["payments", "cron"];

    const rec = recommendDeployPlatform(briefing);

    expect(rec.platform).toContain("Vercel");
    expect(rec.reasons.length).toBeGreaterThan(0);
  });
});
