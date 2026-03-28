import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fetchRegistry } from "../utils/registry";

export async function inspect(moduleId: string) {
  const configPath = path.join(process.cwd(), "hackkit.json");
  let registryUrl = undefined;
  
  if (await fs.pathExists(configPath)) {
    const config = await fs.readJSON(configPath);
    registryUrl = config.registryUri;
  }

  const modules = await fetchRegistry(registryUrl);
  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    console.error(chalk.red(`❌ Module "${moduleId}" not found.`));
    return;
  }

  console.log(chalk.bold.blue(`\n🔍 Inspecting Module: ${module.name}`));
  console.log(chalk.dim(module.description));
  console.log("");

  console.log(chalk.bold("📁 Repository Path:"));
  console.log(`  ${module.path}`);

  console.log(chalk.bold("\n📦 Dependencies:"));
  if (module.dependencies && module.dependencies.length > 0) {
    module.dependencies.forEach(dep => {
      console.log(`  - ${dep}`);
    });
  } else {
    console.log("  None specified.");
  }

  console.log(chalk.bold("\n🛡️  Requirements:"));
  if (module.category === "Real-Time") {
    console.log("  - Supabase Project with Realtime enabled");
    console.log("  - Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY");
  } else if (module.category === "AI & Tools") {
    console.log("  - OpenAI / Anthropic API Keys");
  } else {
     console.log("  - Standard Next.js environment");
  }

  console.log(chalk.cyan("\nUsage:"));
  console.log(chalk.white(`  npx hackkit add ${module.id}`));
}
