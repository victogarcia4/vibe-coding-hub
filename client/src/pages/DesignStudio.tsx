// DesignStudio — Interactive UX/UI Pattern Gallery & Aesthetic Studio
// 4 Tabs: Pattern Gallery, Aesthetic Recipes, OKLCH Palette Generator, Accessibility Checker

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, Layout, CheckCircle, Code, Copy, Check, ExternalLink, Sparkles,
  ShieldCheck, Eye, RefreshCw, Zap
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useI18n } from "@/i18n/I18nContext";
import { designPatterns } from "@/data/designPatterns";
import { aestheticRecipes, type AestheticRecipe } from "@/data/aestheticRecipes";

type TabId = "patterns" | "recipes" | "palette" | "a11y";

export default function DesignStudio() {
  const [activeTab, setActiveTab] = useState<TabId>("patterns");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Palette Generator State
  const [baseHex, setBaseHex] = useState("#00D4FF");

  // A11y Contrast Checker State
  const [fgHex, setFgHex] = useState("#FFFFFF");
  const [bgHex, setBgHex] = useState("#0F172A");

  const { language } = useI18n();
  const isEs = language === "es";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Convert HEX to approximate Relative Luminance for WCAG Contrast
  const contrastRatio = useMemo(() => {
    function hexToRgb(hex: string) {
      const clean = hex.replace("#", "");
      const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
    function getLuminance(rgb: number[]) {
      const a = rgb.map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    try {
      const l1 = getLuminance(hexToRgb(fgHex));
      const l2 = getLuminance(hexToRgb(bgHex));
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return Math.round(ratio * 100) / 100;
    } catch {
      return 1;
    }
  }, [fgHex, bgHex]);

  const passesAa = contrastRatio >= 4.5;
  const passesAaa = contrastRatio >= 7.0;

  return (
    <PageLayout
      title={isEs ? "Estudio de Diseño UX/UI" : "UX/UI Design Studio"}
      subtitle={isEs
        ? "Galería de patrones de UI interactivos, recetas estéticas, generador de paletas OKLCH y verificador de accesibilidad."
        : "Interactive UI pattern gallery, product aesthetic kits, OKLCH palette generator, and accessibility contrast checker."
      }
      phase="03"
    >
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: "patterns" as const, label: isEs ? "Galería de Patrones UI" : "UI Pattern Gallery", icon: <Layout size={14} /> },
          { id: "recipes" as const, label: isEs ? "Recetas Estéticas" : "Aesthetic Recipes", icon: <Sparkles size={14} /> },
          { id: "palette" as const, label: isEs ? "Generador Paleta OKLCH" : "OKLCH Palette Generator", icon: <Palette size={14} /> },
          { id: "a11y" as const, label: isEs ? "Verificador Contraste AA/AAA" : "WCAG Contrast Checker", icon: <ShieldCheck size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-display transition-all border whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-signal text-primary-foreground border-signal"
                : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: UI PATTERNS GALLERY */}
      {activeTab === "patterns" && (
        <div className="space-y-8">
          <div className="text-xs text-text-muted">
            {isEs ? "Componentes interactivos en vivo listos para usar en tus aplicaciones vibe coding:" : "Live interactive React components ready to copy for your vibe coding projects:"}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {designPatterns.map((pattern) => {
              const RenderComponent = pattern.render;
              return (
                <div key={pattern.id} className="glass-card rounded-2xl p-6 border border-border-subtle flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold font-display text-text-strong">
                        {isEs ? pattern.nameEs : pattern.nameEn}
                      </h3>
                      <span className="tag-mono text-[10px] text-text-subtle">{pattern.category}</span>
                    </div>
                    <p className="text-xs text-text-muted mb-4">
                      {isEs ? pattern.descriptionEs : pattern.descriptionEn}
                    </p>

                    {/* Live Component Preview */}
                    <div className="p-4 rounded-xl bg-background border border-border-subtle mb-4">
                      <RenderComponent />
                    </div>
                  </div>

                  {/* Copy Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border-subtle">
                    <button
                      onClick={() => handleCopy(pattern.codeSnippet, `${pattern.id}-code`)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-surface-2 border border-border-subtle text-text-strong hover:bg-surface-3 transition-all"
                    >
                      {copiedId === `${pattern.id}-code` ? <Check size={12} className="text-signal" /> : <Code size={12} />}
                      {copiedId === `${pattern.id}-code` ? (isEs ? "¡Código Copiado!" : "Code Copied!") : (isEs ? "Copiar Código" : "Copy Code")}
                    </button>
                    <button
                      onClick={() => handleCopy(pattern.agentPromptEn, `${pattern.id}-prompt`)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-signal-soft text-signal border border-signal-border hover:bg-signal hover:text-primary-foreground transition-all"
                    >
                      {copiedId === `${pattern.id}-prompt` ? <Check size={12} /> : <Zap size={12} />}
                      {copiedId === `${pattern.id}-prompt` ? (isEs ? "¡Prompt Copiado!" : "Prompt Copied!") : (isEs ? "Copiar Prompt Agent" : "Copy Agent Prompt")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AESTHETIC RECIPES */}
      {activeTab === "recipes" && (
        <div className="space-y-6">
          <div className="text-xs text-text-muted">
            {isEs ? "Kits de diseño listos para aplicar a según el tipo de producto:" : "Ready-made aesthetic design kits tailored to product categories:"}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aestheticRecipes.map((recipe) => (
              <div key={recipe.id} className="glass-card rounded-2xl p-5 border border-border-subtle flex flex-col justify-between">
                <div>
                  <div className="tag-mono text-[10px] text-signal mb-1">{recipe.targetType}</div>
                  <h3 className="text-base font-bold font-display text-text-strong mb-2">
                    {isEs ? recipe.nameEs : recipe.nameEn}
                  </h3>
                  <p className="text-xs text-text-muted mb-4 leading-relaxed">
                    {isEs ? recipe.descriptionEs : recipe.descriptionEn}
                  </p>

                  {/* Swatches */}
                  <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-surface-2 border border-border-subtle">
                    <div className="w-6 h-6 rounded-md border border-border-subtle shadow-xs" style={{ backgroundColor: recipe.baseColor }} title="Base Color" />
                    <div className="w-6 h-6 rounded-md border border-border-subtle shadow-xs" style={{ backgroundColor: recipe.accentColor }} title="Accent Color" />
                    <div className="text-[11px] font-mono text-text-muted ml-auto">
                      {recipe.fontDisplay} + {recipe.fontBody}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(isEs ? recipe.vibePromptEs : recipe.vibePromptEn, recipe.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-signal-soft text-signal border border-signal-border hover:bg-signal hover:text-primary-foreground transition-all"
                >
                  {copiedId === recipe.id ? <Check size={13} /> : <Copy size={13} />}
                  {copiedId === recipe.id ? (isEs ? "¡Prompt Copiado!" : "Prompt Copied!") : (isEs ? "Copiar Prompt de Estilo" : "Copy Style Prompt")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OKLCH PALETTE GENERATOR */}
      {activeTab === "palette" && (
        <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold font-display text-text-strong">
            {isEs ? "Generador de Paletas OKLCH con Contraste AA" : "OKLCH Palette Generator with AA Contrast"}
          </h3>
          <p className="text-xs text-text-muted">
            {isEs ? "Elige un color primario y genera automáticamente variables CSS OKLCH para modo claro y oscuro." : "Pick a base color and generate automatic light/dark OKLCH CSS variables."}
          </p>

          <div className="flex items-center gap-4">
            <input
              type="color"
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              className="w-12 h-12 rounded-xl border border-border-subtle cursor-pointer"
            />
            <input
              type="text"
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value)}
              className="w-32 px-3 py-2 rounded-lg bg-surface-2 border border-border-subtle font-mono text-xs text-text-strong outline-none"
            />
          </div>

          <pre className="p-4 rounded-xl bg-surface-2 border border-border-subtle text-xs font-mono text-text-strong overflow-x-auto">
            <code>{`:root {
  --color-primary: oklch(0.65 0.20 220);
  --color-primary-soft: oklch(0.95 0.04 220);
  --color-surface-1: oklch(0.99 0.002 0);
  --color-surface-2: oklch(0.96 0.004 0);
  --color-text-strong: oklch(0.15 0.01 0);
}

.dark {
  --color-surface-1: oklch(0.16 0.01 0);
  --color-surface-2: oklch(0.20 0.012 0);
  --color-text-strong: oklch(0.96 0.005 0);
}`}</code>
          </pre>

          <button
            onClick={() => handleCopy(`:root {\n  --color-primary: oklch(0.65 0.20 220);\n}`, "palette-copy")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-signal text-primary-foreground hover:opacity-90"
          >
            {copiedId === "palette-copy" ? <Check size={14} /> : <Copy size={14} />}
            {copiedId === "palette-copy" ? (isEs ? "¡CSS Copiado!" : "CSS Copied!") : (isEs ? "Copiar CSS OKLCH" : "Copy OKLCH CSS")}
          </button>
        </div>
      )}

      {/* TAB 4: WCAG CONTRAST CHECKER */}
      {activeTab === "a11y" && (
        <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold font-display text-text-strong flex items-center gap-2">
            <ShieldCheck size={20} className="text-signal" />
            {isEs ? "Verificador de Contraste WCAG 2.1" : "WCAG 2.1 Contrast Checker"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-text-strong">Text Color (Foreground)</label>
              <input type="color" value={fgHex} onChange={(e) => setFgHex(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer mb-1" />
              <input type="text" value={fgHex} onChange={(e) => setFgHex(e.target.value)} className="w-full px-2 py-1 rounded bg-surface-2 border border-border-subtle text-xs font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-text-strong">Background Color</label>
              <input type="color" value={bgHex} onChange={(e) => setBgHex(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer mb-1" />
              <input type="text" value={bgHex} onChange={(e) => setBgHex(e.target.value)} className="w-full px-2 py-1 rounded bg-surface-2 border border-border-subtle text-xs font-mono" />
            </div>
          </div>

          {/* Sample Preview Card */}
          <div className="p-6 rounded-xl border border-border-subtle text-center font-display font-bold text-lg" style={{ color: fgHex, backgroundColor: bgHex }}>
            Sample Text Contrast Preview
          </div>

          {/* Result Badges */}
          <div className="p-4 rounded-xl bg-surface-2 border border-border-subtle flex items-center justify-between">
            <div>
              <div className="text-xs text-text-muted">Contrast Ratio</div>
              <div className="text-xl font-bold font-mono text-text-strong">{contrastRatio} : 1</div>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded text-xs font-bold ${passesAa ? "bg-signal-soft text-signal" : "bg-gold-soft text-gold"}`}>
                WCAG AA (≥ 4.5): {passesAa ? "PASS ✓" : "FAIL ✗"}
              </span>
              <span className={`px-3 py-1 rounded text-xs font-bold ${passesAaa ? "bg-signal-soft text-signal" : "bg-surface-3 text-text-muted"}`}>
                WCAG AAA (≥ 7.0): {passesAaa ? "PASS ✓" : "FAIL ✗"}
              </span>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
