# raredigits.io

Marketing site for Rare Digits, built with Eleventy (`@11ty/eleventy`).

## Local setup

```bash
git pull
npm install
npm run build
```

## Local development

```bash
npm start
```

The app runs on `http://localhost:8080` and automatically rebuilds when files change.

## Project structure

- [`.eleventy.js`](/Users/dk/GiHub/raredigits.io/.eleventy.js): main Eleventy config
- [`_config/filters.js`](/Users/dk/GiHub/raredigits.io/_config/filters.js): custom date/time and numeric filters used across templates
- [`_data/`](/Users/dk/GiHub/raredigits.io/_data): global data files and navigation data
- [`_includes/`](/Users/dk/GiHub/raredigits.io/_includes): partial templates
- [`_layouts/`](/Users/dk/GiHub/raredigits.io/_layouts): page layouts
- [`about/newsroom/`](/Users/dk/GiHub/raredigits.io/about/newsroom): newsroom landing page and news posts
- [`assets/`](/Users/dk/GiHub/raredigits.io/assets): static assets copied through to the output

## Eleventy config

The Eleventy config in [`.eleventy.js`](/Users/dk/GiHub/raredigits.io/.eleventy.js) is intentionally small and mostly does four things:

- registers `@11ty/eleventy-plugin-rss`
- enables YAML data files with `addDataExtension("yml,yaml", ...)`
- defines passthrough copy for `assets`, `CNAME`, `.nojekyll`, and `robots.txt`
- points Eleventy at `_includes`, `_layouts`, and `_data`

Most project-specific logic that used to live directly in the config has been moved into [`_config/filters.js`](/Users/dk/GiHub/raredigits.io/_config/filters.js).

## Custom filters

[`_config/filters.js`](/Users/dk/GiHub/raredigits.io/_config/filters.js) contains the template filters used by the site:

- date/time filters: `formatDate`, `formatLongDate`, `formatTime`, `formatYear`, `currentYear`
- numeric/display filters: `inThousands`, `inMillions`, `inMillionsOneDecimal`, `percentOf`

These are ordinary project utilities, not migration shims from Jekyll.

## Newsroom model

News posts live in [`about/newsroom/posts/`](/Users/dk/GiHub/raredigits.io/about/newsroom/posts).

Important details:

- [`about/newsroom/index.html`](/Users/dk/GiHub/raredigits.io/about/newsroom/index.html) renders the newsroom landing page
- [`about/newsroom/posts/posts.json`](/Users/dk/GiHub/raredigits.io/about/newsroom/posts/posts.json) is a native Eleventy directory data file
- `posts.json` applies shared data to all newsroom posts:
  - `layout: "post"`
  - `tags: "news"`
- the `news` tag creates the native collection `collections.news`
- each post keeps its own explicit `permalink`
- user-facing post tags are stored in `labels`, not in `tags`
- `category` is kept as a normal content field for display

This means:

- use `collections.news` when rendering newsroom content
- use `post.data.labels` when rendering visible labels on cards or post pages

## Content conventions

- Most site pages use front matter like `layout: page` and explicit `permalink`
- News posts use shared layout from `posts.json` and keep per-file permalinks
- Layouts are in [`_layouts/`](/Users/dk/GiHub/raredigits.io/_layouts), includes are in [`_includes/`](/Users/dk/GiHub/raredigits.io/_includes)

## Quick orientation for edits

- If you are changing page chrome, start in [`_layouts/`](/Users/dk/GiHub/raredigits.io/_layouts) and [`_includes/`](/Users/dk/GiHub/raredigits.io/_includes)
- If you are changing menus or shared site data, check [`_data/`](/Users/dk/GiHub/raredigits.io/_data)
- If you are changing newsroom behavior, check both [`about/newsroom/index.html`](/Users/dk/GiHub/raredigits.io/about/newsroom/index.html) and [`about/newsroom/posts/posts.json`](/Users/dk/GiHub/raredigits.io/about/newsroom/posts/posts.json)
- If you are changing formatting logic used in templates, check [`_config/filters.js`](/Users/dk/GiHub/raredigits.io/_config/filters.js)

## Verification

Before shipping changes, run:

```bash
npm run build
```
