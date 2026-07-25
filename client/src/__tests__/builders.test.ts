import { describe, it, expect } from "vitest";
import { createEmptyBriefing } from "../engine/schema";
import { buildPrd } from "../engine/builders/prd";
import { buildTrd } from "../engine/builders/trd";
import { buildActionPlan } from "../engine/builders/actionPlan";
import { buildUxBrief } from "../engine/builders/uxBrief";
import { buildPromptPack } from "../engine/builders/promptPack";

describe("Document Builders Engine", () => {
  const briefing = createEmptyBriefing();
  briefing.identity.name = "Architect Hub";
  briefing.identity.projectType = "saas";
  briefing.identity.tagline = "Build products faster with AI agents";
  briefing.capabilities.selected = ["auth", "payments", "realtime"];

  it("should generate a complete PRD in Spanish and English", () => {
    const prdEs = buildPrd(briefing, { lang: "es" });
    const prdEn = buildPrd(briefing, { lang: "en" });

    expect(prdEs).toContain("# Documento de Requisitos de Producto (PRD)");
    expect(prdEs).toContain("Architect Hub");
    expect(prdEn).toContain("# Product Requirements Document (PRD)");
    expect(prdEn).toContain("Architect Hub");
  });

  it("should generate a complete TRD with Mermaid diagrams and DDL", () => {
    const trd = buildTrd(briefing, { lang: "es" });

    expect(trd).toContain("```mermaid");
    expect(trd).toContain("CREATE TABLE IF NOT EXISTS");
    expect(trd).toContain("ROW LEVEL SECURITY");
  });

  it("should generate a phased Action Plan with checkable tasks", () => {
    const actionPlan = buildActionPlan(briefing, { lang: "es" });

    expect(actionPlan).toContain("# Plan de Acción");
    expect(actionPlan).toContain("- [ ]");
  });

  it("should generate a UX Brief with OKLCH CSS tokens", () => {
    const uxBrief = buildUxBrief(briefing, { lang: "es" });

    expect(uxBrief).toContain("# Brief de UX/UI");
    expect(uxBrief).toContain("oklch(");
    expect(uxBrief).toContain(":root");
  });

  it("should generate a Prompt Pack with English AI prompts", () => {
    const promptPack = buildPromptPack(briefing, { lang: "es" });

    expect(promptPack).toContain("# Paquete de Prompts");
    expect(promptPack).toContain("You are an expert full-stack engineer.");
    expect(promptPack).toContain("CLAUDE.md");
    expect(promptPack).toContain("AGENTS.md");
  });
});
