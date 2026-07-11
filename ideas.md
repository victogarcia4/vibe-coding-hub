# Vibe Coding Hub — Design Brainstorm

## Three Stylistic Approaches

### 1. Obsidian Architect (probability: 0.07)
Dark, editorial, high-contrast. Inspired by Godly.website and Linear. Deep charcoal backgrounds with sharp white typography and electric cyan accents. Feels like a premium developer tool.

### 2. Frosted Blueprint (probability: 0.04)
Glassmorphism meets technical blueprint. Semi-transparent panels over a deep navy gradient with grid-line overlays. Feels like a futuristic design system.

### 3. Midnight Signal (probability: 0.09)
Dark obsidian base with neon amber/gold signal accents. Asymmetric editorial layout. Feels like a high-end architecture firm's internal tool.

---

## Chosen Approach: **Obsidian Architect**

A dark, editorial, high-contrast design that communicates authority, precision, and technical mastery — exactly what a "Strategic Resource Hub" for professional developers should feel like.

### Design Movement
Brutalist-Minimal Dark Editorial — inspired by Linear, Vercel, and Godly.website. Clean geometry, sharp contrast, no decorative noise.

### Core Principles
1. **Radical Contrast** — Near-black backgrounds (#0A0A0F) with pure white headings and electric cyan (#00D4FF) accents.
2. **Asymmetric Hierarchy** — Left-anchored layouts, offset grid columns, deliberate imbalance to create visual tension.
3. **Glassmorphism Panels** — Resource cards use frosted glass (backdrop-blur + semi-transparent borders) over the dark base.
4. **Typography as Architecture** — Headlines are structural elements, not decoration.

### Color Philosophy
- **Base:** `oklch(0.08 0.01 260)` — near-black with a cool blue undertone
- **Surface:** `oklch(0.13 0.015 260)` — card/panel backgrounds
- **Accent:** `oklch(0.78 0.18 200)` — electric cyan, the "signal" color
- **Gold:** `oklch(0.82 0.16 85)` — amber for secondary highlights
- **Text:** Pure white for headings, `oklch(0.65 0.01 260)` for body

### Layout Paradigm
Left-rail navigation with a wide content area. Hero uses full-bleed asymmetric split. Resource vault uses a masonry-inspired grid. Wizard uses a stepped sidebar layout.

### Signature Elements
1. **Cyan glow borders** on interactive cards (box-shadow: 0 0 20px cyan/20%)
2. **Thin horizontal rule dividers** with gradient fade (cyan → transparent)
3. **Monospace labels** in uppercase tracking for category tags

### Interaction Philosophy
Every hover reveals depth — cards lift with subtle glow, buttons pulse with a brief scale animation. Nothing is static; the UI breathes.

### Animation
- Page transitions: 200ms fade + 8px upward translate
- Card hover: 150ms ease-out scale(1.02) + glow intensify
- Wizard steps: 250ms slide-in from right
- Stagger list items: 40ms delay per item

### Typography System
- **Display:** `Space Grotesk` — geometric, technical, bold
- **Body:** `Inter` — readable, neutral
- **Mono:** `JetBrains Mono` — for code labels, tags, and technical identifiers
- **Scale:** 12/14/16/20/28/40/56px

### Brand Essence
*The architect's blueprint for modern web builders — precise, authoritative, and ahead of the curve.*
Adjectives: **Precise. Visionary. Empowering.**

### Brand Voice
Headlines are declarative and confident. CTAs are action-oriented verbs, never passive.
- Example headline: "Build Smarter. Ship Faster. Own Your Stack."
- Example CTA: "Start Your Architecture" / "Explore the Vault"

### Wordmark & Logo
A geometric hexagon with an inner circuit-node pattern — representing interconnected systems. No text in the mark itself.

### Signature Brand Color
Electric Cyan `#00D4FF` — unmistakably this brand's signal color.

## Style Decisions
- Dark theme as default (no toggle needed for this tool)
- Glassmorphism cards with cyan glow on hover
- Monospace uppercase tags for resource categories
- Asymmetric hero with left-anchored headline
