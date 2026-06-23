import rss, { dateToRfc3339, getNewestCollectionItemDate } from "@11ty/eleventy-plugin-rss";
import yaml from "js-yaml";
import relatedPosts from "@raredigits/11ty-rare-related-posts";
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

  // Related posts: curated `related:` picks, else auto-fill by shared `labels`.
  // Logic lives in @raredigits/11ty-rare-related-posts.
  eleventyConfig.addPlugin(relatedPosts, {
    collection: "news",
    labelsField: "labels",
    limit: 3,
    fields: {
      title: true,
      image: ["cover", "img"], // some posts use `cover`, others `img`
      tldr: true,
      tags: false,
      date: true,
    },
    dateFormat: "YYYY",
  });

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
