// Workflow Integration Map Page — Obsidian Architect Design
// Architectural sidebar layout + visual pipeline
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BookOpen, Cpu, Database, Zap, FileText, GitBranch, Github, Globe } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

const workflowSteps = [
  { phase: "01", title: "Ideation & Style", tool: "Dribbble / Refero / Godly", description: "Browse curated design galleries to define the visual language of your project. Save references that match your target audience and brand personality.", icon: <FileText size={18} />, outputs: ["Mood board", "Color palette", "Typography choices"] },
  { phase: "02", title: "Documentation Synthesis", tool: "NotebookLM", description: "Upload official documentation for your chosen stack (Supabase, Convex, Framer Motion) into NotebookLM. Generate source-grounded Q&A to extract precise architectural patterns before writing any code.", icon: <BookOpen size={18} />, outputs: ["Schema designs", "RLS policies", "API patterns", "Context-aware prompts"], highlight: true },
  { phase: "03", title: "Architecture Selection", tool: "Resource Vault", description: "Select your database based on query needs. Relational data → Supabase/Neon. Real-time sync → Convex/Firebase. Flexible schema → MongoDB Atlas. Define your data model before execution.", icon: <Database size={18} />, outputs: ["Database schema", "API architecture", "Auth strategy"] },
  { phase: "04", title: "Vibe Coding Execution", tool: "Manus / Lovable / Emergent", description: "Feed the synthesized context from NotebookLM directly into your chosen vibe coding agent. The agent now has precise, source-grounded instructions rather than generic patterns.", icon: <Cpu size={18} />, outputs: ["Working codebase", "Deployed preview"] },
  { phase: "05", title: "Commit to GitHub", tool: "GitHub", description: "Export your project code to a GitHub repository. This gives you a permanent backup, version history, and the ability to collaborate. In Manus and Lovable, click 'Export to GitHub' — it takes under a minute. This step unlocks deployment to Vercel and Netlify.", icon: <Github size={18} />, outputs: ["GitHub repository", "Version history", "Collaboration ready"], isGithub: true },
  { phase: "06", title: "Deploy to Vercel or Netlify", tool: "Vercel / Netlify", description: "Connect your GitHub repository to Vercel or Netlify with one click. Every time you push new code to GitHub, your live site updates automatically. Both platforms offer a generous free tier — your PWA will be live on a public URL in under 2 minutes.", icon: <Globe size={18} />, outputs: ["Live public URL", "Auto-deploy on push", "Free SSL certificate", "Custom domain support"], isDeploy: true },
  { phase: "07", title: "Iteration & Refinement", tool: "Lovable Visual Editor / Manus", description: "Iterate on the UI with Lovable's visual editor or refine complex logic with Manus. Each change you make gets committed to GitHub automatically, and your live site on Vercel/Netlify updates within seconds.", icon: <GitBranch size={18} />, outputs: ["Refined UI", "Bug fixes", "Auto-deployed updates"] },
];

const notebookLMTips = [
  { title: "Upload Strategy", description: "Group sources by layer: Front-end docs, Back-end docs, and Asset documentation in separate notebooks for focused Q&A.", icon: "⬡" },
  { title: "Query Patterns", description: "Ask: \"Based on the Supabase docs, what is the optimal RLS policy for a multi-tenant app?\" — not generic questions.", icon: "◈" },
  { title: "Error Diagnosis", description: "Paste error logs into NotebookLM with the relevant docs. It cross-references the official source to provide precise fixes.", icon: "◎" },
  { title: "Prompt Synthesis", description: "Extract the NotebookLM answer and use it verbatim as context in your Manus or Lovable prompt for source-grounded execution.", icon: "✦" },
];

export default function WorkflowMap() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <PageLayout
      title="Workflow Integration Map"
      subtitle="A visual guide to the complete development lifecycle — with NotebookLM as your Technical Researcher at the center."
      phase="04"
    >
      <div className="max-w-2xl mb-20">
        {workflowSteps.map((step, i) => (
          <motion.div
            key={step.phase}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div
              className="rounded-2xl p-7 relative"
              style={{
                background: isDark ? "oklch(0.11 0.013 260)" : "oklch(1 0 0)",
                border: (step as any).isGithub ? "1px solid oklch(0.82 0.16 85 / 0.4)" : (step as any).isDeploy ? "1px solid oklch(0.70 0.18 160 / 0.4)" : step.highlight ? "1px solid oklch(0.78 0.18 200 / 0.4)" : isDark ? "1px solid oklch(0.18 0.015 260)" : "1px solid oklch(0.88 0.006 260)",
                boxShadow: (step as any).isGithub ? "0 0 28px oklch(0.82 0.16 85 / 0.08)" : (step as any).isDeploy ? "0 0 28px oklch(0.70 0.18 160 / 0.08)" : step.highlight ? "0 0 28px oklch(0.78 0.18 200 / 0.1)" : "none",
              }}
            >
              {step.highlight && (
                <div
                  className="absolute top-4 right-4 tag-mono"
                  style={{ background: "oklch(0.78 0.18 200 / 0.1)", color: "oklch(0.78 0.18 200)", border: "1px solid oklch(0.78 0.18 200 / 0.25)" }}
                >
                  Core Step
                </div>
              )}
              {(step as any).isGithub && (
                <div className="absolute top-4 right-4 tag-mono" style={{ background: "oklch(0.82 0.16 85 / 0.1)", color: "oklch(0.82 0.16 85)", border: "1px solid oklch(0.82 0.16 85 / 0.3)" }}>
                  Required
                </div>
              )}
              {(step as any).isDeploy && (
                <div className="absolute top-4 right-4 tag-mono" style={{ background: "oklch(0.70 0.18 160 / 0.1)", color: "oklch(0.70 0.18 160)", border: "1px solid oklch(0.70 0.18 160 / 0.3)" }}>
                  Go Live
                </div>
              )}
              <div className="flex items-start gap-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.78 0.18 200 / 0.1)", color: "oklch(0.78 0.18 200)" }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.78 0.18 200)" }}>
                    PHASE {step.phase}
                  </span>
                    <span className="tag-mono" style={{ background: "oklch(0.14 0.012 260)", color: "oklch(0.38 0.01 260)" }}>
                    {step.tool}
                  </span>
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)", color: "oklch(0.92 0.005 260)", letterSpacing: "-0.01em" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.48 0.01 260)" }}>
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.outputs.map((output) => (
                      <span
                        key={output}
                        className="tag-mono"
                        style={{ background: "oklch(0.78 0.18 200 / 0.08)", color: "oklch(0.78 0.18 200)", border: "1px solid oklch(0.78 0.18 200 / 0.2)" }}
                      >
                        → {output}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {i < workflowSteps.length - 1 && (
              <div className="flex justify-start ml-12 my-2">
                <ArrowDown size={14} style={{ color: "oklch(0.25 0.01 260)" }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* NotebookLM Strategy */}
      <div className="mb-16">
        <div className="h-px mb-10" style={{ background: "linear-gradient(90deg, oklch(0.78 0.18 200 / 0.5), transparent)" }} />
        <div className="flex items-center gap-3 mb-3">
          <Zap size={18} style={{ color: "oklch(0.78 0.18 200)" }} />
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)", letterSpacing: "-0.02em" }}
          >
            NotebookLM Strategy Guide
          </h2>
        </div>
        <p className="text-sm mb-8 max-w-xl" style={{ color: "oklch(0.48 0.01 260)" }}>
          NotebookLM acts as your "Technical Researcher" — transforming raw documentation into precise, actionable prompts for your vibe coding agent.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {notebookLMTips.map((tip, i) => (
            <motion.div
              key={tip.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl p-6"
              style={{ background: "oklch(0.11 0.013 260)", border: "1px solid oklch(0.18 0.015 260)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg" style={{ color: "oklch(0.78 0.18 200)" }}>{tip.icon}</span>
                <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "oklch(0.85 0.005 260)" }}>
                  {tip.title}
                </h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.45 0.01 260)" }}>
                {tip.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Flow */}
      <div
        className="rounded-2xl p-8"
        style={{ background: "oklch(0.11 0.013 260)", border: "1px solid oklch(0.18 0.015 260)" }}
      >
        <h3 className="text-base font-bold mb-8" style={{ fontFamily: "var(--font-display)", color: "oklch(0.90 0.005 260)" }}>
          Data Flow: Official Docs → NotebookLM → Vibe Agent → Working App
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {[
            { label: "Official Docs", sublabel: "Supabase, Convex, Framer...", icon: "📄" },
            { label: "NotebookLM", sublabel: "Source-grounded synthesis", icon: "🧠", highlight: true },
            { label: "Context Prompt", sublabel: "Precise architectural patterns", icon: "⚡" },
            { label: "Vibe Agent", sublabel: "Manus / Lovable / Emergent", icon: "🤖" },
            { label: "Working App", sublabel: "Deployed & production-ready", icon: "🚀" },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center gap-3">
              <div
                className="p-4 rounded-xl text-center min-w-[110px]"
                style={{
                  background: node.highlight ? "oklch(0.78 0.18 200 / 0.1)" : "oklch(0.13 0.013 260)",
                  border: `1px solid ${node.highlight ? "oklch(0.78 0.18 200 / 0.4)" : "oklch(0.18 0.015 260)"}`,
                  boxShadow: node.highlight ? "0 0 20px oklch(0.78 0.18 200 / 0.15)" : "none",
                }}
              >
                <div className="text-xl mb-2">{node.icon}</div>
                <div className="text-xs font-bold" style={{ fontFamily: "var(--font-display)", color: node.highlight ? "oklch(0.78 0.18 200)" : "oklch(0.70 0.01 260)" }}>
                  {node.label}
                </div>
                <div className="text-xs mt-1" style={{ color: "oklch(0.35 0.01 260)", fontFamily: "var(--font-mono)" }}>
                  {node.sublabel}
                </div>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight size={14} className="flex-shrink-0 hidden md:block" style={{ color: "oklch(0.28 0.01 260)" }} />
              )}
              {i < arr.length - 1 && (
                <ArrowDown size={14} className="flex-shrink-0 md:hidden" style={{ color: "oklch(0.28 0.01 260)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
