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
            className={`px-5 py-2 rounded-md text-sm font-semibold font-display transition-all border ${
              activeTab === tab
                ? "bg-signal text-primary-foreground border-signal"
                : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
            }`}
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
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold font-display text-signal tracking-tight">
                      {tool.name}
                    </h2>
                    <span className="tag-mono bg-signal-soft text-signal border border-signal-border">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-sm mb-4 text-text-muted font-display italic">
                    {tool.tagline}
                  </p>
                  <p className="text-sm leading-relaxed mb-6 text-text-muted">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-mono text-text-subtle">PWA SUITABILITY</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= tool.pwaRating ? "text-signal fill-signal" : "text-border-strong"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-semibold mb-3 uppercase tracking-widest font-mono text-text-subtle">
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {tool.strengths.map((s) => (
                          <li key={s} className="flex items-start gap-2 text-xs text-text-muted">
                            <CheckCircle2 size={11} className="mt-0.5 flex-shrink-0 text-signal" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold mb-3 uppercase tracking-widest font-mono text-text-subtle">
                        Limitations
                      </h4>
                      <ul className="space-y-2">
                        {tool.weaknesses.map((w) => (
                          <li key={w} className="flex items-start gap-2 text-xs text-text-subtle">
                            <XCircle size={11} className="mt-0.5 flex-shrink-0 text-text-subtle" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="md:w-56 flex-shrink-0">
                  <div className="p-5 rounded-xl bg-signal-soft border border-signal-border">
                    <h4 className="text-xs font-semibold mb-3 uppercase tracking-widest font-mono text-text-subtle">
                      Best For
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {tool.bestFor.map((b) => (
                        <li key={b} className="text-xs text-text-muted">
                          → {b}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-border-subtle mb-3">
                      <span className="text-xs font-mono text-text-subtle">
                        {tool.pricing}
                      </span>
                    </div>
                    {/* Pricing tiers */}
                    <div className="mt-3 space-y-2 mb-3">
                      {tool.pricingTiers.map((tier) => (
                        <div
                          key={tier.label}
                          className="p-2 rounded-lg bg-surface-2 border border-border-subtle"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-display text-signal text-[0.65rem] font-bold">
                              {tier.label}
                            </span>
                            <span className="font-mono text-text-strong text-[0.65rem] font-bold">
                              {tier.monthly}
                            </span>
                          </div>
                          <div className="text-text-subtle text-[0.6rem]">
                            {tier.credits}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mb-3 p-2 rounded-lg bg-signal-soft border border-signal-border">
                      <div className="font-mono tracking-wider uppercase font-semibold text-signal text-[0.58rem]">
                        Est. Project Cost ↓
                      </div>
                      <p className="text-text-muted text-[0.62rem] mt-1 leading-normal">{tool.typicalProjectCost}</p>
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-semibold font-display text-signal transition-all hover:gap-3"
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
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest font-mono text-text-subtle min-w-[160px]">
                      Criterion
                    </th>
                    {vibeTools.map((t) => (
                      <th
                        key={t.id}
                        className="text-left px-6 py-4 text-sm font-bold font-display text-signal min-w-[190px]"
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
                      className={`border-b border-border-subtle/60 ${i % 2 === 0 ? "bg-transparent" : "bg-surface-2/50"}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold font-display text-text-muted">
                          {row.criterion}
                        </span>
                      </td>
                      {(["manus", "lovable", "emergent"] as const).map((toolId) => {
                        const isWinner = row.winner === toolId;
                        return (
                          <td key={toolId} className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              {isWinner && (
                                <Star size={11} className="text-signal fill-signal flex-shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`text-xs ${isWinner ? "text-text-strong font-semibold" : "text-text-muted"}`}
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
          <p className="text-xs mt-4 font-mono text-text-subtle">
            ★ indicates the recommended tool for each criterion.
          </p>
        </motion.div>
      )}
    </PageLayout>
  );
}
