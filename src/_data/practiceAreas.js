const fs = require("fs");
const path = require("path");

module.exports = () => {
  const filePath = path.join(__dirname, "..", "content", "practice-areas.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data.sort((a, b) => a.order - b.order);
};
