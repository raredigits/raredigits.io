# Demo data — changelog

Changes to the **Ambitions Inc.** holding demo dataset (`_data/demo/`). Scope: this dataset only.
Map & invariants: `README.md`. Program plan: `../../_editorial/backlog/demo/_index.md`.
Dates are authoring dates (real time), not the fiction's "today" (which is anchored to 2025-03-28).

## 2026-07-07 — Reconciliation fixes + product-coverage layer (deals / Columbus / forecasts)

### Added
- **`scripts/verify-demo-data.cjs`** (`npm run demo:verify`) — the integrity check as code:
  42 checks over arithmetic, AR/AP reconciliation, payments, cashflow continuity & totals,
  intercompany, cross-refs, FX, FY2024 EBITDA anchors, forecast cones/backtests, timeline.
  Exits 1 on failures. Lives outside `_data` so Eleventy doesn't execute it as global data.
- **Spotlights `deals.yml`** — sales pipeline for the Atlas kanban: 5-stage model with
  defaults (new 0.10 → negotiation 0.70), 14 deals incl. one intercompany (Aurora dome,
  held on the CT dispute), a won deal tied to order `SPL-O-2503-101` (952,000 × 1.05 =
  999,600 ✓) and two losses with reasons. +3 `status: prospect` accounts in `clients.yml`
  (Meraas Entertainment, VOX Cinemas, Red Sea Global).
- **Columbus CRM layer for Crisis Theater** — `thread.yml` (10 contacts, 6 relationship
  threads with phases, entries, small things, promises; Aldira is the live quiet-detection
  case — silence since 2025-02-15 breaches its 10-day cadence), `reciprocity.yml`
  (6 ledgers, balance = Σ received − Σ given; DTCM is the overdrawn example),
  `referrals.yml` (5 warm leads with fit scores & ask checklists, 4 testimonials; the
  Meraas permanent-LED lead hands over to `spotlights/deals.yml#deal-2503-021` — group
  cross-sell traced end to end).
- **`forecast.yml` × 4** — per-entity revenue forecast frozen at "today": 9-month
  P10/P50/P90 cone (Apr–Dec 2025), scenario drivers (base/conservative/stretch) and a
  6-month backtest whose `actual` mirrors `cashflow` exactly. Legacy's backtest shows the
  Feb-2025 anchor default unfiltered (MAPE 29.5%) — structural breaks are alert material,
  not forecast material.

### Fixed
- **Crisis Theater AR/AP now reconcile to `cashflow` exactly** (was ~15% / ~119% off):
  Almas Bank sponsorship `TCT-2025-053` paid in tranches (380,200 on the due date,
  `pay-ct-ar-026`); ticketing fees `TIK-2025-0007` partially auto-deducted from escrow
  (102,735, `pay-ct-ap-007`) as its own note already implied. Policy fixed in README:
  disputed = exposure (excluded), `incoming-counterclaim` = contingent receivable
  (excluded from AP).
- `TCT-2024-156` (Aldira) VAT arithmetic: 40,000 → 38,000, total 800,000 → 798,000
  (narrative keeps saying "AED 800K" — rounded speech).
- `jeeves.yml` leftovers of the old timeline: "Sep '25 / Mar '26" → "Sep '24 / Mar '25";
  Aldira overdue days 47 → 36 (= due 2025-02-20 → today); ref `TCT-2025-156` → `TCT-2024-156`.
- USD collections `pay-ct-ar-022/023` were labelled `AED`/`bank-aed-op` → `USD`/`bank-usd`.
- `TCT-2025-053` client was `null` → `almas-bank`.
- **Intercompany balances now mirror** (consolidation-readiness audit): the open Spotlights
  AR `SPL-2025-098` (756K, Lantern Bay LED, due Apr 12) had no counterpart in the buyer's
  books — added the mirror AP invoice + `vend-spotlights` to Crisis Theater, CT `apEnd`
  1,188,030 → 1,944,030 (vendor-run commitment stays 1,188,000 as *external* AP; new
  intercompany commitment line; `unrestrictedNext30d` 1.91M → 2.67M). `group/intercompany`
  transactions now carry `invoice:` + `settlement:` refs; verify enforces
  seller-open == buyer-open per open IC transaction.

### Notes
- Full re-run after all changes: **0 failures, 0 warnings, 42 passes**; holding FY2024
  EBITDA re-derived at 8,783,000 AED (README anchor 8.78M holds).
- Watchtower and Fanfare intentionally untouched — separate domains, separate decision.

## 2026-06-24 — Initial holding dataset

### Added
- **Holding layer** `group/`: `profile`, `entities` (business registry), `intercompany`
  (sales to be eliminated on consolidation), `fx` (monthly USD peg + EUR series).
- **Crisis Theater** (events): `payments`, `fulfillments` (completed works), `commitments`;
  `type`/`fulfillmentLabel` added to `company`.
- **Spotlights Ltd** (pro-AV distribution) — full dataset: company, products, clients,
  vendors, staff, orders, fulfillments (shipments), invoices, payments, cashflow, targets,
  alerts, commitments, jeeves.
- **Legacy Development** (commercial real estate) — full dataset incl. `portfolio` (9 assets),
  `debt` (4 facilities, DSCR), `projects`, `tickets`, and monthly `valuation` (asset revaluation).
- **Malermeister LLC** (auto paint, AED+EUR) — full dataset incl. `services` price menu and
  `workorders` with `volumeByMonth` (throughput/mix).
- `commitments.yml` for **all four** entities — upcoming payments KPI (payroll, rent, VAT,
  debt service, FX supplier runs, EUR dividend).
- **Jeeves** advisory layer — `jeeves.yml` per entity with a 6-lens nudge set
  (money / operations / strategy / cfo / sales / hr).
- Data dictionary `README.md`; this changelog.

### Changed
- Renamed data namespace `corsair/` → `crisis-theater/` (the Corsair *product* keeps its URL
  `/demo/corsair/`, layout and includes); templates now read `demo["crisis-theater"]`.
  Sub-files `corsairNav`→`nav`, `corsairKeyPersons`→`keyPersons`.
- Shifted the whole fiction timeline **−1 year**; "today" is now **2025-03-28** (Q1-2025).
- Malermeister work-order volume made realistic (~16 tickets/month at peak, Jun–Sep dip;
  large jobs ~20% private / ~80% rental).

### Fixed
- Crisis Theater `cashflow` 27-month `totals` reconciled to the sum of monthly rows
  (revenue/cogs/gp/opex/ebitda + tax accrual) — they were rendered on the finance screen.

### Notes
- All four entities integrity-checked: cross-refs resolve; order/WO arithmetic holds;
  unpaid AR/AP at "today" ≈ each `cashflow` `arEnd`/`apEnd`; intercompany amounts match.
- Shock window Nov 2024 → Feb 2025 runs through every entity; group stays profitable for the year.
- Jeeves tone of voice, advice scope (incl. lawful tax optimization) and anti-hallucination
  rules for developers: `../../_editorial/backlog/demo/jeeves-spec.md`.
- `_temp/` generators are local scratch (gitignored); the YAML data is the source of truth.

### Next
- Calculated holding **Consolidation API** (sum entity cashflows, eliminate intercompany,
  FX-translate) + wiring the product demos to the dataset
  (`../../_editorial/backlog/demo/wire-up-and-consolidation.md`).
