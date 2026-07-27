// Resource Vault Page — Expanded 100-Tool Arsenal System
// Category filtering + capability filtering + comparison modal + favorites bookmarking
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search, Star, Layers, DollarSign, Check, X, Shield, ArrowRightLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { resources, vaultCategories, type Resource } from "@/data/resources";
import { capabilities } from "@/engine/capabilities";
import { useI18n } from "@/i18n/I18nContext";

const FAVORITES_KEY = "vibehub_favorite_resources";

function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function ResourceVault() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCap, setSelectedCap] = useState<string>("all");
  const [pricingFilter, setPricingFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const { t, language } = useI18n();
  const isEs = language === "es";

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = activeCategory === "all" || (activeCategory === "favorites" ? favorites.includes(r.id) : r.category === activeCategory);
      const matchCap = selectedCap === "all" || (r.capabilities && r.capabilities.includes(selectedCap));
      const matchPrice = pricingFilter === "all" || r.pricingTier === pricingFilter;
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        (r.vibecoderNote && r.vibecoderNote.toLowerCase().includes(search.toLowerCase())) ||
        r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      return matchCat && matchCap && matchPrice && matchSearch;
    });
  }, [activeCategory, selectedCap, pricingFilter, search, favorites]);

  const compareTools = useMemo(() => {
    return compareIds.map((id) => resources.find((r) => r.id === id)).filter(Boolean) as Resource[];
  }, [compareIds]);

  return (
    <PageLayout
      title={isEs ? "Resource Vault" : "Resource Vault"}
      subtitle={isEs
        ? "Arsenal de ~120 herramientas seleccionadas para vibe coding. Categorías: inspiración de diseño, imágenes gratis, herramientas de video y más."
        : "Arsenal of ~120 curated tools for vibe coding across 23 categories — design inspiration, free media, video tools, and more."
      }
      phase="02"
    >
      {/* Top Filter Bar */}
      <div className="space-y-4 mb-8">
        {/* Search + Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <Search size={14} className="text-text-muted" />
            <input
              type="text"
              placeholder={isEs ? "Buscar por nombre, tecnología o caso de uso..." : "Search by name, tech, or use case..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-body text-text-strong placeholder:text-text-subtle"
            />
          </div>

          {/* Pricing Filter */}
          <select
            value={pricingFilter}
            onChange={(e) => setPricingFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-surface-2 border border-border-subtle text-xs font-semibold text-text-strong outline-none focus:border-signal"
          >
            <option value="all">{isEs ? "Todos los Precios" : "All Pricing"}</option>
            <option value="free">{isEs ? "100% Gratis" : "100% Free"}</option>
            <option value="freemium">{isEs ? "Freemium (Capa Gratis)" : "Freemium"}</option>
            <option value="paid">{isEs ? "De Pago" : "Paid"}</option>
          </select>

          {/* Capability Filter */}
          <select
            value={selectedCap}
            onChange={(e) => setSelectedCap(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-surface-2 border border-border-subtle text-xs font-semibold text-text-strong outline-none focus:border-signal"
          >
            <option value="all">{isEs ? "Todas las Capacidades del Briefing" : "All Briefing Capabilities"}</option>
            {capabilities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {isEs ? c.labelEs : c.labelEn}
              </option>
            ))}
          </select>

          {/* Comparison Modal Trigger */}
          {compareIds.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-display bg-signal text-primary-foreground hover:opacity-90 transition-all flex-shrink-0"
            >
              <ArrowRightLeft size={14} />
              {isEs ? `Comparar (${compareIds.length})` : `Compare (${compareIds.length})`}
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display transition-all border whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-signal text-primary-foreground border-signal"
                : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
            }`}
          >
            {isEs ? "Todos (100)" : "All (100)"}
          </button>
          <button
            onClick={() => setActiveCategory("favorites")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display transition-all border whitespace-nowrap ${
              activeCategory === "favorites"
                ? "bg-gold text-primary-foreground border-gold"
                : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
            }`}
          >
            <Star size={12} className="fill-current text-gold" />
            {isEs ? `Favoritos (${favorites.length})` : `Favorites (${favorites.length})`}
          </button>
          {vaultCategories.map((cat) => {
            const count = resources.filter((r) => r.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all border whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-signal-soft text-signal border-signal"
                    : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
                }`}
              >
                {isEs ? cat.label : cat.labelEn} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Count Summary */}
      <div className="mb-6 flex justify-between items-center text-xs font-mono text-text-muted">
        <span>{filtered.length} {isEs ? "herramientas encontradas" : "tools found"}</span>
        <span>{isEs ? "Selecciona hasta 3 herramientas para comparar" : "Select up to 3 tools to compare"}</span>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((resource) => {
          const isFav = favorites.includes(resource.id);
          const isComparing = compareIds.includes(resource.id);

          return (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card rounded-2xl p-5 flex flex-col justify-between border transition-all duration-200 ${
                isComparing ? "border-signal bg-signal-soft/30" : "border-border-subtle hover:border-signal-border"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-display text-text-strong">
                      {resource.name}
                    </h3>
                    {resource.highlight && (
                      <span className="w-2 h-2 rounded-full bg-signal" title="Destacado / Recomendado" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleCompare(resource.id)}
                      className={`p-1.5 rounded-md text-xs font-mono transition-all ${
                        isComparing ? "bg-signal text-primary-foreground" : "text-text-subtle hover:text-text-strong hover:bg-surface-2"
                      }`}
                      title={isEs ? "Añadir a comparación" : "Add to comparison"}
                    >
                      <ArrowRightLeft size={13} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(resource.id)}
                      className="p-1.5 rounded-md text-text-subtle hover:text-gold transition-all"
                      title={isEs ? "Marcar como favorito" : "Bookmark favorite"}
                    >
                      <Star size={14} className={isFav ? "fill-gold text-gold" : ""} />
                    </button>
                  </div>
                </div>

                {/* Subcategory & Pricing badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag-mono text-[10px] text-text-subtle">
                    {resource.subcategory}
                  </span>
                  {resource.pricingTier && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      resource.pricingTier === "free" ? "bg-signal-soft text-signal" : "bg-surface-2 text-text-muted"
                    }`}>
                      {resource.pricingTier}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-text-muted mb-3 leading-relaxed">
                  {resource.description}
                </p>

                {/* Vibecoder Note */}
                {resource.vibecoderNote && (
                  <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle mb-3 text-[11px] text-text-strong leading-relaxed">
                    <span className="font-semibold text-signal mr-1">💡 Note:</span>
                    {resource.vibecoderNote}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-surface-3 text-[10px] font-mono text-text-subtle">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Link Action */}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border-subtle text-xs font-semibold text-text-strong hover:bg-signal-soft hover:text-signal hover:border-signal transition-all group"
                >
                  <span>{isEs ? "Visitar Sitio" : "Visit Site"}</span>
                  <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Side-by-Side Tool Comparison Modal */}
      {showCompareModal && compareTools.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="glass-card rounded-2xl p-6 max-w-4xl w-full space-y-6 overflow-x-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-signal" />
                <h3 className="text-lg font-bold font-display text-text-strong">
                  {isEs ? "Comparación de Herramientas" : "Side-by-Side Tool Comparison"}
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded text-text-subtle hover:text-text-strong"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="grid grid-cols-4 gap-4 text-xs font-body">
              <div className="space-y-4 font-semibold text-text-muted border-r border-border-subtle pr-4">
                <div className="h-10 flex items-center">{isEs ? "Herramienta" : "Tool"}</div>
                <div className="h-8 flex items-center">{isEs ? "Categoría" : "Category"}</div>
                <div className="h-8 flex items-center">{isEs ? "Precio" : "Pricing"}</div>
                <div className="h-8 flex items-center">{isEs ? "Madurez" : "Maturity"}</div>
                <div className="h-12 flex items-center">{isEs ? "Alternativas" : "Alternatives"}</div>
                <div className="h-16 flex items-center">{isEs ? "¿Cuándo NO usar?" : "When NOT to use"}</div>
              </div>

              {compareTools.map((tool) => (
                <div key={tool.id} className="space-y-4 text-text-strong">
                  <div className="h-10 font-bold font-display text-sm flex items-center gap-2">
                    {tool.name}
                  </div>
                  <div className="h-8 flex items-center text-text-muted">{tool.subcategory}</div>
                  <div className="h-8 flex items-center">
                    <span className="px-2 py-0.5 rounded bg-signal-soft text-signal font-mono font-semibold">
                      {tool.pricingTier || "freemium"}
                    </span>
                  </div>
                  <div className="h-8 flex items-center text-text-muted font-mono">{tool.maturity || "production-ready"}</div>
                  <div className="h-12 flex items-center text-text-muted text-[11px]">
                    {tool.alternatives ? tool.alternatives.join(", ") : "—"}
                  </div>
                  <div className="h-16 flex items-center text-text-muted text-[11px] leading-tight">
                    {tool.whenNotToUse || "—"}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border-subtle flex justify-end gap-2">
              <button
                onClick={() => setCompareIds([])}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-error hover:underline"
              >
                {isEs ? "Limpiar comparación" : "Clear comparison"}
              </button>
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-signal text-primary-foreground"
              >
                {t.common.back}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
