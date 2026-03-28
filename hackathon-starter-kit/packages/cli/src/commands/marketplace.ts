import { logger } from "../utils/logger";
import { loadRegistry } from "../utils/registry-loader";
import fs from "fs-extra";
import path from "path";

export async function marketplace() {
  const configPath = path.join(process.cwd(), "hackkit.json");
  let registryUrl = undefined;
  
  if (await fs.pathExists(configPath)) {
    const config = await fs.readJSON(configPath);
    registryUrl = config.registryUri;
  }

  const modules = await loadRegistry(registryUrl);

  logger.bold("\n🏪 HackKit Module Marketplace\n");
  
  const categories: Record<string, any[]> = {};
  
  modules.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  Object.keys(categories).forEach(category => {
    logger.bold(`--- ${category} ---`);
    categories[category].forEach(item => {
      console.log(`  ${item.id.padEnd(20)} ${item.description}`);
    });
    console.log("");
  });

  logger.dim("Usage: npx hackkit add <module-id>");
}
