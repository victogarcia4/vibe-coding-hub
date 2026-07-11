// Vibe Coding Tools Data — Obsidian Architect Design

export interface PricingTier {
  label: string;
  monthly: string;
  credits?: string;
  apiCost?: string;
  note?: string;
}

export interface VibeTool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  docsUrl: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  pwaRating: number;
  pricing: string;
  pricingTiers: PricingTier[];
  typicalProjectCost: string;
  color: string;
  badge: string;
}

export const vibeTools: VibeTool[] = [
  {
    id: "manus",
    name: "Manus",
    tagline: "Generalist Agent Mode",
    description:
      "An autonomous AI agent that executes complex, multi-step tasks end-to-end. Manus can research, plan, and build entire projects from a single prompt — making it the most powerful tool for full-lifecycle automation.",
    url: "https://manus.im/",
    docsUrl: "https://manus.im/docs",
    strengths: [
      "End-to-end autonomous task execution",
      "Wide Research for parallel information gathering",
      "Full-stack project generation and deployment",
      "Browser automation and external API integration",
      "Complex multi-step workflow orchestration",
    ],
    weaknesses: [
      "Credits can deplete quickly on complex tasks",
      "Complex tasks may require additional guidance",
      "Platform still actively evolving",
    ],
    bestFor: [
      "Full-lifecycle PWA development from research to deployment",
      "Complex workflows requiring deep documentation synthesis",
      "Automated reporting and multi-source research",
      "Projects requiring external API integration",
    ],
    pwaRating: 5,
    pricing: "From $20/month (4,000 credits)",
    pricingTiers: [
      { label: "Free Trial", monthly: "$0", credits: "Limited credits to explore", note: "Good for testing a single page" },
      { label: "Starter", monthly: "$20/mo", credits: "4,000 credits/month", note: "Enough for 2–4 simple projects" },
      { label: "Pro", monthly: "$50/mo", credits: "10,000 credits/month", note: "Comfortable for active builders" },
    ],
    typicalProjectCost: "A simple landing page: ~200–400 credits ($1–2). A full PWA with auth + database: ~1,000–2,500 credits ($5–12). A complex multi-page SaaS: ~3,000–6,000 credits ($15–30).",
    color: "oklch(0.78 0.18 200)",
    badge: "GENERALIST AGENT",
  },
  {
    id: "lovable",
    name: "Lovable",
    tagline: "UI/UX Iteration Specialist",
    description:
      "A full-stack AI development platform specializing in beautiful, production-grade React frontends. Lovable excels at rapid UI iteration and provides full code ownership via GitHub export — ideal for design-led PWA shells.",
    url: "https://lovable.dev/",
    docsUrl: "https://docs.lovable.dev/",
    strengths: [
      "Exceptional UI/UX generation quality",
      "Full React code ownership and GitHub export",
      "Rapid visual iteration with live preview",
      "Supabase integration for backend",
      "SOC 2 Type II and ISO 27001 certified",
    ],
    weaknesses: [
      "Backend capabilities are limited",
      "No built-in authentication (requires external setup)",
      "Credits deplete quickly during active development",
      "Hosting is preview-only without export",
    ],
    bestFor: [
      "Design-led PWA frontends with custom UI",
      "Rapid prototyping and client demos",
      "Developer handoff with clean React code",
      "Teams prioritizing visual quality and code ownership",
    ],
    pwaRating: 4,
    pricing: "Free / $25/month Pro / $50/month Business",
    pricingTiers: [
      { label: "Free", monthly: "$0", credits: "5 credits/day (30/month)", note: "Good for experimenting" },
      { label: "Pro", monthly: "$25/mo", credits: "100 credits/month + daily bonus", note: "Best for solo builders" },
      { label: "Business", monthly: "$50/mo", credits: "Unlimited collaborators, SSO", note: "For teams and agencies" },
    ],
    typicalProjectCost: "A landing page: ~5–10 credits (free tier). A full PWA prototype: ~20–40 credits ($5–10 on Pro). Active daily iteration: can use 100 credits in a week on Pro plan.",
    color: "oklch(0.82 0.16 85)",
    badge: "UI/UX SPECIALIST",
  },
  {
    id: "emergent",
    name: "Emergent",
    tagline: "Workflow Automation & Full-Stack MVP",
    description:
      "A YC-backed agentic platform that generates complete full-stack applications — frontend, backend, database, and hosting — from a single prompt. Emergent's multi-agent architecture delivers production-ready MVPs at unmatched speed.",
    url: "https://emergent.sh/",
    docsUrl: "https://help.emergent.sh/",
    strengths: [
      "Instant full-stack generation (frontend + backend + DB)",
      "Auto-deployed with live link immediately",
      "Built-in auth, APIs, and data models",
      "1M context window on Pro plan",
      "Y Combinator backed with strong credibility",
    ],
    weaknesses: [
      "No code export — backend stays managed",
      "No visual editor for granular changes",
      "Mobile app support still maturing",
      "Pro plan pricing is higher than competitors",
    ],
    bestFor: [
      "Instant full-stack PWA MVP launches",
      "Solo founders needing speed over control",
      "Backend-heavy ideas without developer resources",
      "Prototypes requiring real auth and data storage",
    ],
    pwaRating: 4,
    pricing: "Free (10 credits) / $20/month / $200/month Pro",
    pricingTiers: [
      { label: "Free", monthly: "$0", credits: "10 credits/month", note: "Enough for 1–2 test builds" },
      { label: "Standard", monthly: "$20/mo", credits: "100 credits/month", note: "Good for regular builders" },
      { label: "Pro", monthly: "$200/mo", credits: "750 credits + 1M context window", note: "For power users and teams" },
    ],
    typicalProjectCost: "A simple MVP: ~5–10 credits ($1–2 on Standard). A full PWA with auth + DB: ~20–40 credits ($4–8). A complex multi-feature app: ~60–120 credits ($12–24).",
    color: "oklch(0.65 0.15 300)",
    badge: "FULL-STACK AGENT",
  },
];

export interface MatrixRow {
  criterion: string;
  manus: string;
  lovable: string;
  emergent: string;
  winner: "manus" | "lovable" | "emergent" | "tie";
}

export const comparisonMatrix: MatrixRow[] = [
  {
    criterion: "PWA Frontend Quality",
    manus: "High — full-stack generation",
    lovable: "Exceptional — design-first React",
    emergent: "Good — auto-generated responsive",
    winner: "lovable",
  },
  {
    criterion: "Backend Automation",
    manus: "Full — autonomous multi-step",
    lovable: "Limited — Supabase only",
    emergent: "Full — auto-generated stack",
    winner: "tie",
  },
  {
    criterion: "Code Ownership",
    manus: "Full — all files accessible",
    lovable: "Full — GitHub export",
    emergent: "None — managed platform",
    winner: "tie",
  },
  {
    criterion: "Speed to MVP",
    manus: "Fast — autonomous execution",
    lovable: "Fast — rapid iteration",
    emergent: "Fastest — single prompt deploy",
    winner: "emergent",
  },
  {
    criterion: "Documentation Synthesis",
    manus: "Excellent — Wide Research",
    lovable: "Basic — prompt context",
    emergent: "Basic — prompt context",
    winner: "manus",
  },
  {
    criterion: "Real-time Data Apps",
    manus: "High — integrates any API",
    lovable: "Medium — via Supabase",
    emergent: "High — auto-configured",
    winner: "manus",
  },
  {
    criterion: "Design Customization",
    manus: "High — full control",
    lovable: "Highest — visual editor",
    emergent: "Low — regenerate only",
    winner: "lovable",
  },
  {
    criterion: "Simple Landing Page",
    manus: "~200–400 credits ($1–2)",
    lovable: "~5–10 credits (free tier)",
    emergent: "~3–5 credits (free tier)",
    winner: "lovable",
  },
  {
    criterion: "Full PWA with Auth + DB",
    manus: "~1,000–2,500 credits ($5–12)",
    lovable: "~20–40 credits ($5–10/Pro)",
    emergent: "~20–40 credits ($4–8/Standard)",
    winner: "tie",
  },
  {
    criterion: "Complex Multi-Page SaaS",
    manus: "~3,000–6,000 credits ($15–30)",
    lovable: "~80–150 credits ($20–37/Pro)",
    emergent: "~60–120 credits ($12–24/Standard)",
    winner: "tie",
  },
  {
    criterion: "GitHub Export",
    manus: "✓ Full codebase",
    lovable: "✓ Full React code",
    emergent: "✗ No export",
    winner: "tie",
  },
  {
    criterion: "Deploy to Vercel / Netlify",
    manus: "✓ Via GitHub export",
    lovable: "✓ Via GitHub export",
    emergent: "✗ Emergent hosting only",
    winner: "tie",
  },
  {
    criterion: "Monthly Subscription Entry",
    manus: "$20/month",
    lovable: "Free / $25/month",
    emergent: "Free / $20/month",
    winner: "tie",
  },
];

