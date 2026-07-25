// ─── Google Drive Integration Subsystem ─────────────────────────────────────
// Client-side OAuth2 using Google Identity Services (GIS) with `drive.file` scope.
// Backs up project JSON and exports PRD/TRD as native Google Docs.

import type { ProjectRecord } from "./db";
import type { GeneratedDocuments } from "../engine/export/exporter";

export interface GoogleDriveStatus {
  isConnected: boolean;
  userEmail: string | null;
  folderId: string | null;
}

const SCOPE = "https://www.googleapis.com/auth/drive.file";

// ─── GIS Token Client Helper ────────────────────────────────────────────────

let accessToken: string | null = null;

export function setGoogleAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    sessionStorage.setItem("vibehub_gdrive_token", token);
  } else {
    sessionStorage.removeItem("vibehub_gdrive_token");
  }
}

export function getGoogleAccessToken(): string | null {
  if (!accessToken) {
    accessToken = sessionStorage.getItem("vibehub_gdrive_token");
  }
  return accessToken;
}

// ─── Drive API Calls ─────────────────────────────────────────────────────────

async function driveApiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getGoogleAccessToken();
  if (!token) throw new Error("Google Drive is not connected. Please connect Google Drive first.");

  const response = await fetch(`https://www.googleapis.com/drive/v3/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      setGoogleAccessToken(null);
      throw new Error("Google Drive session expired. Please re-authenticate.");
    }
    const errorBody = await response.text();
    throw new Error(`Google Drive API Error (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/**
 * Finds or creates the "Vibe Coding Hub" folder in Google Drive.
 */
export async function getOrCreateVibeHubFolder(): Promise<string> {
  const query = encodeURIComponent("name = 'Vibe Coding Hub' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
  const searchRes = await driveApiFetch(`files?q=${query}&fields=files(id,name)`);

  if (searchRes.files && searchRes.files.length > 0) {
    return searchRes.files[0].id;
  }

  // Create folder
  const token = getGoogleAccessToken();
  const createRes = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Vibe Coding Hub",
      mimeType: "application/vnd.google-apps.folder",
    }),
  });

  if (!createRes.ok) throw new Error("Failed to create 'Vibe Coding Hub' folder in Google Drive.");
  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Uploads or updates a project backup JSON file in Google Drive.
 */
export async function backupProjectToDrive(project: ProjectRecord): Promise<{ fileId: string; webViewLink: string }> {
  const folderId = await getOrCreateVibeHubFolder();
  const fileName = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-backup.json`;
  const token = getGoogleAccessToken();

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
    mimeType: "application/json",
  };

  const fileContent = JSON.stringify(project, null, 2);

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
  form.append("file", new Blob([fileContent], { type: "application/json" }));

  const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!uploadRes.ok) throw new Error("Failed to upload project backup to Google Drive.");
  return uploadRes.json();
}

/**
 * Creates a native Google Doc in Google Drive for a Markdown document.
 */
export async function exportDocToGoogleDoc(
  docTitle: string,
  markdownContent: string
): Promise<{ fileId: string; webViewLink: string }> {
  const folderId = await getOrCreateVibeHubFolder();
  const token = getGoogleAccessToken();

  const fileMetadata = {
    name: docTitle,
    parents: [folderId],
    mimeType: "application/vnd.google-apps.document", // Converts to Google Doc
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
  form.append("file", new Blob([markdownContent], { type: "text/markdown" }));

  const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!uploadRes.ok) throw new Error("Failed to create Google Doc in Google Drive.");
  return uploadRes.json();
}
