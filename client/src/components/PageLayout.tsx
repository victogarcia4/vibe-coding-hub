// PageLayout — Architectural sidebar layout — theme-aware
import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const sideNav = [
  { href: "/architect", label: "Project Architect", phase: "01" },
  { href: "/vault", label: "Resource Vault", phase: "02" },
  { href: "/vibe-coding", label: "Vibe Coding", phase: "03" },
  { href: "/workflow", label: "Workflow Map", phase: "04" },
];

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  phase?: string;
}

export default function PageLayout({ children, title, subtitle, phase }: PageLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16 min-h-screen">
        {/* Left Rail */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-sidebar border-r border-sidebar-border relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-signal-border to-transparent" />
          <div className="pt-10 pb-8 px-6 relative z-10">
            <div className="tag-mono mb-6 text-text-subtle">Navigation</div>
            <nav className="space-y-1">
              {sideNav.map((item) => {
                const active = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                      active
                        ? "bg-signal-soft border-l-2 border-signal"
                        : "bg-transparent border-l-2 border-transparent hover:bg-surface-2"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold w-6 flex-shrink-0 font-mono ${
                        active ? "text-signal" : "text-text-subtle"
                      }`}
                    >
                      {item.phase}
                    </span>
                    <span
                      className={`text-xs font-medium leading-tight font-display ${
                        active ? "text-text-strong font-semibold" : "text-text-muted"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto px-6 pb-8 relative z-10">
            <div className="tag-mono mb-2 text-text-subtle">System</div>
            <div className="text-xs font-mono text-text-muted">VIBEHUB v1.0</div>
            <div className="text-xs mt-1 font-mono text-text-subtle">Vercel / Netlify ready</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="px-8 lg:px-12 pt-12 pb-10 border-b border-border-subtle">
            {phase && <div className="tag-mono mb-3 text-signal">Phase {phase}</div>}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl lg:text-5xl font-bold mb-3 font-display text-text-strong tracking-tight"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-base max-w-2xl text-text-muted font-body"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          <div className="px-8 lg:px-12 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

