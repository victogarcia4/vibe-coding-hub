// ProjectLibrary — Multi-project management workspace UI (`/projects`)
// IndexedDB persistence + search + filter + import/export + Google Drive backup
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderPlus, Search, FileText, Trash2, Copy, Edit3, Archive,
  Upload, Download, HardDrive, CheckCircle2, ArrowRight, RefreshCw, AlertTriangle, Layers,
} from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useI18n } from "@/i18n/I18nContext";
import {
  getAllProjects, saveProject, deleteProject, duplicateProject,
  type ProjectRecord,
} from "@/storage/db";
import { createEmptyBriefing, getOverallCompleteness } from "@/engine/schema";
import { generateAllDocuments, downloadJson, downloadMarkdown } from "@/engine/export/exporter";
import { backupProjectToDrive, exportDocToGoogleDoc, getGoogleAccessToken, setGoogleAccessToken } from "@/storage/googleDrive";

export default function ProjectLibrary() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"active" | "archived">("active");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [gdriveToken, setGdriveToken] = useState<string | null>(getGoogleAccessToken());
  const [gdriveStatus, setGdriveStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { t, language } = useI18n();
  const [, navigate] = useLocation();
  const isEs = language === "es";

  // Load projects from IndexedDB
  const loadProjects = async () => {
    try {
      setLoading(true);
      const list = await getAllProjects();
      setProjects(list);
    } catch (err) {
      console.error("Failed to load projects from IndexedDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchFilter = filter === "archived" ? p.archived : !p.archived;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.briefing.identity.projectType.toLowerCase().includes(search.toLowerCase()) ||
        p.briefing.identity.tagline.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [projects, filter, search]);

  // Create new project
  const handleCreateNew = async () => {
    const emptyBriefing = createEmptyBriefing();
    const newProject: ProjectRecord = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: isEs ? "Nuevo Proyecto" : "New Project",
      briefing: emptyBriefing,
      documents: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
      version: 1,
    };
    await saveProject(newProject);
    sessionStorage.setItem("vibe-hub-active-project-id", newProject.id);
    localStorage.setItem("vibe-hub-briefing-draft", JSON.stringify(emptyBriefing));
    navigate("/studio");
  };

  // Open project in Briefing Studio or Documents
  const handleOpenProject = (p: ProjectRecord, target: "studio" | "documents") => {
    sessionStorage.setItem("vibe-hub-active-project-id", p.id);
    localStorage.setItem("vibe-hub-briefing-draft", JSON.stringify(p.briefing));
    if (p.documents) {
      sessionStorage.setItem("vibe-hub-docs", JSON.stringify(p.documents));
      sessionStorage.setItem("vibe-hub-docs-briefing", JSON.stringify(p.briefing));
    }
    navigate(target === "documents" && p.documents ? "/documents" : "/studio");
  };

  // Duplicate project
  const handleDuplicate = async (id: string) => {
    await duplicateProject(id);
    await loadProjects();
  };

  // Toggle archive
  const handleToggleArchive = async (p: ProjectRecord) => {
    await saveProject({ ...p, archived: !p.archived });
    await loadProjects();
  };

  // Delete project
  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setDeleteConfirmId(null);
    await loadProjects();
  };

  // Rename project
  const handleStartRename = (p: ProjectRecord) => {
    setRenameId(p.id);
    setRenameValue(p.name);
  };

  const handleSaveRename = async (p: ProjectRecord) => {
    if (!renameValue.trim()) return;
    const updatedBriefing = {
      ...p.briefing,
      identity: { ...p.briefing.identity, name: renameValue.trim() },
    };
    await saveProject({
      ...p,
      name: renameValue.trim(),
      briefing: updatedBriefing,
    });
    setRenameId(null);
    await loadProjects();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.briefing && imported.name) {
          const projectToSave: ProjectRecord = {
            id: imported.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: imported.name,
            briefing: imported.briefing,
            documents: imported.documents || generateAllDocuments(imported.briefing, language),
            createdAt: imported.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            archived: false,
            version: imported.version || 1,
          };
          await saveProject(projectToSave);
          await loadProjects();
        } else {
          alert(isEs ? "Archivo JSON inválido. Falta el briefing o el nombre." : "Invalid JSON file. Missing briefing or name.");
        }
      } catch (err) {
        alert(isEs ? "Error al leer el archivo JSON." : "Error reading JSON file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Backup to Drive
  const handleDriveBackup = async (p: ProjectRecord) => {
    try {
      setGdriveStatus(isEs ? "Subiendo respaldo..." : "Uploading backup...");
      const result = await backupProjectToDrive(p);
      setGdriveStatus(isEs ? "¡Respaldo en Google Drive completado!" : "Google Drive backup complete!");
      setTimeout(() => setGdriveStatus(null), 3000);
    } catch (err: any) {
      setGdriveStatus(`Error: ${err.message}`);
    }
  };

  return (
    <PageLayout
      title={isEs ? "Mis Proyectos" : "My Projects"}
      subtitle={isEs
        ? "Biblioteca local de proyectos. Crea, gestiona y exporta tus briefs de arquitectura con persistencia garantizada en tu navegador."
        : "Local project workspace. Create, manage, and export your architecture briefs with guaranteed local browser persistence."
      }
      phase="04"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold font-display bg-signal text-primary-foreground hover:opacity-90 transition-all"
          >
            <FolderPlus size={16} />
            {isEs ? "Nuevo Proyecto" : "New Project"}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-border-subtle bg-surface-2 text-text-strong hover:bg-surface-3 transition-all"
          >
            <Upload size={14} />
            {isEs ? "Importar JSON" : "Import JSON"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-border-subtle flex-1 sm:w-64">
            <Search size={14} className="text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEs ? "Buscar proyectos..." : "Search projects..."}
              className="w-full bg-transparent outline-none text-xs text-text-strong placeholder:text-text-subtle"
            />
          </div>
          <button
            onClick={() => setFilter(filter === "active" ? "archived" : "active")}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              filter === "archived"
                ? "bg-signal-soft border-signal text-signal"
                : "bg-surface-2 border-border-subtle text-text-muted hover:text-text-strong"
            }`}
          >
            {filter === "archived" ? (isEs ? "Archivados" : "Archived") : (isEs ? "Activos" : "Active")}
          </button>
        </div>
      </div>

      {/* Drive Status Alert */}
      {gdriveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 rounded-lg bg-signal-soft border border-signal-border text-xs font-semibold text-text-strong flex items-center gap-2"
        >
          <HardDrive size={14} className="text-signal" />
          {gdriveStatus}
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center text-text-muted text-sm font-mono">
          {isEs ? "Cargando proyectos desde IndexedDB..." : "Loading projects from IndexedDB..."}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredProjects.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center my-8">
          <Layers size={48} className="mx-auto mb-4 text-text-subtle" />
          <h3 className="text-lg font-bold font-display text-text-strong mb-1">
            {isEs ? "No hay proyectos" : "No projects found"}
          </h3>
          <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
            {filter === "archived"
              ? (isEs ? "No tienes proyectos archivados." : "You have no archived projects.")
              : (isEs ? "Crea tu primer proyecto para generar briefs de arquitectura completos." : "Create your first project to generate complete architecture briefs.")
            }
          </p>
          {filter === "active" && (
            <button
              onClick={handleCreateNew}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-signal text-primary-foreground hover:opacity-90 transition-all inline-flex items-center gap-2"
            >
              <FolderPlus size={16} />
              {isEs ? "Crear Mi Primer Proyecto" : "Create My First Project"}
            </button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const completeness = Math.round(getOverallCompleteness(p.briefing) * 100);
            const dateStr = new Date(p.updatedAt).toLocaleDateString(language, {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-border-subtle hover:border-signal-border transition-all duration-200"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {renameId === p.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveRename(p)}
                          className="px-2 py-1 rounded bg-background border border-signal text-sm text-text-strong w-full outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(p)}
                          className="px-2 py-1 rounded text-xs bg-signal text-primary-foreground"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <h3
                        onClick={() => handleStartRename(p)}
                        className="text-lg font-bold font-display text-text-strong hover:text-signal cursor-pointer flex items-center gap-2 group"
                        title={isEs ? "Clic para renombrar" : "Click to rename"}
                      >
                        {p.name}
                        <Edit3 size={12} className="opacity-0 group-hover:opacity-100 text-text-subtle transition-opacity" />
                      </h3>
                    )}
                    <span className="tag-mono text-[10px] uppercase tracking-wider flex-shrink-0">
                      {p.briefing.identity.projectType || "draft"}
                    </span>
                  </div>

                  {/* Tagline */}
                  {p.briefing.identity.tagline && (
                    <p className="text-xs text-text-muted mb-4 line-clamp-2">
                      {p.briefing.identity.tagline}
                    </p>
                  )}

                  {/* Completeness Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-text-subtle">{isEs ? "Completitud" : "Completeness"}</span>
                      <span className="text-signal font-semibold">{completeness}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-signal transition-all duration-300"
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div>
                  <div className="text-[11px] font-mono text-text-subtle mb-3 flex items-center justify-between">
                    <span>{dateStr}</span>
                    <span>{p.documents ? (isEs ? "5 docs listos" : "5 docs ready") : (isEs ? "Borrador" : "Draft")}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-3 border-t border-border-subtle">
                    <button
                      onClick={() => handleOpenProject(p, "studio")}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-display bg-signal-soft text-signal hover:bg-signal hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5"
                    >
                      <FileText size={13} />
                      {p.documents ? (isEs ? "Editar Brief" : "Edit Brief") : (isEs ? "Continuar" : "Continue")}
                    </button>
                    {p.documents && (
                      <button
                        onClick={() => handleOpenProject(p, "documents")}
                        className="py-2 px-3 rounded-lg text-xs font-semibold font-display bg-surface-2 text-text-strong hover:bg-surface-3 transition-all flex items-center justify-center gap-1"
                        title={isEs ? "Ver Documentos" : "View Documents"}
                      >
                        <ArrowRight size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDuplicate(p.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-strong hover:bg-surface-2 transition-all"
                      title={isEs ? "Duplicar proyecto" : "Duplicate project"}
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => downloadJson(p, `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-strong hover:bg-surface-2 transition-all"
                      title={isEs ? "Exportar JSON" : "Export JSON"}
                    >
                      <Download size={13} />
                    </button>
                    {gdriveToken && (
                      <button
                        onClick={() => handleDriveBackup(p)}
                        className="p-2 rounded-lg text-text-muted hover:text-signal hover:bg-surface-2 transition-all"
                        title={isEs ? "Respaldo en Google Drive" : "Backup to Google Drive"}
                      >
                        <HardDrive size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleArchive(p)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-strong hover:bg-surface-2 transition-all"
                      title={p.archived ? (isEs ? "Desarchivar" : "Unarchive") : (isEs ? "Archivar" : "Archive")}
                    >
                      <Archive size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-surface-2 transition-all"
                      title={isEs ? "Eliminar" : "Delete"}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-error">
              <AlertTriangle size={24} />
              <h4 className="text-base font-bold font-display text-text-strong">
                {isEs ? "¿Eliminar proyecto?" : "Delete project?"}
              </h4>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {isEs
                ? "Esta acción eliminará el proyecto y todos sus documentos de la base de datos local. No se puede deshacer."
                : "This action will delete the project and all its documents from your local database. It cannot be undone."
              }
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-text-strong"
              >
                {t.common.back}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-error text-white hover:opacity-90"
              >
                {isEs ? "Sí, eliminar" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
