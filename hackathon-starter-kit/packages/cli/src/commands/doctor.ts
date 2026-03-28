import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { satisfies } from "semver";

export async function doctor() {
  console.log(chalk.bold.blue("\n🩺 Running HackKit Environment Diagnostics...\n"));

  const results = {
    node: true,
    next: true,
    tailwind: true,
    supabase: true,
    env: true,
    config: true
  };

  const suggestions: string[] = [];

  // 1. Node.js Version Check
  const nodeVersion = process.version;
  if (!satisfies(nodeVersion, ">=18.0.0")) {
    console.log(`${chalk.red("✗")} Node.js version (${nodeVersion}) incompatible. Need >=18.`);
    results.node = false;
    suggestions.push("Update Node.js to version 18 or higher.");
  } else {
    console.log(`${chalk.green("✓")} Node.js version ${nodeVersion} compatible`);
  }

  // Read package.json for Next.js and Supabase detection
  const pkgPath = path.join(process.cwd(), "package.json");
  let pkg: any = {};
  if (await fs.pathExists(pkgPath)) {
    pkg = await fs.readJSON(pkgPath);
  }

  // 2. Next.js Detection
  const hasNext = pkg.dependencies?.["next"] || pkg.devDependencies?.["next"];
  if (!hasNext) {
    console.log(`${chalk.yellow("⚠")} Next.js not detected in package.json`);
    results.next = false;
    suggestions.push("HackKit is optimized for Next.js. Install it with: npm install next");
  } else {
    console.log(`${chalk.green("✓")} Next.js detected`);
  }

  // 3. Tailwind Detection
  const hasTailwindConfig = (await fs.pathExists(path.join(process.cwd(), "tailwind.config.js"))) || 
                           (await fs.pathExists(path.join(process.cwd(), "tailwind.config.ts"))) ||
                           (await fs.pathExists(path.join(process.cwd(), "tailwind.config.mjs")));
  if (!hasTailwindConfig) {
    console.log(`${chalk.yellow("⚠")} Tailwind CSS configuration not detected`);
    results.tailwind = false;
    suggestions.push("Most modules use Tailwind. Install with: npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p");
  } else {
    console.log(`${chalk.green("✓")} Tailwind CSS detected`);
  }

  // 4. Supabase Detection
  const hasSupabase = pkg.dependencies?.["@supabase/supabase-js"];
  if (!hasSupabase) {
    console.log(`${chalk.yellow("⚠")} Supabase client not installed`);
    results.supabase = false;
    suggestions.push("Real-time modules require Supabase. Install with: npm install @supabase/supabase-js");
  } else {
    console.log(`${chalk.green("✓")} Supabase client detected`);
  }

  // 5. Environment Variables Check
  // Note: This checks process.env and also attempts to check .env.local if present
  let envUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  let envKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const envLocalPath = path.join(process.cwd(), ".env.local");
  if (await fs.pathExists(envLocalPath)) {
    const envLocal = await fs.readFile(envLocalPath, "utf-8");
    if (!envUrl && envLocal.includes("SUPABASE_URL")) envUrl = "detected_in_file";
    if (!envKey && envLocal.includes("SUPABASE_ANON_KEY")) envKey = "detected_in_file";
  }

  if (!envUrl || !envKey) {
    console.log(`${chalk.yellow("⚠")} Missing environment variables:`);
    if (!envUrl) console.log(`  - SUPABASE_URL`);
    if (!envKey) console.log(`  - SUPABASE_ANON_KEY`);
    results.env = false;
    suggestions.push("Set up your Supabase project and add credentials to .env.local");
  } else {
    console.log(`${chalk.green("✓")} Supabase environment variables detected`);
  }

  // 6. HackKit Config
  const hasConfig = await fs.pathExists(path.join(process.cwd(), "hackkit.json"));
  if (!hasConfig) {
    console.log(`${chalk.red("✗")} HackKit configuration (hackkit.json) not found`);
    results.config = false;
    suggestions.push("Initialize HackKit with: npx hackkit init");
  } else {
    console.log(`${chalk.green("✓")} HackKit configuration found`);
  }

  console.log(chalk.bold.blue("\nDiagnostics complete.\n"));

  if (suggestions.length > 0) {
    console.log(chalk.yellow.bold("💡 Suggestions for your environment:"));
    suggestions.forEach(s => console.log(chalk.white(`  • ${s}`)));
    console.log("");
  } else {
    console.log(chalk.green.bold("🚀 Your environment is perfectly prepared for HackKit modules!\n"));
  }
}
