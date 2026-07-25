// ─── IndexedDB Local Storage Subsystem ──────────────────────────────────────
// Offline-first local database for Vibe Coding Hub (`vibehub_db`).
// Pure TypeScript native IndexedDB wrapper with promise API.

import type { Briefing } from "../engine/schema";
import type { GeneratedDocuments } from "../engine/export/exporter";

export interface ProjectRecord {
  id: string;
  name: string;
  briefing: Briefing;
  documents: GeneratedDocuments | null;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  version: number;
}

export interface SnapshotRecord {
  id: string;
  projectId: string;
  timestamp: string;
  briefing: Briefing;
  documents: GeneratedDocuments | null;
  note: string;
}

const DB_NAME = "vibehub_db";
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Projects store
      if (!db.objectStoreNames.contains("projects")) {
        const projectStore = db.createObjectStore("projects", { keyPath: "id" });
        projectStore.createIndex("updatedAt", "updatedAt", { unique: false });
        projectStore.createIndex("archived", "archived", { unique: false });
      }

      // Snapshots store
      if (!db.objectStoreNames.contains("snapshots")) {
        const snapshotStore = db.createObjectStore("snapshots", { keyPath: "id" });
        snapshotStore.createIndex("projectId", "projectId", { unique: false });
        snapshotStore.createIndex("timestamp", "timestamp", { unique: false });
      }

      // Settings store
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// ─── Project Operations ──────────────────────────────────────────────────────

export async function saveProject(project: ProjectRecord): Promise<ProjectRecord> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readwrite");
    const store = tx.objectStore("projects");
    const updated = { ...project, updatedAt: new Date().toISOString() };
    const request = store.put(updated);

    request.onsuccess = () => resolve(updated);
    request.onerror = () => reject(request.error);
  });
}

export async function getProject(id: string): Promise<ProjectRecord | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readonly");
    const store = tx.objectStore("projects");
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllProjects(): Promise<ProjectRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readonly");
    const store = tx.objectStore("projects");
    const request = store.getAll();

    request.onsuccess = () => {
      const results: ProjectRecord[] = request.result || [];
      results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["projects", "snapshots"], "readwrite");
    const projectStore = tx.objectStore("projects");
    const snapshotStore = tx.objectStore("snapshots");

    projectStore.delete(id);

    // Also delete associated snapshots
    const index = snapshotStore.index("projectId");
    const range = IDBKeyRange.only(id);
    const cursorReq = index.openCursor(range);

    cursorReq.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function duplicateProject(id: string): Promise<ProjectRecord | null> {
  const original = await getProject(id);
  if (!original) return null;

  const duplicated: ProjectRecord = {
    ...original,
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: `${original.name} (Copy)`,
    briefing: {
      ...original.briefing,
      identity: {
        ...original.briefing.identity,
        name: `${original.briefing.identity.name} (Copy)`,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveProject(duplicated);
}

// ─── Snapshot Operations ─────────────────────────────────────────────────────

export async function createSnapshot(
  projectId: string,
  briefing: Briefing,
  documents: GeneratedDocuments | null,
  note: string = "Document regeneration"
): Promise<SnapshotRecord> {
  const db = await openDB();
  const snapshot: SnapshotRecord = {
    id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    projectId,
    timestamp: new Date().toISOString(),
    briefing,
    documents,
    note,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction("snapshots", "readwrite");
    const store = tx.objectStore("snapshots");
    const request = store.put(snapshot);

    request.onsuccess = () => resolve(snapshot);
    request.onerror = () => reject(request.error);
  });
}

export async function getSnapshots(projectId: string): Promise<SnapshotRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("snapshots", "readonly");
    const store = tx.objectStore("snapshots");
    const index = store.index("projectId");
    const request = index.getAll(projectId);

    request.onsuccess = () => {
      const results: SnapshotRecord[] = request.result || [];
      results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

// ─── Settings Operations ─────────────────────────────────────────────────────

export async function getSetting<T>(key: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("settings", "readonly");
    const store = tx.objectStore("settings");
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result ? request.result.value : null);
    request.onerror = () => reject(request.error);
  });
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("settings", "readwrite");
    const store = tx.objectStore("settings");
    const request = store.put({ key, value });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
