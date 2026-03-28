import fs from "fs-extra";
import path from "path";
import { logger } from "./logger";

export const envManager = {
  async inject(variables: string[]) {
    if (!variables || variables.length === 0) return;

    const envExamplePath = path.join(process.cwd(), ".env.example");
    if (!(await fs.pathExists(envExamplePath))) {
      await fs.writeFile(envExamplePath, "# HackKit Environment Variables\n");
    }

    let content = await fs.readFile(envExamplePath, "utf-8");
    let updated = false;

    for (const variable of variables) {
      if (!content.includes(variable)) {
        content += `${variable}=\n`;
        updated = true;
      }
    }

    if (updated) {
      await fs.writeFile(envExamplePath, content);
      logger.success("Updated .env.example with required variables.");
    }
  }
};
