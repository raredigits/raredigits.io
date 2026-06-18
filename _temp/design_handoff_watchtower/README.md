# Handoff: Watchtower — Blockchain Network Monitor

## Overview
Watchtower is an analytics dashboard for monitoring the health of a Proof-of-Stake
blockchain network. It is built for **analysts / researchers** and is organized around
**period-based analytics** (24H / 7D / 30D), not a live realtime tick. The prototype
monitors a single fictional PoS network — **Helios (HLX)** — so no real brand/UI is copied;
swap in your real network + data source on implementation.

It has four screens (Overview, Transactions, Staking, Alerts) plus three switchable
Overview layouts (Grid / Briefing / Dense).

## About the Design Files
The files in this bundle (`Watchtower.dc.html`, `support.js`) are **design references created
in HTML** — a prototype showing the intended look, layout, and behavior. They are **not
production code to copy directly**.

`Watchtower.dc.html` is a "Design Component": markup + a `class Component` logic block, run by
the `support.js` runtime. Treat it as an executable spec. The task is to **recreate these
designs in your target codebase** (React, Vue, Svelte, SwiftUI, etc.) using your established
patterns, component library, charting library, and data layer. If no codebase exists yet,
pick the most appropriate stack (a React + TypeScript SPA with a charting lib such as Recharts/
visx/ECharts is a natural fit) and implement there.

All mock data is generated deterministically in the logic class (`renderVals()` and helpers like
`mkSeries`, `rng`). Replace these with real RPC/indexer queries.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are defined. Recreate the
UI to match, using your codebase's libraries. Charts in the prototype are hand-built inline SVG
(`mkSpark`, `mkMultiArea`, `mkBars`, `mkDonut`, `mkRing`) — you should reproduce the same chart
*types and styling* with a proper charting library rather than porting the SVG math.

---

## Design Tokens

### Color
| Token | Hex | Usage |
|---|---|---|
| `bg` | `#f7f8fa` | App background |
| `surface` | `#ffffff` | Cards, sidebar, panels |
| `border` | `#ebedf2` | Card borders |
| `border-hairline` | `#f3f4f7` / `#f0f1f5` | Table row dividers / chart gridlines |
| `ink` | `#1a1d23` | Primary text, active nav text, dark buttons |
| `ink-2` | `#3a4150` / `#5b6473` | Secondary text |
| `ink-3` | `#8a93a3` | Muted labels |
| `ink-4` | `#a3abb8` / `#b6bdc8` | Faint captions, timestamps |
| `primary` | `#5b54f0` | Brand accent, charts, progress bars, links (`#4b40e0` for active nav text, `#5b54f0` link) |
| `primary-soft` | `#eef0fe` | Active nav bg, info badges |
| `teal` (secondary series) | `#19b3a6` | Outbound series in flow charts |
| `positive` | `#16a34a` | Up deltas, healthy status, staking line |
| `positive-soft` | `#e7f6ec` | Positive badge bg |
| `negative` | `#dc2626` | Down deltas, critical alerts, exchange inflow |
| `negative-soft` | `#fdeaea` | Negative badge bg |
| `warning` | `#d97706` | Watch status, warning alerts |
| `warning-soft` | `#fdf2e3` / `#fdf2e3` | Warning badge bg |
| nav hover | `#f2f3f7` | Nav item / chip hover |
| row hover | `#fafbfc` | Table row hover |

Sidebar network avatar gradient: `linear-gradient(135deg,#5b54f0,#8b7dfb)`.

### Typography
- **UI font:** `'IBM Plex Sans'` (weights 400/500/600/700), fallback `system-ui, sans-serif`.
- **Numeric / mono font:** `'IBM Plex Mono'` (400/500/600) — used for ALL numbers, hashes,
  addresses, deltas, timestamps, period labels.
- Loaded from Google Fonts.

Type scale (size / weight):
- Page title (topbar): 19px / 700, letter-spacing −.02em
- Card title: 14px / 600 (13px in Dense layout)
- KPI value: 27px / 600 mono (25px tx/staking, 21px Dense), letter-spacing −.02em
- Big numeric (health score, donut center): 22–30px / 600 mono
- Body / table cell: 12.5–13px / 400–500
- Label / caption: 11–12px / 500, color `ink-3`
- Table header: 11px / 600, uppercase, letter-spacing .04em, color `ink-4`
- Delta badge / mono small: 11.5px / 600 mono

### Spacing, radius, shadow
- Page padding: `24px 30px 40px`; topbar padding `16px 30px`.
- Grid/flex gaps: 16–18px between cards, 14–16px in Dense.
- Card padding: 18–22px (14–18px Dense).
- Radius: cards `14px` (12px Dense), buttons/badges `8–10px`, pills `20px`, status dots `50%`,
  small icon tiles `6–9px`.
- Card shadow: `0 1px 2px rgba(20,25,40,.04)`.
- Card border: `1px solid #ebedf2`.

### Animations / keyframes
- `wt-fade`: `opacity 0→1` + `translateY(7px→0)`, `.4s ease` — KPI cards on mount.
- `wt-pulse`: `opacity 1→.3→1`, `2.4s ease-in-out infinite` — the green "live" status dot.
- Custom scrollbar (`.wt-scroll`): 11px, thumb `#d4d9e2`, hover `#bcc3cf`.

---

## Layout Shell (all screens)
Two-column flex, `min-height:100vh`:
- **Sidebar** — fixed `248px`, white, right border, `position:sticky; height:100vh`. Top to bottom:
  logo lockup (34px dark rounded-square shield icon + "Watchtower / network monitor"),
  network selector card (gradient "H" avatar + "Helios / HLX · PoS" + pulsing green dot),
  nav (4 items), and a bottom user row ("Research desk / analyst workspace").
- **Main** — `flex:1`, `height:100vh; overflow-y:auto`. Sticky translucent topbar
  (`rgba(247,248,250,.82)` + `backdrop-filter:blur(10px)`, bottom border) containing:
  page title + caption (left), a search field placeholder (`search address / tx…`), and the
  **period segmented control** (24H / 7D / 30D). Below: the active screen's scrollable content.

### Navigation (sidebar)
Items: **Overview, Transactions, Staking, Alerts**. Each is a full-width button, 9×12px padding,
9px radius, 13.5px/500, with a 18px stroke icon (grid / swap-arrows / hexagon-layers / bell).
Active item: bg `#eef0fe`, text `#4b40e0`. Hover: bg `#f2f3f7`. **Alerts** shows a red count
badge (`3`) — mono 11px/600, bg `#fdeaea`, text `#dc2626`, pill radius.

### Period segmented control (topbar)
Three buttons in a `#eef0f3` track (3px padding, 10px radius). Active button: white bg,
shadow `0 1px 2px rgba(20,25,40,.12)`, text `#1a1d23`. Inactive: transparent, text `#8a93a3`.
Labels mono 12.5px/600. Changing the period regenerates all series & KPIs.

---

## Screens / Views

### 1. Overview
Purpose: at-a-glance network health & flow. Has a **Layout switcher** (small segmented control
labeled "Layout": Grid / Briefing / Dense; active = dark `#1a1d23` bg / white text, inactive =
`#f2f3f7` / `#8a93a3`).

**Layout A — Grid (default):**
- Row 1: 4 KPI cards (`repeat(4,1fr)`, 16px gap). Each card: label + delta badge (top row),
  big mono value, a 34px sparkline area chart, and a sub caption. KPIs: *Inbound tx, Outbound tx,
  Active addresses, Staking ratio*.
- Row 2: `2fr / 1fr`. Left = **Transaction flow** card (two-series area chart, inbound `#5b54f0`
  vs outbound `#19b3a6`, legend top-right, footer with Inbound/Outbound/Net totals). Right =
  **Network health** card (circular progress ring, score `86 /100` centered, then 4 signal rows:
  Block production 99.98%, Validator uptime 99.2%, Finality time 5.8s, Mempool pressure
  *elevated* (amber)).
- Row 3: `1fr / 1fr`. Left = **Decentralization** (donut + Nakamoto coefficient `19` centered,
  top-5 validator stake list with color swatches). Right = **TVL & DeFi activity** (value
  `$4.8B` + delta, single-series area chart, protocol breakdown bars: Helix DEX, Lumen Lend,
  Orbit Staking, Nova Vaults).
- Row 4: `2fr / 1fr`. Left = **Large transactions** preview table (icon+hash+type, amount, USD,
  age; "View all →" navigates to Transactions). Right = **Recent alerts** preview (severity dot,
  title, detail, time; "All →" navigates to Alerts).

**Layout B — Briefing:** narrative top-to-bottom. Hero row `320px / 1fr`: large Health card
(ring + score + signals) beside a 2×2 grid of KPI cards (with sparklines). Then full-width
Transaction flow card (totals inline in header). Then `1fr/1fr` Decentralization + TVL. Then
full-width Large transactions table.

**Layout C — Dense:** max information density. Top: 4 compact KPI cards (no sparkline, smaller).
Then a `repeat(3,1fr)` masonry: Transaction flow (spans 2 cols), Health (1), Decentralization,
TVL (with protocol list), Recent alerts. Then a full-width Large transactions table. Smaller
radii (12px), tighter padding, smaller type.

### 2. Transactions
Purpose: inbound/outbound activity & whale movements.
- 4 KPI cards: *Total transactions, Avg fee (0.0021 HLX), Success rate (99.4%), Avg block size
  (1.84 MB, delta red because elevated)*.
- **Inbound vs outbound volume** card: grouped **bar chart** (`mkBars`), two bars per interval
  (inbound `#5b54f0`, outbound `#19b3a6`), legend top-right, faint gridlines.
- `2.1fr / 1fr` row: **Recent large transactions** full table (columns: Transaction [icon+hash+
  type], From → To [mono truncated addresses], Amount, Value, Age — 10 rows) and **Transaction
  mix** card (category bars: Transfers 62%, DeFi swaps 18%, Staking ops 11%, IBC 6%, Other 3%).

### 3. Staking
Purpose: validator set, staking ratio & rewards.
- 4 KPI cards: *Staking ratio 67.4%, Total staked 412.6M HLX (≈$2.64B), Active validators 175
  (of 220), Avg APR 8.92%*.
- `2.1fr / 1fr` row: **Staking ratio** area chart (positive green `#16a34a`) + **Bonding & rewards**
  list (Unbonding queue 2.1M HLX, Unbonding period 21 days, Pending rewards 48.3K HLX, Slashing
  (30d) 0 events).
- **Validator set** table — top 8 by voting power. Columns: Rank, Validator, Voting power
  (bar + %), Commission, Uptime, Status pill. Status logic: uptime ≥99.5% → *healthy* (green),
  ≥98% → *watch* (amber), else *jailed* (red).

### 4. Alerts
Purpose: anomalies, reorgs & slashing events.
- 4 stat cards with colored indicator: Critical 1, Warning 2, Info 4, Resolved (24h) 12.
- **Alert feed** card. Header has filter chips (All [active dark] / Critical / Warning / Info —
  currently visual only). Each feed row: severity pill (min-width 64px, colored by severity),
  title + uppercase category tag (`#f2f3f7` chip), detail line (max-width 680px), and right-aligned
  timestamp + status (open / monitoring / resolved). 7 seeded entries covering whale inflow,
  mempool spike, missed blocks, staking milestone, resolved reorg, governance proposal, no-slashing.

---

## Interactions & Behavior
- **Sidebar nav** → switches `screen` state, swaps main content.
- **Period control** (24H/7D/30D) → sets `period`; series length changes (24 / 7 / 30 points) and
  all KPIs/charts/totals recompute.
- **Overview layout switcher** → sets `layout` (grid/briefing/dense), only affects Overview.
- **"View all →" / "All →"** links → navigate to Transactions / Alerts.
- **Hover states:** table rows → bg `#fafbfc`; nav items & chips → bg `#f2f3f7`.
- **On-mount:** KPI cards fade/slide in (`wt-fade`); live status dot pulses.
- No realtime polling in the prototype — period-based snapshots. Add data fetching per period on
  implementation (and optionally a refresh interval).

## State Management
- `screen`: `'overview' | 'transactions' | 'staking' | 'alerts'`
- `period`: `'24h' | '7d' | '30d'`
- `layout`: `'grid' | 'briefing' | 'dense'` (Overview only)
- Derived per render from `period`: time-series (inflow, outflow, active, tvl, staking ratio),
  KPI values + deltas, flow totals, large-tx list (seeded), and all charts.
- **Data fetching to add:** per-period aggregates (tx in/out counts, active addresses, fees,
  success rate), staking ratio history, validator set (power/commission/uptime/status), TVL +
  per-protocol breakdown, large transfers feed, and an alerts/anomaly stream. Source from your
  chain's RPC + an indexer (e.g. block explorer API, staking module, DeFi TVL provider).

## Assets
- **Fonts:** IBM Plex Sans + IBM Plex Mono (Google Fonts) — use your app's font pipeline.
- **Icons:** simple inline stroke SVGs (shield, grid, swap-arrows, hexagon-layers, bell, arrows,
  search). Replace with your icon set (Lucide/Heroicons are close matches).
- **Charts:** hand-built SVG in the prototype — reproduce with your charting library.
- No external images.

## Files
- `Watchtower.dc.html` — full prototype: markup + `class Component` logic (mock data + chart
  builders + `renderVals`). The authoritative reference for layout, copy, tokens, and behavior.
- `support.js` — the runtime that executes the Design Component (needed only to *run* the
  prototype locally; not part of the target implementation).

### Running the prototype locally
Serve the folder over HTTP (the runtime is fetched relatively) and open `Watchtower.dc.html`,
e.g. `npx serve .` then open the file — do not open via `file://`.
