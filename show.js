import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';

const outputDir = './output';

if (!fs.existsSync(outputDir)) {
  console.error('Output folder not found.');
  process.exit(1);
}

const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));

if (files.length === 0) {
  console.log('No HTML files found in the output folder.');
  process.exit(0);
}

let openCmd;
if (os.platform() === 'win32') {
  openCmd = 'start';
} else if (os.platform() === 'darwin') {
  openCmd = 'open';
} else {
  openCmd = 'xdg-open';
}

for (const file of files) {
  const filePath = path.resolve(outputDir, file);
  exec(`${openCmd} "${filePath}"`, (err) => {
    if (err) {
      console.error(`Failed to open file: ${filePath}`);
    } else {
      console.log(`✔ ${filePath} opened in the browser.`);
    }
  });
}