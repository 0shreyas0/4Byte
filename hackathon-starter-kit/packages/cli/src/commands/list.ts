import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fetchRegistry } from "../utils/registry";

export async function list() {
  const configPath = path.join(process.cwd(), "hackkit.json");
  let registryUrl = undefined;
  
  if (await fs.pathExists(configPath)) {
    const config = await fs.readJSON(configPath);
    registryUrl = config.registryUri;
  }

  const modules = await fetchRegistry(registryUrl);

  console.log(chalk.bold.blue("\n📦 Available Hackathon Kit Modules:\n"));
  
  const categories: Record<string, any[]> = {};
  
  modules.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  Object.keys(categories).forEach(category => {
    console.log(chalk.bold.magenta(`--- ${category} ---`));
    categories[category].forEach(item => {
      console.log(`${chalk.green("•")} ${chalk.bold(item.id.padEnd(20))} ${chalk.dim(item.name)}`);
      console.log(`  ${chalk.gray(item.description)}`);
    });
    console.log("");
  });

  console.log(chalk.cyan("Usage: npx hackkit add <module-id>"));
}
