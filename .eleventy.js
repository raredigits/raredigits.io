import rss, { dateToRfc3339, getNewestCollectionItemDate } from "@11ty/eleventy-plugin-rss";
import yaml from "js-yaml";
import { registerFilters } from "./_config/filters.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rss);
  eleventyConfig.addLiquidFilter("dateToRfc3339", dateToRfc3339);
  eleventyConfig.addLiquidFilter("getNewestCollectionItemDate", getNewestCollectionItemDate);

  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");
  eleventyConfig.addPassthroughCopy("robots.txt");
  registerFilters(eleventyConfig);

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    templateFormats: ["html", "md", "liquid", "njk", "11ty.js"],
  };
}
