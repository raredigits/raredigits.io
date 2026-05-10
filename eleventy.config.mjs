import rss from "@11ty/eleventy-plugin-rss";
import yaml from "js-yaml";
import strftime from "strftime";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rss);

  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  eleventyConfig.addLayoutAlias("home", "layouts/home.html");
  eleventyConfig.addLayoutAlias("page", "layouts/page.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");
  eleventyConfig.addLayoutAlias("demo/corsair", "layouts/demo/corsair.html");

  // No-op shim: site has no baseurl, so relative_url is identity.
  eleventyConfig.addFilter("relative_url", (value) => value);

  // strftime-based `date` filter — drop-in replacement for Jekyll's date
  // filter. Accepts Date objects, ISO strings, or anything Date can parse.
  eleventyConfig.addFilter("date", (input, format) => {
    const d = input instanceof Date ? input : new Date(input);
    return strftime(format, d);
  });

  // Posts collection — built from glob, leaves frontmatter tags alone.
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("./_posts/**/*.md"),
  );

  // Jekyll-compatible numeric filters: integer division when both operands
  // are integers (LiquidJS defaults to float division, which breaks the
  // corsair demo's integer-pair-as-decimal pattern: `{{ x | divided_by: 10 }}`
  // followed by `{{ x | modulo: 10 }}` rendered as `W.FM`).
  eleventyConfig.addFilter("divided_by", (a, b) => {
    if (Number.isInteger(a) && Number.isInteger(b)) return Math.floor(a / b);
    return a / b;
  });
  eleventyConfig.addFilter("modulo", (a, b) => {
    if (Number.isInteger(a) && Number.isInteger(b)) {
      return ((a % b) + b) % b;
    }
    return a % b;
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    templateFormats: ["html", "md", "liquid", "njk", "11ty.js"],
  };
}
