// Navbar — Obsidian Architect Design — theme-aware with light/dark & i18n language toggle
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/i18n/I18nContext";
import CodeLogo from "./CodeLogo";

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const isDark = theme === "dark";

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/architect", label: t.nav.architect },
    { href: "/vault", label: t.nav.vault },
    { href: "/design-studio", label: t.nav.designStudio },
    { href: "/vibe-coding", label: t.nav.vibeCoding },
    { href: "/workflow", label: t.nav.workflow },
    { href: "/studio", label: t.nav.studio },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border-subtle shadow-xs"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <CodeLogo size={32} />
          <span className="font-semibold text-sm tracking-wide font-display text-text-strong">
            VIBE<span className="text-signal">HUB</span>
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
                className={`relative px-4 py-2 text-sm font-display transition-colors duration-200 rounded-md ${
                  active ? "text-signal font-semibold" : "text-text-muted hover:text-text-strong"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-signal-soft"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop: Language Toggle + Theme Toggle + CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="h-9 px-3 rounded-md flex items-center gap-1.5 text-xs font-semibold font-mono transition-all duration-200 hover:scale-105 bg-surface-2 text-text-strong border border-border-subtle"
            title="Switch Language"
          >
            <Globe size={13} className="text-signal" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-105 bg-surface-2 text-signal border border-border-subtle"
            aria-label={isDark ? t.nav.switchThemeLight : t.nav.switchThemeDark}
            title={isDark ? t.nav.switchThemeLight : t.nav.switchThemeDark}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/architect"
            className="px-4 py-2 rounded-md text-sm font-semibold font-display transition-all duration-200 hover:scale-105 bg-signal text-primary-foreground shadow-xs"
          >
            {t.architect.title}
          </Link>
        </div>

        {/* Mobile: Language Toggle + Theme Toggle + Menu */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="h-8 px-2.5 rounded-md flex items-center gap-1 text-xs font-mono font-semibold bg-surface-2 text-text-strong border border-border-subtle"
          >
            <Globe size={12} className="text-signal" />
            <span>{language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all bg-surface-2 text-signal border border-border-subtle"
            aria-label={isDark ? t.nav.switchThemeLight : t.nav.switchThemeDark}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            className="p-2 rounded-md text-signal"
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
            className="md:hidden border-t border-border-subtle bg-background/98 backdrop-blur-lg"
          >
            <div className="container px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-display transition-colors ${
                    location === link.href
                      ? "text-signal font-semibold bg-signal-soft"
                      : "text-text-muted hover:text-text-strong"
                  }`}
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
