import fs from "fs-extra";
import path from "path";
import os from "os";
import { logger } from "./logger";

const CACHE_DIR = path.join(os.homedir(), ".hackkit", "cache");

export const cacheManager = {
  async init() {
    await fs.ensureDir(CACHE_DIR);
  },

  getCachePath(moduleId: string, version: string) {
    return path.join(CACHE_DIR, `${moduleId}-${version}.zip`);
  },

  async getCachedModule(moduleId: string, version: string): Promise<Buffer | null> {
    const cachePath = this.getCachePath(moduleId, version);
    if (await fs.pathExists(cachePath)) {
      logger.dim(`  ⚡ Cache hit: ${moduleId}@${version}`);
      return await fs.readFile(cachePath);
    }
    return null;
  },

  async saveModuleToCache(moduleId: string, version: string, buffer: Buffer) {
    const cachePath = this.getCachePath(moduleId, version);
    await fs.ensureDir(path.dirname(cachePath));
    await fs.writeFile(cachePath, buffer);
  },

  async clearCache() {
    await fs.remove(CACHE_DIR);
    logger.success("Cache cleared successfully.");
  }
};
