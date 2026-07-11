// Vibe Coding Tools Data — Obsidian Architect Design

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
  pwaRating: number; // 1-5
  pricing: string;
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
    criterion: "Pricing (Entry)",
    manus: "$20/month",
    lovable: "Free / $25/month",
    emergent: "Free / $20/month",
    winner: "tie",
  },
];

