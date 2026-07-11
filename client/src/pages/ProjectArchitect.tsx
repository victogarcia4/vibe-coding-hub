// Project Architect Page — Obsidian Architect Design
// Stepped wizard that saves answers to ArchitectContext for dynamic WorkflowMap
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Zap, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useArchitect, ArchitectAnswers } from "@/contexts/ArchitectContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Step {
  id: number;
  key: keyof ArchitectAnswers;
  title: string;
  question: string;
  options: { value: string; label: string; description: string; icon: string }[];
}

const steps: Step[] = [
  {
    id: 1, key: "scope",
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
    id: 2, key: "audience",
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
    id: 3, key: "complexity",
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
    id: 4, key: "data",
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

function getVibeTool(a: ArchitectAnswers) {
  if (a.complexity === "complex" || a.complexity === "enterprise") return "Manus";
  if (a.scope === "static") return "Lovable";
  if (a.complexity === "simple") return "Emergent";
  return "Lovable";
}
function getDatabase(a: ArchitectAnswers) {
  if (a.data === "realtime") return "Convex or Firebase";
  if (a.data === "relational") return "Supabase or Neon";
  if (a.data === "document") return "MongoDB Atlas";
  return null;
}
function getStyleSource(a: ArchitectAnswers) {
  if (a.audience === "consumers") return "Godly.website, Awwwards";
  if (a.audience === "developers") return "21st.dev, Refero";
  if (a.audience === "business") return "Refero, Dribbble (SaaS)";
  return "Refero, Awwwards";
}
function getAnimationLib(a: ArchitectAnswers) {
  if (a.scope === "pwa" || a.scope === "dynamic") return "Framer Motion + Lottie loading states";
  if (a.scope === "static") return "Framer Motion for entrance animations";
  return "Framer Motion";
}

export default function ProjectArchitect() {
  const [currentStep, setCurrentStep] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Partial<ArchitectAnswers>>({});
  const [completed, setCompleted] = useState(false);
  const { setAnswers } = useArchitect();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const selectedAnswer = localAnswers[step?.key];

  const handleSelect = (value: string) =>
    setLocalAnswers((prev) => ({ ...prev, [step.key]: value }));

  const handleNext = () => {
    if (isLastStep) {
      const full = localAnswers as ArchitectAnswers;
      setAnswers(full);
      setCompleted(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };
  const handleBack = () => { if (currentStep > 0) setCurrentStep((s) => s - 1); };
  const handleReset = () => { setCurrentStep(0); setLocalAnswers({}); setCompleted(false); };

  const a = localAnswers as ArchitectAnswers;
  const vibeTool = completed ? getVibeTool(a) : "";
  const database = completed ? getDatabase(a) : null;
  const styleSource = completed ? getStyleSource(a) : "";
  const animLib = completed ? getAnimationLib(a) : "";

  const cyan = isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)";
  const cardBg = isDark ? "oklch(0.11 0.013 260)" : "oklch(1 0 0)";
  const cardBorder = isDark ? "1px solid oklch(0.18 0.015 260)" : "1px solid oklch(0.88 0.006 260)";
  const optionBg = isDark ? "oklch(0.13 0.013 260)" : "oklch(0.97 0.003 260)";
  const optionBorder = isDark ? "oklch(0.18 0.015 260)" : "oklch(0.88 0.006 260)";
  const textMuted = isDark ? "oklch(0.38 0.01 260)" : "oklch(0.50 0.01 260)";
  const textBody = isDark ? "oklch(0.55 0.01 260)" : "oklch(0.40 0.01 260)";

  return (
    <PageLayout
      title="The Project Architect"
      subtitle="Answer four questions to receive a personalized stack recommendation and a custom workflow."
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
                    background: i < currentStep ? cyan : i === currentStep ? `${cyan.replace(")", " / 0.15)")}` : isDark ? "oklch(0.13 0.013 260)" : "oklch(0.93 0.005 260)",
                    color: i <= currentStep ? cyan : textMuted,
                    border: i === currentStep ? `1px solid ${cyan.replace(")", " / 0.5)")}` : `1px solid ${optionBorder}`,
                  }}
                >
                  {i < currentStep ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="h-px w-8" style={{ background: i < currentStep ? `${cyan.replace(")", " / 0.4)")}` : optionBorder }} />
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
              <div className="rounded-2xl p-8 mb-6" style={{ background: cardBg, border: cardBorder }}>
                <div className="tag-mono mb-5 inline-block" style={{ background: `${cyan.replace(")", " / 0.08)")}`, color: cyan, border: `1px solid ${cyan.replace(")", " / 0.2)")}` }}>
                  Step {currentStep + 1} of {steps.length} — {step.title}
                </div>
                <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.97 0.005 260)" : "oklch(0.12 0.015 260)", letterSpacing: "-0.02em" }}>
                  {step.question}
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {step.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="text-left p-5 rounded-xl transition-all duration-200"
                      style={{
                        background: selectedAnswer === opt.value ? `${cyan.replace(")", " / 0.1)")}` : optionBg,
                        border: `1px solid ${selectedAnswer === opt.value ? cyan.replace(")", " / 0.5)") : optionBorder}`,
                        boxShadow: selectedAnswer === opt.value ? `0 0 16px ${cyan.replace(")", " / 0.1)")}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-base" style={{ color: selectedAnswer === opt.value ? cyan : textMuted }}>{opt.icon}</span>
                        <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: selectedAnswer === opt.value ? (isDark ? "oklch(0.92 0.005 260)" : "oklch(0.12 0.015 260)") : (isDark ? "oklch(0.65 0.01 260)" : "oklch(0.45 0.01 260)") }}>
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: textMuted }}>{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={handleBack} disabled={currentStep === 0} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-25" style={{ fontFamily: "var(--font-display)", color: textBody, border: cardBorder }}>
                  <ArrowLeft size={14} /> Back
                </button>
                <button onClick={handleNext} disabled={!selectedAnswer} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-25 disabled:scale-100" style={{ fontFamily: "var(--font-display)", background: cyan, color: isDark ? "oklch(0.08 0.01 260)" : "oklch(0.98 0 0)", boxShadow: selectedAnswer ? `0 0 16px ${cyan.replace(")", " / 0.3)")}` : "none" }}>
                  {isLastStep ? "Generate My Workflow" : "Continue"} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="rounded-2xl p-8 mb-6" style={{ background: cardBg, border: cardBorder }}>
                <div className="flex items-center gap-3 mb-6">
                  <Zap size={18} style={{ color: cyan }} />
                  <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.97 0.005 260)" : "oklch(0.12 0.015 260)", letterSpacing: "-0.02em" }}>
                    Your Architecture Blueprint
                  </h2>
                </div>

                {/* Recommendations */}
                <div className="space-y-3 mb-8">
                  <div className="p-5 rounded-xl" style={{ background: `${cyan.replace(")", " / 0.06)")}`, border: `1px solid ${cyan.replace(")", " / 0.25)")}` }}>
                    <div className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-display)", color: cyan }}>Vibe Coding Tool → {vibeTool}</div>
                    <p className="text-sm" style={{ color: textBody }}>
                      {vibeTool === "Manus" && "Complex projects need autonomous orchestration. Manus handles research, architecture, and execution end-to-end."}
                      {vibeTool === "Lovable" && "Design-led projects shine with Lovable's visual editor and full React code ownership via GitHub export."}
                      {vibeTool === "Emergent" && "For a fast MVP, Emergent generates your frontend, backend, and database in one shot — no setup needed."}
                    </p>
                  </div>
                  {database && (
                    <div className="p-5 rounded-xl" style={{ background: `${cyan.replace(")", " / 0.04)")}`, border: `1px solid ${cyan.replace(")", " / 0.18)")}` }}>
                      <div className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-display)", color: cyan }}>Database → {database}</div>
                      <p className="text-sm" style={{ color: textBody }}>
                        {a.data === "realtime" && "Real-time sync required. Convex or Firebase will keep all users' screens updated instantly without page refreshes."}
                        {a.data === "relational" && "Structured data with complex queries — Supabase or Neon give you a full Postgres database with zero server management."}
                        {a.data === "document" && "Flexible, evolving data structures — MongoDB Atlas stores data like notes rather than rigid spreadsheets."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Execution Roadmap */}
                <div className="pt-6 border-t" style={{ borderColor: isDark ? "oklch(0.16 0.015 260)" : "oklch(0.88 0.006 260)" }}>
                  <h3 className="text-sm font-semibold mb-5" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.78 0.01 260)" : "oklch(0.30 0.01 260)" }}>
                    Personalized Execution Roadmap
                  </h3>
                  <div className="space-y-4">
                    {[
                      { step: "01", title: "Ideation", desc: `Browse ${styleSource} for style references matching your ${a.audience} audience.` },
                      { step: "02", title: "Research", desc: `Upload ${database ? `${database} and` : ""} ${animLib} docs to NotebookLM. Generate source-grounded architectural patterns.` },
                      { step: "03", title: "Architecture", desc: database ? `Use ${database} for your data layer. ${a.data === "realtime" ? "Configure real-time listeners before building the UI." : "Define your schema and access rules before coding."}` : "No database needed — focus on static content and performance." },
                      { step: "04", title: "Execution", desc: `Prompt ${vibeTool} with your NotebookLM-synthesized context. ${a.scope === "pwa" ? "Add manifest.json and service worker for offline support." : ""}` },
                      { step: "05", title: "GitHub", desc: `Export to GitHub via ${vibeTool}'s export button. This unlocks deployment and version history.` },
                      { step: "06", title: "Deploy", desc: "Connect your GitHub repo to Vercel or Netlify with one click. Your site goes live in under 2 minutes with auto-deploy on every push." },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4">
                        <span className="text-xs font-bold w-7 flex-shrink-0 mt-0.5" style={{ fontFamily: "var(--font-mono)", color: cyan }}>{item.step}</span>
                        <div>
                          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.80 0.005 260)" : "oklch(0.20 0.015 260)" }}>{item.title}</span>
                          <p className="text-xs mt-0.5" style={{ color: textMuted }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleReset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105" style={{ fontFamily: "var(--font-display)", border: cardBorder, color: textBody }}>
                  Start Over
                </button>
                <Link href="/workflow" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all hover:scale-105" style={{ fontFamily: "var(--font-display)", background: cyan, color: isDark ? "oklch(0.08 0.01 260)" : "oklch(0.98 0 0)" }}>
                  View My Workflow <ExternalLink size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

