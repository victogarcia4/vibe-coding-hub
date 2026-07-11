// Home Page — Obsidian Architect Design
// Hero + Feature Overview + Quick Stats + CTA
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Layers, Cpu, Zap, BookOpen, GitBranch } from "lucide-react";
import Navbar from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  {
    icon: <Layers size={22} />,
    title: "Project Architect",
    description: "Define your project scope, audience, and complexity through an intelligent onboarding wizard.",
    href: "/architect",
    color: "oklch(0.78 0.18 200)",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Resource Vault",
    description: "A structured library of 25+ curated tools across front-end, back-end, assets, and inspiration.",
    href: "/vault",
    color: "oklch(0.82 0.16 85)",
  },
  {
    icon: <Cpu size={22} />,
    title: "Vibe Coding Masterclass",
    description: "Compare Manus, Lovable, and Emergent with a detailed recommendation matrix for your project.",
    href: "/vibe-coding",
    color: "oklch(0.65 0.15 300)",
  },
  {
    icon: <GitBranch size={22} />,
    title: "Workflow Integration Map",
    description: "Visual flow showing where NotebookLM fits as your Technical Researcher in the dev cycle.",
    href: "/workflow",
    color: "oklch(0.70 0.18 160)",
  },
];

const stats = [
  { value: "25+", label: "Curated Resources" },
  { value: "3", label: "Vibe Coding Tools" },
  { value: "4", label: "Resource Categories" },
  { value: "∞", label: "Build Possibilities" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.01 260)" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/manus-storage/hero-bg_7e372a1c.png)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, oklch(0.08 0.01 260 / 0.92) 0%, oklch(0.08 0.01 260 / 0.7) 60%, oklch(0.08 0.01 260 / 0.85) 100%)" }}
        />

        <div className="container relative z-10 pt-24 pb-20">
          <div className="max-w-3xl">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="tag-mono mb-6 inline-block"
              style={{
                background: "oklch(0.78 0.18 200 / 0.12)",
                border: "1px solid oklch(0.78 0.18 200 / 0.3)",
                color: "oklch(0.78 0.18 200)",
              }}
            >
              Strategic Resource Hub v1.0
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
              style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)" }}
            >
              Build Smarter.
              <br />
              <span className="gradient-text">Ship Faster.</span>
              <br />
              Own Your Stack.
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
              style={{ color: "oklch(0.65 0.01 260)" }}
            >
              The architect's blueprint for modern web builders. Catalog your resources, compare vibe coding tools, and orchestrate your entire PWA development lifecycle with precision.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/architect"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "oklch(0.78 0.18 200)",
                  color: "oklch(0.08 0.01 260)",
                  boxShadow: "0 0 24px oklch(0.78 0.18 200 / 0.35)",
                }}
              >
                Start Your Architecture <ArrowRight size={16} />
              </Link>
              <Link
                href="/vault"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  fontFamily: "var(--font-display)",
                  border: "1px solid oklch(0.78 0.18 200 / 0.4)",
                  color: "oklch(0.78 0.18 200)",
                  background: "oklch(0.78 0.18 200 / 0.06)",
                }}
              >
                Explore the Vault
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, oklch(0.78 0.18 200 / 0.6), transparent)" }} />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y" style={{ borderColor: "oklch(0.22 0.015 260)", background: "oklch(0.10 0.012 260)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "oklch(0.78 0.18 200)" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest" style={{ color: "oklch(0.55 0.01 260)", fontFamily: "var(--font-mono)" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="cyan-divider mb-6 w-16" />
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)" }}
            >
              Four Pillars of the Hub
            </h2>
            <p className="text-base max-w-xl" style={{ color: "oklch(0.55 0.01 260)" }}>
              Every section is engineered to guide you through a specific phase of the modern development lifecycle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link href={feature.href} className="block glass-card rounded-xl p-8 h-full group">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                    style={{ background: `${feature.color}18`, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-display)", color: "oklch(0.92 0.005 260)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.55 0.01 260)" }}>
                    {feature.description}
                  </p>
                  <div
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors"
                    style={{ fontFamily: "var(--font-mono)", color: feature.color }}
                  >
                    Explore <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe Coding Highlight */}
      <section className="py-24 border-t" style={{ borderColor: "oklch(0.22 0.015 260)" }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="cyan-divider mb-6 w-16" />
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)" }}
              >
                The Vibe Coding
                <br />
                <span className="gradient-text">Recommendation Engine</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "oklch(0.55 0.01 260)" }}>
                Not all vibe coding tools are created equal. The right tool depends on your project's specific requirements — speed vs. control, frontend quality vs. full-stack automation. Our comparison matrix cuts through the noise.
              </p>
              <Link
                href="/vibe-coding"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "oklch(0.78 0.18 200 / 0.12)",
                  border: "1px solid oklch(0.78 0.18 200 / 0.35)",
                  color: "oklch(0.78 0.18 200)",
                }}
              >
                View Comparison Matrix <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { name: "Manus", role: "Generalist Agent", score: 95, color: "oklch(0.78 0.18 200)" },
                { name: "Lovable", role: "UI/UX Specialist", score: 82, color: "oklch(0.82 0.16 85)" },
                { name: "Emergent", role: "Full-Stack Agent", score: 78, color: "oklch(0.65 0.15 300)" },
              ].map((tool) => (
                <div key={tool.name} className="glass-card rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "oklch(0.92 0.005 260)" }}>
                        {tool.name}
                      </span>
                      <span className="tag-mono ml-3" style={{ background: `${tool.color}18`, color: tool.color }}>
                        {tool.role}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)", color: tool.color }}>
                      {tool.score}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "oklch(0.22 0.015 260)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: tool.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tool.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
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
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: "url(/manus-storage/workflow-map_91185978.png)", backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="relative z-10">
              <div className="tag-mono mb-4 inline-block" style={{ background: "oklch(0.82 0.16 85 / 0.12)", border: "1px solid oklch(0.82 0.16 85 / 0.3)", color: "oklch(0.82 0.16 85)" }}>
                NotebookLM Strategy
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)" }}
              >
                Your AI Technical Researcher
              </h2>
              <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: "oklch(0.55 0.01 260)" }}>
                Learn how to use NotebookLM to ingest official documentation, synthesize architectural patterns, and generate context-aware prompts for your vibe coding agent — before a single line of code is written.
              </p>
              <Link
                href="/workflow"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "oklch(0.82 0.16 85)",
                  color: "oklch(0.08 0.01 260)",
                }}
              >
                View Workflow Map <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: "oklch(0.22 0.015 260)" }}>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/logo-icon_5195df88.png" alt="Logo" className="w-6 h-6" />
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.55 0.01 260)" }}>
              VIBEHUB — Strategic Resource Hub
            </span>
          </div>
          <a
            href="https://48hours.live"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group transition-all hover:opacity-80"
          >
            <img
              src="/manus-storage/VHGMpicfoto_006cff98.png"
              alt="Dr. Victor Garcia Martinez"
              className="w-8 h-8 rounded-full object-cover object-top"
              style={{ border: "2px solid oklch(0.78 0.18 200 / 0.4)" }}
            />
            <div className="text-right">
              <div className="text-xs font-semibold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.65 0.01 260)" }}>
                Built by Dr. Victor Garcia Martinez
              </div>
              <div className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.78 0.18 200)", letterSpacing: "0.05em" }}>
                48hours.live ↗
              </div>
            </div>
          </a>
        </div>
      </footer>
    </div>
  );
}
