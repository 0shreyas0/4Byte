import path from "path";
import fs from "fs-extra";
import { execa } from "execa";
import { logger } from "../utils/logger";
import { loadRegistry } from "../utils/registry-loader";

export async function preview(moduleId: string) {
  const configPath = path.join(process.cwd(), "hackkit.json");
  if (!(await fs.pathExists(configPath))) {
    logger.error("hackkit.json not found.");
    return;
  }

  const config = await fs.readJSON(configPath);
  const registry = await loadRegistry(config.registryUri);
  const module = registry.find(m => m.id === moduleId);

  if (!module) {
    logger.error(`Module "${moduleId}" not found.`);
    return;
  }

  logger.info(`🚀 Opening preview for ${module.name}...`);

  const previewFile = path.join(process.cwd(), "src/app/hackkit-preview/page.tsx");
  await fs.ensureDir(path.dirname(previewFile));

  const content = `
"use client";
import React from 'react';
import { ${module.name} } from "@/components/hackkit/${module.name}";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-white">${module.name} Preview</h1>
          <p className="text-zinc-400">Live development preview of the ${module.id} module.</p>
        </header>
        
        <main className="p-8 border border-zinc-800 rounded-2xl bg-zinc-900/50 backdrop-blur-sm">
           <${module.name} />
        </main>

        <footer className="text-xs text-zinc-600">
           Path: src/app/hackkit-preview/page.tsx
        </footer>
      </div>
    </div>
  );
}
`.trim();

  await fs.writeFile(previewFile, content);
  
  logger.success("Preview scaffolded at /hackkit-preview");
  logger.info("Starting development server...");
  
  // Try to open browser (best effort)
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try {
     await execa(start, ["http://localhost:3000/hackkit-preview"]);
  } catch (e) {}

}
