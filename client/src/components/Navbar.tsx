// Navbar — Obsidian Architect Design
// Fixed top navigation with glassmorphism, cyan accent, Space Grotesk typography
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.10 0.012 260 / 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(0.22 0.015 260)" : "1px solid transparent",
      }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden cyan-glow">
            <img
              src="/manus-storage/logo-icon_5195df88.png"
              alt="Vibe Coding Hub"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="font-semibold text-sm tracking-wide"
            style={{ fontFamily: "var(--font-display)", color: "oklch(0.95 0.005 260)" }}
          >
            VIBE<span style={{ color: "oklch(0.78 0.18 200)" }}>HUB</span>
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
                style={{
                  fontFamily: "var(--font-display)",
                  color: active ? "oklch(0.78 0.18 200)" : "oklch(0.65 0.01 260)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md"
                    style={{ background: "oklch(0.78 0.18 200 / 0.1)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/architect"
            className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              fontFamily: "var(--font-display)",
              background: "oklch(0.78 0.18 200)",
              color: "oklch(0.08 0.01 260)",
            }}
          >
            Start Building
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md"
          style={{ color: "oklch(0.78 0.18 200)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
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
            style={{
              background: "oklch(0.10 0.012 260 / 0.98)",
              borderColor: "oklch(0.22 0.015 260)",
            }}
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
                    color: location === link.href ? "oklch(0.78 0.18 200)" : "oklch(0.75 0.01 260)",
                    background: location === link.href ? "oklch(0.78 0.18 200 / 0.08)" : "transparent",
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

