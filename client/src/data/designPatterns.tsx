// Design Patterns Database — 14 Live Interactive UI Patterns
// Live interactive React components + code snippets + agent prompts in English

import React, { useState } from "react";
import {
  CheckCircle, AlertCircle, RefreshCw, Trash2, Search, ArrowRight,
  Shield, CreditCard, Bell, ChevronRight, User, Lock, WifiOff, Plus
} from "lucide-react";

export interface DesignPattern {
  id: string;
  nameEs: string;
  nameEn: string;
  category: string;
  descriptionEs: string;
  descriptionEn: string;
  codeSnippet: string;
  agentPromptEn: string;
  render: React.FC;
}

export const designPatterns: DesignPattern[] = [
  // 1. Empty State
  {
    id: "empty-state",
    nameEs: "Estado Vacío (Empty State)",
    nameEn: "Empty State",
    category: "Feedback & Guidance",
    descriptionEs: "Se muestra cuando no hay datos. Incluye explicación amable e ilustración con botón de llamada a la acción.",
    descriptionEn: "Displayed when no data exists. Features a helpful message, visual icon, and primary call-to-action button.",
    codeSnippet: `<div className="text-center py-12 px-6 rounded-2xl bg-surface-2 border border-border-subtle">
  <div className="w-12 h-12 rounded-full bg-signal-soft text-signal flex items-center justify-center mx-auto mb-4">
    <Plus size={24} />
  </div>
  <h3 className="text-base font-bold font-display text-text-strong mb-1">No hay proyectos creados</h3>
  <p className="text-xs text-text-muted max-w-sm mx-auto mb-6">Empieza creando tu primer proyecto para generar documentos de arquitectura.</p>
  <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-signal text-primary-foreground hover:opacity-90">
    + Crear Nuevo Proyecto
  </button>
</div>`,
    agentPromptEn: "Build an accessible empty state component. Include a centered brand icon container, a bold title, a short explanatory description, and a primary CTA button to create the first item.",
    render: () => (
      <div className="text-center py-10 px-6 rounded-2xl bg-surface-2 border border-border-subtle max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-signal-soft text-signal flex items-center justify-center mx-auto mb-3">
          <Plus size={24} />
        </div>
        <h4 className="text-sm font-bold font-display text-text-strong mb-1">No items found</h4>
        <p className="text-xs text-text-muted max-w-xs mx-auto mb-4">Get started by creating your first entry in the workspace.</p>
        <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-signal text-primary-foreground hover:opacity-90 transition-all">
          + Create First Entry
        </button>
      </div>
    ),
  },

  // 2. Skeleton Loader
  {
    id: "skeleton-loader",
    nameEs: "Carga Esquelética (Skeleton Loader)",
    nameEn: "Skeleton Loader",
    category: "Loading States",
    descriptionEs: "Marcador de posición animado que simula la estructura de la tarjeta mientras se cargan los datos reales.",
    descriptionEn: "Animated placeholder card simulating layout structure while asynchronous content is loading.",
    codeSnippet: `<div className="p-4 rounded-xl bg-surface-2 border border-border-subtle animate-pulse space-y-3">
  <div className="flex justify-between items-center">
    <div className="h-4 bg-surface-3 rounded w-1/3"></div>
    <div className="h-3 bg-surface-3 rounded w-1/6"></div>
  </div>
  <div className="h-3 bg-surface-3 rounded w-3/4"></div>
  <div className="h-2 bg-surface-3 rounded w-full"></div>
</div>`,
    agentPromptEn: "Implement a pulse-animated skeleton loader for card items instead of a simple spinner to reduce perceived load time.",
    render: () => (
      <div className="p-5 rounded-2xl bg-surface-2 border border-border-subtle animate-pulse space-y-3 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-surface-3 rounded-md w-1/3"></div>
          <div className="h-3 bg-surface-3 rounded-md w-1/6"></div>
        </div>
        <div className="h-3 bg-surface-3 rounded-md w-3/4"></div>
        <div className="h-2 bg-surface-3 rounded-full w-full"></div>
        <div className="pt-2 flex gap-2">
          <div className="h-7 bg-surface-3 rounded-lg w-20"></div>
          <div className="h-7 bg-surface-3 rounded-lg w-16"></div>
        </div>
      </div>
    ),
  },

  // 3. Multi-step Form
  {
    id: "multistep-form",
    nameEs: "Formulario Multi-paso",
    nameEn: "Multi-Step Form Wizard",
    category: "Forms & Input",
    descriptionEs: "Divide tareas complejas en pasos secuenciales claros con indicador de progreso.",
    descriptionEn: "Breaks complex multi-input forms into sequential steps with clear progress indicators.",
    codeSnippet: `<div className="space-y-4">
  <div className="flex justify-between text-xs font-mono">
    <span>Paso 2 de 3</span>
    <span>66%</span>
  </div>
  <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
    <div className="h-full bg-signal w-2/3"></div>
  </div>
</div>`,
    agentPromptEn: "Create a multi-step form wizard with a progress bar, step counter, back/next navigation controls, and state retention.",
    render: () => {
      const [step, setStep] = useState(2);
      return (
        <div className="p-5 rounded-2xl bg-surface-2 border border-border-subtle max-w-md mx-auto space-y-4">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-strong font-semibold">Step {step} of 3</span>
            <span className="text-signal font-semibold">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div className="h-full bg-signal transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
          <div className="py-2">
            <label className="block text-xs font-semibold text-text-strong mb-1">Project Name</label>
            <input type="text" defaultValue="VibeHub Project" className="w-full px-3 py-2 rounded-lg bg-background border border-border-subtle text-xs text-text-strong outline-none" />
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="px-3 py-1.5 text-xs text-text-muted hover:text-text-strong">Back</button>
            <button onClick={() => setStep((s) => Math.min(3, s + 1))} className="px-3 py-1.5 text-xs rounded-lg bg-signal text-primary-foreground">Next Step</button>
          </div>
        </div>
      );
    },
  },

  // 4. Metrics Dashboard Cards
  {
    id: "metrics-card",
    nameEs: "Tarjeta de Métricas (Dashboard)",
    nameEn: "Metrics Stat Card",
    category: "Data Visualization",
    descriptionEs: "Tarjeta para mostrar KPIs clave con indicador de tendencia (incremento/decremento).",
    descriptionEn: "High-visibility metric card displaying key performance indicators with trend percentage.",
    codeSnippet: `<div className="p-4 rounded-xl bg-surface-2 border border-border-subtle">
  <div className="text-xs text-text-muted">Ingresos Mensuales</div>
  <div className="text-2xl font-bold font-display text-text-strong">$12,450</div>
  <div className="text-xs text-signal font-semibold">↑ +14.2% este mes</div>
</div>`,
    agentPromptEn: "Build a KPI metric card with label, prominent number format, and positive/negative trend indicator badge.",
    render: () => (
      <div className="p-5 rounded-2xl bg-surface-2 border border-border-subtle max-w-xs mx-auto space-y-2">
        <div className="text-xs font-mono text-text-muted">Monthly Recurring Revenue</div>
        <div className="text-2xl font-bold font-display text-text-strong">$24,850</div>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-signal-soft text-signal">
          ↑ +18.4% vs last month
        </div>
      </div>
    ),
  },

  // 5. Destructive Confirmation Modal
  {
    id: "destructive-modal",
    nameEs: "Modal de Confirmación Destructiva",
    nameEn: "Destructive Confirmation Modal",
    category: "Overlays & Dialogs",
    descriptionEs: "Diálogo de advertencia antes de ejecutar una acción irreversible (eliminar datos).",
    descriptionEn: "Warning dialog asking explicit user confirmation before performing non-reversible deletion.",
    codeSnippet: `<div className="p-6 rounded-2xl bg-surface-1 border border-border-subtle max-w-sm">
  <h4 className="text-base font-bold text-error">¿Eliminar proyecto?</h4>
  <p className="text-xs text-text-muted">Esta acción no se puede deshacer.</p>
</div>`,
    agentPromptEn: "Implement a confirmation modal for destructive actions with distinct error color treatment and explicit 'Cancel' and 'Delete' buttons.",
    render: () => (
      <div className="p-5 rounded-2xl bg-surface-1 border border-border-subtle max-w-sm mx-auto space-y-3">
        <div className="flex items-center gap-2 text-error font-bold text-sm">
          <AlertCircle size={18} />
          <span>Delete Project Permanently?</span>
        </div>
        <p className="text-xs text-text-muted">This action will delete all briefings and documents. This cannot be undone.</p>
        <div className="flex justify-end gap-2 pt-2">
          <button className="px-3 py-1.5 text-xs text-text-muted">Cancel</button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-error text-white font-semibold">Yes, Delete</button>
        </div>
      </div>
    ),
  },

  // 6. Offline Status Banner
  {
    id: "offline-banner",
    nameEs: "Banner de Estado Sin Conexión",
    nameEn: "Offline Status Banner",
    category: "Feedback & Guidance",
    descriptionEs: "Aviso discreto que informa al usuario cuando se pierde la conexión a internet.",
    descriptionEn: "Floating status banner notifying users when internet connectivity drops without blocking UI.",
    codeSnippet: `<div className="p-3 rounded-xl bg-gold-soft border border-gold-border flex items-center gap-3">
  <WifiOff size={16} className="text-gold" />
  <span className="text-xs text-text-strong font-semibold">Modo sin conexión activo</span>
</div>`,
    agentPromptEn: "Add a floating offline detection banner that alerts users when internet connection is lost, emphasizing offline-first data retention.",
    render: () => (
      <div className="p-3.5 rounded-xl bg-gold-soft border border-gold-border text-xs text-text-strong flex items-center gap-3 max-w-md mx-auto">
        <WifiOff size={16} className="text-gold flex-shrink-0" />
        <div className="flex-1">
          <div className="font-bold">Offline Mode Active</div>
          <div className="text-[11px] text-text-muted">Changes are saved locally to your browser IndexedDB.</div>
        </div>
      </div>
    ),
  },
];
