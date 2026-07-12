// Project Architect — Non-tech friendly funnel with restaurant metaphor
// 4 steps: Project Type → Goal → Audience → Data Needs
// Output: Full personalized blueprint
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Zap, ExternalLink, ChefHat, Utensils, Database, Globe, Github, Layers } from "lucide-react";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useArchitect } from "@/contexts/ArchitectContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  projectTypes, goalOptions, audienceOptions, dataNeedOptions,
  generateBlueprint, type Blueprint,
} from "@/data/architectData";

export default function ProjectArchitect() {
  const [step, setStep] = useState(0); // 0=type, 1=goal, 2=audience, 3=data
  const [projectType, setProjectType] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [dataNeed, setDataNeed] = useState("");
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const { setAnswers } = useArchitect();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cyan = isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)";
  const gold = isDark ? "oklch(0.82 0.16 85)" : "oklch(0.55 0.14 85)";
  const green = isDark ? "oklch(0.70 0.18 160)" : "oklch(0.45 0.18 160)";
  const pageBg = isDark ? "oklch(0.08 0.01 260)" : "oklch(0.97 0.004 260)";
  const cardBg = isDark ? "oklch(0.11 0.013 260)" : "oklch(1 0 0)";
  const cardBorder = isDark ? "oklch(0.18 0.015 260)" : "oklch(0.88 0.006 260)";
  const headingColor = isDark ? "oklch(0.97 0.005 260)" : "oklch(0.10 0.015 260)";
  const bodyColor = isDark ? "oklch(0.55 0.01 260)" : "oklch(0.40 0.01 260)";
  const mutedColor = isDark ? "oklch(0.38 0.01 260)" : "oklch(0.55 0.01 260)";
  const optionBg = isDark ? "oklch(0.13 0.013 260)" : "oklch(0.97 0.003 260)";
  const optionBorder = isDark ? "oklch(0.18 0.015 260)" : "oklch(0.88 0.006 260)";
  const sectionBg = isDark ? "oklch(0.78 0.18 200 / 0.06)" : "oklch(0.45 0.18 200 / 0.06)";
  const sectionBorderColor = isDark ? "oklch(0.78 0.18 200 / 0.2)" : "oklch(0.45 0.18 200 / 0.25)";
  const dividerBorder = isDark ? "oklch(0.16 0.015 260)" : "oklch(0.88 0.006 260)";

  const steps = [
    { id: 0, label: "Project Type", icon: <Layers size={14} /> },
    { id: 1, label: "Your Goal", icon: <Zap size={14} /> },
    { id: 2, label: "Audience", icon: <Globe size={14} /> },
    { id: 3, label: "Data Needs", icon: <Database size={14} /> },
  ];

  const handleFinish = () => {
    const bp = generateBlueprint(projectType, goal, audience, dataNeed);
    setBlueprint(bp);
    setAnswers({
      scope: projectType,
      audience,
      complexity: ["saas", "dashboard", "crm", "mobile"].includes(projectType) ? "complex" : "moderate",
      data: dataNeed,
    });
  };

  const handleReset = () => {
    setStep(0); setProjectType(""); setGoal(""); setAudience(""); setDataNeed(""); setBlueprint(null);
  };

  const currentValue = [projectType, goal, audience, dataNeed][step];
  const isLastStep = step === 3;

  const handleNext = () => {
    if (isLastStep) handleFinish();
    else setStep((s) => s + 1);
  };

  const setCurrentValue = (v: string) => {
    if (step === 0) setProjectType(v);
    else if (step === 1) setGoal(v);
    else if (step === 2) setAudience(v);
    else setDataNeed(v);
  };

  return (
    <PageLayout
      title="The Project Architect"
      subtitle="Answer 4 questions — get a personalized blueprint with your frontend structure, backend setup, tool recommendation, and step-by-step workflow."
      phase="01"
    >
      {/* Restaurant Metaphor Explainer */}
      {!blueprint && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 rounded-xl"
          style={{ background: sectionBg, border: `1px solid ${sectionBorderColor}` }}
        >
          <div className="flex items-start gap-4">
            <div className="flex gap-3 flex-shrink-0 mt-0.5">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: headingColor }}>
                Think of your app like a restaurant
              </p>
              <p className="text-xs leading-relaxed" style={{ color: bodyColor }}>
                The <strong style={{ color: cyan }}>Frontend</strong> is the dining room — everything your users see, touch, and experience.
                The <strong style={{ color: gold }}>Backend</strong> is the kitchen — the hidden logic, storage, and preparation that powers the experience.
                You don't need to cook — your vibe coding agent does. You just need to know what dish you're ordering.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Rail */}
      {!blueprint && (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: i < step ? cyan : i === step ? `${cyan.replace(")", " / 0.15)")}` : optionBg,
                  color: i <= step ? (i < step ? (isDark ? "oklch(0.08 0.01 260)" : "oklch(0.98 0 0)") : cyan) : mutedColor,
                  border: i === step ? `1px solid ${cyan.replace(")", " / 0.5)")}` : `1px solid ${optionBorder}`,
                }}
              >
                {i < step ? <CheckCircle2 size={12} /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </div>
              {i < steps.length - 1 && <div className="h-px w-4 flex-shrink-0" style={{ background: i < step ? `${cyan.replace(")", " / 0.4)")}` : optionBorder }} />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!blueprint ? (
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            <div className="rounded-2xl p-6 md:p-8 mb-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              {/* Step 0: Project Type */}
              {step === 0 && (
                <>
                  <div className="tag-mono mb-4 inline-block" style={{ background: `${cyan.replace(")", " / 0.08)")}`, color: cyan, border: `1px solid ${cyan.replace(")", " / 0.2)")}` }}>
                    Step 1 of 4 — What are you building?
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: headingColor, letterSpacing: "-0.02em" }}>
                    Choose your project type
                  </h2>
                  <p className="text-sm mb-6" style={{ color: bodyColor }}>
                    This determines your frontend structure, backend needs, and which vibe coding tool to use.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projectTypes.map((pt) => (
                      <button key={pt.id} onClick={() => setProjectType(pt.id)}
                        className="text-left p-4 rounded-xl transition-all duration-200 group"
                        style={{
                          background: projectType === pt.id ? `${cyan.replace(")", " / 0.1)")}` : optionBg,
                          border: `1px solid ${projectType === pt.id ? cyan.replace(")", " / 0.5)") : optionBorder}`,
                          boxShadow: projectType === pt.id ? `0 0 16px ${cyan.replace(")", " / 0.1)")}` : "none",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{pt.emoji}</span>
                          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: projectType === pt.id ? (isDark ? "oklch(0.92 0.005 260)" : "oklch(0.12 0.015 260)") : (isDark ? "oklch(0.70 0.01 260)" : "oklch(0.35 0.01 260)") }}>
                            {pt.label}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed mb-1" style={{ color: mutedColor }}>{pt.description}</p>
                        <p className="text-xs italic" style={{ color: isDark ? "oklch(0.32 0.01 260)" : "oklch(0.60 0.01 260)" }}>{pt.example}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 1: Goal */}
              {step === 1 && (
                <>
                  <div className="tag-mono mb-4 inline-block" style={{ background: `${cyan.replace(")", " / 0.08)")}`, color: cyan, border: `1px solid ${cyan.replace(")", " / 0.2)")}` }}>
                    Step 2 of 4 — What's your primary goal?
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: headingColor, letterSpacing: "-0.02em" }}>
                    What should this project achieve?
                  </h2>
                  <p className="text-sm mb-6" style={{ color: bodyColor }}>
                    Your goal shapes the layout, CTAs, and user flow of the entire project.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {goalOptions.map((g) => (
                      <button key={g.id} onClick={() => setGoal(g.id)}
                        className="text-left p-5 rounded-xl transition-all duration-200"
                        style={{
                          background: goal === g.id ? `${cyan.replace(")", " / 0.1)")}` : optionBg,
                          border: `1px solid ${goal === g.id ? cyan.replace(")", " / 0.5)") : optionBorder}`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{g.emoji}</span>
                          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: goal === g.id ? (isDark ? "oklch(0.92 0.005 260)" : "oklch(0.12 0.015 260)") : (isDark ? "oklch(0.70 0.01 260)" : "oklch(0.35 0.01 260)") }}>
                            {g.label}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: mutedColor }}>{g.description}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 2: Audience */}
              {step === 2 && (
                <>
                  <div className="tag-mono mb-4 inline-block" style={{ background: `${cyan.replace(")", " / 0.08)")}`, color: cyan, border: `1px solid ${cyan.replace(")", " / 0.2)")}` }}>
                    Step 3 of 4 — Who is this for?
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: headingColor, letterSpacing: "-0.02em" }}>
                    Who is your primary audience?
                  </h2>
                  <p className="text-sm mb-6" style={{ color: bodyColor }}>
                    Your audience determines the visual style, language, and UX priorities of the dining room.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {audienceOptions.map((a) => (
                      <button key={a.id} onClick={() => setAudience(a.id)}
                        className="text-left p-5 rounded-xl transition-all duration-200"
                        style={{
                          background: audience === a.id ? `${cyan.replace(")", " / 0.1)")}` : optionBg,
                          border: `1px solid ${audience === a.id ? cyan.replace(")", " / 0.5)") : optionBorder}`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{a.emoji}</span>
                          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: audience === a.id ? (isDark ? "oklch(0.92 0.005 260)" : "oklch(0.12 0.015 260)") : (isDark ? "oklch(0.70 0.01 260)" : "oklch(0.35 0.01 260)") }}>
                            {a.label}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: mutedColor }}>{a.description}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 3: Data Needs */}
              {step === 3 && (
                <>
                  <div className="tag-mono mb-4 inline-block" style={{ background: `${cyan.replace(")", " / 0.08)")}`, color: cyan, border: `1px solid ${cyan.replace(")", " / 0.2)")}` }}>
                    Step 4 of 4 — The Kitchen
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: headingColor, letterSpacing: "-0.02em" }}>
                    What does your kitchen need to do?
                  </h2>
                  <p className="text-sm mb-6" style={{ color: bodyColor }}>
                    The backend (kitchen) handles data storage, logins, and business logic. Choose what yours needs to do.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dataNeedOptions.map((d) => (
                      <button key={d.id} onClick={() => setDataNeed(d.id)}
                        className="text-left p-5 rounded-xl transition-all duration-200"
                        style={{
                          background: dataNeed === d.id ? `${cyan.replace(")", " / 0.1)")}` : optionBg,
                          border: `1px solid ${dataNeed === d.id ? cyan.replace(")", " / 0.5)") : optionBorder}`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{d.emoji}</span>
                          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: dataNeed === d.id ? (isDark ? "oklch(0.92 0.005 260)" : "oklch(0.12 0.015 260)") : (isDark ? "oklch(0.70 0.01 260)" : "oklch(0.35 0.01 260)") }}>
                            {d.label}
                          </span>
                        </div>
                        <p className="text-xs mb-2" style={{ color: mutedColor }}>{d.description}</p>
                        <p className="text-xs italic" style={{ color: isDark ? "oklch(0.32 0.01 260)" : "oklch(0.60 0.01 260)" }}>🍴 {d.kitchenAnalogy}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-25"
                style={{ fontFamily: "var(--font-display)", color: bodyColor, border: `1px solid ${cardBorder}` }}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={handleNext} disabled={!currentValue}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-25 disabled:scale-100"
                style={{ fontFamily: "var(--font-display)", background: currentValue ? cyan : optionBg, color: currentValue ? (isDark ? "oklch(0.08 0.01 260)" : "oklch(0.98 0 0)") : mutedColor, boxShadow: currentValue ? `0 0 16px ${cyan.replace(")", " / 0.3)")}` : "none" }}
              >
                {isLastStep ? "Generate My Blueprint 🚀" : "Continue"} {!isLastStep && <ArrowRight size={14} />}
              </button>
            </div>
          </motion.div>
        ) : (
          // ─── BLUEPRINT RESULTS ───────────────────────────────────────────
          <motion.div key="blueprint" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <Zap size={20} style={{ color: cyan }} />
              <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: headingColor, letterSpacing: "-0.02em" }}>
                Your {blueprint.projectLabel} Blueprint
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Vibe Tool */}
              <div className="rounded-xl p-6" style={{ background: `${cyan.replace(")", " / 0.07)")}`, border: `1px solid ${cyan.replace(")", " / 0.28)")}` }}>
                <div className="tag-mono mb-3" style={{ color: cyan }}>Recommended Vibe Coding Tool</div>
                <div className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: cyan }}>{blueprint.vibeTool}</div>
                <p className="text-sm" style={{ color: bodyColor }}>{blueprint.vibeToolReason}</p>
              </div>

              {/* Cost Estimate */}
              <div className="rounded-xl p-6" style={{ background: `${gold.replace(")", " / 0.07)")}`, border: `1px solid ${gold.replace(")", " / 0.28)")}` }}>
                <div className="tag-mono mb-3" style={{ color: gold }}>Estimated Build Cost</div>
                <p className="text-sm leading-relaxed" style={{ color: bodyColor }}>{blueprint.estimatedCost}</p>
                <p className="text-xs mt-2" style={{ color: mutedColor }}>Deploy: {blueprint.deployTarget}</p>
              </div>
            </div>

            {/* Frontend — The Dining Room */}
            <div className="rounded-xl p-6 mb-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-center gap-3 mb-4">
                <Utensils size={18} style={{ color: cyan }} />
                <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: headingColor }}>
                  🍽️ The Dining Room — Your Frontend
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="tag-mono mb-3" style={{ color: mutedColor }}>Page Structure</div>
                  <ul className="space-y-1.5">
                    {blueprint.frontend.structure.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs" style={{ color: bodyColor }}>
                        <span style={{ color: cyan, flexShrink: 0 }}>→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="tag-mono mb-1" style={{ color: mutedColor }}>Visual Style</div>
                    <p className="text-xs leading-relaxed" style={{ color: bodyColor }}>{blueprint.frontend.style}</p>
                  </div>
                  <div>
                    <div className="tag-mono mb-1" style={{ color: mutedColor }}>Animations</div>
                    <p className="text-xs leading-relaxed" style={{ color: bodyColor }}>{blueprint.frontend.animations}</p>
                  </div>
                  <div>
                    <div className="tag-mono mb-1" style={{ color: mutedColor }}>Framework</div>
                    <p className="text-xs" style={{ color: bodyColor }}>{blueprint.frontend.framework}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend — The Kitchen */}
            <div className="rounded-xl p-6 mb-6" style={{ background: cardBg, border: `1px solid ${blueprint.backend.needed ? gold.replace(")", " / 0.3)") : cardBorder}` }}>
              <div className="flex items-center gap-3 mb-4">
                <ChefHat size={18} style={{ color: gold }} />
                <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: headingColor }}>
                  👨‍🍳 The Kitchen — Your Backend
                </h3>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: bodyColor }}>{blueprint.backend.summary}</p>
              {blueprint.backend.needed && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ background: `${gold.replace(")", " / 0.06)")}`, border: `1px solid ${gold.replace(")", " / 0.2)")}` }}>
                    <div className="tag-mono mb-2" style={{ color: gold }}>Database (The Pantry)</div>
                    <div className="font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-display)", color: gold }}>{blueprint.backend.database}</div>
                    <p className="text-xs leading-relaxed" style={{ color: bodyColor }}>{blueprint.backend.databaseReason}</p>
                  </div>
                  {blueprint.backend.apis.length > 0 && (
                    <div>
                      <div className="tag-mono mb-2" style={{ color: mutedColor }}>APIs & Integrations (The Delivery Drivers)</div>
                      <ul className="space-y-1">
                        {blueprint.backend.apis.map((api) => (
                          <li key={api} className="flex items-center gap-2 text-xs" style={{ color: bodyColor }}>
                            <span style={{ color: gold }}>→</span> {api}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Workflow */}
            <div className="rounded-xl p-6 mb-8" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <h3 className="font-bold text-base mb-5" style={{ fontFamily: "var(--font-display)", color: headingColor }}>
                🗺️ Your Step-by-Step Execution Roadmap
              </h3>
              <div className="space-y-4">
                {blueprint.workflow.map((item, i) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ fontFamily: "var(--font-mono)", color: isDark ? "oklch(0.08 0.01 260)" : "oklch(0.98 0 0)", background: cyan, fontSize: "0.6rem" }}>{item.step}</span>
                      {i < blueprint.workflow.length - 1 && <div className="w-px flex-1 min-h-[16px]" style={{ background: `${cyan.replace(")", " / 0.2)")}` }} />}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: headingColor }}>{item.title}</span>
                        <span className="tag-mono" style={{ background: `${cyan.replace(")", " / 0.08)")}`, color: cyan }}>{item.tool}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: bodyColor }}>{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-display)", border: `1px solid ${cardBorder}`, color: bodyColor }}
              >
                Start Over
              </button>
              <Link href="/workflow"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-display)", background: cyan, color: isDark ? "oklch(0.08 0.01 260)" : "oklch(0.98 0 0)" }}
              >
                View Full Workflow Map <ExternalLink size={14} />
              </Link>
              <Link href="/vault"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-display)", background: `${gold.replace(")", " / 0.12)")}`, border: `1px solid ${gold.replace(")", " / 0.3)")}`, color: gold }}
              >
                Explore Resource Vault
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

