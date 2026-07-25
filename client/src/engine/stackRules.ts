// ─── Stack Recommendation Engine ────────────────────────────────────────────
// Score-based recommendation replacing primitive if/else logic.
// Scores each option against the briefing on multiple axes and returns
// ranked results with explicit rationale and trade-offs.

import type { Briefing } from "./schema";

// ─── Scoring Types ───────────────────────────────────────────────────────────

export interface ScoredOption {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  reasons: string[];      // Why this scored well
  tradeoffs: string[];    // Limitations / caveats
}

export interface Recommendation {
  top3: ScoredOption[];
  whyNotOthers: { name: string; reason: string }[];
}

// ─── Vibe Tool Scoring ───────────────────────────────────────────────────────

interface ToolProfile {
  id: string;
  name: string;
  strengths: string[];
  // Scoring axes (0-10 each)
  axes: {
    complexity: number;     // Handles complex projects
    simplicity: number;     // Best for simple projects
    codeExport: number;     // Can export code to GitHub
    autonomy: number;       // Works autonomously
    visualEditor: number;   // Has visual editing
    pwaSupport: number;     // PWA features
    realtimeDb: number;     // Built-in realtime DB
    budgetFriendly: number; // Cost-effective
    techLevelLow: number;   // Good for non-technical users
    enterprise: number;     // Enterprise-grade features
  };
}

const toolProfiles: ToolProfile[] = [
  {
    id: "manus",
    name: "Manus",
    strengths: ["Full autonomy", "Complex projects", "Backend integration", "Multi-file codebases"],
    axes: {
      complexity: 10, simplicity: 5, codeExport: 8, autonomy: 10,
      visualEditor: 3, pwaSupport: 7, realtimeDb: 6, budgetFriendly: 5,
      techLevelLow: 7, enterprise: 9,
    },
  },
  {
    id: "lovable",
    name: "Lovable",
    strengths: ["Beautiful UI", "Visual editor", "GitHub sync", "React-first"],
    axes: {
      complexity: 6, simplicity: 9, codeExport: 10, autonomy: 6,
      visualEditor: 10, pwaSupport: 5, realtimeDb: 4, budgetFriendly: 7,
      techLevelLow: 9, enterprise: 4,
    },
  },
  {
    id: "emergent",
    name: "Emergent",
    strengths: ["One-prompt deploy", "Built-in hosting", "Full-stack from single prompt"],
    axes: {
      complexity: 4, simplicity: 10, codeExport: 3, autonomy: 8,
      visualEditor: 2, pwaSupport: 3, realtimeDb: 7, budgetFriendly: 10,
      techLevelLow: 10, enterprise: 2,
    },
  },
];

function scoreToolForBriefing(tool: ToolProfile, b: Briefing): ScoredOption {
  let score = 0;
  let maxScore = 0;
  const reasons: string[] = [];
  const tradeoffs: string[] = [];

  // Axis: Complexity
  const isComplex = ["saas", "dashboard", "crm", "marketplace"].includes(b.identity.projectType);
  const isEnterprise = b.users.expectedVolume === "enterprise";
  const capCount = b.capabilities.selected.length;

  if (isComplex || capCount > 8) {
    const w = 3;
    maxScore += 10 * w;
    score += tool.axes.complexity * w;
    if (tool.axes.complexity >= 8) reasons.push("Handles complex, multi-feature projects well");
    if (tool.axes.complexity < 5) tradeoffs.push("May struggle with complex architectures");
  } else {
    const w = 2;
    maxScore += 10 * w;
    score += tool.axes.simplicity * w;
    if (tool.axes.simplicity >= 8) reasons.push("Excellent for simpler projects — fast to ship");
    if (tool.axes.simplicity < 5) tradeoffs.push("Overkill for simple projects");
  }

  // Axis: Code Export
  const needsExport = b.constraints.deployPlatform !== "other";
  if (needsExport) {
    const w = 2;
    maxScore += 10 * w;
    score += tool.axes.codeExport * w;
    if (tool.axes.codeExport >= 8) reasons.push("Easy code export to GitHub for deployment");
    if (tool.axes.codeExport < 5) tradeoffs.push("Limited code export — harder to deploy externally");
  }

  // Axis: Autonomy
  const w_auto = b.constraints.yourTechLevel === "none" || b.constraints.yourTechLevel === "basic" ? 3 : 1;
  maxScore += 10 * w_auto;
  score += tool.axes.autonomy * w_auto;
  if (tool.axes.autonomy >= 8 && w_auto > 1) reasons.push("High autonomy — great for non-technical users");

  // Axis: Visual Editor
  if (b.constraints.yourTechLevel === "none") {
    const w = 2;
    maxScore += 10 * w;
    score += tool.axes.visualEditor * w;
    if (tool.axes.visualEditor >= 8) reasons.push("Visual editor lets you tweak UI without code");
    if (tool.axes.visualEditor < 5) tradeoffs.push("No visual editor — changes require re-prompting");
  }

  // Axis: PWA
  if (b.identity.projectType === "pwa") {
    const w = 2;
    maxScore += 10 * w;
    score += tool.axes.pwaSupport * w;
    if (tool.axes.pwaSupport >= 7) reasons.push("Good PWA support — offline, installable");
    if (tool.axes.pwaSupport < 5) tradeoffs.push("Limited PWA support");
  }

  // Axis: Real-time
  const hasRealtime = b.capabilities.selected.includes("realtime");
  if (hasRealtime) {
    const w = 2;
    maxScore += 10 * w;
    score += tool.axes.realtimeDb * w;
    if (tool.axes.realtimeDb >= 7) reasons.push("Built-in or strong real-time data support");
    if (tool.axes.realtimeDb < 5) tradeoffs.push("Real-time features require manual database setup");
  }

  // Axis: Budget
  if (b.constraints.monthlyBudget === "free" || b.constraints.monthlyBudget === "low") {
    const w = 2;
    maxScore += 10 * w;
    score += tool.axes.budgetFriendly * w;
    if (tool.axes.budgetFriendly >= 8) reasons.push("Cost-effective — generous free tier");
    if (tool.axes.budgetFriendly < 5) tradeoffs.push("Higher cost than alternatives");
  }

  // Axis: Enterprise
  if (isEnterprise) {
    const w = 3;
    maxScore += 10 * w;
    score += tool.axes.enterprise * w;
    if (tool.axes.enterprise >= 8) reasons.push("Enterprise-grade features and scalability");
    if (tool.axes.enterprise < 5) tradeoffs.push("Not designed for enterprise workloads");
  }

  // Axis: Tech level
  const w_tech = 1;
  maxScore += 10 * w_tech;
  score += tool.axes.techLevelLow * w_tech;

  return { id: tool.id, name: tool.name, score, maxScore, reasons, tradeoffs };
}

export function recommendVibeTools(briefing: Briefing): Recommendation {
  const scored = toolProfiles
    .map((t) => scoreToolForBriefing(t, briefing))
    .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore));

  const top3 = scored.slice(0, 3);
  const whyNotOthers = scored.slice(3).map((s) => ({
    name: s.name,
    reason: s.tradeoffs[0] || "Lower overall score for your project profile",
  }));

  return { top3, whyNotOthers };
}

// ─── Database Scoring ────────────────────────────────────────────────────────

interface DbProfile {
  id: string;
  name: string;
  axes: {
    relational: number;
    realtime: number;
    flexibility: number;
    freeVol: number;
    serverless: number;
    ecosystem: number;
    sqlFriendly: number;
  };
}

const dbProfiles: DbProfile[] = [
  {
    id: "supabase",
    name: "Supabase (Postgres)",
    axes: { relational: 10, realtime: 7, flexibility: 6, freeVol: 8, serverless: 7, ecosystem: 9, sqlFriendly: 10 },
  },
  {
    id: "neon",
    name: "Neon (Postgres)",
    axes: { relational: 10, realtime: 4, flexibility: 6, freeVol: 9, serverless: 10, ecosystem: 7, sqlFriendly: 10 },
  },
  {
    id: "convex",
    name: "Convex",
    axes: { relational: 4, realtime: 10, flexibility: 8, freeVol: 7, serverless: 10, ecosystem: 6, sqlFriendly: 2 },
  },
  {
    id: "firebase",
    name: "Firebase",
    axes: { relational: 3, realtime: 9, flexibility: 7, freeVol: 8, serverless: 9, ecosystem: 10, sqlFriendly: 1 },
  },
  {
    id: "mongodb",
    name: "MongoDB Atlas",
    axes: { relational: 3, realtime: 5, flexibility: 10, freeVol: 8, serverless: 8, ecosystem: 8, sqlFriendly: 1 },
  },
];

function scoreDbForBriefing(db: DbProfile, b: Briefing): ScoredOption {
  let score = 0;
  let maxScore = 0;
  const reasons: string[] = [];
  const tradeoffs: string[] = [];

  // Data relationships
  const hasEntities = b.data.entities.length > 2;
  const hasPayments = b.capabilities.selected.includes("payments");
  const hasRoles = b.capabilities.selected.includes("roles");
  const needsRelational = hasEntities || hasPayments || hasRoles;

  if (needsRelational) {
    const w = 3;
    maxScore += 10 * w;
    score += db.axes.relational * w;
    if (db.axes.relational >= 8) reasons.push("Strong relational data support with JOINs and foreign keys");
    if (db.axes.relational < 5) tradeoffs.push("Weak relational model — complex queries are harder");
  }

  // Realtime
  const hasRealtime = b.capabilities.selected.includes("realtime") || b.capabilities.selected.includes("messaging");
  if (hasRealtime) {
    const w = 3;
    maxScore += 10 * w;
    score += db.axes.realtime * w;
    if (db.axes.realtime >= 8) reasons.push("Excellent real-time data synchronization");
    if (db.axes.realtime < 5) tradeoffs.push("Real-time requires additional setup");
  }

  // Flexibility (document-style)
  if (!needsRelational) {
    const w = 2;
    maxScore += 10 * w;
    score += db.axes.flexibility * w;
    if (db.axes.flexibility >= 8) reasons.push("Flexible schema — iterate without migrations");
  }

  // Budget
  if (b.constraints.monthlyBudget === "free" || b.constraints.monthlyBudget === "low") {
    const w = 2;
    maxScore += 10 * w;
    score += db.axes.freeVol * w;
    if (db.axes.freeVol >= 8) reasons.push("Generous free tier");
  }

  // Serverless
  const w_sl = 1;
  maxScore += 10 * w_sl;
  score += db.axes.serverless * w_sl;

  // Ecosystem
  const w_eco = 1;
  maxScore += 10 * w_eco;
  score += db.axes.ecosystem * w_eco;

  // SQL-friendly (for export/DDL)
  if (b.constraints.yourTechLevel === "intermediate" || b.constraints.yourTechLevel === "advanced") {
    const w = 1;
    maxScore += 10 * w;
    score += db.axes.sqlFriendly * w;
    if (db.axes.sqlFriendly >= 8) reasons.push("SQL-native — familiar query language");
  }

  return { id: db.id, name: db.name, score, maxScore, reasons, tradeoffs };
}

export function recommendDatabases(briefing: Briefing): Recommendation {
  // Check if database is even needed
  const capIds = briefing.capabilities.selected;
  const needsDb = capIds.length > 0 || briefing.data.entities.length > 0;

  if (!needsDb) {
    return {
      top3: [{
        id: "none",
        name: "No database needed",
        score: 10,
        maxScore: 10,
        reasons: ["Your project is static — no data storage required"],
        tradeoffs: [],
      }],
      whyNotOthers: dbProfiles.map((d) => ({
        name: d.name,
        reason: "No database needed for a static project",
      })),
    };
  }

  const scored = dbProfiles
    .map((d) => scoreDbForBriefing(d, briefing))
    .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore));

  const top3 = scored.slice(0, 3);
  const whyNotOthers = scored.slice(3).map((s) => ({
    name: s.name,
    reason: s.tradeoffs[0] || "Lower overall score for your data requirements",
  }));

  return { top3, whyNotOthers };
}

// ─── Deploy Platform Scoring ─────────────────────────────────────────────────

export interface DeployRecommendation {
  platform: string;
  reasons: string[];
}

export function recommendDeployPlatform(briefing: Briefing): DeployRecommendation {
  if (briefing.constraints.deployPlatform !== "recommend") {
    const names: Record<string, string> = {
      vercel: "Vercel", netlify: "Netlify", cloudflare: "Cloudflare Pages", other: "Custom",
    };
    return {
      platform: names[briefing.constraints.deployPlatform] || briefing.constraints.deployPlatform,
      reasons: ["User-selected platform"],
    };
  }

  const hasServerSide = briefing.capabilities.selected.some((c) =>
    ["payments", "webhooks", "cron", "email"].includes(c)
  );

  if (hasServerSide) {
    return {
      platform: "Vercel",
      reasons: [
        "Serverless Functions for API routes and webhooks",
        "Built-in cron jobs support",
        "Excellent Next.js / Vite integration",
        "Generous free tier (100 GB bandwidth)",
      ],
    };
  }

  return {
    platform: "Vercel or Netlify",
    reasons: [
      "Both offer excellent static site hosting",
      "Auto-deploy from GitHub on every push",
      "Free SSL and custom domains",
      "CDN-backed for global performance",
    ],
  };
}
