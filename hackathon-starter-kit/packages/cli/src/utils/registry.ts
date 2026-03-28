import fetch from "node-fetch";
import path from "path";
import fs from "fs-extra";

export interface RemoteModule {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string; // Path within the repo
  dependencies?: string[];
  modularStructure?: {
    name: string;
    path: string;
  }[];
}

const DEFAULT_REGISTRY_URL = "https://raw.githubusercontent.com/Pruthv-creates/hackathon-starter-kit/main/registry/modules.json";

export async function fetchRegistry(registryUrl?: string): Promise<RemoteModule[]> {
  const url = registryUrl || DEFAULT_REGISTRY_URL;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Registry fetch failed: ${response.statusText}`);
    return (await response.json()) as RemoteModule[];
  } catch (error) {
    console.warn("⚠️  Remote registry unreachable at GitHub. Falling back to local modules.");
    
    // Attempt local fallback
    try {
      const localPath = path.join(__dirname, "registry-catalog.json");
      if (await fs.pathExists(localPath)) {
        return await fs.readJSON(localPath);
      }
    } catch (e) {
      // Ignore fallback errors
    }
    
    return [];
  }
}
