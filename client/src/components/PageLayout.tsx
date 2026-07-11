// PageLayout — Architectural sidebar layout for inner pages
// Left rail with vertical blueprint axis + wide content area
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
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.01 260)" }}>
      <Navbar />
      <div className="flex pt-16 min-h-screen">
        {/* Left Rail */}
        <aside
          className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
          style={{
            background: "oklch(0.09 0.011 260)",
            borderRight: "1px solid oklch(0.18 0.015 260)",
          }}
        >
          {/* Blueprint axis line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, oklch(0.78 0.18 200 / 0.3), transparent 80%)" }}
          />
          <div className="pt-10 pb-8 px-6">
            <div className="tag-mono mb-6" style={{ color: "oklch(0.35 0.01 260)" }}>
              Navigation
            </div>
            <nav className="space-y-1">
              {sideNav.map((item) => {
                const active = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group"
                    style={{
                      background: active ? "oklch(0.78 0.18 200 / 0.1)" : "transparent",
                      borderLeft: active ? "2px solid oklch(0.78 0.18 200)" : "2px solid transparent",
                    }}
                  >
                    <span
                      className="text-xs font-bold w-6 flex-shrink-0"
                      style={{ fontFamily: "var(--font-mono)", color: active ? "oklch(0.78 0.18 200)" : "oklch(0.30 0.01 260)" }}
                    >
                      {item.phase}
                    </span>
                    <span
                      className="text-xs font-medium leading-tight"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: active ? "oklch(0.92 0.005 260)" : "oklch(0.50 0.01 260)",
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* Bottom metadata */}
          <div className="mt-auto px-6 pb-8">
            <div className="tag-mono mb-2" style={{ color: "oklch(0.28 0.01 260)" }}>System</div>
            <div className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.28 0.01 260)" }}>
              VIBEHUB v1.0
            </div>
            <div className="text-xs mt-1" style={{ fontFamily: "var(--font-mono)", color: "oklch(0.25 0.01 260)" }}>
              Vercel / Netlify ready
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Page header with blueprint accent */}
          <div
            className="px-8 lg:px-12 pt-12 pb-10 border-b"
            style={{ borderColor: "oklch(0.16 0.015 260)" }}
          >
            {phase && (
              <div className="tag-mono mb-3" style={{ color: "oklch(0.78 0.18 200)" }}>
                Phase {phase}
              </div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl lg:text-5xl font-bold mb-3"
              style={{ fontFamily: "var(--font-display)", color: "oklch(0.97 0.005 260)", letterSpacing: "-0.02em" }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-base max-w-2xl"
                style={{ color: "oklch(0.50 0.01 260)", fontFamily: "var(--font-body)" }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          <div className="px-8 lg:px-12 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

