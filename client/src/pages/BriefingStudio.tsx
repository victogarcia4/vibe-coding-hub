// BriefingStudio — 6-step non-linear briefing wizard
// Quick mode (8 questions) or Full mode for deep documents
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, FileText, Users, Layers, Database, Settings, Palette, Zap, Save } from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useI18n } from "@/i18n/I18nContext";
import {
  type Briefing, createEmptyBriefing, getSectionCompleteness, getOverallCompleteness,
  type ProjectType, ProjectTypeEnum, ObjectiveEnum, DeviceEnum, TechLevelEnum,
  BudgetEnum, YourTechLevelEnum, PreferredToolEnum, DeployPlatformEnum, DensityEnum,
} from "@/engine/schema";
import { capabilities } from "@/engine/capabilities";
import { generateAllDocuments, type GeneratedDocuments } from "@/engine/export/exporter";

const sectionIcons = [
  <Layers size={16} />, <Users size={16} />, <Zap size={16} />,
  <Database size={16} />, <Settings size={16} />, <Palette size={16} />,
];

const STORAGE_KEY = "vibe-hub-briefing-draft";

function loadDraft(): Briefing {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : createEmptyBriefing();
  } catch {
    return createEmptyBriefing();
  }
}

function saveDraft(b: Briefing) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
}

export default function BriefingStudio() {
  const [briefing, setBriefing] = useState<Briefing>(loadDraft);
  const [activeSection, setActiveSection] = useState(0);
  const { t, language } = useI18n();
  const [, navigate] = useLocation();

  const isEs = language === "es";

  const sections = [
    { key: "identity", label: isEs ? "Identidad" : "Identity", icon: sectionIcons[0] },
    { key: "users", label: isEs ? "Usuarios" : "Users", icon: sectionIcons[1] },
    { key: "capabilities", label: isEs ? "Capacidades" : "Capabilities", icon: sectionIcons[2] },
    { key: "data", label: isEs ? "Datos" : "Data", icon: sectionIcons[3] },
    { key: "constraints", label: isEs ? "Restricciones" : "Constraints", icon: sectionIcons[4] },
    { key: "branding", label: isEs ? "Marca / Estética" : "Branding / Aesthetic", icon: sectionIcons[5] },
  ];

  const completeness = getSectionCompleteness(briefing);
  const overall = getOverallCompleteness(briefing);

  const update = useCallback((patch: Partial<Briefing>) => {
    setBriefing((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });
  }, []);

  const handleGenerate = async () => {
    const docs = generateAllDocuments(briefing, language);
    sessionStorage.setItem("vibe-hub-docs", JSON.stringify(docs));
    sessionStorage.setItem("vibe-hub-docs-briefing", JSON.stringify(briefing));

    // Save or update project in IndexedDB
    try {
      const { saveProject, createSnapshot } = await import("@/storage/db");
      let projectId = sessionStorage.getItem("vibe-hub-active-project-id");

      if (!projectId) {
        projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        sessionStorage.setItem("vibe-hub-active-project-id", projectId);
      }

      const projectName = briefing.identity.name.trim() || (isEs ? "Sin Título" : "Untitled Project");

      await saveProject({
        id: projectId,
        name: projectName,
        briefing,
        documents: docs,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archived: false,
        version: 1,
      });

      await createSnapshot(projectId, briefing, docs, "Document generation");
    } catch (err) {
      console.error("Failed to save project to IndexedDB:", err);
    }

    navigate("/documents");
  };

  // ── Project type options ──
  const projectTypeOptions: { id: ProjectType; label: string; emoji: string }[] = [
    { id: "landing", label: "Landing Page", emoji: "🚀" },
    { id: "portfolio", label: "Portfolio", emoji: "🎨" },
    { id: "store", label: "E-Commerce", emoji: "🛍️" },
    { id: "saas", label: "SaaS / Web App", emoji: "⚙️" },
    { id: "dashboard", label: "Dashboard", emoji: "📊" },
    { id: "crm", label: "CRM", emoji: "🤝" },
    { id: "funnel", label: isEs ? "Embudo de Ventas" : "Sales Funnel", emoji: "🔁" },
    { id: "blog", label: "Blog", emoji: "✍️" },
    { id: "pwa", label: "PWA", emoji: "📲" },
    { id: "booking", label: isEs ? "Reservas" : "Booking", emoji: "📅" },
    { id: "marketplace", label: "Marketplace", emoji: "🏪" },
    { id: "internal", label: isEs ? "Herramienta Interna" : "Internal Tool", emoji: "🏢" },
  ];

  const capCategories = [
    { id: "core", label: isEs ? "Núcleo" : "Core" },
    { id: "data", label: isEs ? "Datos" : "Data" },
    { id: "ux", label: "UX" },
    { id: "integration", label: isEs ? "Integración" : "Integration" },
    { id: "ops", label: isEs ? "Operaciones" : "Ops" },
  ];

  return (
    <PageLayout
      title={isEs ? "Briefing Studio" : "Briefing Studio"}
      subtitle={isEs
        ? "Responde las preguntas de cada sección para generar tu paquete completo de documentos: PRD, TRD, Plan de Acción, Brief UX/UI y Paquete de Prompts."
        : "Answer each section's questions to generate your complete document package: PRD, TRD, Action Plan, UX/UI Brief, and Prompt Pack."
      }
      phase="05"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="tag-mono text-signal">{Math.round(overall * 100)}% {isEs ? "completado" : "complete"}</span>
          <button
            onClick={handleGenerate}
            disabled={overall < 0.2}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold font-display transition-all bg-signal text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText size={16} />
            {isEs ? "Generar Documentos 🚀" : "Generate Documents 🚀"}
          </button>
        </div>
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-signal"
            initial={{ width: 0 }}
            animate={{ width: `${overall * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1.5 mb-8 overflow-x-auto pb-2">
        {sections.map((sec, i) => {
          const comp = completeness[sec.key] || 0;
          const active = i === activeSection;
          return (
            <button
              key={sec.key}
              onClick={() => setActiveSection(i)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-display transition-all border whitespace-nowrap ${
                active
                  ? "bg-signal-soft text-signal border-signal"
                  : comp >= 1
                    ? "bg-surface-2 text-text-strong border-border-subtle"
                    : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
              }`}
            >
              {comp >= 1 ? <CheckCircle2 size={14} className="text-signal" /> : sec.icon}
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          {/* Section 0: Identity */}
          {activeSection === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-text-strong">
                {isEs ? "1. Identidad del Proyecto" : "1. Project Identity"}
              </h2>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text-strong">
                  {isEs ? "Nombre del proyecto" : "Project name"}
                </label>
                <input
                  type="text"
                  value={briefing.identity.name}
                  onChange={(e) => update({ identity: { ...briefing.identity, name: e.target.value } })}
                  placeholder={isEs ? "Mi Aplicación" : "My Application"}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-2 border border-border-subtle text-sm text-text-strong placeholder:text-text-subtle outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text-strong">
                  {isEs ? "Propuesta en una frase" : "One-line tagline"}
                </label>
                <input
                  type="text"
                  value={briefing.identity.tagline}
                  onChange={(e) => update({ identity: { ...briefing.identity, tagline: e.target.value } })}
                  placeholder={isEs ? "La herramienta que resuelve..." : "The tool that solves..."}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-2 border border-border-subtle text-sm text-text-strong placeholder:text-text-subtle outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-text-strong">
                  {isEs ? "Tipo de proyecto" : "Project type"}
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {projectTypeOptions.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => update({ identity: { ...briefing.identity, projectType: pt.id } })}
                      className={`text-left p-3 rounded-xl text-sm transition-all border ${
                        briefing.identity.projectType === pt.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong hover:border-border-default"
                      }`}
                    >
                      <span className="mr-2">{pt.emoji}</span>{pt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-text-strong">
                  {isEs ? "Objetivo" : "Objective"}
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    { id: "personal" as const, label: isEs ? "Proyecto personal" : "Personal project", emoji: "🎯" },
                    { id: "directSale" as const, label: isEs ? "Venta directa" : "Direct sale", emoji: "💰" },
                    { id: "subscription" as const, label: isEs ? "Suscripción" : "Subscription", emoji: "🔄" },
                    { id: "clientProject" as const, label: isEs ? "Proyecto para cliente" : "Client project", emoji: "🤝" },
                  ].map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => update({ identity: { ...briefing.identity, objective: obj.id } })}
                      className={`text-left p-3 rounded-xl text-sm transition-all border ${
                        briefing.identity.objective === obj.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                      }`}
                    >
                      <span className="mr-2">{obj.emoji}</span>{obj.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Users */}
          {activeSection === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-text-strong">
                {isEs ? "2. Usuarios Objetivo" : "2. Target Users"}
              </h2>

              {briefing.users.personas.map((persona, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-2 border border-border-subtle space-y-3">
                  <div className="text-sm font-semibold text-text-strong">
                    {isEs ? `Persona ${idx + 1}` : `Persona ${idx + 1}`}
                  </div>
                  <input
                    type="text"
                    value={persona.role}
                    onChange={(e) => {
                      const personas = [...briefing.users.personas];
                      personas[idx] = { ...persona, role: e.target.value };
                      update({ users: { ...briefing.users, personas } });
                    }}
                    placeholder={isEs ? "Rol (ej: Emprendedor, Estudiante)" : "Role (e.g. Entrepreneur, Student)"}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border-subtle text-sm text-text-strong placeholder:text-text-subtle outline-none focus:border-signal"
                  />
                  <input
                    type="text"
                    value={persona.mainPain}
                    onChange={(e) => {
                      const personas = [...briefing.users.personas];
                      personas[idx] = { ...persona, mainPain: e.target.value };
                      update({ users: { ...briefing.users, personas } });
                    }}
                    placeholder={isEs ? "Dolor principal" : "Main pain point"}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border-subtle text-sm text-text-strong placeholder:text-text-subtle outline-none focus:border-signal"
                  />
                  <select
                    value={persona.techLevel}
                    onChange={(e) => {
                      const personas = [...briefing.users.personas];
                      personas[idx] = { ...persona, techLevel: e.target.value as any };
                      update({ users: { ...briefing.users, personas } });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border-subtle text-sm text-text-strong outline-none focus:border-signal"
                  >
                    <option value="none">{isEs ? "Sin experiencia técnica" : "No technical experience"}</option>
                    <option value="basic">{isEs ? "Básico" : "Basic"}</option>
                    <option value="intermediate">{isEs ? "Intermedio" : "Intermediate"}</option>
                    <option value="advanced">{isEs ? "Avanzado" : "Advanced"}</option>
                  </select>
                </div>
              ))}

              {briefing.users.personas.length < 3 && (
                <button
                  onClick={() => {
                    const personas = [...briefing.users.personas, { role: "", mainPain: "", context: "", techLevel: "basic" as const }];
                    update({ users: { ...briefing.users, personas } });
                  }}
                  className="text-sm text-signal hover:underline"
                >
                  + {isEs ? "Añadir persona" : "Add persona"}
                </button>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "Dispositivo primario" : "Primary device"}
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "mobile" as const, label: "📱 Mobile" },
                    { id: "desktop" as const, label: "🖥️ Desktop" },
                    { id: "both" as const, label: isEs ? "📱🖥️ Ambos" : "📱🖥️ Both" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => update({ users: { ...briefing.users, primaryDevice: d.id } })}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                        briefing.users.primaryDevice === d.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Capabilities */}
          {activeSection === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-text-strong">
                {isEs ? "3. Capacidades" : "3. Capabilities"}
              </h2>
              <p className="text-sm text-text-muted">
                {isEs
                  ? "Selecciona las funcionalidades que necesitas. Cada capacidad inyecta requisitos, historias de usuario y modelo de datos en tus documentos."
                  : "Select the features you need. Each capability injects requirements, user stories, and data models into your documents."
                }
              </p>

              {capCategories.map((cat) => {
                const catCaps = capabilities.filter((c) => c.category === cat.id);
                if (catCaps.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <div className="tag-mono mb-2 text-text-subtle">{cat.label}</div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {catCaps.map((cap) => {
                        const selected = briefing.capabilities.selected.includes(cap.id);
                        return (
                          <button
                            key={cap.id}
                            onClick={() => {
                              const current = briefing.capabilities.selected;
                              const next = selected
                                ? current.filter((id) => id !== cap.id)
                                : [...current, cap.id];
                              update({ capabilities: { selected: next } });
                            }}
                            className={`text-left p-3 rounded-xl text-sm transition-all border ${
                              selected
                                ? "bg-signal-soft border-signal text-text-strong"
                                : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong hover:border-border-default"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{cap.emoji}</span>
                              <span className="font-semibold">{isEs ? cap.labelEs : cap.labelEn}</span>
                              <span className="ml-auto tag-mono text-text-subtle">{cap.effort}</span>
                            </div>
                            <div className="text-xs mt-1 text-text-muted">
                              {isEs ? cap.descEs : cap.descEn}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="text-sm text-text-muted">
                {briefing.capabilities.selected.length} {isEs ? "seleccionadas" : "selected"}
              </div>
            </div>
          )}

          {/* Section 3: Data */}
          {activeSection === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-text-strong">
                {isEs ? "4. Requisitos de Datos" : "4. Data Requirements"}
              </h2>
              <p className="text-sm text-text-muted">
                {isEs
                  ? "Define las entidades principales de tu aplicación. Los campos clave y relaciones se usan para generar el modelo de datos del TRD."
                  : "Define the main entities of your application. Key fields and relationships are used to generate the TRD data model."
                }
              </p>

              {briefing.data.entities.map((entity, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-2 border border-border-subtle space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={entity.name}
                      onChange={(e) => {
                        const entities = [...briefing.data.entities];
                        entities[idx] = { ...entity, name: e.target.value };
                        update({ data: { ...briefing.data, entities } });
                      }}
                      placeholder={isEs ? "Nombre de entidad (ej: Producto)" : "Entity name (e.g. Product)"}
                      className="flex-1 px-3 py-2 rounded-lg bg-background border border-border-subtle text-sm text-text-strong placeholder:text-text-subtle outline-none focus:border-signal"
                    />
                    <button
                      onClick={() => {
                        const entities = briefing.data.entities.filter((_, i) => i !== idx);
                        update({ data: { ...briefing.data, entities } });
                      }}
                      className="text-xs text-text-muted hover:text-error"
                    >
                      ✕
                    </button>
                  </div>
                  <select
                    value={entity.sensitivity}
                    onChange={(e) => {
                      const entities = [...briefing.data.entities];
                      entities[idx] = { ...entity, sensitivity: e.target.value as any };
                      update({ data: { ...briefing.data, entities } });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border-subtle text-sm text-text-strong outline-none focus:border-signal"
                  >
                    <option value="none">{isEs ? "Sin datos sensibles" : "No sensitive data"}</option>
                    <option value="pii">{isEs ? "Datos personales (PII)" : "Personal Data (PII)"}</option>
                    <option value="health">{isEs ? "Datos de salud" : "Health Data"}</option>
                    <option value="payments">{isEs ? "Datos de pago" : "Payment Data"}</option>
                  </select>
                </div>
              ))}

              <button
                onClick={() => {
                  const entities = [...briefing.data.entities, { name: "", keyFields: [], sensitivity: "none" as const }];
                  update({ data: { ...briefing.data, entities } });
                }}
                className="text-sm text-signal hover:underline"
              >
                + {isEs ? "Añadir entidad" : "Add entity"}
              </button>
            </div>
          )}

          {/* Section 4: Constraints */}
          {activeSection === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-text-strong">
                {isEs ? "5. Restricciones" : "5. Constraints"}
              </h2>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "Presupuesto mensual" : "Monthly budget"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "free" as const, label: isEs ? "Gratis" : "Free", emoji: "🆓" },
                    { id: "low" as const, label: "< $20/mo", emoji: "💵" },
                    { id: "medium" as const, label: "$20-100/mo", emoji: "💰" },
                    { id: "high" as const, label: "> $100/mo", emoji: "🏦" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => update({ constraints: { ...briefing.constraints, monthlyBudget: b.id } })}
                      className={`p-3 rounded-xl text-sm border transition-all ${
                        briefing.constraints.monthlyBudget === b.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                      }`}
                    >
                      {b.emoji} {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "Tu nivel técnico" : "Your technical level"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "none" as const, label: isEs ? "Ninguno" : "None" },
                    { id: "basic" as const, label: isEs ? "Básico" : "Basic" },
                    { id: "intermediate" as const, label: isEs ? "Intermedio" : "Intermediate" },
                    { id: "advanced" as const, label: isEs ? "Avanzado" : "Advanced" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => update({ constraints: { ...briefing.constraints, yourTechLevel: l.id } })}
                      className={`p-3 rounded-xl text-sm border transition-all ${
                        briefing.constraints.yourTechLevel === l.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "Herramienta de vibe coding preferida" : "Preferred vibe coding tool"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "recommend" as const, label: isEs ? "Recomiéndame" : "Recommend" },
                    { id: "manus" as const, label: "Manus" },
                    { id: "lovable" as const, label: "Lovable" },
                    { id: "emergent" as const, label: "Emergent" },
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => update({ constraints: { ...briefing.constraints, preferredTool: tool.id } })}
                      className={`p-3 rounded-xl text-sm border transition-all ${
                        briefing.constraints.preferredTool === tool.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                      }`}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "Plataforma de despliegue" : "Deploy platform"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "recommend" as const, label: isEs ? "Recomiéndame" : "Recommend" },
                    { id: "vercel" as const, label: "Vercel" },
                    { id: "netlify" as const, label: "Netlify" },
                    { id: "cloudflare" as const, label: "Cloudflare" },
                  ].map((dp) => (
                    <button
                      key={dp.id}
                      onClick={() => update({ constraints: { ...briefing.constraints, deployPlatform: dp.id } })}
                      className={`p-3 rounded-xl text-sm border transition-all ${
                        briefing.constraints.deployPlatform === dp.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                      }`}
                    >
                      {dp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Branding */}
          {activeSection === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-text-strong">
                {isEs ? "6. Marca y Estética" : "6. Branding & Aesthetic"}
              </h2>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "3 adjetivos de tono visual" : "3 visual tone adjectives"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    isEs ? "Minimalista" : "Minimalist",
                    isEs ? "Vibrante" : "Vibrant",
                    isEs ? "Profesional" : "Professional",
                    isEs ? "Lúdico" : "Playful",
                    isEs ? "Oscuro" : "Dark",
                    isEs ? "Premium" : "Premium",
                    isEs ? "Orgánico" : "Organic",
                    isEs ? "Brutalista" : "Brutalist",
                    isEs ? "Corporativo" : "Corporate",
                  ].map((adj) => {
                    const selected = briefing.branding.toneAdjectives.includes(adj);
                    return (
                      <button
                        key={adj}
                        onClick={() => {
                          const current = briefing.branding.toneAdjectives;
                          const next = selected
                            ? current.filter((a) => a !== adj)
                            : current.length < 3
                              ? [...current, adj]
                              : current;
                          update({ branding: { ...briefing.branding, toneAdjectives: next } });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          selected
                            ? "bg-signal-soft border-signal text-signal"
                            : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                        }`}
                      >
                        {adj}
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs mt-1 text-text-subtle">
                  {briefing.branding.toneAdjectives.length}/3 {isEs ? "seleccionados" : "selected"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "Color base" : "Base color"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={briefing.branding.baseColor}
                    onChange={(e) => update({ branding: { ...briefing.branding, baseColor: e.target.value } })}
                    className="w-10 h-10 rounded-lg border border-border-subtle cursor-pointer"
                  />
                  <input
                    type="text"
                    value={briefing.branding.baseColor}
                    onChange={(e) => update({ branding: { ...briefing.branding, baseColor: e.target.value } })}
                    className="w-28 px-3 py-2 rounded-lg bg-surface-2 border border-border-subtle text-sm font-mono text-text-strong outline-none focus:border-signal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-strong">
                  {isEs ? "Densidad" : "Density"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "spacious" as const, label: isEs ? "Espacioso" : "Spacious", emoji: "🌿" },
                    { id: "balanced" as const, label: isEs ? "Equilibrado" : "Balanced", emoji: "⚖️" },
                    { id: "dense" as const, label: isEs ? "Denso" : "Dense", emoji: "📊" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => update({ branding: { ...briefing.branding, density: d.id } })}
                      className={`p-3 rounded-xl text-sm border transition-all ${
                        briefing.branding.density === d.id
                          ? "bg-signal-soft border-signal text-text-strong"
                          : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
                      }`}
                    >
                      {d.emoji} {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
          disabled={activeSection === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-strong disabled:opacity-30 transition-all"
        >
          <ArrowLeft size={16} />
          {isEs ? "Anterior" : "Previous"}
        </button>
        <button
          onClick={() => {
            if (activeSection < 5) setActiveSection((s) => s + 1);
            else handleGenerate();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold font-display transition-all bg-signal text-primary-foreground hover:opacity-90"
        >
          {activeSection < 5 ? (isEs ? "Siguiente" : "Next") : (isEs ? "Generar Documentos 🚀" : "Generate Documents 🚀")}
          {activeSection < 5 && <ArrowRight size={16} />}
        </button>
      </div>
    </PageLayout>
  );
}
