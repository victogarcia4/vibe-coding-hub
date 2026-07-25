// ─── Document Exporter ───────────────────────────────────────────────────────
// Exports generated documents as downloadable files.

import type { Briefing } from "../schema";
import { buildPrd } from "../builders/prd";
import { buildTrd } from "../builders/trd";
import { buildActionPlan } from "../builders/actionPlan";
import { buildUxBrief } from "../builders/uxBrief";
import { buildPromptPack } from "../builders/promptPack";

export type DocumentId = "prd" | "trd" | "actionPlan" | "uxBrief" | "promptPack";

export interface GeneratedDocuments {
  prd: string;
  trd: string;
  actionPlan: string;
  uxBrief: string;
  promptPack: string;
}

export function generateAllDocuments(briefing: Briefing, lang: "es" | "en"): GeneratedDocuments {
  return {
    prd: buildPrd(briefing, { lang }),
    trd: buildTrd(briefing, { lang }),
    actionPlan: buildActionPlan(briefing, { lang }),
    uxBrief: buildUxBrief(briefing, { lang }),
    promptPack: buildPromptPack(briefing, { lang }),
  };
}

// ─── Download Helpers ────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function downloadAllDocuments(docs: GeneratedDocuments, projectName: string) {
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";

  downloadMarkdown(docs.prd, `${safeName}-prd.md`);
  downloadMarkdown(docs.trd, `${safeName}-trd.md`);
  downloadMarkdown(docs.actionPlan, `${safeName}-action-plan.md`);
  downloadMarkdown(docs.uxBrief, `${safeName}-ux-brief.md`);
  downloadMarkdown(docs.promptPack, `${safeName}-prompt-pack.md`);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
