#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";
import { marketplace } from "./commands/marketplace";
import { openModule } from "./commands/open";
import { inspect } from "./commands/inspect";
import { doctor } from "./commands/doctor";
import { upgrade } from "./commands/upgrade";
import { preview } from "./commands/preview";
import { cacheManager } from "./utils/cache-manager";

const program = new Command();

program
  .name("hackkit")
  .description("CLI to manage Hackathon Kit modular components")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize hackkit configuration in your project")
  .action(init);

program
  .command("add")
  .description("Add a modular component to your project (support @version)")
  .argument("<module>", "The ID of the module (e.g., team-chat@1.0.0)")
  .action(add);

program
  .command("upgrade")
  .description("Upgrade installed modules to the latest version")
  .argument("[module]", "The ID of the specific module to upgrade")
  .action(upgrade);

program
  .command("marketplace")
  .description("Browse available modules in the HackKit marketplace")
  .action(marketplace);

program
  .command("open")
  .description("Open module documentation in browser")
  .argument("<module>", "The ID of the module to open")
  .action(openModule);

program
  .command("inspect")
  .description("Inspect a module's details and requirements")
  .argument("<module>", "The ID of the module to inspect")
  .action(inspect);

program
  .command("preview")
  .description("Scaffold a local preview page for a module")
  .argument("<module>", "The ID of the module to preview")
  .action(preview);

program
  .command("doctor")
  .description("Verify project environment for HackKit compatibility")
  .action(doctor);

program
  .command("clear-cache")
  .description("Clear the local module cache")
  .action(async () => {
    await cacheManager.clearCache();
  });

program.parse();
