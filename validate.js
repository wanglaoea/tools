import validator from 'amphtml-validator';
import fs from 'fs';
import path from 'path';

const outputDir = './output';

if (!fs.existsSync(outputDir)) {
  console.error('Folder output tidak ditemukan.');
  process.exit(1);
}

const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));

if (files.length === 0) {
  console.log('Tidak ada file HTML di folder output.');
  process.exit(0);
}

(async () => {
  const v = await validator.getInstance();

  for (const file of files) {
    const filePath = path.join(outputDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const result = v.validateString(html);

    console.log(`\n${file} ✔ ${result.status}`);
    result.errors.forEach(e => {
      const msg = `line ${e.line}, col ${e.col}: ${e.message}`;
      if (e.severity === 'ERROR') {
        console.error(msg);
      } else {
        console.warn(msg);
      }
    });
  }
})();