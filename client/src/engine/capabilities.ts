// ─── Capability Catalog ──────────────────────────────────────────────────────
// Declarative catalog of technical capabilities.
// Each capability injects functional requirements, user stories, data model
// needs, risks, NFRs, and UX screens into the generated documents.

export interface FunctionalRequirement {
  id: string;       // e.g. "RF-AUTH-01"
  text: string;
  priority: "must" | "should" | "could";
}

export interface UserStory {
  persona: string;  // e.g. "user", "admin"
  action: string;
  benefit: string;
  acceptance: string[]; // Given/When/Then criteria
}

export interface DataModelEntry {
  table: string;
  fields: { name: string; type: string; nullable?: boolean; note?: string }[];
}

export interface Capability {
  id: string;
  labelEs: string;
  labelEn: string;
  descEs: string;
  descEn: string;
  emoji: string;
  category: "core" | "data" | "ux" | "integration" | "ops";
  requirements: FunctionalRequirement[];
  userStories: UserStory[];
  dataModel: DataModelEntry[];
  risks: string[];
  nfrs: string[];
  uxScreens: string[];
  effort: "S" | "M" | "L" | "XL";
  monthlyCost: { free: boolean; from: number };
  dependsOn: string[];
  conflictsWith: string[];
  services: { name: string; tags: string[] }[];
}

// ─── The Catalog (~25 capabilities) ──────────────────────────────────────────

export const capabilities: Capability[] = [
  // ── Core ──
  {
    id: "auth",
    labelEs: "Autenticación",
    labelEn: "Authentication",
    descEs: "Registro, inicio de sesión, recuperación de contraseña y verificación de email.",
    descEn: "Sign up, login, password recovery, and email verification.",
    emoji: "🔐",
    category: "core",
    requirements: [
      { id: "RF-AUTH-01", text: "Users can register with email and password", priority: "must" },
      { id: "RF-AUTH-02", text: "Users can log in and receive a session token", priority: "must" },
      { id: "RF-AUTH-03", text: "Users can reset their password via email", priority: "must" },
      { id: "RF-AUTH-04", text: "Users can verify their email address", priority: "should" },
      { id: "RF-AUTH-05", text: "Users can log in with OAuth providers (Google, GitHub)", priority: "could" },
    ],
    userStories: [
      {
        persona: "user",
        action: "create an account",
        benefit: "access personalized features",
        acceptance: [
          "Given I'm on the registration page, When I submit valid credentials, Then my account is created and I'm redirected to the dashboard",
          "Given I submit an existing email, When the form is submitted, Then I see an error without revealing if the email exists",
        ],
      },
      {
        persona: "user",
        action: "reset my password",
        benefit: "regain access to my account",
        acceptance: [
          "Given I click 'Forgot Password', When I enter my email, Then I receive a reset link within 2 minutes",
          "Given I use a reset link, When I submit a new password, Then my password is updated and old sessions are invalidated",
        ],
      },
    ],
    dataModel: [
      {
        table: "users",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY DEFAULT gen_random_uuid()" },
          { name: "email", type: "text", note: "UNIQUE NOT NULL" },
          { name: "password_hash", type: "text", note: "NOT NULL" },
          { name: "email_verified", type: "boolean", note: "DEFAULT false" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
          { name: "updated_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Credential stuffing attacks", "Insecure password storage", "Session hijacking", "Email enumeration"],
    nfrs: ["Passwords hashed with bcrypt (cost ≥ 12)", "Rate limit login to 5 attempts / minute", "JWT expiry ≤ 15 min with refresh tokens", "HTTPS required"],
    uxScreens: ["register", "login", "forgot-password", "verify-email", "reset-password"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Clerk", tags: ["managed", "react", "free-tier"] },
      { name: "Supabase Auth", tags: ["open-source", "postgres", "free-tier"] },
      { name: "Better Auth", tags: ["self-hosted", "flexible"] },
    ],
  },
  {
    id: "roles",
    labelEs: "Roles y Permisos",
    labelEn: "Roles & Permissions",
    descEs: "Control de acceso basado en roles (RBAC) con permisos granulares.",
    descEn: "Role-based access control (RBAC) with granular permissions.",
    emoji: "🛡️",
    category: "core",
    requirements: [
      { id: "RF-ROLE-01", text: "System supports at least 3 roles: admin, editor, viewer", priority: "must" },
      { id: "RF-ROLE-02", text: "Admins can assign and revoke roles", priority: "must" },
      { id: "RF-ROLE-03", text: "UI elements are conditionally rendered based on user role", priority: "must" },
    ],
    userStories: [
      {
        persona: "admin",
        action: "assign roles to team members",
        benefit: "control who can edit or view data",
        acceptance: [
          "Given I'm an admin, When I change a user's role, Then the change takes effect immediately",
          "Given a viewer tries to access an admin route, Then they are redirected to a 403 page",
        ],
      },
    ],
    dataModel: [
      {
        table: "user_roles",
        fields: [
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "role", type: "text", note: "CHECK (role IN ('admin','editor','viewer'))" },
          { name: "granted_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Privilege escalation", "Stale role cache"],
    nfrs: ["RLS policies enforce server-side checks", "Role changes reflected within 5 seconds"],
    uxScreens: ["user-management", "role-assignment"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: ["auth"],
    conflictsWith: [],
    services: [],
  },
  {
    id: "payments",
    labelEs: "Pagos y Suscripciones",
    labelEn: "Payments & Subscriptions",
    descEs: "Cobros únicos, suscripciones recurrentes, gestión de planes y facturación.",
    descEn: "One-time charges, recurring subscriptions, plan management, and invoicing.",
    emoji: "💳",
    category: "core",
    requirements: [
      { id: "RF-PAY-01", text: "Users can purchase a product or subscribe to a plan", priority: "must" },
      { id: "RF-PAY-02", text: "System processes payments securely via Stripe", priority: "must" },
      { id: "RF-PAY-03", text: "Users can view their billing history and invoices", priority: "should" },
      { id: "RF-PAY-04", text: "Users can upgrade, downgrade, or cancel subscriptions", priority: "must" },
      { id: "RF-PAY-05", text: "Webhook handler processes Stripe events idempotently", priority: "must" },
    ],
    userStories: [
      {
        persona: "user",
        action: "subscribe to a plan",
        benefit: "access premium features",
        acceptance: [
          "Given I select a plan, When I enter valid payment info, Then I'm charged and my plan is activated within 10 seconds",
          "Given my payment fails, When I retry, Then no duplicate charges are created",
        ],
      },
    ],
    dataModel: [
      {
        table: "subscriptions",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "stripe_subscription_id", type: "text", note: "UNIQUE" },
          { name: "plan", type: "text", note: "NOT NULL" },
          { name: "status", type: "text", note: "CHECK (status IN ('active','past_due','canceled','trialing'))" },
          { name: "current_period_end", type: "timestamptz" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Double charges", "Webhook race conditions", "PCI compliance scope"],
    nfrs: ["PCI DSS Level 1 via Stripe Elements (no card data touches server)", "Webhook idempotency via event ID dedup", "99.9% payment uptime"],
    uxScreens: ["pricing", "checkout", "billing-history", "plan-management"],
    effort: "L",
    monthlyCost: { free: false, from: 0 },
    dependsOn: ["auth"],
    conflictsWith: [],
    services: [
      { name: "Stripe", tags: ["industry-standard", "global"] },
      { name: "LemonSqueezy", tags: ["simpler", "merchant-of-record"] },
    ],
  },
  {
    id: "notifications",
    labelEs: "Notificaciones Push",
    labelEn: "Push Notifications",
    descEs: "Notificaciones push web para mantener a los usuarios informados.",
    descEn: "Web push notifications to keep users engaged and informed.",
    emoji: "🔔",
    category: "ux",
    requirements: [
      { id: "RF-NOTIF-01", text: "Users can opt in/out of push notifications", priority: "must" },
      { id: "RF-NOTIF-02", text: "System sends notifications for key events", priority: "must" },
      { id: "RF-NOTIF-03", text: "Notification preferences are persisted per user", priority: "should" },
    ],
    userStories: [
      {
        persona: "user",
        action: "enable push notifications",
        benefit: "receive timely updates without opening the app",
        acceptance: [
          "Given I'm asked to enable notifications, When I accept, Then I receive a confirmation notification",
          "Given I disabled notifications, When a new event occurs, Then I am not notified",
        ],
      },
    ],
    dataModel: [
      {
        table: "push_subscriptions",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "endpoint", type: "text", note: "NOT NULL" },
          { name: "keys_p256dh", type: "text" },
          { name: "keys_auth", type: "text" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["User fatigue from over-notification", "Browser permission UX"],
    nfrs: ["Notification delivery within 30 seconds", "Respect user's OS-level DND settings"],
    uxScreens: ["notification-preferences", "notification-prompt"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: ["auth"],
    conflictsWith: [],
    services: [
      { name: "Web Push API", tags: ["native", "free"] },
      { name: "OneSignal", tags: ["managed", "analytics"] },
    ],
  },
  {
    id: "fileUpload",
    labelEs: "Subida de Archivos",
    labelEn: "File Upload",
    descEs: "Carga de imágenes, documentos y archivos con preview y validación.",
    descEn: "Upload images, documents, and files with preview and validation.",
    emoji: "📁",
    category: "data",
    requirements: [
      { id: "RF-FILE-01", text: "Users can upload files up to a configurable size limit", priority: "must" },
      { id: "RF-FILE-02", text: "System validates file type and size before upload", priority: "must" },
      { id: "RF-FILE-03", text: "Uploaded images have thumbnail previews", priority: "should" },
      { id: "RF-FILE-04", text: "Files are stored in a CDN-backed object store", priority: "must" },
    ],
    userStories: [
      {
        persona: "user",
        action: "upload a profile picture",
        benefit: "personalize my account",
        acceptance: [
          "Given I select an image, When it exceeds 5 MB, Then I see a validation error",
          "Given I upload a valid image, When it finishes, Then a thumbnail appears immediately",
        ],
      },
    ],
    dataModel: [
      {
        table: "files",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "url", type: "text", note: "NOT NULL" },
          { name: "filename", type: "text" },
          { name: "mime_type", type: "text" },
          { name: "size_bytes", type: "integer" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Malicious file uploads", "Storage cost explosion", "CORS misconfiguration"],
    nfrs: ["Max file size configurable (default 10 MB)", "Content-type sniffing validation", "Signed URL expiry ≤ 1 hour"],
    uxScreens: ["file-upload", "file-gallery"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Supabase Storage", tags: ["integrated", "postgres", "free-tier"] },
      { name: "Cloudflare R2", tags: ["cheap", "no-egress"] },
      { name: "UploadThing", tags: ["react-native", "simple"] },
    ],
  },
  {
    id: "realtime",
    labelEs: "Tiempo Real",
    labelEn: "Real-Time",
    descEs: "Datos que se actualizan instantáneamente para todos los usuarios conectados.",
    descEn: "Data that updates instantly for all connected users.",
    emoji: "⚡",
    category: "data",
    requirements: [
      { id: "RF-RT-01", text: "Data changes are reflected to all connected clients within 500ms", priority: "must" },
      { id: "RF-RT-02", text: "System handles client reconnection gracefully", priority: "must" },
      { id: "RF-RT-03", text: "Presence indicators show who is online", priority: "could" },
    ],
    userStories: [
      {
        persona: "user",
        action: "see live updates from teammates",
        benefit: "stay in sync without refreshing",
        acceptance: [
          "Given another user edits a record, When I'm viewing the same record, Then the change appears within 1 second",
          "Given my connection drops, When it reconnects, Then I receive all missed updates",
        ],
      },
    ],
    dataModel: [],
    risks: ["Connection scaling under load", "Stale data on reconnect", "Thundering herd on broadcast"],
    nfrs: ["Supports ≥ 500 concurrent connections", "Graceful degradation to polling when WebSocket unavailable"],
    uxScreens: ["presence-indicator"],
    effort: "L",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Convex", tags: ["reactive", "serverless", "free-tier"] },
      { name: "Supabase Realtime", tags: ["postgres", "websocket"] },
      { name: "Firebase RTDB", tags: ["google", "mature"] },
    ],
  },
  {
    id: "offline",
    labelEs: "Modo Sin Conexión",
    labelEn: "Offline Support",
    descEs: "La app funciona sin internet y sincroniza cuando vuelve la conexión.",
    descEn: "The app works without internet and syncs when connection returns.",
    emoji: "📴",
    category: "ux",
    requirements: [
      { id: "RF-OFF-01", text: "Critical app screens load without network", priority: "must" },
      { id: "RF-OFF-02", text: "User can create/edit data offline", priority: "should" },
      { id: "RF-OFF-03", text: "Offline changes sync when connectivity resumes", priority: "must" },
      { id: "RF-OFF-04", text: "Conflict resolution strategy is defined", priority: "must" },
    ],
    userStories: [
      {
        persona: "user",
        action: "use the app without internet",
        benefit: "continue working in areas with poor connectivity",
        acceptance: [
          "Given I'm offline, When I open the app, Then cached content loads",
          "Given I edited data offline, When I reconnect, Then changes sync and conflicts are surfaced",
        ],
      },
    ],
    dataModel: [],
    risks: ["Data conflicts on sync", "Stale cached content", "Storage quota limits"],
    nfrs: ["Service worker precaches app shell", "IndexedDB for offline data queue", "Last-write-wins or user-choice conflict resolution"],
    uxScreens: ["offline-indicator", "sync-status"],
    effort: "L",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Workbox", tags: ["google", "sw-toolkit"] },
      { name: "vite-plugin-pwa", tags: ["vite", "easy-setup"] },
    ],
  },
  {
    id: "i18n",
    labelEs: "Internacionalización",
    labelEn: "Internationalization (i18n)",
    descEs: "Soporte multi-idioma con cambio dinámico de idioma.",
    descEn: "Multi-language support with dynamic language switching.",
    emoji: "🌐",
    category: "ux",
    requirements: [
      { id: "RF-I18N-01", text: "UI supports at least 2 languages", priority: "must" },
      { id: "RF-I18N-02", text: "Language preference is persisted", priority: "must" },
      { id: "RF-I18N-03", text: "Date, number, and currency formats adapt to locale", priority: "should" },
    ],
    userStories: [
      {
        persona: "user",
        action: "switch the interface language",
        benefit: "use the app in my preferred language",
        acceptance: [
          "Given I switch to Spanish, When the page re-renders, Then all UI text is in Spanish",
          "Given I reload the page, Then my language preference is preserved",
        ],
      },
    ],
    dataModel: [],
    risks: ["Missed translation keys", "RTL layout support if applicable"],
    nfrs: ["Type-safe translation keys (compile-time check)", "Locale-aware date/number formatting"],
    uxScreens: ["language-switcher"],
    effort: "S",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Custom React Context", tags: ["zero-dep", "type-safe"] },
      { name: "next-intl", tags: ["next.js", "mature"] },
    ],
  },
  {
    id: "search",
    labelEs: "Búsqueda",
    labelEn: "Search",
    descEs: "Búsqueda de texto completo con filtros, facetas y resultados instantáneos.",
    descEn: "Full-text search with filters, facets, and instant results.",
    emoji: "🔍",
    category: "data",
    requirements: [
      { id: "RF-SEARCH-01", text: "Users can search content by keyword", priority: "must" },
      { id: "RF-SEARCH-02", text: "Results appear within 200ms", priority: "should" },
      { id: "RF-SEARCH-03", text: "Search supports filters and facets", priority: "could" },
    ],
    userStories: [
      {
        persona: "user",
        action: "search for a specific item",
        benefit: "find what I need quickly",
        acceptance: [
          "Given I type a keyword, When results appear, Then matching items are highlighted",
          "Given no results match, Then a helpful empty state is shown",
        ],
      },
    ],
    dataModel: [],
    risks: ["Search index out of sync", "Performance at scale"],
    nfrs: ["Search latency < 200ms (p95)", "Typo tolerance"],
    uxScreens: ["search-results", "search-filters"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Meilisearch", tags: ["open-source", "fast", "free-tier"] },
      { name: "Algolia", tags: ["managed", "powerful"] },
      { name: "pg_trgm (Postgres)", tags: ["built-in", "free"] },
    ],
  },
  {
    id: "llm",
    labelEs: "Integración con IA/LLM",
    labelEn: "AI/LLM Integration",
    descEs: "Conecta con Claude, GPT o modelos open-source para funcionalidades de IA.",
    descEn: "Connect with Claude, GPT, or open-source models for AI features.",
    emoji: "🤖",
    category: "integration",
    requirements: [
      { id: "RF-LLM-01", text: "System can send prompts to an LLM and stream responses", priority: "must" },
      { id: "RF-LLM-02", text: "API key is stored securely (not in client bundle)", priority: "must" },
      { id: "RF-LLM-03", text: "Usage is rate-limited per user", priority: "should" },
    ],
    userStories: [
      {
        persona: "user",
        action: "generate content with AI",
        benefit: "save time on repetitive tasks",
        acceptance: [
          "Given I submit a prompt, When the LLM responds, Then the response streams token by token",
          "Given I exceed my rate limit, Then I see a clear message with time until reset",
        ],
      },
    ],
    dataModel: [
      {
        table: "ai_usage",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "tokens_in", type: "integer" },
          { name: "tokens_out", type: "integer" },
          { name: "model", type: "text" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Prompt injection", "Cost overrun", "Hallucinated output"],
    nfrs: ["API key in server-side env only", "Token budget per user per day", "Streaming via SSE"],
    uxScreens: ["ai-chat", "ai-settings"],
    effort: "M",
    monthlyCost: { free: false, from: 5 },
    dependsOn: ["auth"],
    conflictsWith: [],
    services: [
      { name: "Anthropic (Claude)", tags: ["quality", "streaming"] },
      { name: "OpenAI (GPT)", tags: ["mature", "ecosystem"] },
      { name: "Vercel AI SDK", tags: ["react", "streaming", "multi-provider"] },
    ],
  },
  {
    id: "maps",
    labelEs: "Mapas",
    labelEn: "Maps",
    descEs: "Mapas interactivos con marcadores, geocodificación y rutas.",
    descEn: "Interactive maps with markers, geocoding, and routing.",
    emoji: "🗺️",
    category: "integration",
    requirements: [
      { id: "RF-MAP-01", text: "Map displays with markers for relevant data points", priority: "must" },
      { id: "RF-MAP-02", text: "Users can search locations by address", priority: "should" },
    ],
    userStories: [
      {
        persona: "user",
        action: "view locations on a map",
        benefit: "understand geographic distribution at a glance",
        acceptance: [
          "Given I open the map, When data loads, Then markers appear at correct coordinates",
        ],
      },
    ],
    dataModel: [],
    risks: ["API cost from frequent geocoding", "Map tile loading performance"],
    nfrs: ["Map loads in < 2 seconds", "Cluster markers at zoom levels > 100 points"],
    uxScreens: ["map-view", "location-search"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Mapbox", tags: ["beautiful", "free-tier"] },
      { name: "Google Maps", tags: ["mature", "geocoding"] },
      { name: "Leaflet + OSM", tags: ["free", "open-source"] },
    ],
  },
  {
    id: "calendar",
    labelEs: "Calendario",
    labelEn: "Calendar",
    descEs: "Vista de calendario con eventos, recordatorios e integración con agendas externas.",
    descEn: "Calendar view with events, reminders, and external calendar integration.",
    emoji: "📅",
    category: "ux",
    requirements: [
      { id: "RF-CAL-01", text: "Users can view events in day/week/month views", priority: "must" },
      { id: "RF-CAL-02", text: "Users can create, edit, and delete events", priority: "must" },
      { id: "RF-CAL-03", text: "Events support reminders and recurrence", priority: "could" },
    ],
    userStories: [
      {
        persona: "user",
        action: "schedule an event",
        benefit: "organize my time within the app",
        acceptance: [
          "Given I click a date, When I fill in event details, Then the event appears on the calendar",
        ],
      },
    ],
    dataModel: [
      {
        table: "events",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "title", type: "text", note: "NOT NULL" },
          { name: "starts_at", type: "timestamptz", note: "NOT NULL" },
          { name: "ends_at", type: "timestamptz" },
          { name: "recurrence_rule", type: "text", nullable: true },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Timezone handling complexity", "Recurrence rule parsing"],
    nfrs: ["All times stored in UTC", "Recurrence follows RFC 5545"],
    uxScreens: ["calendar-month", "calendar-week", "event-detail"],
    effort: "L",
    monthlyCost: { free: true, from: 0 },
    dependsOn: ["auth"],
    conflictsWith: [],
    services: [],
  },
  {
    id: "email",
    labelEs: "Email Transaccional",
    labelEn: "Transactional Email",
    descEs: "Emails automáticos para registro, notificaciones, recibos y recordatorios.",
    descEn: "Automated emails for signup, notifications, receipts, and reminders.",
    emoji: "📧",
    category: "integration",
    requirements: [
      { id: "RF-EMAIL-01", text: "System sends welcome email on registration", priority: "must" },
      { id: "RF-EMAIL-02", text: "System sends transactional emails for key events", priority: "must" },
      { id: "RF-EMAIL-03", text: "Emails use branded HTML templates", priority: "should" },
    ],
    userStories: [
      {
        persona: "user",
        action: "receive a confirmation email",
        benefit: "verify my actions were successful",
        acceptance: [
          "Given I register, When my account is created, Then I receive a welcome email within 1 minute",
        ],
      },
    ],
    dataModel: [],
    risks: ["Email deliverability issues", "Landing in spam"],
    nfrs: ["Email delivery within 60 seconds", "SPF, DKIM, DMARC configured"],
    uxScreens: [],
    effort: "S",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Resend", tags: ["modern", "react-email", "free-tier"] },
      { name: "SendGrid", tags: ["mature", "scalable"] },
      { name: "Postmark", tags: ["deliverability", "transactional"] },
    ],
  },
  {
    id: "exportData",
    labelEs: "Exportación de Datos",
    labelEn: "Data Export",
    descEs: "Exportar datos en CSV, PDF o JSON para análisis o respaldo.",
    descEn: "Export data as CSV, PDF, or JSON for analysis or backup.",
    emoji: "📤",
    category: "data",
    requirements: [
      { id: "RF-EXP-01", text: "Users can export their data as CSV", priority: "must" },
      { id: "RF-EXP-02", text: "Users can export reports as PDF", priority: "should" },
      { id: "RF-EXP-03", text: "Export respects user's permission scope", priority: "must" },
    ],
    userStories: [
      {
        persona: "user",
        action: "download my data as CSV",
        benefit: "analyze it in Excel or share with others",
        acceptance: [
          "Given I click Export, When I select CSV, Then a file downloads with my current filtered data",
        ],
      },
    ],
    dataModel: [],
    risks: ["Large export performance", "Exposing sensitive data"],
    nfrs: ["Export files < 50 MB generated client-side", "Larger exports queued server-side"],
    uxScreens: ["export-dialog"],
    effort: "S",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [],
  },
  {
    id: "admin",
    labelEs: "Panel de Administración",
    labelEn: "Admin Panel",
    descEs: "Panel para gestionar usuarios, contenido, configuración y métricas.",
    descEn: "Dashboard to manage users, content, settings, and metrics.",
    emoji: "⚙️",
    category: "ops",
    requirements: [
      { id: "RF-ADMIN-01", text: "Admins can list, search, and edit users", priority: "must" },
      { id: "RF-ADMIN-02", text: "Admins can manage content (CRUD)", priority: "must" },
      { id: "RF-ADMIN-03", text: "Admin panel shows key metrics and stats", priority: "should" },
    ],
    userStories: [
      {
        persona: "admin",
        action: "manage all users from one place",
        benefit: "moderate the platform efficiently",
        acceptance: [
          "Given I'm an admin, When I search for a user, Then I can view and edit their profile",
        ],
      },
    ],
    dataModel: [],
    risks: ["Admin becoming a bottleneck", "Over-featuring the admin panel"],
    nfrs: ["Admin panel loads in < 3 seconds", "All admin actions logged"],
    uxScreens: ["admin-dashboard", "admin-users", "admin-content"],
    effort: "L",
    monthlyCost: { free: true, from: 0 },
    dependsOn: ["auth", "roles"],
    conflictsWith: [],
    services: [],
  },
  {
    id: "analytics",
    labelEs: "Analítica",
    labelEn: "Analytics",
    descEs: "Seguimiento de eventos, métricas de uso y dashboards de analítica.",
    descEn: "Event tracking, usage metrics, and analytics dashboards.",
    emoji: "📊",
    category: "ops",
    requirements: [
      { id: "RF-ANA-01", text: "System tracks page views and key user events", priority: "must" },
      { id: "RF-ANA-02", text: "Analytics dashboard shows daily/weekly/monthly trends", priority: "should" },
      { id: "RF-ANA-03", text: "Analytics respects user privacy (GDPR-compliant)", priority: "must" },
    ],
    userStories: [
      {
        persona: "admin",
        action: "view usage analytics",
        benefit: "make data-driven product decisions",
        acceptance: [
          "Given I open analytics, When data loads, Then I see charts for key metrics over the past 30 days",
        ],
      },
    ],
    dataModel: [],
    risks: ["Analytics blocking page load", "Privacy regulation compliance"],
    nfrs: ["Analytics script < 5 KB", "No PII in analytics events", "Cookie-less tracking preferred"],
    uxScreens: ["analytics-dashboard"],
    effort: "S",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Plausible", tags: ["privacy", "lightweight", "open-source"] },
      { name: "PostHog", tags: ["product-analytics", "self-hostable"] },
      { name: "Vercel Analytics", tags: ["zero-config", "vercel"] },
    ],
  },
  {
    id: "comments",
    labelEs: "Comentarios",
    labelEn: "Comments",
    descEs: "Sistema de comentarios con hilos, reacciones y moderación.",
    descEn: "Comment system with threads, reactions, and moderation.",
    emoji: "💬",
    category: "ux",
    requirements: [
      { id: "RF-COM-01", text: "Users can add comments to content items", priority: "must" },
      { id: "RF-COM-02", text: "Comments support threaded replies", priority: "should" },
      { id: "RF-COM-03", text: "Admins can moderate (delete, hide) comments", priority: "must" },
    ],
    userStories: [
      {
        persona: "user",
        action: "comment on a post",
        benefit: "share my thoughts and engage with the community",
        acceptance: [
          "Given I'm logged in, When I submit a comment, Then it appears immediately below the content",
        ],
      },
    ],
    dataModel: [
      {
        table: "comments",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "content_id", type: "uuid", note: "NOT NULL" },
          { name: "parent_id", type: "uuid", nullable: true, note: "REFERENCES comments(id)" },
          { name: "body", type: "text", note: "NOT NULL" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Spam and abuse", "Deeply nested thread performance"],
    nfrs: ["Max nesting depth: 3 levels", "Comments paginated (20 per page)"],
    uxScreens: ["comment-thread", "comment-form"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: ["auth"],
    conflictsWith: [],
    services: [],
  },
  {
    id: "messaging",
    labelEs: "Mensajería",
    labelEn: "Messaging",
    descEs: "Chat directo entre usuarios o canales de grupo.",
    descEn: "Direct chat between users or group channels.",
    emoji: "✉️",
    category: "ux",
    requirements: [
      { id: "RF-MSG-01", text: "Users can send direct messages to other users", priority: "must" },
      { id: "RF-MSG-02", text: "Messages are delivered in real-time", priority: "must" },
      { id: "RF-MSG-03", text: "Unread message count is shown", priority: "should" },
    ],
    userStories: [
      {
        persona: "user",
        action: "send a message to another user",
        benefit: "communicate without leaving the platform",
        acceptance: [
          "Given I send a message, When the recipient is online, Then they see it within 2 seconds",
        ],
      },
    ],
    dataModel: [
      {
        table: "messages",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "sender_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "receiver_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "body", type: "text", note: "NOT NULL" },
          { name: "read_at", type: "timestamptz", nullable: true },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Message ordering issues", "Abuse and harassment"],
    nfrs: ["Messages encrypted in transit (TLS)", "Delivery latency < 2 seconds"],
    uxScreens: ["inbox", "chat-thread"],
    effort: "L",
    monthlyCost: { free: true, from: 0 },
    dependsOn: ["auth", "realtime"],
    conflictsWith: [],
    services: [
      { name: "Convex", tags: ["reactive", "serverless"] },
      { name: "Stream Chat", tags: ["managed", "scalable"] },
    ],
  },
  {
    id: "bulkImport",
    labelEs: "Importación Masiva",
    labelEn: "Bulk Import",
    descEs: "Importar datos desde CSV, Excel o APIs externas.",
    descEn: "Import data from CSV, Excel, or external APIs.",
    emoji: "📥",
    category: "data",
    requirements: [
      { id: "RF-BULK-01", text: "Users can upload a CSV to import records", priority: "must" },
      { id: "RF-BULK-02", text: "System validates and previews data before import", priority: "must" },
      { id: "RF-BULK-03", text: "Import errors are reported per row", priority: "should" },
    ],
    userStories: [
      {
        persona: "admin",
        action: "import users from a CSV",
        benefit: "onboard existing data without manual entry",
        acceptance: [
          "Given I upload a CSV, When parsing completes, Then I see a preview with validation errors highlighted",
          "Given I confirm import, When processing finishes, Then a summary shows success/error counts",
        ],
      },
    ],
    dataModel: [],
    risks: ["Malformed CSV crashing import", "Duplicate data"],
    nfrs: ["Import handles ≥ 10,000 rows", "Progress indicator for large imports"],
    uxScreens: ["import-upload", "import-preview", "import-results"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [],
  },
  {
    id: "webhooks",
    labelEs: "Webhooks",
    labelEn: "Webhooks",
    descEs: "Endpoints HTTP que reciben eventos de servicios externos.",
    descEn: "HTTP endpoints that receive events from external services.",
    emoji: "🔗",
    category: "integration",
    requirements: [
      { id: "RF-WH-01", text: "System exposes webhook endpoints for key events", priority: "must" },
      { id: "RF-WH-02", text: "Webhooks validate signatures for authenticity", priority: "must" },
      { id: "RF-WH-03", text: "Failed webhooks are retried with exponential backoff", priority: "should" },
    ],
    userStories: [
      {
        persona: "developer",
        action: "configure a webhook for order events",
        benefit: "integrate external systems automatically",
        acceptance: [
          "Given an order is created, When the webhook fires, Then the external system receives the event within 5 seconds",
        ],
      },
    ],
    dataModel: [],
    risks: ["Webhook replay attacks", "Endpoint availability"],
    nfrs: ["HMAC signature validation on all incoming webhooks", "Retry 3 times with exponential backoff"],
    uxScreens: ["webhook-config"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [],
  },
  {
    id: "cron",
    labelEs: "Tareas Programadas",
    labelEn: "Scheduled Tasks (Cron)",
    descEs: "Ejecutar tareas automáticas en horarios programados.",
    descEn: "Run automated tasks on scheduled intervals.",
    emoji: "⏰",
    category: "ops",
    requirements: [
      { id: "RF-CRON-01", text: "System runs scheduled tasks at defined intervals", priority: "must" },
      { id: "RF-CRON-02", text: "Task execution is logged with status and duration", priority: "should" },
    ],
    userStories: [
      {
        persona: "admin",
        action: "schedule a daily report",
        benefit: "automate routine tasks",
        acceptance: [
          "Given a daily cron is configured, When the scheduled time arrives, Then the task runs and logs its result",
        ],
      },
    ],
    dataModel: [],
    risks: ["Overlapping task runs", "Task failures going unnoticed"],
    nfrs: ["Dead-letter queue for failed tasks", "Max task duration: 5 minutes"],
    uxScreens: ["cron-dashboard"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [
      { name: "Vercel Cron", tags: ["serverless", "free-tier"] },
      { name: "Inngest", tags: ["event-driven", "reliable"] },
    ],
  },
  {
    id: "versioning",
    labelEs: "Versionado",
    labelEn: "Versioning",
    descEs: "Historial de versiones de contenido con posibilidad de restaurar.",
    descEn: "Content version history with restore capability.",
    emoji: "🔄",
    category: "data",
    requirements: [
      { id: "RF-VER-01", text: "System stores a history of changes for key entities", priority: "must" },
      { id: "RF-VER-02", text: "Users can view and restore previous versions", priority: "must" },
    ],
    userStories: [
      {
        persona: "user",
        action: "restore a previous version of my document",
        benefit: "undo accidental changes",
        acceptance: [
          "Given I view version history, When I select a past version, Then I can preview and restore it",
        ],
      },
    ],
    dataModel: [
      {
        table: "content_versions",
        fields: [
          { name: "id", type: "uuid", note: "PRIMARY KEY" },
          { name: "entity_id", type: "uuid", note: "NOT NULL" },
          { name: "entity_type", type: "text", note: "NOT NULL" },
          { name: "snapshot", type: "jsonb", note: "NOT NULL" },
          { name: "created_by", type: "uuid", note: "REFERENCES users(id)" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Storage growth from frequent snapshots", "Large JSONB payloads"],
    nfrs: ["Retain last 50 versions per entity", "Snapshot size < 1 MB"],
    uxScreens: ["version-history", "version-diff"],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [],
  },
  {
    id: "audit",
    labelEs: "Auditoría",
    labelEn: "Audit Trail",
    descEs: "Registro inmutable de todas las acciones críticas del sistema.",
    descEn: "Immutable log of all critical system actions.",
    emoji: "📋",
    category: "ops",
    requirements: [
      { id: "RF-AUD-01", text: "All create/update/delete actions are logged", priority: "must" },
      { id: "RF-AUD-02", text: "Audit log is append-only (immutable)", priority: "must" },
      { id: "RF-AUD-03", text: "Admins can filter audit log by user, action, and date", priority: "should" },
    ],
    userStories: [
      {
        persona: "admin",
        action: "review the audit trail",
        benefit: "investigate incidents and ensure accountability",
        acceptance: [
          "Given I open the audit log, When I filter by user, Then I see all their actions chronologically",
        ],
      },
    ],
    dataModel: [
      {
        table: "audit_log",
        fields: [
          { name: "id", type: "bigint", note: "PRIMARY KEY GENERATED ALWAYS AS IDENTITY" },
          { name: "user_id", type: "uuid", note: "REFERENCES users(id)" },
          { name: "action", type: "text", note: "NOT NULL" },
          { name: "entity_type", type: "text" },
          { name: "entity_id", type: "uuid" },
          { name: "metadata", type: "jsonb" },
          { name: "created_at", type: "timestamptz", note: "DEFAULT now()" },
        ],
      },
    ],
    risks: ["Log volume at scale", "Querying large audit tables"],
    nfrs: ["Append-only table (no UPDATE/DELETE)", "Indexed on user_id + created_at", "Retention: 12 months"],
    uxScreens: ["audit-log"],
    effort: "S",
    monthlyCost: { free: true, from: 0 },
    dependsOn: ["auth"],
    conflictsWith: [],
    services: [],
  },
  {
    id: "a11y",
    labelEs: "Accesibilidad Reforzada",
    labelEn: "Enhanced Accessibility",
    descEs: "Cumplimiento WCAG 2.1 AA con navegación por teclado y lectores de pantalla.",
    descEn: "WCAG 2.1 AA compliance with keyboard navigation and screen reader support.",
    emoji: "♿",
    category: "ux",
    requirements: [
      { id: "RF-A11Y-01", text: "All interactive elements are keyboard-navigable", priority: "must" },
      { id: "RF-A11Y-02", text: "Color contrast meets WCAG 2.1 AA (4.5:1 for text)", priority: "must" },
      { id: "RF-A11Y-03", text: "All images have meaningful alt text", priority: "must" },
      { id: "RF-A11Y-04", text: "Forms have associated labels and error announcements", priority: "must" },
    ],
    userStories: [
      {
        persona: "user",
        action: "navigate the app using only a keyboard",
        benefit: "use the app regardless of motor ability",
        acceptance: [
          "Given I use Tab to navigate, When I reach an interactive element, Then it has a visible focus ring",
          "Given I submit a form with errors, When errors appear, Then the first error is announced by screen readers",
        ],
      },
    ],
    dataModel: [],
    risks: ["Accessibility regressions with new features", "Third-party components not accessible"],
    nfrs: ["WCAG 2.1 AA compliance", "Axe-core automated checks in CI", "Reduced motion preference respected"],
    uxScreens: [],
    effort: "M",
    monthlyCost: { free: true, from: 0 },
    dependsOn: [],
    conflictsWith: [],
    services: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCapability(id: string): Capability | undefined {
  return capabilities.find((c) => c.id === id);
}

export function getCapabilities(ids: string[]): Capability[] {
  return ids.map(getCapability).filter((c): c is Capability => !!c);
}

export function getAllRequirements(ids: string[]): FunctionalRequirement[] {
  return getCapabilities(ids).flatMap((c) => c.requirements);
}

export function getAllUserStories(ids: string[]): (UserStory & { capabilityId: string })[] {
  return getCapabilities(ids).flatMap((c) =>
    c.userStories.map((s) => ({ ...s, capabilityId: c.id }))
  );
}

export function getAllDataModel(ids: string[]): DataModelEntry[] {
  return getCapabilities(ids).flatMap((c) => c.dataModel);
}

export function getAllRisks(ids: string[]): string[] {
  return Array.from(new Set(getCapabilities(ids).flatMap((c) => c.risks)));
}

export function getAllNfrs(ids: string[]): string[] {
  return Array.from(new Set(getCapabilities(ids).flatMap((c) => c.nfrs)));
}

export function getAllUxScreens(ids: string[]): string[] {
  return Array.from(new Set(getCapabilities(ids).flatMap((c) => c.uxScreens)));
}

export function getDependencyChain(ids: string[]): string[] {
  const all = new Set(ids);
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of Array.from(all)) {
      const cap = getCapability(id);
      if (!cap) continue;
      for (const dep of cap.dependsOn) {
        if (!all.has(dep)) {
          all.add(dep);
          changed = true;
        }
      }
    }
  }
  return Array.from(all);
}

