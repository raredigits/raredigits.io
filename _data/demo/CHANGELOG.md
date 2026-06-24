# Demo data — changelog

Changes to the **Ambitions Inc.** holding demo dataset (`_data/demo/`). Scope: this dataset only.
Map & invariants: `README.md`. Program plan: `../../_editorial/backlog/demo/_index.md`.
Dates are authoring dates (real time), not the fiction's "today" (which is anchored to 2025-03-28).

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
