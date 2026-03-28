import { logger } from "../utils/logger";
import { loadRegistry } from "../utils/registry-loader";
import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";

export async function openModule(moduleId: string) {
  const configPath = path.join(process.cwd(), "hackkit.json");
  let registryUrl = undefined;
  
  if (await fs.pathExists(configPath)) {
    const config = await fs.readJSON(configPath);
    registryUrl = config.registryUri;
  }

  const modules = await loadRegistry(registryUrl);
  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    logger.error(`Module "${moduleId}" not found.`);
    return;
  }

  const docUrl = `https://hackkit.dev/modules/${module.id}`;
  
  logger.info(`Opening documentation for ${module.name}...`);
  logger.dim(`URL: ${docUrl}`);

  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} ${docUrl}`);
}
