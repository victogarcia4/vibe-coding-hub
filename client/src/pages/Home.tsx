// Home Page — Obsidian Architect Design — fully theme-aware
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Layers, Cpu, BookOpen, GitBranch } from "lucide-react";
import Navbar from "@/components/Navbar";
import CodeLogo from "@/components/CodeLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  { icon: <Layers size={22} />, title: "Project Architect", description: "Define your project scope, audience, and complexity through an intelligent onboarding wizard.", href: "/architect", color: "text-signal bg-signal-soft border-signal-border" },
  { icon: <BookOpen size={22} />, title: "Resource Vault", description: "A structured library of 25+ curated tools across front-end, back-end, assets, and inspiration.", href: "/vault", color: "text-gold bg-gold-soft border-gold-border" },
  { icon: <Cpu size={22} />, title: "Vibe Coding Masterclass", description: "Compare Manus, Lovable, and Emergent with a detailed recommendation matrix for your project.", href: "/vibe-coding", color: "text-signal bg-signal-soft border-signal-border" },
  { icon: <GitBranch size={22} />, title: "Workflow Integration Map", description: "Visual flow showing where NotebookLM fits as your Technical Researcher in the dev cycle.", href: "/workflow", color: "text-success bg-success-soft border-success-border" },
];

const stats = [
  { value: "25+", label: "Curated Resources" },
  { value: "3", label: "Vibe Coding Tools" },
  { value: "4", label: "Resource Categories" },
  { value: "∞", label: "Build Possibilities" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url(https://d36hbw14aib5lz.cloudfront.net/310419663032046254/8vbHfNLTfUL3Mvpo7dHqU4/hero-bg_7e372a1c.png)" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/85" />

        <div className="container relative z-10 pt-24 pb-20">
          <div className="max-w-3xl">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="tag-mono mb-6 inline-block"
            >
              Strategic Resource Hub v1.0
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6 font-display text-text-strong tracking-tight"
            >
              Build Smarter.
              <br />
              <span className="gradient-text">Ship Faster.</span>
              <br />
              Own Your Stack.
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed text-text-muted font-body"
            >
              The architect's blueprint for modern web builders. Catalog your resources, compare vibe coding tools, and orchestrate your entire PWA development lifecycle with precision.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-4">
              <Link href="/architect"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm font-display transition-all duration-200 hover:scale-105 active:scale-95 bg-signal text-primary-foreground shadow-md cyan-glow"
              >
                Start Your Architecture <ArrowRight size={16} />
              </Link>
              <Link href="/vault"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm font-display transition-all duration-200 hover:scale-105 active:scale-95 border border-signal-border text-signal bg-signal-soft"
              >
                Explore the Vault
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-px h-12 bg-gradient-to-b from-signal-border to-transparent" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-border-subtle bg-surface-2">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="text-3xl font-bold mb-1 font-display text-signal">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-text-muted font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container">
          <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
            <div className="h-px mb-6 w-16 bg-gradient-to-r from-signal to-transparent" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-text-strong">
              Four Pillars of the Hub
            </h2>
            <p className="text-base max-w-xl text-text-muted">
              Every section is engineered to guide you through a specific phase of the modern development lifecycle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link href={feature.href}
                  className="block glass-card rounded-xl p-8 h-full group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 border ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 font-display text-text-strong group-hover:text-signal transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-muted">{feature.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono text-signal">
                    Explore <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe Coding Highlight */}
      <section className="py-24 border-t border-border-subtle">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="h-px mb-6 w-16 bg-gradient-to-r from-signal to-transparent" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display text-text-strong">
                The Vibe Coding<br />
                <span className="gradient-text">
                  Recommendation Engine
                </span>
              </h2>
              <p className="text-base leading-relaxed mb-8 text-text-muted">
                Not all vibe coding tools are created equal. The right tool depends on your project's specific requirements — speed vs. control, frontend quality vs. full-stack automation. Our comparison matrix cuts through the noise.
              </p>
              <Link href="/vibe-coding"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold font-display transition-all duration-200 hover:scale-105 bg-signal-soft border border-signal-border text-signal"
              >
                View Comparison Matrix <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4">
              {[
                { name: "Manus", role: "Generalist Agent", score: 95, colorClass: "bg-signal text-primary-foreground", barClass: "bg-signal" },
                { name: "Lovable", role: "UI/UX Specialist", score: 82, colorClass: "bg-gold text-primary-foreground", barClass: "bg-gold" },
                { name: "Emergent", role: "Full-Stack Agent", score: 78, colorClass: "bg-success text-primary-foreground", barClass: "bg-success" },
              ].map((tool) => (
                <div key={tool.name} className="glass-card rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-semibold text-sm font-display text-text-strong">{tool.name}</span>
                      <span className={`tag-mono ml-3 ${tool.colorClass}`}>{tool.role}</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-signal">{tool.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-3">
                    <motion.div className={`h-full rounded-full ${tool.barClass}`}
                      initial={{ width: 0 }} whileInView={{ width: `${tool.score}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* NotebookLM Teaser */}
      <section className="py-24">
        <div className="container">
          <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="glass-card rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(https://d36hbw14aib5lz.cloudfront.net/310419663032046254/8vbHfNLTfUL3Mvpo7dHqU4/workflow-map_91185978.png)", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="relative z-10">
              <div className="tag-mono mb-4 inline-block bg-gold-soft border-gold-border text-gold">
                NotebookLM Strategy
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-text-strong">
                Your AI Technical Researcher
              </h2>
              <p className="text-base max-w-2xl mx-auto mb-8 text-text-muted">
                Learn how to use NotebookLM to ingest official documentation, synthesize architectural patterns, and generate context-aware prompts for your vibe coding agent — before a single line of code is written.
              </p>
              <Link href="/workflow"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm font-display transition-all duration-200 hover:scale-105 bg-gold text-primary-foreground shadow-xs"
              >
                View Workflow Map <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle bg-surface-2">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CodeLogo size={24} />
            <span className="text-sm font-semibold font-display text-text-muted">
              VIBEHUB — Strategic Resource Hub
            </span>
          </div>
          <a href="https://48hours.live" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 group transition-all hover:opacity-80"
          >
            <img src="/victor-garcia.png" alt="Dr. Victor Garcia Martinez"
              className="w-8 h-8 rounded-full object-cover object-top border-2 border-signal-border"
            />
            <div className="text-right">
              <div className="text-xs font-semibold font-display text-text-muted">
                Built by Dr. Victor Garcia M.
              </div>
              <div className="text-xs font-mono text-signal tracking-wide">
                48hours.live ↗
              </div>
            </div>
          </a>
        </div>
      </footer>
    </div>
  );
}

