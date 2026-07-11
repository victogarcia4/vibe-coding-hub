// Workflow Integration Map Page — Dynamic per-project workflow based on Architect answers
import { motion } from "framer-motion";
import { ArrowDown, BookOpen, Cpu, Database, Zap, FileText, GitBranch, Github, Globe, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useArchitect, ArchitectAnswers } from "@/contexts/ArchitectContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

interface WorkflowStep {
  phase: string;
  title: string;
  tool: string;
  description: string;
  icon: React.ReactNode;
  outputs: string[];
  highlight?: boolean;
  isGithub?: boolean;
  isDeploy?: boolean;
}

function buildWorkflow(a: ArchitectAnswers): WorkflowStep[] {
  const vibeTool = a.complexity === "complex" || a.complexity === "enterprise" ? "Manus"
    : a.scope === "static" ? "Lovable"
    : a.complexity === "simple" ? "Emergent"
    : "Lovable";

  const database = a.data === "realtime" ? "Convex or Firebase"
    : a.data === "relational" ? "Supabase or Neon"
    : a.data === "document" ? "MongoDB Atlas"
    : null;

  const styleSource = a.audience === "consumers" ? "Godly.website & Awwwards"
    : a.audience === "developers" ? "21st.dev & Refero"
    : a.audience === "business" ? "Refero & Dribbble (SaaS)"
    : "Refero & Awwwards";

  const scopeLabel = a.scope === "pwa" ? "PWA" : a.scope === "static" ? "Static Site" : a.scope === "saas" ? "SaaS" : "Web App";
  const complexityLabel = a.complexity === "simple" ? "MVP" : a.complexity === "moderate" ? "standard" : a.complexity === "enterprise" ? "enterprise-grade" : "complex";

  const steps: WorkflowStep[] = [
    {
      phase: "01", title: "Ideation & Style Research",
      tool: styleSource,
      description: `Browse ${styleSource} to collect visual references for your ${scopeLabel} targeting ${a.audience === "consumers" ? "general consumers" : a.audience === "developers" ? "technical users" : a.audience === "business" ? "business users" : "your internal team"}. Screenshot 5–10 examples that match the tone you want.`,
      icon: <FileText size={18} />,
      outputs: ["Mood board", "Color palette", "Typography direction"],
    },
    {
      phase: "02", title: "Documentation Synthesis",
      tool: "NotebookLM",
      description: `Upload the official docs for ${database ? `${database}${a.scope === "pwa" ? ", PWA manifest specs," : ""}` : "your chosen stack"} into NotebookLM. Ask source-grounded questions like: "${database === "Supabase or Neon" ? "What is the optimal RLS policy for a " + complexityLabel + " app?" : database === "Convex or Firebase" ? "How do I structure real-time listeners for a " + scopeLabel + "?" : database === "MongoDB Atlas" ? "What is the best schema design for a flexible " + scopeLabel + "?" : "What are the best practices for a " + complexityLabel + " " + scopeLabel + "?"}" Extract the answer and use it verbatim as your agent prompt.`,
      icon: <BookOpen size={18} />,
      outputs: ["Source-grounded prompts", database ? `${database} schema` : "Architecture notes", "Context-aware agent instructions"],
      highlight: true,
    },
    {
      phase: "03", title: "Architecture & Database Setup",
      tool: database ? database : "No database needed",
      description: database
        ? `Set up ${database} before writing any UI code. ${a.data === "realtime" ? "Configure your real-time listeners and data subscriptions first — the UI will react to them automatically." : a.data === "relational" ? "Define your tables, relationships, and row-level security policies. Your agent can generate the SQL schema from your NotebookLM output." : "Design your document collections and indexes. Flexible schemas mean you can iterate quickly without migrations."}`
        : `Your ${scopeLabel} doesn't need a database. Focus on content structure, static generation, and performance. ${a.scope === "pwa" ? "Plan your service worker caching strategy for offline support." : ""}`,
      icon: <Database size={18} />,
      outputs: database ? [`${database} configured`, "Schema defined", "Auth rules set"] : ["Content structure", "Performance plan", a.scope === "pwa" ? "Offline strategy" : "SEO plan"],
    },
    {
      phase: "04", title: `Vibe Coding with ${vibeTool}`,
      tool: vibeTool,
      description: `Paste your NotebookLM-synthesized context directly into ${vibeTool} as the opening prompt. ${vibeTool === "Manus" ? "Manus will autonomously research, plan, and build the entire " + complexityLabel + " " + scopeLabel + " — including backend integration, auth, and deployment." : vibeTool === "Lovable" ? "Lovable will generate a beautiful React frontend. Use its visual editor to iterate on the UI, then export the full codebase to GitHub." : "Emergent will generate your complete " + scopeLabel + " — frontend, backend, database, and a live URL — from a single prompt. No setup required."}`,
      icon: <Cpu size={18} />,
      outputs: ["Working codebase", "Live preview", vibeTool === "Emergent" ? "Auto-deployed URL" : "Exportable code"],
    },
    {
      phase: "05", title: "Commit to GitHub",
      tool: "GitHub",
      description: vibeTool === "Emergent"
        ? "Emergent manages its own hosting. If you want to move to Vercel/Netlify, you'll need to export your code first (available on paid plans). For Manus and Lovable, click 'Export to GitHub' — it takes under a minute and gives you full version history."
        : `In ${vibeTool}, click 'Export to GitHub' or 'Sync to GitHub'. This creates a repository with your full codebase, gives you version history, and unlocks automatic deployment. Every future change you make will be committed automatically.`,
      icon: <Github size={18} />,
      outputs: ["GitHub repository", "Version history", "Team collaboration ready"],
      isGithub: true,
    },
    {
      phase: "06", title: "Deploy to Vercel or Netlify",
      tool: "Vercel / Netlify",
      description: `Go to vercel.com or netlify.com, click 'New Project', and connect your GitHub repository. Both platforms detect your framework automatically. Your ${scopeLabel} will be live on a public URL in under 2 minutes. Every time you push new code to GitHub, your live site updates automatically. ${a.scope === "pwa" ? "Both platforms support PWA features including HTTPS (required for service workers) and custom domains." : "Both offer generous free tiers — no credit card needed to start."}`,
      icon: <Globe size={18} />,
      outputs: ["Live public URL", "Auto-deploy on every push", "Free SSL certificate", "Custom domain support"],
      isDeploy: true,
    },
    {
      phase: "07", title: "Iterate & Refine",
      tool: vibeTool === "Lovable" ? "Lovable Visual Editor" : vibeTool,
      description: `${vibeTool === "Lovable" ? "Use Lovable's visual editor to tweak layouts, colors, and components without re-prompting. For logic changes, describe them in chat." : vibeTool === "Manus" ? "Describe changes to Manus — it will update the codebase, commit to GitHub, and your live site on Vercel/Netlify updates within seconds." : "Re-prompt Emergent with change requests. For deeper customization, export the code to GitHub and continue with Lovable or Manus."} Use NotebookLM to diagnose any errors: paste the error log and ask 'Based on the ${database || "stack"} docs, what is causing this?'`,
      icon: <GitBranch size={18} />,
      outputs: ["Refined UI", "Bug fixes", "Auto-deployed updates"],
    },
  ];

  return steps;
}

const defaultWorkflow: WorkflowStep[] = [
  { phase: "01", title: "Ideation & Style", tool: "Dribbble / Refero / Godly", description: "Browse curated design galleries to define the visual language of your project. Save references that match your target audience and brand personality.", icon: <FileText size={18} />, outputs: ["Mood board", "Color palette", "Typography choices"] },
  { phase: "02", title: "Documentation Synthesis", tool: "NotebookLM", description: "Upload official documentation for your chosen stack into NotebookLM. Generate source-grounded Q&A to extract precise architectural patterns before writing any code.", icon: <BookOpen size={18} />, outputs: ["Schema designs", "API patterns", "Context-aware prompts"], highlight: true },
  { phase: "03", title: "Architecture Selection", tool: "Resource Vault", description: "Select your database based on query needs. Relational → Supabase/Neon. Real-time → Convex/Firebase. Flexible → MongoDB Atlas.", icon: <Database size={18} />, outputs: ["Database schema", "API architecture", "Auth strategy"] },
  { phase: "04", title: "Vibe Coding Execution", tool: "Manus / Lovable / Emergent", description: "Feed the synthesized context from NotebookLM directly into your chosen vibe coding agent.", icon: <Cpu size={18} />, outputs: ["Working codebase", "Deployed preview"] },
  { phase: "05", title: "Commit to GitHub", tool: "GitHub", description: "Export your project code to a GitHub repository. In Manus and Lovable, click 'Export to GitHub' — it takes under a minute. This step unlocks deployment to Vercel and Netlify.", icon: <Github size={18} />, outputs: ["GitHub repository", "Version history", "Collaboration ready"], isGithub: true },
  { phase: "06", title: "Deploy to Vercel or Netlify", tool: "Vercel / Netlify", description: "Connect your GitHub repository to Vercel or Netlify with one click. Every time you push new code to GitHub, your live site updates automatically. Both platforms offer a generous free tier.", icon: <Globe size={18} />, outputs: ["Live public URL", "Auto-deploy on push", "Free SSL certificate", "Custom domain support"], isDeploy: true },
  { phase: "07", title: "Iteration & Refinement", tool: "Lovable Visual Editor / Manus", description: "Iterate on the UI or refine logic. Each change gets committed to GitHub automatically, and your live site updates within seconds.", icon: <GitBranch size={18} />, outputs: ["Refined UI", "Bug fixes", "Auto-deployed updates"] },
];

export default function WorkflowMap() {
  const { answers } = useArchitect();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const workflowSteps = answers ? buildWorkflow(answers) : defaultWorkflow;
  const isPersonalized = !!answers;

  const cyan = isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)";
  const gold = isDark ? "oklch(0.82 0.16 85)" : "oklch(0.60 0.14 85)";
  const green = isDark ? "oklch(0.70 0.18 160)" : "oklch(0.52 0.18 160)";
  const cardBg = isDark ? "oklch(0.11 0.013 260)" : "oklch(1 0 0)";
  const cardBorder = isDark ? "oklch(0.18 0.015 260)" : "oklch(0.88 0.006 260)";
  const textMuted = isDark ? "oklch(0.45 0.01 260)" : "oklch(0.50 0.01 260)";
  const textBody = isDark ? "oklch(0.48 0.01 260)" : "oklch(0.40 0.01 260)";

  return (
    <PageLayout
      title="Workflow Integration Map"
      subtitle={isPersonalized ? "Your personalized step-by-step workflow — generated from your Project Architect answers." : "Complete the Project Architect to get a personalized workflow for your specific project."}
      phase="04"
    >
      {/* Personalization banner */}
      {!isPersonalized && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl flex items-center gap-4"
          style={{ background: `${gold}10`, border: `1px solid ${gold}35` }}
        >
          <AlertCircle size={18} style={{ color: gold, flexShrink: 0 }} />
          <div>
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.85 0.005 260)" : "oklch(0.20 0.015 260)" }}>
              Showing the default workflow
            </p>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>
              Complete the <Link href="/architect" className="underline" style={{ color: gold }}>Project Architect</Link> to get a workflow tailored to your specific project type, audience, and data requirements.
            </p>
          </div>
        </motion.div>
      )}

      {isPersonalized && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl flex items-center justify-between gap-4"
          style={{ background: `${cyan}08`, border: `1px solid ${cyan}30` }}
        >
          <div className="flex items-center gap-3">
            <Zap size={16} style={{ color: cyan }} />
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.85 0.005 260)" : "oklch(0.20 0.015 260)" }}>
              Personalized for: {answers.scope.toUpperCase()} · {answers.audience} · {answers.complexity} · {answers.data} data
            </p>
          </div>
          <Link href="/architect" className="tag-mono flex-shrink-0 transition-all hover:opacity-80" style={{ background: `${cyan}12`, color: cyan, border: `1px solid ${cyan}30` }}>
            Reconfigure
          </Link>
        </motion.div>
      )}

      {/* Workflow Steps */}
      <div className="max-w-2xl mb-20">
        {workflowSteps.map((step, i) => (
          <motion.div key={step.phase} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div
              className="rounded-2xl p-7 relative"
              style={{
                background: cardBg,
                border: `1px solid ${step.isGithub ? gold.replace(")", " / 0.4)") : step.isDeploy ? green.replace(")", " / 0.4)") : step.highlight ? cyan.replace(")", " / 0.4)") : cardBorder}`,
                boxShadow: step.isGithub ? `0 0 24px ${gold.replace(")", " / 0.08)")}` : step.isDeploy ? `0 0 24px ${green.replace(")", " / 0.08)")}` : step.highlight ? `0 0 24px ${cyan.replace(")", " / 0.1)")}` : "none",
              }}
            >
              {step.highlight && <div className="absolute top-4 right-4 tag-mono" style={{ background: `${cyan}12`, color: cyan, border: `1px solid ${cyan}28` }}>Core Step</div>}
              {step.isGithub && <div className="absolute top-4 right-4 tag-mono" style={{ background: `${gold}12`, color: gold, border: `1px solid ${gold}30` }}>Required</div>}
              {step.isDeploy && <div className="absolute top-4 right-4 tag-mono" style={{ background: `${green}12`, color: green, border: `1px solid ${green}30` }}>Go Live</div>}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cyan}12`, color: cyan }}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold" style={{ fontFamily: "var(--font-mono)", color: cyan }}>PHASE {step.phase}</span>
                    <span className="tag-mono" style={{ background: isDark ? "oklch(0.14 0.012 260)" : "oklch(0.93 0.005 260)", color: textMuted }}>{step.tool}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.92 0.005 260)" : "oklch(0.12 0.015 260)", letterSpacing: "-0.01em" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: textBody }}>{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.outputs.map((output) => (
                      <span key={output} className="tag-mono" style={{ background: `${cyan}08`, color: cyan, border: `1px solid ${cyan}20` }}>→ {output}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {i < workflowSteps.length - 1 && (
              <div className="flex justify-start ml-12 my-2">
                <ArrowDown size={14} style={{ color: isDark ? "oklch(0.25 0.01 260)" : "oklch(0.70 0.01 260)" }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* NotebookLM Strategy */}
      <div className="mb-16">
        <div className="h-px mb-10" style={{ background: `linear-gradient(90deg, ${cyan.replace(")", " / 0.5)")}, transparent)` }} />
        <div className="flex items-center gap-3 mb-3">
          <Zap size={18} style={{ color: cyan }} />
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.97 0.005 260)" : "oklch(0.12 0.015 260)", letterSpacing: "-0.02em" }}>
            NotebookLM Strategy Guide
          </h2>
        </div>
        <p className="text-sm mb-8 max-w-xl" style={{ color: textBody }}>
          NotebookLM acts as your "Technical Researcher" — transforming raw documentation into precise, actionable prompts for your vibe coding agent.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: "Upload Strategy", description: "Group sources by layer: Front-end docs, Back-end docs, and Asset documentation in separate notebooks for focused Q&A.", icon: "⬡" },
            { title: "Query Patterns", description: "Ask: \"Based on the Supabase docs, what is the optimal RLS policy for a multi-tenant app?\" — not generic questions.", icon: "◈" },
            { title: "Error Diagnosis", description: "Paste error logs into NotebookLM with the relevant docs. It cross-references the official source to provide precise fixes.", icon: "◎" },
            { title: "Prompt Synthesis", description: "Extract the NotebookLM answer and use it verbatim as context in your Manus or Lovable prompt for source-grounded execution.", icon: "✦" },
          ].map((tip, i) => (
            <motion.div key={tip.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg" style={{ color: cyan }}>{tip.icon}</span>
                <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: isDark ? "oklch(0.85 0.005 260)" : "oklch(0.20 0.015 260)" }}>{tip.title}</h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

