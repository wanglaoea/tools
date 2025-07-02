import slugify from 'slugify';
import fs from 'fs';

const dataPath = 'article/data.txt';

if (!fs.existsSync(dataPath)) {
  console.error('File article/data.txt tidak ditemukan.');
  process.exit(1);
}

const lines = fs.readFileSync(dataPath, 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.startsWith('_@_TITLE_@_:'));

if (lines.length === 0) {
  console.log('Tidak ada baris _@_TITLE_@_: di article/data.txt');
  process.exit(0);
}

for (const line of lines) {
  const title = line.replace('_@_TITLE_@_:', '').trim();
  if (title.length > 0) {
    const slug = slugify(title, { lower: true });
    console.log(`${slug}.html`);
  }
}