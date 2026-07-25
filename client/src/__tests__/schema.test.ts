import { describe, it, expect } from "vitest";
import { createEmptyBriefing, getSectionCompleteness, getOverallCompleteness } from "../engine/schema";

describe("Briefing Schema Engine", () => {
  it("should create a valid empty briefing structure", () => {
    const briefing = createEmptyBriefing();

    expect(briefing).toBeDefined();
    expect(briefing.identity.name).toBe("");
    expect(briefing.identity.projectType).toBe("pwa");
    expect(briefing.users.personas).toHaveLength(1);
    expect(briefing.capabilities.selected).toEqual([]);
  });

  it("should calculate section completeness correctly", () => {
    const briefing = createEmptyBriefing();
    const initialSection = getSectionCompleteness(briefing);

    expect(initialSection.identity).toBe(0.5);

    // Fill in name and tagline
    briefing.identity.name = "My Test App";
    briefing.identity.tagline = "Awesome product tagline";

    const updatedSection = getSectionCompleteness(briefing);
    expect(updatedSection.identity).toBe(1);
  });

  it("should calculate overall briefing completeness", () => {
    const briefing = createEmptyBriefing();
    const initialOverall = getOverallCompleteness(briefing);
    expect(initialOverall).toBeGreaterThan(0.3);

    briefing.identity.name = "Complete App";
    briefing.identity.tagline = "Full app tagline";
    briefing.users.personas[0].role = "Developer";
    briefing.users.personas[0].mainPain = "Manual setup";
    briefing.capabilities.selected = ["auth", "payments"];

    expect(getOverallCompleteness(briefing)).toBeGreaterThan(initialOverall);
  });
});
