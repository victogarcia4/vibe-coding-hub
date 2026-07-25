// DocumentViewer — Tabbed viewer for generated documents with export
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Code, Clipboard, Download, Check, ArrowLeft, BookOpen, Cpu, Zap, Palette, Terminal } from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useI18n } from "@/i18n/I18nContext";
import {
  type GeneratedDocuments, type DocumentId,
  downloadMarkdown, downloadJson, downloadAllDocuments,
  copyToClipboard, generateAllDocuments,
} from "@/engine/export/exporter";
import type { Briefing } from "@/engine/schema";

const docTabs: { id: DocumentId; labelEs: string; labelEn: string; icon: React.ReactNode }[] = [
  { id: "prd", labelEs: "PRD", labelEn: "PRD", icon: <FileText size={14} /> },
  { id: "trd", labelEs: "TRD", labelEn: "TRD", icon: <Code size={14} /> },
  { id: "actionPlan", labelEs: "Plan de Acción", labelEn: "Action Plan", icon: <Zap size={14} /> },
  { id: "uxBrief", labelEs: "Brief UX/UI", labelEn: "UX/UI Brief", icon: <Palette size={14} /> },
  { id: "promptPack", labelEs: "Prompts", labelEn: "Prompts", icon: <Terminal size={14} /> },
];

export default function DocumentViewer() {
  const [activeDoc, setActiveDoc] = useState<DocumentId>("prd");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { language } = useI18n();
  const [, navigate] = useLocation();
  const isEs = language === "es";

  // Load from sessionStorage
  const { docs, briefing } = useMemo(() => {
    try {
      const docsStr = sessionStorage.getItem("vibe-hub-docs");
      const briefingStr = sessionStorage.getItem("vibe-hub-docs-briefing");
      if (docsStr && briefingStr) {
        return {
          docs: JSON.parse(docsStr) as GeneratedDocuments,
          briefing: JSON.parse(briefingStr) as Briefing,
        };
      }
    } catch { /* fallthrough */ }
    return { docs: null, briefing: null };
  }, []);

  if (!docs || !briefing) {
    return (
      <PageLayout
        title={isEs ? "Visor de Documentos" : "Document Viewer"}
        subtitle={isEs ? "No hay documentos generados aún." : "No documents generated yet."}
        phase="06"
      >
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto mb-4 text-text-subtle" />
          <p className="text-lg font-semibold text-text-strong mb-2">
            {isEs ? "No hay documentos" : "No documents"}
          </p>
          <p className="text-sm text-text-muted mb-6">
            {isEs
              ? "Completa el Briefing Studio para generar tu paquete de documentos."
              : "Complete the Briefing Studio to generate your document package."
            }
          </p>
          <button
            onClick={() => navigate("/studio")}
            className="px-6 py-3 rounded-lg text-sm font-semibold bg-signal text-primary-foreground hover:opacity-90 transition-all"
          >
            {isEs ? "Ir al Briefing Studio" : "Go to Briefing Studio"}
          </button>
        </div>
      </PageLayout>
    );
  }

  const currentContent = docs[activeDoc];
  const projectName = briefing.identity.name || "project";

  const handleCopy = async () => {
    await copyToClipboard(currentContent);
    setCopiedSection(activeDoc);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadCurrent = () => {
    const safeName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project";
    const suffixes: Record<DocumentId, string> = {
      prd: "prd",
      trd: "trd",
      actionPlan: "action-plan",
      uxBrief: "ux-brief",
      promptPack: "prompt-pack",
    };
    downloadMarkdown(currentContent, `${safeName}-${suffixes[activeDoc]}.md`);
  };

  const handleDownloadAll = () => {
    downloadAllDocuments(docs, projectName);
  };

  const handleDownloadJson = () => {
    downloadJson(briefing, `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project"}-briefing.json`);
  };

  const handleRegenerate = () => {
    const newDocs = generateAllDocuments(briefing, language);
    sessionStorage.setItem("vibe-hub-docs", JSON.stringify(newDocs));
    window.location.reload();
  };

  // Simple Markdown renderer — renders key elements
  const renderMarkdown = (md: string) => {
    const lines = md.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = "";

    lines.forEach((line, i) => {
      if (line.startsWith("```") && !inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
        return;
      }
      if (line.startsWith("```") && inCodeBlock) {
        inCodeBlock = false;
        elements.push(
          <pre key={`code-${i}`} className="my-4 p-4 rounded-xl bg-surface-2 border border-border-subtle overflow-x-auto text-xs font-mono text-text-strong">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        return;
      }
      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(<h1 key={i} className="text-2xl font-bold font-display text-text-strong mt-8 mb-3">{line.slice(2)}</h1>);
      } else if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="text-xl font-bold font-display text-text-strong mt-6 mb-2 pb-2 border-b border-border-subtle">{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="text-lg font-semibold font-display text-text-strong mt-4 mb-1.5">{line.slice(4)}</h3>);
      }
      // Blockquotes
      else if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={i} className="my-2 pl-4 border-l-2 border-signal text-sm text-text-muted italic">
            {line.slice(2)}
          </blockquote>
        );
      }
      // Table rows
      else if (line.startsWith("|")) {
        if (line.match(/^\|[\s-|]+$/)) return; // separator
        const cells = line.split("|").filter(Boolean).map((c) => c.trim());
        elements.push(
          <div key={i} className="flex gap-4 py-1.5 border-b border-border-subtle text-xs font-mono text-text-muted">
            {cells.map((cell, ci) => (
              <span key={ci} className={`flex-1 ${ci === 0 ? "font-semibold text-text-strong" : ""}`}>
                {cell}
              </span>
            ))}
          </div>
        );
      }
      // List items
      else if (line.match(/^- \[[ x\/]\] /)) {
        const checked = line.includes("[x]");
        const inProgress = line.includes("[/]");
        elements.push(
          <div key={i} className="flex items-start gap-2 py-0.5 text-sm text-text-muted">
            <span className={`mt-0.5 ${checked ? "text-signal" : inProgress ? "text-gold" : "text-text-subtle"}`}>
              {checked ? "☑" : inProgress ? "◐" : "☐"}
            </span>
            <span>{line.replace(/^- \[[ x\/]\] /, "")}</span>
          </div>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <div key={i} className="flex items-start gap-2 py-0.5 text-sm text-text-muted">
            <span className="text-text-subtle mt-0.5">•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      // Horizontal rule
      else if (line === "---") {
        elements.push(<hr key={i} className="my-6 border-border-subtle" />);
      }
      // Bold text / paragraphs
      else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(<p key={i} className="text-sm font-semibold text-text-strong my-1">{line.replace(/\*\*/g, "")}</p>);
      }
      // Regular paragraph
      else if (line.trim()) {
        elements.push(<p key={i} className="text-sm text-text-muted my-1">{line}</p>);
      }
      // Blank line
      else {
        elements.push(<div key={i} className="h-2" />);
      }
    });

    return elements;
  };

  return (
    <PageLayout
      title={isEs ? "Documentos Generados" : "Generated Documents"}
      subtitle={`${briefing.identity.name} — ${isEs ? "5 documentos listos" : "5 documents ready"}`}
      phase="06"
    >
      {/* Top Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => navigate("/studio")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-border-subtle bg-surface-2 text-text-muted hover:text-text-strong transition-all"
        >
          <ArrowLeft size={14} />
          {isEs ? "Volver al Briefing" : "Back to Briefing"}
        </button>
        <button
          onClick={handleRegenerate}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-border-subtle bg-surface-2 text-text-muted hover:text-text-strong transition-all"
        >
          <Cpu size={14} />
          {isEs ? "Regenerar" : "Regenerate"}
        </button>
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-signal text-primary-foreground hover:opacity-90 transition-all"
        >
          <Download size={14} />
          {isEs ? "Descargar Todo (.md)" : "Download All (.md)"}
        </button>
        <button
          onClick={handleDownloadJson}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-border-subtle bg-surface-2 text-text-muted hover:text-text-strong transition-all"
        >
          <Code size={14} />
          {isEs ? "Exportar Briefing (.json)" : "Export Briefing (.json)"}
        </button>
      </div>

      {/* Document Tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
        {docTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDoc(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-display transition-all border whitespace-nowrap ${
              activeDoc === tab.id
                ? "bg-signal text-primary-foreground border-signal"
                : "bg-surface-2 text-text-muted border-border-subtle hover:text-text-strong"
            }`}
          >
            {tab.icon}
            {isEs ? tab.labelEs : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Document Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-surface-2 border border-border-subtle text-text-muted hover:text-text-strong transition-all"
        >
          {copiedSection === activeDoc ? <Check size={12} className="text-signal" /> : <Clipboard size={12} />}
          {copiedSection === activeDoc ? (isEs ? "¡Copiado!" : "Copied!") : (isEs ? "Copiar" : "Copy")}
        </button>
        <button
          onClick={handleDownloadCurrent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-surface-2 border border-border-subtle text-text-muted hover:text-text-strong transition-all"
        >
          <Download size={12} />
          {isEs ? "Descargar .md" : "Download .md"}
        </button>
      </div>

      {/* Document Content */}
      <motion.div
        key={activeDoc}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-2xl p-6 md:p-8 overflow-x-auto"
      >
        {renderMarkdown(currentContent)}
      </motion.div>
    </PageLayout>
  );
}
