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
