// Vibe Coding Masterclass Page — Obsidian Architect Design
// Architectural sidebar layout + tool profiles + comparison matrix
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, XCircle, Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { vibeTools, comparisonMatrix } from "@/data/vibeTools";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

export default function VibeCoding() {
  const [activeTab, setActiveTab] = useState<"profiles" | "matrix">("profiles");

  return (
    <PageLayout
      title="Vibe Coding Masterclass"
      subtitle="A deep comparative analysis of Manus, Lovable, and Emergent — specifically for PWA and full-stack web development."
      phase="03"
    >
      {/* Tab Toggle */}
      <div className="flex gap-2 mb-10">
        {(["profiles", "matrix"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-md text-sm font-semibold transition-all"
            style={{
              fontFamily: "var(--font-display)",
              background: activeTab === tab ? "oklch(0.78 0.18 200)" : "oklch(0.11 0.013 260)",
              color: activeTab === tab ? "oklch(0.08 0.01 260)" : "oklch(0.45 0.01 260)",
              border: `1px solid ${activeTab === tab ? "oklch(0.78 0.18 200)" : "oklch(0.18 0.015 260)"}`,
            }}
          >
            {tab === "profiles" ? "Tool Profiles" : "Comparison Matrix"}
          </button>
        ))}
      </div>

      {activeTab === "profiles" && (
        <div className="space-y-6">
          {vibeTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl p-8"
              style={{ background: "oklch(0.11 0.013 260)", border: "1px solid oklch(0.18 0.015 260)" }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-display)", color: "oklch(0.78 0.18 200)", letterSpacing: "-0.02em" }}
                    >
                      {tool.name}
                    </h2>
                    <span className="tag-mono" style={{ background: "oklch(0.78 0.18 200 / 0.1)", color: "oklch(0.78 0.18 200)", border: "1px solid oklch(0.78 0.18 200 / 0.25)" }}>
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "oklch(0.50 0.01 260)", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                    {tool.tagline}
                  </p>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.50 0.01 260)" }}>
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.38 0.01 260)" }}>PWA SUITABILITY</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= tool.pwaRating ? "oklch(0.78 0.18 200)" : "transparent"}
                          style={{ color: s <= tool.pwaRating ? "oklch(0.78 0.18 200)" : "oklch(0.25 0.01 260)" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.38 0.01 260)" }}>
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {tool.strengths.map((s) => (
                          <li key={s} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>
                            <CheckCircle2 size={11} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.78 0.18 200)" }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.38 0.01 260)" }}>
                        Limitations
                      </h4>
                      <ul className="space-y-2">
                        {tool.weaknesses.map((w) => (
                          <li key={w} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>
                            <XCircle size={11} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.35 0.01 260)" }} />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="md:w-56 flex-shrink-0">
                  <div
                    className="p-5 rounded-xl"
                    style={{ background: "oklch(0.78 0.18 200 / 0.05)", border: "1px solid oklch(0.78 0.18 200 / 0.18)" }}
                  >
                    <h4 className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.38 0.01 260)" }}>
                      Best For
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {tool.bestFor.map((b) => (
                        <li key={b} className="text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>
                          → {b}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t mb-3" style={{ borderColor: "oklch(0.78 0.18 200 / 0.15)" }}>
                      <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.35 0.01 260)" }}>
                        {tool.pricing}
                      </span>
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-semibold transition-all hover:gap-3"
                      style={{ fontFamily: "var(--font-display)", color: "oklch(0.78 0.18 200)" }}
                    >
                      Visit {tool.name} <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "matrix" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "oklch(0.11 0.013 260)", border: "1px solid oklch(0.18 0.015 260)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid oklch(0.18 0.015 260)" }}>
                    <th
                      className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-mono)", color: "oklch(0.38 0.01 260)", minWidth: 160 }}
                    >
                      Criterion
                    </th>
                    {vibeTools.map((t) => (
                      <th
                        key={t.id}
                        className="text-left px-6 py-4 text-sm font-bold"
                        style={{ fontFamily: "var(--font-display)", color: "oklch(0.78 0.18 200)", minWidth: 190 }}
                      >
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonMatrix.map((row, i) => (
                    <tr
                      key={row.criterion}
                      style={{
                        borderBottom: "1px solid oklch(0.16 0.015 260 / 0.6)",
                        background: i % 2 === 0 ? "transparent" : "oklch(0.09 0.011 260 / 0.5)",
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.65 0.01 260)" }}>
                          {row.criterion}
                        </span>
                      </td>
                      {(["manus", "lovable", "emergent"] as const).map((toolId) => {
                        const isWinner = row.winner === toolId;
                        return (
                          <td key={toolId} className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              {isWinner && (
                                <Star size={11} fill="oklch(0.78 0.18 200)" style={{ color: "oklch(0.78 0.18 200)", flexShrink: 0, marginTop: 2 }} />
                              )}
                              <span
                                className="text-xs"
                                style={{
                                  color: isWinner ? "oklch(0.80 0.01 260)" : "oklch(0.42 0.01 260)",
                                  fontWeight: isWinner ? 600 : 400,
                                }}
                              >
                                {row[toolId]}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs mt-4" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.28 0.01 260)" }}>
            ★ indicates the recommended tool for each criterion.
          </p>
        </motion.div>
      )}
    </PageLayout>
  );
}

