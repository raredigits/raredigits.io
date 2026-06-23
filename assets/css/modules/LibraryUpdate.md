# Library Update — gaps found while building the demo-app module

Running list of things the **rare-styles** library is missing or got wrong,
discovered while building `app.css` (the demo-app shell). Each entry says what
we needed, what we did locally as a stopgap, and where that stopgap lives so it
can be ripped out once the library covers it.

Tag in `app.css`: search for `LIB:` comments to find every local workaround.

---

## Component model (accepted)

Hybrid, not utility-first and not pure-semantic:

1. **Component owns its layout.** A reusable block (`footer-container`,
   `app-toolbar`) carries its own grid, alignment, columns, spacing and
   responsive behaviour. The consumer writes **one semantic class** and it works.
2. **Utilities tune locally.** Single-purpose classes (`padding-xs`, `center`,
   `justify-end`) nudge a component per-instance: `class="footer-container padding-xs"`.
   They are the escape hatch, not the assembly method — no long utility chains
   reconstructing a component in markup.
3. **Tokens carry shared values.** Spacing/colour/size come from CSS custom
   properties (`--space-*`, `--action-size`), so a value is defined once.

"Don't repeat" means *don't ship the same block in N files* — a component
re-stating `align-items: center` is owning its layout, not duplication.

## How we stage proposed utilities (forward-compat shim)

When the demo needs a primitive the library lacks, we **implement it in `app.css`
under the exact name and behaviour it should have in rare-styles**, in the
`PROPOSED rare-styles utilities` block at the bottom of the file, and use that
class in the demo right away.

When the utility later lands in the library, we **delete the local copy** and the
demo keeps working unchanged — the class name resolves to the library version.
That is the whole point: stage here, migrate by deletion.

Each shimmed utility is tagged `LIB:` and cross-referenced to its entry below.

**Ordering caveat — must be locked with layers in the library.** Today the shim
only beats component defaults because it is declared *below* the components in
the same file (later source order wins at equal specificity). That is incidental.
Once these utilities move into rare-styles, this guarantee disappears — an app
stylesheet that loads after the library, or any reshuffle, breaks tuning like
`footer-container padding-xs`. The library must enforce precedence with
`@layer` (utilities in the last layer), not rely on source order. See #4.

---

## 1. No `justify-content` utilities (only `stretched`)

The library ships `.flex`, `.stretched` (`space-between`) and the grid-level
`.justify-items-*`, but **no flex `justify-content` helpers** — in particular no
`justify-end` / `justify-center` / `justify-start`.

- **Needed:** push the toolbar icon cluster to the trailing edge of its grid span.
- **Staged:** shimmed in `app.css` as `.justify-start/center/end/between/around`
  under their final names (`LIB:justify-end`); the demo uses `.justify-end` on
  `.app-toolbar` today. Delete the shim when these land in rare-styles.
- **Proposed utilities:** `.justify-start`, `.justify-center`, `.justify-end`,
  `.justify-between` (alias of existing `.stretched`), `.justify-around`.

## 2. No mobile `text-align` variants

Base `.center` / `.left` / `.right` exist, but there are **no responsive
variants** (`mobile:left`, `tablet:center`, …), unlike `col-span-*` which do
have them.

- **Needed:** reset the footer CTA/copyright to left-aligned when the columns
  stack on mobile.
- **Staged:** shimmed in `app.css` as `.mobile\:left/center/right` under their
  final names (`LIB:mobile-text-align`); the demo uses `mobile:left` on the
  footer CTA/copyright blocks. The component still owns the mobile grid stack.
- **Proposed utilities:** `mobile:left|center|right`, `tablet:…`, `desktop:…`,
  mirroring the existing responsive `col-span-*` set.

## 3. `col-span-*` responsive overrides lose to base by source order

`col-span-*` and their `mobile:` / `tablet:` / `desktop:` variants all have the
**same specificity** and are emitted in the bundle ordered by N
(`col-span-1`, `mobile:col-span-1`, … then `col-span-2`, …).

Result: a responsive override only wins if its N is **greater** than the base N.
`col-span-4` + `mobile:col-span-6` works (6 > 4); `col-span-10` + `mobile:col-span-5`
does **not** — base `col-span-10` is emitted after `mobile:col-span-5` and wins
even inside the media query.

- **Impact:** responsive narrowing of a wide element silently no-ops.
- **Fix in library:** give the responsive variants higher precedence — either
  order all base spans first then all responsive ones, or bump specificity
  so responsive variants always beat the base set.
- **Where we hit it:** originally tried `col-span-10` + `mobile:col-span-5` on
  the toolbar and the mobile span silently no-opped. We since moved placement
  into the component CSS (`grid-column`), so we no longer rely on these utilities
  here — but the ordering bug is real and will bite anyone who does.

## 4. No layer ordering, so utilities can't reliably tune components

For the agreed model (`class="footer-container padding-xs"` where the utility
nudges a component default) to work, **utilities must win over component rules**.
Today everything is unlayered and decided by source order, so whichever file
loads last wins — fragile, and backwards for an app stylesheet that loads after
the library.

- **Needed:** a utility (`padding-xs`) overriding a component default (`.footer-container`)
  regardless of load order.
- **Fix in library:** adopt `@layer` — e.g. `@layer base, components, utilities;`
  with utilities last. Then a one-class component default is always tunable by a
  utility, at equal specificity, no `!important`.
- **Note:** must be adopted library-wide; mixing layered + unlayered is worse
  than neither (unlayered always beats layered, which would let stray base
  element rules override components — exactly the `button` background bug we hit).

---

## Candidates to promote into the library (not bugs, just reuse)

Generic enough to belong in rare-styles as a proper component module:

- `.app-toolbar` / `.app-toolbar__action` — trailing actions cluster (app-bar
  icon buttons). Themeable via `--action-size`.
