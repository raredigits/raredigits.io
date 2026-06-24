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
targets, alerts, fulfillments, jeeves`. Type-specific: `products/orders` (distribution);
`projects/portfolio/debt/tickets/valuation` (real estate); `services/workorders` (services).

## Invariants (must stay true)

- Each entity's unpaid AR/AP at "today" ≈ its `cashflow` `arEnd`/`apEnd`.
- Order / work-order `subtotal` = Σ lines; `vat` = 5%; `total` = subtotal + vat.
- Intercompany order amounts = the matching `group/intercompany` transactions.
- `cashflow.ebitda` is **pre-interest**; debt service sits below it (see Legacy `debt.yml`).
- Asset revaluation (`legacy-development/valuation.yml`) is non-cash — NOT in EBITDA/consolidation.
- All cross-references resolve (clients/products/staff/invoices/loans/...).
- Timeline is anchored to 2025 — do not reintroduce 2026 fiction (footer copyright `{{ currentYear }}` is real and stays).

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

All four entities are built and integrity-checked; Jeeves nudges and `commitments` (AR/AP +
upcoming payments KPI) are in. **Next:** the calculated holding **Consolidation API** (sum
entity cashflows, eliminate intercompany, FX-translate) + wiring the product demos to the
dataset — see `../../_editorial/backlog/demo/wire-up-and-consolidation.md`.
