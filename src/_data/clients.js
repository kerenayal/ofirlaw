const fs = require("fs");
const path = require("path");

module.exports = () => {
  const filePath = path.join(__dirname, "..", "content", "clients.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};
