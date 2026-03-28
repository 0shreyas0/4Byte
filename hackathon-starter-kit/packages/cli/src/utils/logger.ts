import chalk from "chalk";

export const logger = {
  info: (msg: string) => console.log(chalk.blue(msg)),
  success: (msg: string) => console.log(chalk.bold.green(`✓ ${msg}`)),
  warn: (msg: string) => console.log(chalk.yellow(`⚠ ${msg}`)),
  error: (msg: string) => console.log(chalk.bold.red(`✗ ${msg}`)),
  dim: (msg: string) => console.log(chalk.dim(msg)),
  bold: (msg: string) => console.log(chalk.bold(msg)),
  module: (msg: string) => console.log(chalk.magenta(`📦 ${msg}`)),
  step: (msg: string) => console.log(chalk.cyan(`  → ${msg}`)),
};
