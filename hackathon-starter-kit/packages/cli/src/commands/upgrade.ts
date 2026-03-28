import path from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger";
import { loadRegistry } from "../utils/registry-loader";
import { add } from "./add";

export async function upgrade(moduleId?: string) {
  const configPath = path.join(process.cwd(), "hackkit.json");
  if (!(await fs.pathExists(configPath))) {
    logger.error("hackkit.json not found.");
    return;
  }

  const config = await fs.readJSON(configPath);
  const installedModules = config.modules || {};
  
  const registry = await loadRegistry(config.registryUri);

  if (moduleId) {
    if (!installedModules[moduleId]) {
      logger.error(`Module "${moduleId}" is not currently installed.`);
      return;
    }
    await checkForUpgrade(moduleId, installedModules[moduleId], registry);
  } else {
    logger.bold("\nChecking for updates for all installed modules...\n");
    for (const id of Object.keys(installedModules)) {
      await checkForUpgrade(id, installedModules[id], registry);
    }
  }
}

async function checkForUpgrade(id: string, currentVersion: string, registry: any[]) {
  const module = registry.find(m => m.id === id);
  if (!module) {
    logger.warn(`Module "${id}" not found in registry.`);
    return;
  }

  if (module.version !== currentVersion) {
    logger.info(`✨ Update available for ${id}: ${currentVersion} -> ${module.version}`);
    await add(id); // Re-installing pulls the latest
  } else {
    logger.step(`${id} is up to date (${currentVersion})`);
  }
}
