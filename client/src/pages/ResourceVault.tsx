// Resource Vault Page — Obsidian Architect Design
// Architectural sidebar layout + precision card system
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { resources, categories } from "@/data/resources";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        <div
          className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-lg"
          style={{ background: "oklch(0.11 0.013 260)", border: "1px solid oklch(0.20 0.015 260)" }}
        >
          <Search size={14} style={{ color: "oklch(0.40 0.01 260)" }} />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ fontFamily: "var(--font-body)", color: "oklch(0.85 0.005 260)" }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className="tag-mono px-4 py-2 rounded-md transition-all"
            style={{
              background: activeCategory === "all" ? "oklch(0.78 0.18 200)" : "oklch(0.11 0.013 260)",
              color: activeCategory === "all" ? "oklch(0.08 0.01 260)" : "oklch(0.45 0.01 260)",
              border: `1px solid ${activeCategory === "all" ? "oklch(0.78 0.18 200)" : "oklch(0.20 0.015 260)"}`,
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="tag-mono px-4 py-2 rounded-md transition-all"
              style={{
                background: activeCategory === cat.id ? "oklch(0.78 0.18 200)" : "oklch(0.11 0.013 260)",
                color: activeCategory === cat.id ? "oklch(0.08 0.01 260)" : "oklch(0.45 0.01 260)",
                border: `1px solid ${activeCategory === cat.id ? "oklch(0.78 0.18 200)" : "oklch(0.20 0.015 260)"}`,
              }}
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
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: "oklch(0.78 0.18 200 / 0.1)", color: "oklch(0.78 0.18 200)" }}
              >
                {cat.icon}
              </div>
              <div>
                <h2
                  className="text-lg font-bold leading-tight"
                  style={{ fontFamily: "var(--font-display)", color: "oklch(0.92 0.005 260)", letterSpacing: "-0.01em" }}
                >
                  {cat.label}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.38 0.01 260)", fontFamily: "var(--font-mono)" }}>
                  {cat.description}
                </p>
              </div>
            </div>
            {/* Cyan divider */}
            <div
              className="h-px mb-6"
              style={{ background: "linear-gradient(90deg, oklch(0.78 0.18 200 / 0.5), transparent)" }}
            />
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
                  className="block group relative rounded-xl p-5 transition-all duration-200"
                  style={{
                    background: isDark ? "oklch(0.11 0.013 260)" : "oklch(1 0 0)",
                    border: isDark ? "1px solid oklch(0.18 0.015 260)" : "1px solid oklch(0.88 0.006 260)",
                  }}
                  whileHover={{
                    borderColor: "oklch(0.78 0.18 200 / 0.45)",
                    boxShadow: "0 0 20px oklch(0.78 0.18 200 / 0.1)",
                    y: -2,
                  }}
                >
                  {resource.highlight && (
                    <div
                      className="absolute top-3 right-3 tag-mono"
                      style={{ background: "oklch(0.78 0.18 200 / 0.12)", color: "oklch(0.78 0.18 200)", border: "1px solid oklch(0.78 0.18 200 / 0.3)" }}
                    >
                      ★
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="font-semibold text-sm leading-tight"
                      style={{ fontFamily: "var(--font-display)", color: "oklch(0.90 0.005 260)" }}
                    >
                      {resource.name}
                    </h3>
                    <ExternalLink
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 ml-2 flex-shrink-0"
                      style={{ color: "oklch(0.78 0.18 200)" }}
                    />
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "oklch(0.45 0.01 260)" }}>
                    {resource.description}
                  </p>
                  {resource.vibecoderNote && (
                    <div
                      className="mb-4 p-3 rounded-lg text-xs leading-relaxed"
                      style={{
                        background: isDark ? "oklch(0.78 0.18 200 / 0.06)" : "oklch(0.45 0.18 200 / 0.06)",
                        border: isDark ? "1px solid oklch(0.78 0.18 200 / 0.2)" : "1px solid oklch(0.45 0.18 200 / 0.2)",
                        color: isDark ? "oklch(0.65 0.01 260)" : "oklch(0.35 0.01 260)",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 600, color: isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)" }}>
                        For Vibecoders ↓
                      </span>
                      <p className="mt-1">{resource.vibecoderNote}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-mono"
                        style={{ background: "oklch(0.14 0.012 260)", color: "oklch(0.38 0.01 260)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {resource.subcategory && (
                    <div className="pt-3 border-t" style={{ borderColor: "oklch(0.16 0.015 260)" }}>
                      <span className="tag-mono" style={{ background: "oklch(0.78 0.18 200 / 0.1)", color: "oklch(0.78 0.18 200)" }}>
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
        <div className="text-center py-24" style={{ color: "oklch(0.35 0.01 260)" }}>
          <p className="text-lg" style={{ fontFamily: "var(--font-display)" }}>No resources found.</p>
          <p className="text-xs mt-2" style={{ fontFamily: "var(--font-mono)" }}>Adjust your search or filter.</p>
        </div>
      )}
    </PageLayout>
  );
}
