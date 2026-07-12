// Architect Funnel Data — Non-tech friendly, restaurant metaphor
// Step 1: Project Type (10+ options)
// Step 2: Goal / Outcome
// Step 3: Audience
// Step 4: Data Needs (plain English)
// Output: Full personalized blueprint with frontend + backend + tool + workflow

export interface ProjectType {
  id: string;
  label: string;
  emoji: string;
  description: string;
  example: string;
}

export const projectTypes: ProjectType[] = [
  { id: "landing", label: "Landing Page", emoji: "🚀", description: "A single page that presents your offer and captures leads or sells one thing.", example: "e.g. a product launch, a course waitlist, a service offer" },
  { id: "portfolio", label: "Portfolio / Personal Brand", emoji: "🎨", description: "Showcase your work, skills, and story to attract clients or employers.", example: "e.g. designer portfolio, consultant site, personal brand hub" },
  { id: "store", label: "Online Store / E-Commerce", emoji: "🛍️", description: "Sell physical or digital products with a cart, checkout, and payments.", example: "e.g. clothing brand, digital downloads, handmade goods" },
  { id: "saas", label: "SaaS / Web App", emoji: "⚙️", description: "A software product users log into and use repeatedly — with accounts, data, and features.", example: "e.g. project manager, AI tool, subscription platform" },
  { id: "dashboard", label: "Dashboard / Admin Panel", emoji: "📊", description: "A data-rich interface for monitoring, managing, or analyzing information.", example: "e.g. analytics dashboard, CRM overview, internal ops tool" },
  { id: "crm", label: "CRM / Client Manager", emoji: "🤝", description: "Track leads, clients, deals, and follow-ups in one organized place.", example: "e.g. sales pipeline, client portal, contact manager" },
  { id: "funnel", label: "Sales Funnel", emoji: "🔁", description: "A multi-step flow that guides visitors from interest to purchase or sign-up.", example: "e.g. lead magnet → email opt-in → offer page → checkout" },
  { id: "blog", label: "Blog / Content Platform", emoji: "✍️", description: "Publish articles, tutorials, or media to build an audience and authority.", example: "e.g. newsletter site, knowledge base, media publication" },
  { id: "slides", label: "HTML Slide Deck / Presentation", emoji: "🖥️", description: "An interactive, browser-based presentation instead of PowerPoint or Keynote.", example: "e.g. pitch deck, course module, keynote-style web presentation" },
  { id: "mobile", label: "Native Mobile App", emoji: "📱", description: "An app installed on a phone from the App Store or Google Play.", example: "e.g. fitness tracker, social app, on-demand service" },
  { id: "pwa", label: "Progressive Web App (PWA)", emoji: "📲", description: "A website that works like an app — installable, offline-capable, and fast.", example: "e.g. field tool, offline-first utility, installable web tool" },
  { id: "booking", label: "Booking / Scheduling System", emoji: "📅", description: "Let users book appointments, reserve slots, or schedule services online.", example: "e.g. coaching calls, restaurant reservations, class sign-ups" },
];

export interface GoalOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const goalOptions: GoalOption[] = [
  { id: "leads", label: "Capture Leads / Build a List", emoji: "📧", description: "Collect emails or contact info from interested visitors." },
  { id: "sell", label: "Sell a Product or Service", emoji: "💳", description: "Accept payments and deliver value directly through the site." },
  { id: "showcase", label: "Showcase Work / Build Credibility", emoji: "⭐", description: "Impress visitors with your portfolio, story, or expertise." },
  { id: "manage", label: "Manage Data / Run Operations", emoji: "🗂️", description: "Organize internal information, clients, or workflows." },
  { id: "educate", label: "Educate / Deliver Content", emoji: "📚", description: "Teach, inform, or entertain an audience with structured content." },
  { id: "automate", label: "Automate a Business Process", emoji: "🤖", description: "Replace a manual task with a digital workflow or tool." },
];

export interface AudienceOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const audienceOptions: AudienceOption[] = [
  { id: "consumers", label: "General Public / Consumers", emoji: "🌍", description: "Anyone — mobile-first, simple language, fast loading." },
  { id: "professionals", label: "Professionals / B2B Clients", emoji: "💼", description: "Business buyers — trust signals, case studies, clear ROI." },
  { id: "team", label: "Your Own Team / Internal Users", emoji: "🏢", description: "Colleagues — efficiency over aesthetics, dense info OK." },
  { id: "creators", label: "Creators / Developers", emoji: "🛠️", description: "Tech-savvy users — API docs, code examples, power features." },
  { id: "students", label: "Students / Learners", emoji: "🎓", description: "Learners — clear progression, encouraging tone, simple UI." },
];

export interface DataNeedOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  kitchenAnalogy: string;
}

export const dataNeedOptions: DataNeedOption[] = [
  { id: "none", label: "No data storage needed", emoji: "🏖️", description: "Static content only — no user accounts, no database.", kitchenAnalogy: "A food truck with a fixed menu. No pantry, no orders to track." },
  { id: "forms", label: "Collect form submissions", emoji: "📝", description: "Capture contact info, survey answers, or sign-up data.", kitchenAnalogy: "A reservation book — you write down who's coming, but the kitchen stays simple." },
  { id: "auth", label: "User accounts & login", emoji: "🔐", description: "People create profiles, log in, and see personalized content.", kitchenAnalogy: "A members-only club — the host checks your name at the door before seating you." },
  { id: "content", label: "Store & display content", emoji: "📦", description: "Products, articles, portfolio items — content that changes over time.", kitchenAnalogy: "A pantry stocked with ingredients you pull from to build each dish (page)." },
  { id: "realtime", label: "Live / real-time updates", emoji: "⚡", description: "Data changes instantly for all users — chats, live dashboards, collaboration.", kitchenAnalogy: "An open kitchen — diners watch dishes being prepared live and updates appear instantly." },
  { id: "payments", label: "Payments & transactions", emoji: "💳", description: "Accept money, manage orders, handle subscriptions.", kitchenAnalogy: "A full-service restaurant with a cashier, receipts, and a POS system." },
];

// ─── Blueprint Generator ─────────────────────────────────────────────────────

export interface Blueprint {
  projectLabel: string;
  vibeTool: string;
  vibeToolReason: string;
  frontend: {
    structure: string[];
    style: string;
    animations: string;
    framework: string;
  };
  backend: {
    needed: boolean;
    summary: string;
    database: string | null;
    databaseReason: string;
    auth: boolean;
    payments: boolean;
    apis: string[];
  };
  workflow: Array<{ step: string; title: string; action: string; tool: string }>;
  estimatedCost: string;
  deployTarget: string;
}

export function generateBlueprint(
  projectTypeId: string,
  goalId: string,
  audienceId: string,
  dataNeedId: string
): Blueprint {
  const pt = projectTypes.find((p) => p.id === projectTypeId)!;
  const isComplex = ["saas", "dashboard", "crm", "mobile", "booking"].includes(projectTypeId);
  const needsBackend = ["auth", "content", "realtime", "payments"].includes(dataNeedId) || isComplex;
  const needsPayments = dataNeedId === "payments" || ["store", "funnel", "booking"].includes(projectTypeId);
  const needsAuth = dataNeedId === "auth" || ["saas", "dashboard", "crm", "mobile", "pwa"].includes(projectTypeId);
  const isRealtime = dataNeedId === "realtime" || ["dashboard", "crm"].includes(projectTypeId);

  // Vibe tool selection
  let vibeTool = "Lovable";
  let vibeToolReason = "";
  if (isComplex || isRealtime) {
    vibeTool = "Manus";
    vibeToolReason = `${pt.label} projects require autonomous orchestration — Manus handles research, architecture, and full-stack execution in one pass.`;
  } else if (["landing", "portfolio", "slides", "blog"].includes(projectTypeId)) {
    vibeTool = "Lovable";
    vibeToolReason = `${pt.label} projects are design-first. Lovable generates beautiful React frontends you can iterate visually and export to GitHub.`;
  } else if (["store", "funnel", "booking"].includes(projectTypeId) && !isComplex) {
    vibeTool = "Emergent";
    vibeToolReason = `${pt.label} projects need a full stack fast. Emergent generates frontend, backend, database, and payments in one prompt — no setup required.`;
  } else {
    vibeTool = "Lovable";
    vibeToolReason = `${pt.label} is design-led. Lovable's visual editor lets you iterate quickly and export clean React code to GitHub.`;
  }

  // Frontend structure by project type
  const frontendStructures: Record<string, string[]> = {
    landing: ["Hero section (headline + CTA)", "Value proposition / features grid", "Social proof / testimonials", "Lead capture form", "Footer with links"],
    portfolio: ["Hero with name + tagline", "Work / project grid", "About section", "Skills or services list", "Contact form"],
    store: ["Product grid / catalog", "Product detail page", "Shopping cart sidebar", "Checkout flow", "Order confirmation page"],
    saas: ["Marketing landing page", "Login / signup screens", "App dashboard (post-login)", "Settings / profile page", "Billing / subscription page"],
    dashboard: ["Top stats bar (KPIs)", "Charts and data visualizations", "Data tables with filters", "Sidebar navigation", "Detail / drill-down panels"],
    crm: ["Contacts list with search", "Deal pipeline (Kanban board)", "Contact detail view", "Activity timeline", "Notes and follow-up reminders"],
    funnel: ["Opt-in / lead magnet page", "Thank-you / bridge page", "Sales / offer page", "Order form / checkout", "Upsell / confirmation page"],
    blog: ["Article listing page", "Single article view", "Author profile", "Category / tag pages", "Newsletter sign-up section"],
    slides: ["Title slide", "Section divider slides", "Content slides with bullet points or images", "Quote / highlight slides", "Final CTA slide"],
    mobile: ["Splash / onboarding screens", "Home / feed screen", "Detail / profile screen", "Settings screen", "Bottom tab navigation"],
    pwa: ["Installable home screen", "Offline fallback page", "Core feature screens", "Push notification prompts", "App manifest + service worker"],
    booking: ["Service / availability calendar", "Time slot picker", "Booking form (name, email, notes)", "Confirmation screen", "Email confirmation trigger"],
  };

  // Style by audience
  const styleByAudience: Record<string, string> = {
    consumers: "Bold typography, generous whitespace, mobile-first layout, high-contrast CTAs. Think Apple or Airbnb.",
    professionals: "Clean, trust-building design with case studies, logos, and clear pricing. Think Stripe or HubSpot.",
    team: "Dense, information-rich layout with clear hierarchy. Efficiency over decoration. Think Linear or Notion.",
    creators: "Dark mode default, monospace accents, code-friendly layout. Think Vercel or GitHub.",
    students: "Friendly colors, clear progress indicators, encouraging microcopy. Think Duolingo or Khan Academy.",
  };

  // Animation recommendation
  const animByType: Record<string, string> = {
    landing: "Entrance animations on scroll (Framer Motion). Subtle hero parallax. CTA button pulse on hover.",
    portfolio: "Smooth page transitions. Project card hover lifts. Image reveal on scroll.",
    store: "Product image zoom on hover. Cart slide-in drawer. Checkout step progress bar.",
    saas: "Dashboard data load skeletons (Lottie). Smooth tab transitions. Onboarding step animations.",
    dashboard: "Chart draw-on animations. Skeleton loaders for data tables. Smooth filter transitions.",
    crm: "Kanban card drag animations. Status badge color transitions. Timeline entry reveals.",
    funnel: "Countdown timer animation. Progress bar between steps. Urgency pulse on CTA.",
    blog: "Reading progress bar. Article card hover lift. Image lazy-load fade-in.",
    slides: "Slide transition animations (fade, slide, zoom). Bullet point reveals. Presenter mode cursor.",
    mobile: "Native-feel swipe gestures. Bottom sheet slide-up. Loading skeleton screens.",
    pwa: "Install prompt animation. Offline indicator banner. Push notification badge pulse.",
    booking: "Calendar date selection animation. Time slot highlight. Booking confirmation confetti.",
  };

  // Database selection
  let database: string | null = null;
  let databaseReason = "";
  if (!needsBackend) {
    database = null;
    databaseReason = "No database needed — your project is static content only. This keeps it fast, cheap, and simple to deploy.";
  } else if (isRealtime) {
    database = "Convex or Firebase";
    databaseReason = "Real-time data requires a reactive database. Convex or Firebase push updates to all users instantly — no page refresh needed. Think of it as an open kitchen where everyone sees the food being prepared live.";
  } else if (["store", "saas", "crm", "booking", "funnel"].includes(projectTypeId)) {
    database = "Supabase";
    databaseReason = "Structured, relational data (orders, users, appointments) needs a Postgres database. Supabase gives you a full database + authentication + file storage in one free-tier platform. Think of it as a well-organized pantry with labeled shelves.";
  } else if (dataNeedId === "content") {
    database = "Supabase or Neon";
    databaseReason = "Content that changes over time (articles, products, portfolio items) needs a database. Supabase or Neon give you a Postgres database that your vibe coding agent can query automatically.";
  } else if (dataNeedId === "forms") {
    database = "Supabase (forms table)";
    databaseReason = "Form submissions need somewhere to land. A simple Supabase table captures every entry and lets you view, export, or trigger emails from it.";
  } else {
    database = "Supabase";
    databaseReason = "Supabase is the safest default — it handles user accounts, data storage, and file uploads in one place, with a generous free tier.";
  }

  // APIs
  const apis: string[] = [];
  if (needsPayments) apis.push("Stripe (payments & subscriptions)");
  if (needsAuth) apis.push("Supabase Auth or Google OAuth (user login)");
  if (goalId === "leads") apis.push("Resend or Mailchimp (email capture & automation)");
  if (projectTypeId === "booking") apis.push("Cal.com API or Google Calendar (scheduling)");
  if (projectTypeId === "blog") apis.push("Resend (newsletter delivery)");

  // Workflow steps
  const workflow = [
    { step: "01", title: "Ideation & Style Research", action: `Browse design galleries matching your ${audienceId === "consumers" ? "consumer-facing" : audienceId === "professionals" ? "B2B professional" : audienceId === "team" ? "internal tool" : "creator-focused"} aesthetic. Save 5–10 screenshots as your visual brief.`, tool: audienceId === "consumers" ? "Godly.website, Awwwards" : audienceId === "creators" ? "21st.dev, Vercel.com" : "Refero, Dribbble" },
    { step: "02", title: "Documentation Synthesis", action: `Upload the official docs for ${database || "your chosen stack"} into NotebookLM. Ask: "What is the optimal setup for a ${pt.label} with ${dataNeedId === "realtime" ? "real-time sync" : dataNeedId === "payments" ? "Stripe payments" : dataNeedId === "auth" ? "user authentication" : "form submissions"}?" Extract the answer as your agent prompt.`, tool: "NotebookLM" },
    { step: "03", title: `Build the Frontend (The Dining Room)`, action: `Describe your ${pt.label} layout to ${vibeTool}: "${frontendStructures[projectTypeId]?.slice(0, 3).join(", ")}." Include your color palette, font choices, and mobile-first requirement. ${vibeTool === "Lovable" ? "Use the visual editor to iterate." : "Manus will generate the full layout autonomously."}`, tool: vibeTool },
    ...(needsBackend ? [{ step: "04", title: "Connect the Backend (The Kitchen)", action: `${needsPayments ? "Set up Stripe for payments. " : ""}${needsAuth ? "Configure user authentication. " : ""}${database ? `Connect ${database} as your database. ` : ""}Your agent will wire the frontend forms to the backend automatically using your NotebookLM context.`, tool: database || "Supabase" }] : []),
    { step: needsBackend ? "05" : "04", title: "Commit to GitHub", action: `In ${vibeTool}, click "Export to GitHub." This saves your full codebase, gives you version history, and unlocks deployment. Takes under 1 minute.`, tool: "GitHub" },
    { step: needsBackend ? "06" : "05", title: "Deploy to Vercel or Netlify", action: "Go to vercel.com → New Project → connect your GitHub repo. Your site goes live in under 2 minutes with a public URL and auto-deploy on every future change.", tool: "Vercel / Netlify" },
    { step: needsBackend ? "07" : "06", title: "Iterate & Refine", action: `${vibeTool === "Lovable" ? "Use Lovable's visual editor for UI tweaks. For logic changes, describe them in chat." : "Describe changes to Manus — it updates the codebase and commits automatically."} Use NotebookLM to diagnose any errors.`, tool: vibeTool },
  ];

  // Cost estimate
  const costMap: Record<string, string> = {
    landing: "~5–15 Lovable credits ($0–4). Free tier is enough for a polished landing page.",
    portfolio: "~10–20 Lovable credits ($0–5). Free tier handles most portfolios.",
    store: "~20–50 Emergent credits ($4–10). Stripe adds ~2.9% + $0.30 per transaction.",
    saas: "~1,000–3,000 Manus credits ($5–15). Supabase free tier covers early users.",
    dashboard: "~800–2,000 Manus credits ($4–10). Free tiers on Supabase + Vercel cover launch.",
    crm: "~600–1,500 Manus credits ($3–8). Supabase free tier is sufficient.",
    funnel: "~15–40 Emergent credits ($3–8). Stripe for payments.",
    blog: "~10–25 Lovable credits ($0–6). Hosting free on Vercel.",
    slides: "~5–15 Lovable credits ($0–4). No backend needed.",
    mobile: "~2,000–5,000 Manus credits ($10–25). App Store fees: $99/year (Apple), $25 one-time (Google).",
    pwa: "~500–1,500 Manus credits ($2–8). No app store fees — deploy like a website.",
    booking: "~30–60 Emergent credits ($6–12). Cal.com has a free tier.",
  };

  return {
    projectLabel: pt.label,
    vibeTool,
    vibeToolReason,
    frontend: {
      structure: frontendStructures[projectTypeId] || ["Hero section", "Content area", "Footer"],
      style: styleByAudience[audienceId] || "Clean, modern, mobile-first.",
      animations: animByType[projectTypeId] || "Subtle entrance animations with Framer Motion.",
      framework: ["mobile"].includes(projectTypeId) ? "React Native (Expo)" : "React + Vite",
    },
    backend: {
      needed: needsBackend,
      summary: needsBackend
        ? `Your ${pt.label} needs a backend — the "kitchen" that stores data, handles logins${needsPayments ? ", processes payments" : ""}, and runs business logic securely.`
        : `Great news: your ${pt.label} doesn't need a backend. It's a "food truck" — fast, simple, and deployed as static files with zero server costs.`,
      database,
      databaseReason,
      auth: needsAuth,
      payments: needsPayments,
      apis,
    },
    workflow,
    estimatedCost: costMap[projectTypeId] || "~$5–20 depending on complexity.",
    deployTarget: "Vercel (recommended) or Netlify — both free for static and serverless projects.",
  };
}

