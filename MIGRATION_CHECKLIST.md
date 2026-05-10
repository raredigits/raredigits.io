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
- [ ] In `.eleventy.js`: register `date` filter using `strftime` package as a shim
- [ ] Do **not** use the default 11ty Luxon date filter — token syntax differs
- [ ] Grep all `date:` calls, confirm shim covers `%B %d, %Y`, `%d.%m.%Y`, `%Y`

## Phase 6 — posts collection & permalinks
- [ ] Create `_posts/_posts.json`:
  ```json
  { "layout": "layouts/post.html", "tags": "posts", "permalink": "/newsroom/{{ page.fileSlug }}/" }
  ```
- [ ] Strip redundant `layout: post` from each post's frontmatter (optional)
- [ ] Build a URL diff table Jekyll vs 11ty for all 31 posts; pin per-post `permalink` where slugify diverges
- [ ] Verify post dates aren't shifted by timezone (posts use `+0400` and `+0800`)

## Phase 7 — section pages
- [ ] Update `layout: page` → `layout: layouts/page.html` (or set up layout aliases in `.eleventy.js`)
- [ ] Same for `about/newsroom/newsroom.html`
- [ ] Verify `if/elsif page.offset == "..."` block in `page.html` renders under LiquidJS

## Phase 8 — corsair demo (highest QA risk)
- [ ] Move/update `_includes/layouts/demo/corsair.html` include paths
- [ ] Walk every page: `demo/corsair/{index,finance,forecast,money,notification,production,reconcile,settings,staff}/index.html`
- [ ] Walk every modal: `umbrella-casefile.html`, `unit-drilldown.html`, `monday-digest.html`
- [ ] Confirm LiquidJS compatibility for `where`, `sort`, `last`, `first`, `slice` filter chains
- [ ] `assets/js/demo/corsair.js` — passthrough only

## Phase 9 — feed, sitemap, 404, robots
- [ ] Create `feed.njk` via `eleventy-plugin-rss`, output `/feed.xml`, validate against jekyll-feed shape
- [ ] Add `sitemap.xml.njk` (new — Jekyll didn't have one)
- [ ] Passthrough `robots.txt` if present, otherwise create
- [ ] `404.html` — add `permalink: /404.html` or passthrough

## Phase 10 — CSS
- [ ] `assets/css/feedback.scss` — passthrough as-is, or rename to `.css` (Jekyll never compiled it)
- [ ] Confirm all `<link rel="stylesheet">` paths resolve in built `_site/`

## Phase 11 — deploy
- [ ] **Important context**: `_site/` is currently *committed* to the repo (178 files). Current prod is GitHub Pages serving built HTML from the branch. Cutover must replace this with a proper build pipeline before merging to main.
- [ ] `git rm -r --cached _site/` once new pipeline is wired up (it's already in `.gitignore`)
- [ ] Decide: GitHub Pages + Actions, or Cloudflare Pages
- [ ] **GitHub Pages path:**
  - [ ] `.github/workflows/deploy.yml`: checkout → setup-node@v4 → `npm ci` → `npx @11ty/eleventy` → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`
  - [ ] Settings → Pages → switch source to "GitHub Actions"
  - [ ] Verify `.nojekyll` is in `_site/` after build
  - [ ] Verify `CNAME` is in `_site/` after build
- [ ] **Cloudflare Pages path:**
  - [ ] Connect repo, build cmd `npx @11ty/eleventy`, output `_site/`, Node 20
  - [ ] Move DNS for raredigits.io to Cloudflare
  - [ ] Disable old GitHub Pages site
- [ ] **Do not switch prod DNS until preview deploy is green**

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
