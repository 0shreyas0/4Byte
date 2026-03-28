import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function init() {
  console.log(chalk.blue("🚀 Initializing Hackathon Kit..."));

  const configPath = path.join(process.cwd(), "hackkit.json");
  
  const config = {
    componentsPath: "./components/hackkit",
    libPath: "./lib/hackkit",
    hooksPath: "./hooks/hackkit",
    registryUri: "https://raw.githubusercontent.com/Pruthv-creates/hackathon-starter-kit/main/registry/modules.json"
  };

  if (await fs.pathExists(configPath)) {
    console.log(chalk.yellow("⚠️  hackkit.json already exists."));
  } else {
    await fs.writeJSON(configPath, config, { spaces: 2 });
    console.log(chalk.green("✅ Created hackkit.json configuration."));
  }

  // Ensure components directory exists
  const componentsDir = path.join(process.cwd(), "components", "hackkit");
  await fs.ensureDir(componentsDir);
  
  console.log(chalk.cyan("\nSetup complete! You can now use:"));
  console.log(chalk.white("  npx hackkit list"));
  console.log(chalk.white("  npx hackkit add <module-id>"));
}
