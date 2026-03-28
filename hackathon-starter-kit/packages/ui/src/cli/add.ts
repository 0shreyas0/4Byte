import fs from 'fs';
import path from 'path';

const componentName = process.argv[2];
if (!componentName) {
  console.error('Please specify a component name: npx ts-node packages/ui/src/cli/add.ts <component>');
  process.exit(1);
}

const UI_SRC = path.join(process.cwd(), 'packages/ui/src');

function addComponent(name: string) {
  // Check packages/ui/src/components
  const primitivePath = path.join(UI_SRC, 'components', name);
  const featurePath = path.join(UI_SRC, 'features', name);
  
  let sourcePath = '';
  let targetSubDir = 'ui';

  if (fs.existsSync(primitivePath)) {
    sourcePath = primitivePath;
  } else if (fs.existsSync(featurePath)) {
    sourcePath = featurePath;
    targetSubDir = 'features';
  } else {
    console.error(`Component "${name}" not found in library.`);
    process.exit(1);
  }

  const targetPath = path.join(process.cwd(), 'components', targetSubDir, name);
  
  if (!fs.existsSync(path.join(process.cwd(), 'components', targetSubDir))) {
    fs.mkdirSync(path.join(process.cwd(), 'components', targetSubDir), { recursive: true });
  }

  if (fs.existsSync(targetPath)) {
    console.log(`Component "${name}" already exists in components/${targetSubDir}. Overwriting...`);
  }

  // Copy recursive
  copyRecursiveSync(sourcePath, targetPath);
  console.log(`Successfully added ${name} to components/${targetSubDir}`);
}

function copyRecursiveSync(src: string, dest: string) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

addComponent(componentName);
