// Resource Vault Page — Obsidian Architect Design
// Architectural sidebar layout + precision card system
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { resources, categories } from "@/data/resources";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35 },
  }),
};

export default function ResourceVault() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = activeCategory === "all" || r.category === activeCategory;
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some((t) => t.includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <PageLayout
      title="Resource Vault"
      subtitle="A structured database of 25+ curated tools, libraries, and assets — organized by layer for precision selection."
      phase="02"
    >
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-lg bg-surface-2 border border-border-subtle">
          <Search size={14} className="text-text-muted" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-body text-text-strong placeholder:text-text-subtle"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`tag-mono px-4 py-2 rounded-md transition-all border ${
              activeCategory === "all"
                ? "bg-signal text-primary-foreground border-signal"
                : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`tag-mono px-4 py-2 rounded-md transition-all border ${
                activeCategory === cat.id
                  ? "bg-signal text-primary-foreground border-signal"
                  : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      {(activeCategory === "all" ? categories : categories.filter((c) => c.id === activeCategory)).map((cat) => {
        const catResources = filtered.filter((r) => r.category === cat.id);
        if (catResources.length === 0) return null;
        return (
          <div key={cat.id} className="mb-16">
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 bg-signal-soft text-signal border border-signal-border">
                {cat.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight font-display text-text-strong tracking-tight">
                  {cat.label}
                </h2>
                <p className="text-xs mt-0.5 text-text-muted font-mono">
                  {cat.description}
                </p>
              </div>
            </div>
            {/* Cyan divider */}
            <div className="h-px mb-6 bg-gradient-to-r from-signal-border to-transparent" />
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {catResources.map((resource, i) => (
                <motion.a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="block group relative glass-card rounded-xl p-5"
                >
                  {resource.highlight && (
                    <div className="absolute top-3 right-3 tag-mono bg-signal-soft text-signal border border-signal-border">
                      ★
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm leading-tight font-display text-text-strong group-hover:text-signal transition-colors">
                      {resource.name}
                    </h3>
                    <ExternalLink
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 ml-2 flex-shrink-0 text-signal"
                    />
                  </div>
                  <p className="text-xs leading-relaxed mb-4 text-text-muted">
                    {resource.description}
                  </p>
                  {resource.vibecoderNote && (
                    <div className="mb-4 p-3 rounded-lg text-xs leading-relaxed bg-signal-soft border border-signal-border text-text-body">
                      <span className="font-mono text-[0.6rem] tracking-wider uppercase font-semibold text-signal">
                        For Vibecoders ↓
                      </span>
                      <p className="mt-1">{resource.vibecoderNote}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-mono bg-surface-2 text-text-muted border-border-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {resource.subcategory && (
                    <div className="pt-3 border-t border-border-subtle">
                      <span className="tag-mono bg-signal-soft text-signal border border-signal-border">
                        {resource.subcategory}
                      </span>
                    </div>
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-24 text-text-muted">
          <p className="text-lg font-display">No resources found.</p>
          <p className="text-xs mt-2 font-mono">Adjust your search or filter.</p>
        </div>
      )}
    </PageLayout>
  );
}
