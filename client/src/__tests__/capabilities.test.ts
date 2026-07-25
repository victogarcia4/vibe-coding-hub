import { describe, it, expect } from "vitest";
import {
  capabilities, getCapability, getCapabilities,
  getDependencyChain, getAllRequirements, getAllUserStories, getAllDataModel
} from "../engine/capabilities";

describe("Capabilities Engine", () => {
  it("should contain capabilities in the catalog", () => {
    expect(capabilities.length).toBeGreaterThanOrEqual(24);
  });

  it("should retrieve a single capability by ID", () => {
    const auth = getCapability("auth");
    expect(auth).toBeDefined();
    expect(auth?.labelEn).toBe("Authentication");
  });

  it("should resolve capability dependency chain", () => {
    // 'roles' depends on 'auth'
    const chain = getDependencyChain(["roles"]);
    expect(chain).toContain("roles");
    expect(chain).toContain("auth");
  });

  it("should extract all functional requirements for selected capabilities", () => {
    const reqs = getAllRequirements(["auth", "payments"]);
    expect(reqs.length).toBeGreaterThan(0);
    expect(reqs.some((r) => r.id.startsWith("RF-"))).toBe(true);
  });

  it("should extract user stories in Given/When/Then format", () => {
    const stories = getAllUserStories(["auth"]);
    expect(stories.length).toBeGreaterThan(0);
    expect(stories[0].acceptance.length).toBeGreaterThan(0);
  });

  it("should extract data model entries for SQL DDL generation", () => {
    const dataModels = getAllDataModel(["auth", "payments"]);
    expect(dataModels.length).toBeGreaterThan(0);
    expect(dataModels.some((dm) => dm.table === "users")).toBe(true);
  });
});
