// Project Architect Page — Obsidian Architect Design
// Architectural sidebar layout + stepped console wizard
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import PageLayout from "@/components/PageLayout";

interface Step {
  id: number;
  title: string;
  question: string;
  options: { value: string; label: string; description: string; icon: string }[];
}

const steps: Step[] = [
  {
    id: 1,
    title: "Project Scope",
    question: "What type of application are you building?",
    options: [
      { value: "pwa", label: "Progressive Web App (PWA)", description: "Offline-capable, installable, mobile-first web app", icon: "⬡" },
      { value: "static", label: "Static Website", description: "Marketing site, portfolio, or documentation", icon: "◻" },
      { value: "dynamic", label: "Dynamic Web App", description: "Full-stack app with real-time data and auth", icon: "◈" },
      { value: "saas", label: "SaaS Product", description: "Multi-tenant application with subscriptions", icon: "✦" },
    ],
  },
  {
    id: 2,
    title: "Target Audience",
    question: "Who is your primary target audience?",
    options: [
      { value: "consumers", label: "Consumers / General Public", description: "Broad audience, mobile-first UX critical", icon: "◎" },
      { value: "developers", label: "Developers / Technical Users", description: "Power users, CLI-friendly, API-first", icon: "⟨⟩" },
      { value: "business", label: "Business / Enterprise", description: "B2B tools, dashboards, compliance matters", icon: "▣" },
      { value: "internal", label: "Internal Team", description: "Admin panels, ops tools, workflow automation", icon: "⊞" },
    ],
  },
  {
    id: 3,
    title: "Complexity Level",
    question: "What is the technical complexity of your project?",
    options: [
      { value: "simple", label: "Simple / MVP", description: "Core features only, ship in days", icon: "○" },
      { value: "moderate", label: "Moderate", description: "Multiple features, basic auth, standard CRUD", icon: "◑" },
      { value: "complex", label: "Complex", description: "Real-time data, advanced auth, third-party APIs", icon: "●" },
      { value: "enterprise", label: "Enterprise", description: "Multi-tenant, compliance, high availability", icon: "⬟" },
    ],
  },
  {
    id: 4,
    title: "Data Requirements",
    question: "What are your primary data requirements?",
    options: [
      { value: "realtime", label: "High-Performance Real-Time", description: "Live updates, collaborative features, low latency", icon: "⚡" },
      { value: "relational", label: "Relational / Structured", description: "Complex queries, joins, transactions", icon: "⊟" },
      { value: "document", label: "Document / Flexible", description: "Varied schemas, nested data, rapid iteration", icon: "≡" },
      { value: "minimal", label: "Minimal / Static", description: "No database needed, or simple key-value", icon: "—" },
    ],
  },
];

interface Recommendation {
  tool: string;
  reason: string;
  database?: string;
  animation?: string;
  color: string;
}

function getRecommendations(answers: Record<number, string>): Recommendation[] {
  const recs: Recommendation[] = [];
  if (answers[3] === "simple" || answers[3] === "moderate") {
    if (answers[1] === "static") {
      recs.push({ tool: "Lovable", reason: "Best for design-led static sites and rapid UI iteration with full code ownership.", color: "oklch(0.82 0.16 85)" });
    } else {
      recs.push({ tool: "Emergent", reason: "Fastest path to a full-stack MVP — generates frontend, backend, and database in one shot.", color: "oklch(0.78 0.18 200)" });
    }
  } else {
    recs.push({ tool: "Manus", reason: "Complex projects need autonomous orchestration. Manus handles research, architecture, and execution end-to-end.", color: "oklch(0.78 0.18 200)" });
  }
  if (answers[4] === "realtime") {
    recs.push({ tool: "Convex or Firebase", reason: "Real-time data requirements demand reactive backends with built-in sync.", database: "Convex / Firebase", animation: "Lottie animations for loading states", color: "oklch(0.78 0.18 200)" });
  } else if (answers[4] === "relational") {
    recs.push({ tool: "Supabase or Neon", reason: "Relational data with complex queries is best served by Postgres-based platforms.", database: "Supabase / Neon", color: "oklch(0.78 0.18 200)" });
  } else if (answers[4] === "document") {
    recs.push({ tool: "MongoDB Atlas", reason: "Flexible document schemas accelerate iteration on evolving data models.", database: "MongoDB Atlas", color: "oklch(0.78 0.18 200)" });
  }
  return recs;
}

export default function ProjectArchitect() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const selectedAnswer = answers[step?.id];

  const handleSelect = (value: string) => setAnswers((prev) => ({ ...prev, [step.id]: value }));
  const handleNext = () => { if (isLastStep) setCompleted(true); else setCurrentStep((s) => s + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep((s) => s - 1); };
  const handleReset = () => { setCurrentStep(0); setAnswers({}); setCompleted(false); };

  const recommendations = completed ? getRecommendations(answers) : [];

  return (
    <PageLayout
      title="The Project Architect"
      subtitle="Answer four questions to receive a personalized stack recommendation and execution roadmap."
      phase="01"
    >
      <div className="max-w-2xl">
        {/* Progress Rail */}
        {!completed && (
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: i < currentStep ? "oklch(0.78 0.18 200)" : i === currentStep ? "oklch(0.78 0.18 200 / 0.15)" : "oklch(0.13 0.013 260)",
                    color: i <= currentStep ? "oklch(0.78 0.18 200)" : "oklch(0.30 0.01 260)",
                    border: i === currentStep ? "1px solid oklch(0.78 0.18 200 / 0.5)" : "1px solid oklch(0.18 0.015 260)",
                  }}
                >
                  {i < currentStep ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="h-px w-8"
                    style={{ background: i < currentStep ? "oklch(0.78 0.18 200 / 0.4)" : "oklch(0.18 0.015 260)" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
            >
              <div
                className="rounded-2xl p-8 mb-6"
                style={{ background: "oklch(0.11 0.013 260)", border: "1px solid oklch(0.18 0.015 260)" }}
              >
                <div className="tag-mono mb-5 inline-block" style={{ background: "oklch(0.78 0.18 200 / 0.08)", color: "oklch(0.78 0.18 200)", border: "1px solid oklch(0.78 0.18 200 / 0.2)" }}>
                  Step {currentStep + 1} of {steps.length} — {step.title}
                </div>
                <h2
                  className="text-2xl font-bold mb-8"
                  style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)", letterSpacing: "-0.02em" }}
                >
                  {step.question}
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {step.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="text-left p-5 rounded-xl transition-all duration-200"
                      style={{
                        background: selectedAnswer === opt.value ? "oklch(0.78 0.18 200 / 0.1)" : "oklch(0.13 0.013 260)",
                        border: `1px solid ${selectedAnswer === opt.value ? "oklch(0.78 0.18 200 / 0.5)" : "oklch(0.18 0.015 260)"}`,
                        boxShadow: selectedAnswer === opt.value ? "0 0 16px oklch(0.78 0.18 200 / 0.1)" : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-base" style={{ color: selectedAnswer === opt.value ? "oklch(0.78 0.18 200)" : "oklch(0.35 0.01 260)" }}>
                          {opt.icon}
                        </span>
                        <span
                          className="font-semibold text-sm"
                          style={{ fontFamily: "var(--font-display)", color: selectedAnswer === opt.value ? "oklch(0.92 0.005 260)" : "oklch(0.65 0.01 260)" }}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "oklch(0.38 0.01 260)" }}>
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-25"
                  style={{ fontFamily: "var(--font-display)", color: "oklch(0.45 0.01 260)", border: "1px solid oklch(0.18 0.015 260)" }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-25 disabled:scale-100"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "oklch(0.78 0.18 200)",
                    color: "oklch(0.08 0.01 260)",
                    boxShadow: selectedAnswer ? "0 0 16px oklch(0.78 0.18 200 / 0.3)" : "none",
                  }}
                >
                  {isLastStep ? "Get Recommendations" : "Continue"} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div
                className="rounded-2xl p-8 mb-6"
                style={{ background: "oklch(0.11 0.013 260)", border: "1px solid oklch(0.18 0.015 260)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Zap size={18} style={{ color: "oklch(0.78 0.18 200)" }} />
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)", letterSpacing: "-0.02em" }}
                  >
                    Your Architecture Blueprint
                  </h2>
                </div>
                <div className="space-y-3 mb-8">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl"
                      style={{ background: "oklch(0.78 0.18 200 / 0.06)", border: "1px solid oklch(0.78 0.18 200 / 0.25)" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: "oklch(0.78 0.18 200)" }}>
                          {rec.tool}
                        </span>
                        {rec.database && (
                          <span className="tag-mono" style={{ background: "oklch(0.78 0.18 200 / 0.1)", color: "oklch(0.78 0.18 200)" }}>
                            Database
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "oklch(0.55 0.01 260)" }}>{rec.reason}</p>
                      {rec.animation && (
                        <p className="text-xs mt-2" style={{ color: "oklch(0.40 0.01 260)", fontFamily: "var(--font-mono)" }}>
                          → Suggested: {rec.animation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {/* Execution Roadmap */}
                <div className="pt-6 border-t" style={{ borderColor: "oklch(0.16 0.015 260)" }}>
                  <h3 className="text-sm font-semibold mb-5" style={{ fontFamily: "var(--font-display)", color: "oklch(0.78 0.01 260)" }}>
                    Execution Roadmap
                  </h3>
                  <div className="space-y-4">
                    {[
                      { step: "01", title: "Ideation", desc: "Browse Dribbble / Refero for style references matching your audience." },
                      { step: "02", title: "Research", desc: "Upload official docs to NotebookLM. Generate source-grounded architectural patterns." },
                      { step: "03", title: "Architecture", desc: "Select your database based on query needs. Define your schema before coding." },
                      { step: "04", title: "Execution", desc: `Prompt ${recommendations[0]?.tool || "your chosen vibe coding tool"} with your NotebookLM-synthesized context.` },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4">
                        <span
                          className="text-xs font-bold w-7 flex-shrink-0 mt-0.5"
                          style={{ fontFamily: "var(--font-mono)", color: "oklch(0.78 0.18 200)" }}
                        >
                          {item.step}
                        </span>
                        <div>
                          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.80 0.005 260)" }}>
                            {item.title}
                          </span>
                          <p className="text-xs mt-0.5" style={{ color: "oklch(0.40 0.01 260)" }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105"
                style={{
                  fontFamily: "var(--font-display)",
                  border: "1px solid oklch(0.18 0.015 260)",
                  color: "oklch(0.50 0.01 260)",
                }}
              >
                Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

