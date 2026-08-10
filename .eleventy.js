const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Static passthroughs
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/styles": "styles" });
  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  eleventyConfig.addWatchTarget("src/styles");
  eleventyConfig.addWatchTarget("src/scripts");

  // Date formatting filters — accept ISO date strings (e.g. "2026-01-01")
  eleventyConfig.addFilter("dateHe", (isoString) => {
    return DateTime.fromISO(isoString, { zone: "utc" }).setLocale("he").toFormat("d בMMMM yyyy");
  });
  eleventyConfig.addFilter("dateEn", (isoString) => {
    return DateTime.fromISO(isoString, { zone: "utc" }).setLocale("en").toFormat("MMMM d, yyyy");
  });
  eleventyConfig.addFilter("isoDate", (isoString) => {
    return DateTime.fromISO(isoString, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Given a root-relative (Hebrew) path, return its English-mirror path
  eleventyConfig.addFilter("localize", (urlPath, lang) => {
    if (lang !== "en") return urlPath;
    if (urlPath === "/") return "/en/";
    return "/en" + urlPath;
  });

  // Turn multi-paragraph content strings (separated by blank lines) into <p> tags
  eleventyConfig.addFilter("paragraphs", (text) => {
    if (!text) return "";
    return text
      .split(/\n\s*\n/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("\n");
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
