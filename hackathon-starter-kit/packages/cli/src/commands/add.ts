import path from "path";
import fs from "fs-extra";
import fetch from "node-fetch";
import AdmZip from "adm-zip";
import { execa } from "execa";
import { logger } from "../utils/logger";
import { loadRegistry, RemoteModule } from "../utils/registry-loader";
import { cacheManager } from "../utils/cache-manager";
import { envManager } from "../utils/env-manager";

const REPO_ZIP_URL = "https://api.github.com/repos/Pruthv-creates/website-template/zipball/main";

export async function add(moduleQuery: string) {
  const [moduleId, requestedVersion] = moduleQuery.split("@");

  const configPath = path.join(process.cwd(), "hackkit.json");
  if (!(await fs.pathExists(configPath))) {
    logger.error("hackkit.json not found. Please run 'npx hackkit init' first.");
    return;
  }

  const config = await fs.readJSON(configPath);
  const modules = await loadRegistry(config.registryUri);

  const module = modules.find((m) => m.id === moduleId);
  if (!module) {
    logger.error(`Module "${moduleId}" not found.`);
    return;
  }

  const version = requestedVersion || module.version;
  logger.bold(`\nInstalling module: ${module.id}@${version}\n`);

  try {
    await cacheManager.init();
    let buffer = await cacheManager.getCachedModule(module.id, version);

    if (!buffer) {
      logger.dim("  ⬇️  Downloading from remote...");
      const response = await fetch(REPO_ZIP_URL);
      if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
      buffer = await response.buffer();
      await cacheManager.saveModuleToCache(module.id, version, buffer);
    }

    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    
    // Dynamically find the repo root directory (GitHub adds a hash/suffix)
    const rootDir = zipEntries[0].entryName.split('/')[0];
    const modulePrefix = `${rootDir}/${module.path}/`;
    
    const addedFiles: string[] = [];
    const componentsTarget = path.join(process.cwd(), config.componentsPath || "src/components/hackkit", module.name);
    const hooksTarget = path.join(process.cwd(), config.hooksPath || "src/hooks/hackkit");

    await fs.ensureDir(componentsTarget);
    await fs.ensureDir(hooksTarget);

    for (const entry of zipEntries) {
      if (entry.entryName.startsWith(modulePrefix) && !entry.isDirectory) {
        const relativePath = entry.entryName.replace(modulePrefix, "");
        
        // Handle metadata file module.json specifically if needed
        if (relativePath === "module.json") {
          // You could parse this here for extra logic
        }

        const content = entry.getData();
        let destPath: string;
        
        if (relativePath.includes("hooks/") || relativePath.startsWith("use") || (relativePath.endsWith(".ts") && !relativePath.endsWith(".tsx"))) {
          destPath = path.join(hooksTarget, path.basename(relativePath));
        } else {
          destPath = path.join(componentsTarget, relativePath);
        }

        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, content);
        addedFiles.push(path.relative(process.cwd(), destPath));
      }
    }

    if (addedFiles.length === 0) {
      throw new Error(`No files extracted for module: ${module.id}. Check path: ${module.path}`);
    }

    logger.bold("Files added:");
    addedFiles.forEach(f => logger.step(f));

    // Env injection
    if (module.env) {
      await envManager.inject(module.env);
    }

    // Dependency installation
    const deps = module.dependencies || [];
    if (deps.length > 0) {
      logger.bold("\nDependencies installed:");
      deps.forEach(d => logger.step(d));
      await execa("npm", ["install", ...deps], { stdio: "inherit" });
    }

    // Update hackkit.json
    config.modules = config.modules || {};
    config.modules[module.id] = version;
    await fs.writeJSON(configPath, config, { spaces: 2 });

    logger.success(`${module.name} v${version} installed successfully!`);

  } catch (error: any) {
    logger.error(`Installation failed: ${error.message}`);
  }
}
