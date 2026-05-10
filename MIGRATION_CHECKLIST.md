# Jekyll → 11ty migration checklist

Working branch: `migrate-to-11ty`. Tick each box as we go.

## Phase 0 — repo prep
- [x] Snapshot baseline: `bundle exec jekyll build` → copy `_site/` to `_site_jekyll/` for final diff
- [x] Add `.nvmrc` with Node LTS (e.g. `20`)
- [x] Update `.gitignore`: `node_modules/`, `_site/`, `.cache/`, `.DS_Store`
- [x] `git rm --cached` any tracked `.DS_Store` (5 files)

## Phase 1 — bootstrap 11ty
- [x] `npm init` (rewrote `package.json` with proper name + scripts)
- [x] Install: `@11ty/eleventy@3.1.5`, `@11ty/eleventy-plugin-rss@3.0.0`, `strftime`
- [x] `package.json` scripts: `dev` (`eleventy --serve`), `build` (`eleventy`), `clean`, `debug`
- [x] Create `eleventy.config.mjs` (ESM — required because `eleventy-plugin-rss@3` is ESM-only):
  - `dir: { input: '.', output: '_site', includes: '_includes', data: '_data' }`
  - passthrough copy: `assets/`, `CNAME`, `.nojekyll`
  - default template engine: `liquid` (matches existing Jekyll templates)
  - RSS plugin registered
  - filters wired up in Phase 5
- [x] Create `.eleventyignore`: ignores `node_modules`, `_site*`, `.claude`, `Gemfile*`, `_config.yml`, `MIGRATION_CHECKLIST.md`, etc.
- [x] **Create `.nojekyll`** in repo root (prevents GitHub Pages from running Jekyll over output)
- [x] Smoke test: `npx @11ty/eleventy --dryrun` — config loads, plugin loads, fails on missing layouts (expected; Phase 3 fixes)

## Phase 2 — global data
- [x] Create `_data/site.json` with all `_config.yml` values (`title`, `description`, `email`, `phone`, `url`, `baseurl: ""`)
- [x] Keep `_config.yml` in place until Phase 13 final cleanup
- [ ] **Carry-over**: `{{ site.time | date: '%Y' }}` in `footer.html` — Jekyll auto-var; replace in Phase 3 (either inline `now` in Liquid, or convert `_data/site.json` → `_data/site.js` with dynamic `time: new Date()`)
- [ ] Final cleanup (Phase 13): delete `_config.yml`, `Gemfile`, `Gemfile.lock`

## Phase 3 — layouts & includes
- [x] Create `_includes/layouts/` directory
- [x] Move `_layouts/home.html` → `_includes/layouts/home.html`
- [x] Move `_layouts/page.html` → `_includes/layouts/page.html`
- [x] Move `_layouts/post.html` → `_includes/layouts/post.html`
- [x] Move `_layouts/demo/corsair.html` → `_includes/layouts/demo/corsair.html`
- [x] Delete empty `_layouts/`
- [x] Register layout aliases (`home`, `page`, `post`, `demo/corsair`) so existing frontmatter `layout: x` keeps working
- [x] Convert all 31 post `date:` fields from Jekyll `2025-01-13 10:00:00 +0400` to ISO-8601 `2025-01-13T10:00:00+04:00` (LiquidJS / Luxon parser strict)
- [x] Rewrite all 59 `{% include /path %}` calls to `{% include "path" %}` (LiquidJS requires quoted paths and rejects leading slash)
- [x] Register no-op `relative_url` filter (baseurl is empty, so identity is correct)
- [x] First successful build: `npx eleventy --output=_site_11ty` → 177 files in 0.47s
- [x] Add `_site_11ty/` to `.gitignore` and `.eleventyignore`
- [ ] **Carry-over to Phase 5**: `{{ site.time | date: '%Y' }}` in `footer.html` not yet handled
- [ ] **Carry-over to Phase 4**: footer/sidebar menus render empty because `site.data.menu.*` resolves to `undefined`

## Phase 4 — global template renames
- [x] `site.data.` → `` across all menu / layout / corsair files (24 files touched)
- [x] `site.posts` → `collections.posts reversed` (LiquidJS for-loop modifier; covers both `newsroom.html` and the homepage `limit:9` block)
- [x] **Discovered**: 11ty doesn't read `.yml` data files by default. Installed `js-yaml`, registered `addDataExtension("yml,yaml", ...)`. Without this every menu / corsair data ref is `undefined`
- [x] `relative_url` already a no-op shim from Phase 3
- [x] Build verified: menus render with all items, corsair demo loads data
- [ ] **Carry-over**: `collections.posts` is still empty until `_posts/_posts.json` adds `tags: posts` (Phase 6)

## Phase 5 — date filter shim
- [x] Register `date` filter in `eleventy.config.mjs` using `strftime` package as a drop-in for Jekyll's date filter (accepts Date or ISO string)
- [x] Convert `_data/site.json` → `_data/site.mjs` with dynamic `time: new Date()` getter (handles `site.time` carry-over from Phase 2)
- [x] Add `eleventy` config to `.claude/launch.json` for browser preview
- [x] Verified all 4 formats in real build + browser: `%Y` (footer 2026), `%B %d, %Y` (post sidebar), `%H:%M` (corsair refresh), `%d.%m.%Y` (newsroom — confirmed via post.html template, list itself empty until Phase 6)
- [x] No build errors, no console errors

## Phase 6 — posts collection & permalinks
- [x] Create `_posts/_posts.json` with `layout: post` and `permalink: /newsroom/{{ page.fileSlug }}/`
- [x] Define `posts` collection programmatically in config (not via `tags: posts`) so frontmatter `tags` aren't polluted with the technical tag
- [x] **Discovered**: 11ty `page.*` only exposes built-ins (url, fileSlug, date). Custom frontmatter fields like `page.title`, `page.cover`, `page.category`, `page.tags`, `page.remark`, `page.offset` had to be rewritten as top-level (`{{ title }}` etc.) across all layouts, includes, and 11 posts
- [x] **Discovered**: collection items expose frontmatter under `post.data.*`, not `post.*` — fixed in `index.html` and `newsroom.html`
- [x] **Discovered**: LiquidJS for-loop applies `limit:9` BEFORE `reversed`, opposite of expected. Switched homepage to `assign recent = collections.posts | reverse` then iterate with `limit: 9`
- [x] **Discovered**: js-yaml parses `tags: kitchen design` as a single string (Jekyll splits on spaces). Rewrote 21 posts to YAML flow arrays `tags: [kitchen, design]`
- [x] All 31 post URLs match Jekyll baseline byte-for-byte (`diff` empty)
- [x] All 31 newsroom dates match Jekyll byte-for-byte
- [x] Newsroom titles, tags, categories all match Jekyll byte-for-byte
- [x] Homepage featured 9 posts match Jekyll byte-for-byte and order

## Phase 7 — section pages
- [x] Layout aliases from Phase 3 mean frontmatter `layout: page` keeps working unchanged across `services/`, `tools/`, `about/`, `legal/`, and `about/newsroom/`
- [x] `if/elsif offset == "..."` block in `page.html` renders correctly under LiquidJS (was `page.offset`, fixed in Phase 6)
- [x] All 72 generated URLs match Jekyll baseline byte-for-byte
- [x] Per-section URL link diff vs Jekyll is empty for `services/`, `tools/`, `about/contacts`, `about/principles`, `legal/terms`
- [x] **Side fix**: corrected `mailto: ` typo (extra space) in `legal/terms/index.md` — markdown-it strict, Jekyll tolerated

## Phase 8 — corsair demo (highest QA risk)
- [x] All 9 demo pages render and load corsair YAML data correctly
- [x] **Discovered**: LiquidJS `divided_by` always does float division, Jekyll's does integer division when both operands are integers. Pattern `{{ x | divided_by: 10 }}.{{ x | modulo: 10 }}M` rendered as `9.1.1M` — completely broken
- [x] **Discovered**: Jekyll/Ruby integer division floors (negatives go more negative), JavaScript `Math.trunc` truncates toward zero. Difference visible on `-163%` vs `-162%`
- [x] Registered Jekyll-compatible `divided_by` and `modulo` shims in config — fixed all 113 callsites at once
- [x] Visual check: corsair main page numbers match (`9.1M`, `14.7M AED`, `4.2M / 4.5M`, `95% / 103% / 104% / 84%`)
- [x] Remaining diffs vs Jekyll baseline are non-material:
  - Sort tie-breaker order for 2 invoices with identical `issued` date (Ruby sort non-stable; LiquidJS stable — Jekyll behavior is undefined here)
  - `40.0%` rendered as `40%` because js-yaml doesn't preserve float precision (JS Number doesn't distinguish int/float). Cosmetic
- [x] `assets/js/demo/corsair.js` carried through via assets passthrough

## Phase 9 — feed, sitemap, 404, robots
- [x] `feed.liquid` outputting `/feed.xml` — Atom format, 31 entries (Jekyll-feed had 10, but no clamp by default makes more sense)
- [x] **Discovered**: `eleventy-plugin-rss` v3 only registers filters for Nunjucks. Imported `dateToRfc3339` and `getNewestCollectionItemDate` and re-registered them as Liquid filters
- [x] `sitemap.xml.liquid` — 73 URLs (all pages including newsroom posts and corsair demo, excluding feed/sitemap themselves via `eleventyExcludeFromCollections`)
- [x] `robots.txt` (new) — passthrough, points crawlers to `/sitemap.xml`
- [x] `404.html` — auto-renders through `layout: page` (frontmatter already had `permalink: /404.html`)

## Phase 10 — CSS
- [x] `assets/css/feedback.scss` carried through via `assets/` passthrough — same as Jekyll, no compilation, the `.scss` extension is cosmetic
- [x] All 6 local stylesheets resolve in `_site_11ty/`: `rare.css`, `feedback.scss`, `themes/black.css`, `themes/rareBlack.css`, `modules/home.css`, `demo/corsair.css`
- [x] Phase closed without code changes — assets passthrough from Phase 1 covers it

## Phase 11 — deploy
- [ ] **Important context**: `_site/` is currently *committed* to the repo (178 files). Current prod is GitHub Pages serving built HTML from the branch. Cutover must replace this with a proper build pipeline before merging to main.
- [ ] `git rm -r --cached _site/` once new pipeline is wired up (it's already in `.gitignore`)
- [ ] Decide: GitHub Pages + Actions, or Cloudflare Pages
- [x] **Decision: GitHub Pages + Actions**
- [x] `.github/workflows/deploy.yml` created — checkout → setup-node@v4 (reads `.nvmrc`) → `npm ci` → `npx @11ty/eleventy` → `actions/configure-pages@v5` → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`
- [x] Triggers: push to `main`, plus `workflow_dispatch` for manual reruns
- [x] Verified locally that `npm ci && npx @11ty/eleventy` produces `_site/` with `.nojekyll`, `CNAME`, `feed.xml`, `sitemap.xml`, `robots.txt`, `index.html`, `404.html`
- [ ] **Manual cutover steps for the user (cannot be done from CLI):**
  1. Merge `migrate-to-11ty` → `main` (squash-merge recommended)
  2. GitHub → Settings → Pages → Source: switch from "Deploy from a branch" to "GitHub Actions"
  3. Actions tab → run "Build and deploy to GitHub Pages" via `workflow_dispatch` once to confirm green
  4. Visit https://raredigits.io and spot-check
  5. Open a follow-up PR with `git rm -r _site/` and a `git rm Gemfile Gemfile.lock _config.yml` to clean up Jekyll legacy (Phase 13)

## Phase 12 — QA
- [ ] `npx @11ty/eleventy && diff -r _site_jekyll _site` — review diff
- [ ] Spot-check in browser:
  - [ ] Home `/`
  - [ ] Newsroom list `/about/newsroom/`
  - [ ] Random sample of posts (incl. `2023-05-17-UAE-license` which uses `{{ page.cover }}`)
  - [ ] Hamburger menu, footer menus in both themes (light + black)
  - [ ] Corsair demo: all 9 screens + 3 modals
  - [ ] Cookie consent banner
  - [ ] WhatsApp button on home
  - [ ] Mobile breakpoints: 320 / 768 / 1024
- [ ] Optional: wire up Pagefind (already referenced in 2025-10-29 post)
- [ ] `curl https://raredigits.io/feed.xml` after deploy — RSS validator
- [ ] Run `lychee` (or similar) for outbound link 404 check

## Phase 13 — finalization
- [ ] Delete `_site_jekyll/`, `Gemfile*`, original `_layouts/`, `_config.yml`
- [ ] Update `README.md` with new commands (`npm run dev`, `npm run build`)
- [ ] Update `.claude/CLAUDE.md` if it references Jekyll/bundler
- [ ] Squash-merge `migrate-to-11ty` → `main`, tag `v2-eleventy`
- [ ] Archive last Jekyll snapshot somewhere recoverable in case of rollback

## Don't-forget list
- [ ] **`.nojekyll`** in repo root — without it GitHub Pages re-runs Jekyll over the output and breaks underscore-prefixed paths
- [ ] **`CNAME`** must end up in `_site/` (passthrough), or the custom domain detaches
- [ ] **`baseurl: ""`** in `_data/site.json` so the `relative_url` shim doesn't double-prefix
- [ ] **Timezones** — Luxon is strict; verify post dates don't shift a day after build
- [ ] **YAML encoding** — `_data/menu/*.yml` already UTF-8, leave alone
- [ ] **CDN/Cloudflare cache** — purge after cutover, otherwise floating 404s
