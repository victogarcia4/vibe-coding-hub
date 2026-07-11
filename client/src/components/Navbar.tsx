// Navbar — Obsidian Architect Design — theme-aware with light/dark toggle
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/architect", label: "Architect" },
  { href: "/vault", label: "Resource Vault" },
  { href: "/vibe-coding", label: "Vibe Coding" },
  { href: "/workflow", label: "Workflow Map" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Theme-aware color helpers
  const navBg = scrolled
    ? isDark ? "oklch(0.10 0.012 260 / 0.94)" : "oklch(0.97 0.004 260 / 0.96)"
    : "transparent";
  const navBorder = scrolled
    ? isDark ? "1px solid oklch(0.22 0.015 260)" : "1px solid oklch(0.88 0.006 260)"
    : "1px solid transparent";
  const logoTextColor = isDark ? "oklch(0.95 0.005 260)" : "oklch(0.15 0.015 260)";
  const navLinkColor = isDark ? "oklch(0.65 0.01 260)" : "oklch(0.45 0.01 260)";
  const activeLinkColor = isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)";
  const activeIndicatorBg = isDark ? "oklch(0.78 0.18 200 / 0.1)" : "oklch(0.45 0.18 200 / 0.1)";
  const ctaBg = isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)";
  const ctaColor = isDark ? "oklch(0.08 0.01 260)" : "oklch(0.98 0 0)";
  const mobileBg = isDark ? "oklch(0.10 0.012 260 / 0.98)" : "oklch(0.97 0.004 260 / 0.98)";
  const mobileBorderColor = isDark ? "oklch(0.22 0.015 260)" : "oklch(0.88 0.006 260)";
  const mobileLinkColor = isDark ? "oklch(0.75 0.01 260)" : "oklch(0.35 0.01 260)";
  const toggleBg = isDark ? "oklch(0.16 0.015 260)" : "oklch(0.90 0.006 260)";
  const toggleColor = isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: navBg,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: navBorder,
      }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden cyan-glow">
            <img src="https://d36hbw14aib5lz.cloudfront.net/310419663032046254/8vbHfNLTfUL3Mvpo7dHqU4/logo-icon_5195df88.png" alt="Vibe Coding Hub" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-sm tracking-wide" style={{ fontFamily: "var(--font-display)", color: logoTextColor }}>
            VIBE<span style={{ color: isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)" }}>HUB</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm transition-colors duration-200 rounded-md"
                style={{ fontFamily: "var(--font-display)", color: active ? activeLinkColor : navLinkColor, fontWeight: active ? 600 : 400 }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md"
                    style={{ background: activeIndicatorBg }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop: Theme Toggle + CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{ background: toggleBg, color: toggleColor }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/architect"
            className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{ fontFamily: "var(--font-display)", background: ctaBg, color: ctaColor }}
          >
            Start Building
          </Link>
        </div>

        {/* Mobile: Theme Toggle + Menu */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all"
            style={{ background: toggleBg, color: toggleColor }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            className="p-2 rounded-md"
            style={{ color: isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t"
            style={{ background: mobileBg, borderColor: mobileBorderColor }}
          >
            <div className="container px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-md text-sm transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: location === link.href ? activeLinkColor : mobileLinkColor,
                    background: location === link.href ? activeIndicatorBg : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

