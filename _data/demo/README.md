# Demo data — Ambitions Inc. holding

Single synthetic dataset that powers all the product demos (Corsair HQ, Atlas ERP,
Forecast, Columbus CRM). Full program plan & decisions: `../../_editorial/backlog/demo/_index.md`.

## What this is

A diversified holding — **Ambitions Inc.** — of four operating businesses across different
industries, sizes and currencies, all described by **one data contract** and rolled up into
**one consolidated view**. North star: a business-management dashboard that works regardless
of company size or accounting software.

## Anchors (keep consistent when editing)

- Reporting currency **AED**; fiction "today" = **2025-03-28** (books closed Q1-2025).
- FX rates → `group/fx.yml` (USD pegged 3.6725; EUR monthly series, spot 3.95).
- Data contract (which file holds what) → `../../_editorial/backlog/demo/schema-contract.md`.

## Layout

```
group/            holding layer: profile, entities, intercompany, fx
crisis-theater/   events / experiential (Dubai, AED) — powers the Corsair screens
spotlights/       pro-AV / LED distribution (AED + USD/EUR imports)
legacy-development/ commercial real estate (AED; large debt; asset revaluation)
malermeister/     auto paint shop (German painters, AED + EUR)
```

Note: `crisis-theater/` is the data namespace; the Corsair *product* demo keeps URL
`/demo/corsair/`, layout `demo/corsair`, includes `_includes/special/demo/corsair/`.
Templates read it as `demo["crisis-theater"]` (hyphenated key, Liquid bracket access).

## Per-entity contract

Common: `company, clients, vendors, staff, invoices, payments, commitments, cashflow,
targets, alerts, fulfillments, forecast, jeeves`. Type-specific: `products/orders/deals`
(distribution); `projects/portfolio/debt/tickets/valuation` (real estate);
`services/workorders` (services); `thread/reciprocity/referrals` (Columbus CRM layer —
Crisis Theater only, per the wire-up decision: Columbus looks at CT).

Product-coverage files (added 2026-07): `spotlights/deals.yml` (Atlas pipeline kanban),
`crisis-theater/{thread,reciprocity,referrals}.yml` (Columbus Thread / Reciprocity Ledger /
Warm Leads), `<entity>/forecast.yml` × 4 (Forecast app: P10/P50/P90 cone Apr–Dec 2025,
scenario drivers, 6-month backtest).

## Invariants (must stay true)

Machine-checked: `npm run demo:verify` (`scripts/verify-demo-data.cjs`) — run it after any
edit; it must exit with 0 failures.

- Each entity's unpaid AR/AP at "today" = its `cashflow` `arEnd`/`apEnd` **exactly**.
  Policy: `disputed` items are exposure, not balance (excluded); the insurance
  `incoming-counterclaim` in CT's payable ledger is a contingent receivable (excluded from AP);
  open FX items translate at `group/fx` spot.
- Order / work-order `subtotal` = Σ lines; `vat` = 5% (0 = zero-rated/exempt, keep the note);
  `total` = subtotal + vat. Invoice `paid` = Σ its `payments` records.
- Intercompany order amounts = the matching `group/intercompany` transactions.
- `cashflow.ebitda` is **pre-interest**; debt service sits below it (see Legacy `debt.yml`).
- Asset revaluation (`legacy-development/valuation.yml`) is non-cash — NOT in EBITDA/consolidation.
- All cross-references resolve (clients/products/staff/invoices/loans/deals/contacts/...).
- `forecast.yml`: p10 ≤ p50 ≤ p90 per month; `backtest.months[].actual` mirrors `cashflow`
  revenue exactly; `errorPct` and `summaryMapePct` recompute from the rows.
- `reciprocity` balance = Σ received − Σ given weights; deal stages ∈ `stageDefaults`.
- Timeline is anchored to 2025 — do not reintroduce 2026 fiction (footer copyright `{{ currentYear }}` is real
  and stays). Contractual forward dates (leaseEnd, loan maturity, re-let scenarios) may extend past "today".

## Holding EBITDA (sanity check)

FY2024 ≈ **+8.78M AED** (CT +1.79, Spotlights +1.13, Legacy +5.40, Malermeister +0.46).
Shock window Nov 2024 → Feb 2025; Legacy's anchor-tenant default craters Feb 2025; group
stays positive over the year. Narrative: `../../_editorial/backlog/demo/shock-scenario.md`.

## Jeeves (the advisory layer)

Each entity has `jeeves.yml` with a **6-lens** nudge set for the owner's dashboard:
money / operations / strategy / cfo / sales / hr. Tone of voice, scope of advice
(incl. lawful tax optimization) and **anti-hallucination rules** for developers:
`../../_editorial/backlog/demo/jeeves-spec.md`.

## Status & next step

All four entities are built and integrity-checked (`npm run demo:verify` — 0 failures).
Jeeves nudges, `commitments`, and the product-coverage layer (Atlas `deals`, Columbus
`thread/reciprocity/referrals`, Forecast `forecast` × 4) are in — the dataset now carries
everything the tools docs promise for Atlas / Columbus / Forecast / Corsair.
**Next:** wiring the product demos to the dataset + the holding consolidation views.
Start from `../../_editorial/backlog/demo/wiring-handbook.md` — screen→data map, acceptance
numbers, known hardcode drifts. Reference consolidation: `npm run demo:consolidate`
(`scripts/consolidate-demo-data.cjs` — sums cashflows, eliminates intercompany, nets open
IC balances). Watchtower and Fanfare are intentionally out of scope for this dataset.
