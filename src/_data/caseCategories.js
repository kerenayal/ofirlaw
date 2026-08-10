const fs = require("fs");
const path = require("path");

module.exports = () => {
  const dir = path.join(__dirname, "..", "content", "cases");
  const cases = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));

  const seen = new Set();
  const categories = [];
  cases.forEach((c) => {
    if (!seen.has(c.category)) {
      seen.add(c.category);
      categories.push({ category: c.category, field_he: c.field_he, field_en: c.field_en });
    }
  });
  return categories;
};
