function toDate(input) {
  return input instanceof Date ? input : new Date(input);
}

function formatWithOptions(input, locale, options) {
  return new Intl.DateTimeFormat(locale, options).format(toDate(input));
}

function formatNumber(input) {
  return Number(input);
}

export function registerFilters(eleventyConfig) {
  eleventyConfig.addFilter("formatDate", (input, locale = "en-GB") =>
    formatWithOptions(input, locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }),
  );

  eleventyConfig.addFilter("formatLongDate", (input, locale = "en-US") =>
    formatWithOptions(input, locale, {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
  );

  eleventyConfig.addFilter("formatTime", (input, locale = "en-GB") =>
    formatWithOptions(input, locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }),
  );

  eleventyConfig.addFilter("formatYear", (input, locale = "en-US") =>
    formatWithOptions(input, locale, {
      year: "numeric",
      timeZone: "UTC",
    }),
  );

  eleventyConfig.addFilter("currentYear", (_input, locale = "en-US") =>
    formatWithOptions(new Date(), locale, {
      year: "numeric",
      timeZone: "UTC",
    }),
  );

  eleventyConfig.addFilter("inThousands", (input) =>
    Math.floor(formatNumber(input) / 1000),
  );

  eleventyConfig.addFilter("inMillions", (input) =>
    Math.floor(formatNumber(input) / 1000000),
  );

  eleventyConfig.addFilter("inMillionsOneDecimal", (input) =>
    (Math.floor(formatNumber(input) / 100000) / 10).toFixed(1),
  );

  eleventyConfig.addFilter("percentOf", (input, total) => {
    const numerator = formatNumber(input);
    const denominator = formatNumber(total);

    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return 0;
    }

    return Math.floor((numerator * 100) / denominator);
  });
}
