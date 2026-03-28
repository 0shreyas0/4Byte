#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { execa } from "execa";

const program = new Command();

program
  .name("create-hackkit-app")
  .description("Create a new Next.js project preconfigured with HackKit")
  .argument("<project-name>", "The name of your project")
  .version("0.0.2")
  .action(async (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);

    console.log(chalk.bold.blue(`\n🚀 Creating HackKit App: ${projectName}\n`));

    try {
      // 1. Run create-next-app
      console.log(chalk.dim("  📦 Initializing Next.js project..."));
      await execa("npx", [
        "create-next-app@latest",
        projectName,
        "--ts",
        "--tailwind",
        "--eslint",
        "--app",
        "--src-dir",
        "--import-alias",
        "@/*",
        "--no-git",
        "--no-rc",
        "--no-turbo",
        "--use-npm",
        "--yes"
      ], { stdio: "inherit" });

      process.chdir(projectPath);

      // 2. Install HackKit dependencies
      console.log(chalk.dim("\n  🛠  Installing local dependencies..."));
      await execa("npm", ["install"], { stdio: "inherit" });

      console.log(chalk.dim("  ⚙️  Configuring HackKit..."));
      const pkgPath = path.join(projectPath, "package.json");
      const pkg = await fs.readJSON(pkgPath);
      
      pkg.devDependencies = {
        ...pkg.devDependencies,
        "commander": "^11.0.0",
        "chalk": "^5.3.0",
        "fs-extra": "^11.1.1",
        "execa": "^8.0.1",
        "jiti": "^1.21.0",
        "node-fetch": "^3.3.2",
        "adm-zip": "^0.5.10"
      };
      
      await fs.writeJSON(pkgPath, pkg, { spaces: 2 });

      // 3. Create hackkit.json
      const config = {
        componentsPath: "./src/components/hackkit",
        libPath: "./src/lib/hackkit",
        hooksPath: "./src/hooks/hackkit",
        registryUri: "https://raw.githubusercontent.com/Pruthv-creates/hackathon-starter-kit/main/registry/modules.json"
      };
      await fs.writeJSON(path.join(projectPath, "hackkit.json"), config, { spaces: 2 });

      // 4. Create standard folders
      await fs.ensureDir(path.join(projectPath, "src/components/hackkit"));
      await fs.ensureDir(path.join(projectPath, "src/hooks/hackkit"));
      await fs.ensureDir(path.join(projectPath, "src/lib/hackkit"));

      // 5. Generate starter page
      const starterPage = `
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-black text-white selection:bg-blue-500">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        HackKit Ready <span className="inline-block hover:rotate-12 transition-transform cursor-default">🚀</span>
      </h1>
      <p className="text-gray-400 text-lg mb-8 max-w-md text-center">
        Your high-performance hackathon foundation is ready. Add your first elite module to begin.
      </p>
      
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <pre className="relative bg-zinc-900 text-blue-400 p-6 rounded-lg text-sm font-mono border border-zinc-800 shadow-2xl">
          npx hackkit add team-chat
        </pre>
      </div>

      <div className="mt-12 flex gap-6 text-sm text-gray-500">
        <a href="#" className="hover:text-white transition-colors underline decoration-gray-800 underline-offset-4">Marketplace</a>
        <a href="#" className="hover:text-white transition-colors underline decoration-gray-800 underline-offset-4">Documentation</a>
        <a href="#" className="hover:text-white transition-colors underline decoration-gray-800 underline-offset-4">GitHub</a>
      </div>
    </div>
  )
}
`.trim();
      await fs.writeFile(path.join(projectPath, "src/app/page.tsx"), starterPage);

      // 6. Generate .env.example
      const envExample = `
# Core HackKit Services
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI & Data
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
SCRAPER_SERVICE_URL=http://localhost:8000

# Analytics & Payments
NEXT_PUBLIC_GA_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
`.trim();
      await fs.writeFile(path.join(projectPath, ".env.example"), envExample);

      // 7. Final success message
      console.log(chalk.bold.green(`\n✨ Project "${projectName}" created successfully!\n`));
      console.log(chalk.cyan("Next steps:"));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white(`  npx hackkit marketplace`));
      console.log(chalk.white(`  npx hackkit add team-chat`));
      
    } catch (error: any) {
      console.error(chalk.red(`\n❌ Failed to create project: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
