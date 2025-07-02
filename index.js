import fs from "fs";
import path from "path";

const dataPath = "./article/data.txt";
const landingpagePath = "./landingpage/laz-new.html";
const outputDir = "./output";
const maxArticles = 100

if (!fs.existsSync("./output")) {
  fs.mkdirSync("./output");
}

const parseDataFile = (raw) => {

  const articleBlocks = raw
    .split(/\n_@_AUTHOR_@_:/)
    .map((b, i) => (i === 0 ? b : "_@_AUTHOR_@_:" + b))
    .map(b => b.trim())
    .filter(Boolean);

  return articleBlocks.slice(0, maxArticles).map((block, index) => {
    const meta = {};

    const [metaPart, ...contentParts] = block.split(/\n#{3,}\n/);

    metaPart.split('\n').forEach(line => {
      let match = line.match(/_@_(.*?)_@_:\s*(.*)/);
      if (match) {
        meta[match[1].trim()] = match[2].trim();
      } else {
        match = line.match(/_%_(.*?)_%_:\s*(.*)/);
        if (match) {
          meta[match[1].trim()] = match[2].trim();
        }
      }
    });

    meta["CONTENT"] = contentParts.join('\n').replace(/^#+|#+$/g, '').trim();
    return { ...meta, index };
  });
};

const generateSlug = (title) =>
  title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "artikel";

const run = async () => {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const rawData = fs.readFileSync(dataPath, "utf8");
  const landingpage = fs.readFileSync(landingpagePath, "utf8");
  const articles = parseDataFile(rawData);
  console.log(`✔ Successfull ${articles.length} Article`);

  articles.forEach((article) => {
    let html = landingpage;
    for (const [key, value] of Object.entries(article)) {
      html = html.replace(new RegExp(`_@_${key}_@_`, 'g'), value);
      html = html.replace(new RegExp(`_\\*_\\${key}_\\*_`, 'g'), value);
    }

    const filename = article.OUTPUT && article.OUTPUT.endsWith('.html')
      ? article.OUTPUT
      : `${generateSlug(article.TITLE || `artikel-${article.index + 1}`)}.html`;
    fs.writeFileSync(path.join(outputDir, filename), html, "utf8");
    console.log(filename);
  });
};
run();