import fs from 'fs';

const dataPath = './article/data.txt';

if (!fs.existsSync(dataPath)) {
  console.error('File article/data.txt not found.');
  process.exit(1);
}

const lines = fs.readFileSync(dataPath, 'utf8').split('\n');
const banners = lines
  .filter(line => line.startsWith('_@_BANNER_@_:'))
  .map(line => line.replace('_@_BANNER_@_:', '').trim())
  .filter(content => content.length > 0);

if (banners.length === 0) {
  console.log('No Banner content found in article/data.txt.');
  process.exit(0);
}

for (const banner of banners) {
  console.log(`${banner}`);
}