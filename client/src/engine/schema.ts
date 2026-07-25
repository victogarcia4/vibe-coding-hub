// ─── Briefing Schema ─────────────────────────────────────────────────────────
// Zod-validated schema for the 6-section project briefing.
// Pure TypeScript, zero backend dependencies.

import { z } from "zod";

// ─── Section 1: Identity ─────────────────────────────────────────────────────

export const ProjectTypeEnum = z.enum([
  "landing", "portfolio", "store", "saas", "dashboard", "crm",
  "funnel", "blog", "slides", "mobile", "pwa", "booking", "marketplace",
  "internal",
]);
export type ProjectType = z.infer<typeof ProjectTypeEnum>;

export const ObjectiveEnum = z.enum([
  "personal", "directSale", "subscription", "clientProject",
]);
export type Objective = z.infer<typeof ObjectiveEnum>;

export const IdentitySchema = z.object({
  name: z.string().min(1).max(80),
  tagline: z.string().max(200).default(""),
  projectType: ProjectTypeEnum,
  objective: ObjectiveEnum,
});

// ─── Section 2: Users ────────────────────────────────────────────────────────

export const TechLevelEnum = z.enum(["none", "basic", "intermediate", "advanced"]);
export type TechLevel = z.infer<typeof TechLevelEnum>;

export const DeviceEnum = z.enum(["mobile", "desktop", "both"]);
export type Device = z.infer<typeof DeviceEnum>;

export const PersonaSchema = z.object({
  role: z.string().min(1).max(80),
  mainPain: z.string().max(200).default(""),
  context: z.string().max(200).default(""),
  techLevel: TechLevelEnum,
});

export const UsersSchema = z.object({
  personas: z.array(PersonaSchema).min(1).max(3),
  primaryDevice: DeviceEnum,
  expectedVolume: z.enum(["small", "medium", "large", "enterprise"]).default("small"),
});

// ─── Section 3: Capabilities ─────────────────────────────────────────────────

export const CapabilitiesSchema = z.object({
  selected: z.array(z.string()).min(0),
});

// ─── Section 4: Data ─────────────────────────────────────────────────────────

export const SensitivityEnum = z.enum(["none", "pii", "health", "payments"]);
export type Sensitivity = z.infer<typeof SensitivityEnum>;

export const EntitySchema = z.object({
  name: z.string().min(1).max(60),
  keyFields: z.array(z.string()).default([]),
  sensitivity: SensitivityEnum.default("none"),
});

export const DataSchema = z.object({
  entities: z.array(EntitySchema).default([]),
  retentionMonths: z.number().min(0).max(120).default(24),
});

// ─── Section 5: Constraints ──────────────────────────────────────────────────

export const BudgetEnum = z.enum(["free", "low", "medium", "high"]);
export type Budget = z.infer<typeof BudgetEnum>;

export const YourTechLevelEnum = z.enum(["none", "basic", "intermediate", "advanced"]);
export type YourTechLevel = z.infer<typeof YourTechLevelEnum>;

export const PreferredToolEnum = z.enum(["manus", "lovable", "emergent", "recommend"]);
export type PreferredTool = z.infer<typeof PreferredToolEnum>;

export const DeployPlatformEnum = z.enum(["vercel", "netlify", "cloudflare", "other", "recommend"]);
export type DeployPlatform = z.infer<typeof DeployPlatformEnum>;

export const ConstraintsSchema = z.object({
  monthlyBudget: BudgetEnum.default("free"),
  targetDate: z.string().max(40).default(""),
  yourTechLevel: YourTechLevelEnum.default("none"),
  preferredTool: PreferredToolEnum.default("recommend"),
  deployPlatform: DeployPlatformEnum.default("recommend"),
});

// ─── Section 6: Branding & Aesthetic ─────────────────────────────────────────

export const DensityEnum = z.enum(["spacious", "balanced", "dense"]);
export type Density = z.infer<typeof DensityEnum>;

export const BrandingSchema = z.object({
  toneAdjectives: z.array(z.string()).max(3).default([]),
  visualReference: z.string().max(200).default(""),
  density: DensityEnum.default("balanced"),
  baseColor: z.string().max(30).default("#6366f1"),
  hasLogo: z.boolean().default(false),
});

// ─── Full Briefing ───────────────────────────────────────────────────────────

export const BriefingSchema = z.object({
  identity: IdentitySchema,
  users: UsersSchema,
  capabilities: CapabilitiesSchema,
  data: DataSchema,
  constraints: ConstraintsSchema,
  branding: BrandingSchema,
});

export type Briefing = z.infer<typeof BriefingSchema>;

// ─── Quick Mode Defaults ─────────────────────────────────────────────────────
// In quick mode, only 8 questions are required. The rest use sensible defaults.

export function createEmptyBriefing(): Briefing {
  return {
    identity: { name: "", tagline: "", projectType: "pwa", objective: "personal" },
    users: {
      personas: [{ role: "", mainPain: "", context: "", techLevel: "basic" }],
      primaryDevice: "mobile",
      expectedVolume: "small",
    },
    capabilities: { selected: [] },
    data: { entities: [], retentionMonths: 24 },
    constraints: {
      monthlyBudget: "free",
      targetDate: "",
      yourTechLevel: "none",
      preferredTool: "recommend",
      deployPlatform: "recommend",
    },
    branding: {
      toneAdjectives: [],
      visualReference: "",
      density: "balanced",
      baseColor: "#6366f1",
      hasLogo: false,
    },
  };
}

// ─── Section Completeness ────────────────────────────────────────────────────

export function getSectionCompleteness(briefing: Briefing): Record<string, number> {
  const id = briefing.identity;
  const identityScore = [id.name, id.tagline, id.projectType, id.objective]
    .filter(Boolean).length / 4;

  const u = briefing.users;
  const personaScore = u.personas.length > 0 && u.personas[0].role ? 1 : 0;
  const usersScore = (personaScore + (u.primaryDevice ? 1 : 0)) / 2;

  const capScore = briefing.capabilities.selected.length > 0 ? 1 : 0;

  const dataScore = briefing.data.entities.length > 0 ? 1 : 0;

  const c = briefing.constraints;
  const constraintScore = [c.monthlyBudget, c.yourTechLevel].filter(Boolean).length / 2;

  const b = briefing.branding;
  const brandScore = [
    b.toneAdjectives.length > 0 ? 1 : 0,
    b.baseColor ? 1 : 0,
  ].reduce((a, c) => a + c, 0) / 2;

  return {
    identity: identityScore,
    users: usersScore,
    capabilities: capScore,
    data: dataScore,
    constraints: constraintScore,
    branding: brandScore,
  };
}

export function getOverallCompleteness(briefing: Briefing): number {
  const sections = getSectionCompleteness(briefing);
  const values = Object.values(sections);
  return values.reduce((a, b) => a + b, 0) / values.length;
}
