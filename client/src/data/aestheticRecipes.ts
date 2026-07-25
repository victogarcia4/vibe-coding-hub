// Aesthetic Recipes — 6 complete product design kits
// Color palettes, typography pairs, density, shadow treatment, and agent prompts

export interface AestheticRecipe {
  id: string;
  nameEs: string;
  nameEn: string;
  targetType: string;
  descriptionEs: string;
  descriptionEn: string;
  baseColor: string;
  accentColor: string;
  fontDisplay: string;
  fontBody: string;
  density: "spacious" | "balanced" | "dense";
  shadows: string;
  vibePromptEs: string;
  vibePromptEn: string;
}

export const aestheticRecipes: AestheticRecipe[] = [
  {
    id: "saas-b2b",
    nameEs: "SaaS B2B Moderno",
    nameEn: "Modern B2B SaaS",
    targetType: "SaaS / Web App / Admin",
    descriptionEs: "Limpio, confiable y enfocado en la productividad. Tonos azul marino, acentos cian y alta densidad de datos.",
    descriptionEn: "Clean, trustworthy, and productivity-focused. Deep navy tones, cyan accents, and high data density.",
    baseColor: "#0F172A",
    accentColor: "#00D4FF",
    fontDisplay: "Space Grotesk",
    fontBody: "Inter",
    density: "balanced",
    shadows: "subtle, precise 1px borders",
    vibePromptEs: "Diseña un SaaS B2B moderno. Usa paleta azul marino (#0F172A) con acentos cian (#00D4FF) en modo claro/oscuro. Tipografía: Space Grotesk en títulos e Inter en texto. Bordes finos de 1px, tarjetas elevadas y densidad limpia.",
    vibePromptEn: "Design a modern B2B SaaS. Use a navy palette (#0F172A) with cyan accents (#00D4FF) supporting light/dark mode. Typography: Space Grotesk for headings and Inter for body. Fine 1px borders, subtle cards, and balanced density.",
  },
  {
    id: "mobile-consumer",
    nameEs: "App Móvil de Consumo",
    nameEn: "Consumer Mobile App",
    targetType: "PWA / Mobile / Store",
    descriptionEs: "Cálido, accesible y lúdico. Botones grandes con esquinas muy redondeadas y mucho aire entre elementos.",
    descriptionEn: "Warm, friendly, and accessible. Large buttons with generous border radii and ample whitespace.",
    baseColor: "#6366F1",
    accentColor: "#EC4899",
    fontDisplay: "Outfit",
    fontBody: "Inter",
    density: "spacious",
    shadows: "soft diffuse blur shadows",
    vibePromptEs: "Diseña una app de consumo estilo móvil. Usa tonos violeta (#6366F1) y acentos rosa (#EC4899). Radios de borde amplios (16px+), botones táctiles grandes (≥44px), animaciones suaves y espaciado espacioso.",
    vibePromptEn: "Design a mobile consumer web app. Use indigo tones (#6366F1) and pink accents (#EC4899). Large border radii (16px+), touch-friendly buttons (≥44px), smooth animations, and spacious layout.",
  },
  {
    id: "editorial-portfolio",
    nameEs: "Portafolio Editorial",
    nameEn: "Editorial Portfolio",
    targetType: "Portfolio / Landing / Blog",
    descriptionEs: "Elegante, minimalista y tipográfico. Máximo contraste, negro obsidian y blanco con toques dorados.",
    descriptionEn: "Elegant, minimalist, and typography-first. High contrast obsidian black and white with gold touches.",
    baseColor: "#0A0A0F",
    accentColor: "#F59E0B",
    fontDisplay: "Playfair Display",
    fontBody: "Inter",
    density: "spacious",
    shadows: "no shadows, pure flat contrast borders",
    vibePromptEs: "Diseña un portafolio de estilo editorial. Fondo negro obsidiana (#0A0A0F) con tipografía blanca de alto contraste y acentos dorados (#F59E0B). Diseños asimétricos, imágenes grandes y máxima elegancia.",
    vibePromptEn: "Design an editorial portfolio. Obsidian black background (#0A0A0F) with high contrast white typography and gold accents (#F59E0B). Asymmetric layouts, large imagery, and minimal elegant styling.",
  },
  {
    id: "data-dashboard",
    nameEs: "Dashboard Analítico",
    nameEn: "Data Dashboard",
    targetType: "Dashboard / Analytics / CRM",
    descriptionEs: "Denso, técnico y con contraste optimizado para lectura de gráficos y métricas durante horas.",
    descriptionEn: "Dense, technical, and contrast-optimized for reading charts and metrics over long periods.",
    baseColor: "#18181B",
    accentColor: "#10B981",
    fontDisplay: "JetBrains Mono",
    fontBody: "Inter",
    density: "dense",
    shadows: "inset panel borders",
    vibePromptEs: "Diseña un panel analítico denso. Usa fondo gris zinc (#18181B) con acentos esmeralda (#10B981). Fuentes monoespaciadas para cifras, gráficos de alta visibilidad y disposición compacta de datos.",
    vibePromptEn: "Design a dense analytics dashboard. Use zinc background (#18181B) with emerald accents (#10B981). Monospace font for key metrics, high contrast chart components, and compact data density.",
  },
  {
    id: "ecommerce-store",
    nameEs: "Tienda Online / E-Commerce",
    nameEn: "Online Store / E-Commerce",
    targetType: "Store / Marketplace",
    descriptionEs: "Enfocado en la conversión y el producto. Tarjetas de producto destacadas, insignias claras y checkout directo.",
    descriptionEn: "Conversion-focused and product-centric. Highlighted product cards, clear badges, and frictionless checkout.",
    baseColor: "#111827",
    accentColor: "#F43F5E",
    fontDisplay: "Space Grotesk",
    fontBody: "Inter",
    density: "balanced",
    shadows: "medium card elevation",
    vibePromptEs: "Diseña una tienda online orientada a conversión. Usa tarjetas de producto limpias, precios destacados en negrita, botones de añadir al carrito en rojo rosa (#F43F5E) y selector de variantes.",
    vibePromptEn: "Design a conversion-focused online store. Use clean product cards, bold pricing badges, rose-red buy buttons (#F43F5E), and clear variant selectors.",
  },
  {
    id: "internal-tool",
    nameEs: "Herramienta Interna",
    nameEn: "Internal Operations Tool",
    targetType: "Internal / Backoffice / CRM",
    descriptionEs: "Eficiencia pura sin adornos innecesarios. Tablas filtrables, atajos de teclado y acciones en lote.",
    descriptionEn: "Pure efficiency without unnecessary fluff. Filterable data tables, keyboard shortcuts, and batch actions.",
    baseColor: "#1E293B",
    accentColor: "#3B82F6",
    fontDisplay: "Inter",
    fontBody: "Inter",
    density: "dense",
    shadows: "minimal 1px borders",
    vibePromptEs: "Diseña una herramienta interna para operaciones. Usa tabla de datos completa con filtros, selección múltiple para acciones en lote, estado de carga esquelético y botones de acción rápidos.",
    vibePromptEn: "Design an internal operations tool. Use full data tables with search filters, multi-select batch actions, skeleton loaders, and quick action toolbars.",
  },
];
