// Project Architect — Non-tech friendly funnel with restaurant metaphor
// 4 steps: Project Type → Goal → Audience → Data Needs
// Output: Full personalized blueprint
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Zap, ExternalLink, ChefHat, Utensils, Database, Globe, Layers } from "lucide-react";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useArchitect } from "@/contexts/ArchitectContext";
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
          className="mb-8 p-5 rounded-xl bg-signal-soft border border-signal-border"
        >
          <div className="flex items-start gap-4">
            <div className="flex gap-3 flex-shrink-0 mt-0.5">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1 font-display text-text-strong">
                Think of your app like a restaurant
              </p>
              <p className="text-xs leading-relaxed text-text-muted">
                The <strong className="text-signal">Frontend</strong> is the dining room — everything your users see, touch, and experience.
                The <strong className="text-gold">Backend</strong> is the kitchen — the hidden logic, storage, and preparation that powers the experience.
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-mono transition-all border ${
                  i < step
                    ? "bg-signal text-primary-foreground border-signal"
                    : i === step
                    ? "bg-signal-soft text-signal border-signal"
                    : "bg-surface-2 text-text-muted border-border-subtle"
                }`}
              >
                {i < step ? <CheckCircle2 size={12} /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-px w-4 flex-shrink-0 ${i < step ? "bg-signal-border" : "bg-border-subtle"}`} />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!blueprint ? (
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
              {/* Step 0: Project Type */}
              {step === 0 && (
                <>
                  <div className="tag-mono mb-4 inline-block">
                    Step 1 of 4 — What are you building?
                  </div>
                  <h2 className="text-2xl font-bold mb-2 font-display text-text-strong tracking-tight">
                    Choose your project type
                  </h2>
                  <p className="text-sm mb-6 text-text-muted">
                    This determines your frontend structure, backend needs, and which vibe coding tool to use.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projectTypes.map((pt) => (
                      <button key={pt.id} onClick={() => setProjectType(pt.id)}
                        className={`text-left p-4 rounded-xl transition-all duration-200 group border ${
                          projectType === pt.id
                            ? "bg-signal-soft border-signal shadow-xs"
                            : "bg-surface-2 border-border-subtle hover:border-signal-border"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{pt.emoji}</span>
                          <span className={`font-semibold text-sm font-display ${projectType === pt.id ? "text-signal" : "text-text-strong"}`}>
                            {pt.label}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed mb-1 text-text-muted">{pt.description}</p>
                        <p className="text-xs italic text-text-subtle">{pt.example}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 1: Goal */}
              {step === 1 && (
                <>
                  <div className="tag-mono mb-4 inline-block">
                    Step 2 of 4 — What's your primary goal?
                  </div>
                  <h2 className="text-2xl font-bold mb-2 font-display text-text-strong tracking-tight">
                    What should this project achieve?
                  </h2>
                  <p className="text-sm mb-6 text-text-muted">
                    Your goal shapes the layout, CTAs, and user flow of the entire project.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {goalOptions.map((g) => (
                      <button key={g.id} onClick={() => setGoal(g.id)}
                        className={`text-left p-5 rounded-xl transition-all duration-200 border ${
                          goal === g.id
                            ? "bg-signal-soft border-signal shadow-xs"
                            : "bg-surface-2 border-border-subtle hover:border-signal-border"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{g.emoji}</span>
                          <span className={`font-semibold text-sm font-display ${goal === g.id ? "text-signal" : "text-text-strong"}`}>
                            {g.label}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">{g.description}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 2: Audience */}
              {step === 2 && (
                <>
                  <div className="tag-mono mb-4 inline-block">
                    Step 3 of 4 — Who is this for?
                  </div>
                  <h2 className="text-2xl font-bold mb-2 font-display text-text-strong tracking-tight">
                    Who is your primary audience?
                  </h2>
                  <p className="text-sm mb-6 text-text-muted">
                    Your audience determines the visual style, language, and UX priorities of the dining room.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {audienceOptions.map((a) => (
                      <button key={a.id} onClick={() => setAudience(a.id)}
                        className={`text-left p-5 rounded-xl transition-all duration-200 border ${
                          audience === a.id
                            ? "bg-signal-soft border-signal shadow-xs"
                            : "bg-surface-2 border-border-subtle hover:border-signal-border"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{a.emoji}</span>
                          <span className={`font-semibold text-sm font-display ${audience === a.id ? "text-signal" : "text-text-strong"}`}>
                            {a.label}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">{a.description}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 3: Data Needs */}
              {step === 3 && (
                <>
                  <div className="tag-mono mb-4 inline-block">
                    Step 4 of 4 — The Kitchen
                  </div>
                  <h2 className="text-2xl font-bold mb-2 font-display text-text-strong tracking-tight">
                    What does your kitchen need to do?
                  </h2>
                  <p className="text-sm mb-6 text-text-muted">
                    The backend (kitchen) handles data storage, logins, and business logic. Choose what yours needs to do.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dataNeedOptions.map((d) => (
                      <button key={d.id} onClick={() => setDataNeed(d.id)}
                        className={`text-left p-5 rounded-xl transition-all duration-200 border ${
                          dataNeed === d.id
                            ? "bg-signal-soft border-signal shadow-xs"
                            : "bg-surface-2 border-border-subtle hover:border-signal-border"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{d.emoji}</span>
                          <span className={`font-semibold text-sm font-display ${dataNeed === d.id ? "text-signal" : "text-text-strong"}`}>
                            {d.label}
                          </span>
                        </div>
                        <p className="text-xs mb-2 text-text-muted">{d.description}</p>
                        <p className="text-xs italic text-text-subtle">🍴 {d.kitchenAnalogy}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold font-display text-text-muted border border-border-subtle transition-all disabled:opacity-25 hover:text-text-strong"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={handleNext} disabled={!currentValue}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold font-display transition-all hover:scale-105 active:scale-95 disabled:opacity-25 disabled:scale-100 ${
                  currentValue ? "bg-signal text-primary-foreground shadow-sm cyan-glow" : "bg-surface-2 text-text-muted"
                }`}
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
              <Zap size={20} className="text-signal" />
              <h2 className="text-2xl font-bold font-display text-text-strong tracking-tight">
                Your {blueprint.projectLabel} Blueprint
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Vibe Tool */}
              <div className="rounded-xl p-6 bg-signal-soft border border-signal-border">
                <div className="tag-mono mb-3 text-signal">Recommended Vibe Coding Tool</div>
                <div className="text-2xl font-bold mb-2 font-display text-signal">{blueprint.vibeTool}</div>
                <p className="text-sm text-text-muted">{blueprint.vibeToolReason}</p>
              </div>

              {/* Cost Estimate */}
              <div className="rounded-xl p-6 bg-gold-soft border border-gold-border">
                <div className="tag-mono mb-3 text-gold">Estimated Build Cost</div>
                <p className="text-sm leading-relaxed text-text-muted">{blueprint.estimatedCost}</p>
                <p className="text-xs mt-2 text-text-subtle">Deploy: {blueprint.deployTarget}</p>
              </div>
            </div>

            {/* Frontend — The Dining Room */}
            <div className="glass-card rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Utensils size={18} className="text-signal" />
                <h3 className="font-bold text-base font-display text-text-strong">
                  🍽️ The Dining Room — Your Frontend
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="tag-mono mb-3 text-text-subtle">Page Structure</div>
                  <ul className="space-y-1.5">
                    {blueprint.frontend.structure.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-text-muted">
                        <span className="text-signal flex-shrink-0">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="tag-mono mb-1 text-text-subtle">Visual Style</div>
                    <p className="text-xs leading-relaxed text-text-muted">{blueprint.frontend.style}</p>
                  </div>
                  <div>
                    <div className="tag-mono mb-1 text-text-subtle">Animations</div>
                    <p className="text-xs leading-relaxed text-text-muted">{blueprint.frontend.animations}</p>
                  </div>
                  <div>
                    <div className="tag-mono mb-1 text-text-subtle">Framework</div>
                    <p className="text-xs text-text-muted">{blueprint.frontend.framework}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend — The Kitchen */}
            <div className={`glass-card rounded-xl p-6 mb-6 ${blueprint.backend.needed ? "border-gold-border" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <ChefHat size={18} className="text-gold" />
                <h3 className="font-bold text-base font-display text-text-strong">
                  👨‍🍳 The Kitchen — Your Backend
                </h3>
              </div>
              <p className="text-sm leading-relaxed mb-4 text-text-muted">{blueprint.backend.summary}</p>
              {blueprint.backend.needed && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gold-soft border border-gold-border">
                    <div className="tag-mono mb-2 text-gold">Database (The Pantry)</div>
                    <div className="font-semibold text-sm mb-1 font-display text-gold">{blueprint.backend.database}</div>
                    <p className="text-xs leading-relaxed text-text-muted">{blueprint.backend.databaseReason}</p>
                  </div>
                  {blueprint.backend.apis.length > 0 && (
                    <div>
                      <div className="tag-mono mb-2 text-text-subtle">APIs & Integrations (The Delivery Drivers)</div>
                      <ul className="space-y-1">
                        {blueprint.backend.apis.map((api) => (
                          <li key={api} className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="text-gold">→</span> {api}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Workflow */}
            <div className="glass-card rounded-xl p-6 mb-8">
              <h3 className="font-bold text-base mb-5 font-display text-text-strong">
                🗺️ Your Step-by-Step Execution Roadmap
              </h3>
              <div className="space-y-4">
                {blueprint.workflow.map((item, i) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-primary-foreground bg-signal text-[0.6rem]">{item.step}</span>
                      {i < blueprint.workflow.length - 1 && <div className="w-px flex-1 min-h-[16px] bg-signal-border" />}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold font-display text-text-strong">{item.title}</span>
                        <span className="tag-mono bg-signal-soft text-signal">{item.tool}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-text-muted">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold font-display text-text-muted border border-border-subtle transition-all hover:scale-105 hover:text-text-strong"
              >
                Start Over
              </button>
              <Link href="/workflow"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold font-display transition-all hover:scale-105 bg-signal text-primary-foreground"
              >
                View Full Workflow Map <ExternalLink size={14} />
              </Link>
              <Link href="/vault"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold font-display transition-all hover:scale-105 bg-gold-soft border border-gold-border text-gold"
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

