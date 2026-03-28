'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { ModularFile } from '@/lib/registry';

export async function getFileContent(componentName: string, subPath: string) {
  if (subPath.endsWith('/')) {
    return `// Code snippets are only available for files.\n// You selected a directory: ${subPath}`;
  }

  const cwd = process.cwd();
  
  const baseFolders = [
    path.join(cwd, 'packages/ui/src/components', componentName),
    path.join(cwd, 'packages/ui/src/features', componentName),
    path.join(cwd, 'packages/ui/src/theme', componentName),
  ];

  const normalizedSubPath = subPath.startsWith(`${componentName}/`) 
    ? subPath.slice(componentName.length + 1)
    : subPath;

  for (const base of baseFolders) {
    try {
      const fullPath = path.join(base, normalizedSubPath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return content;
    } catch (e) {
      // Ignore
    }
    
    try {
      const fullPath = path.join(base, subPath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return content;
    } catch (e) {
      // Ignore
    }
  }

  try {
    const rootPath = path.join(cwd, subPath);
    const content = await fs.readFile(rootPath, 'utf-8');
    return content;
  } catch (e) {
    // Ignore
  }

  return `// Could not load file: ${subPath}\n// Check if the registry path is correct.`;
}

export async function getDirectoryContent(componentName: string, subPath: string) {
  const cwd = process.cwd();
  
  const baseFolders = [
    path.join(cwd, 'packages/ui/src/components', componentName),
    path.join(cwd, 'packages/ui/src/features', componentName),
    path.join(cwd, 'packages/ui/src/theme', componentName),
  ];

  const normalizedSubPath = subPath.startsWith(`${componentName}/`) 
    ? subPath.slice(componentName.length + 1)
    : subPath;

  for (const base of baseFolders) {
    try {
      const fullPath = path.join(base, normalizedSubPath);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        const files = await fs.readdir(fullPath, { withFileTypes: true });
        return files.map((f) => ({
          name: f.name + (f.isDirectory() ? '/' : ''),
          type: f.isDirectory() ? 'directory' : 'file',
          path: path.join(subPath, f.name),
        } as ModularFile));
      }
    } catch (e) {
      // Ignore
    }
  }

  try {
    const rootPath = path.join(cwd, subPath);
    const stat = await fs.stat(rootPath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(rootPath, { withFileTypes: true });
      return files.map((f) => ({
        name: f.name + (f.isDirectory() ? '/' : ''),
        type: f.isDirectory() ? 'directory' : 'file',
        path: path.join(subPath, f.name),
      } as ModularFile));
    }
  } catch (e) {
    // Ignore
  }

  return [];
}
