# Rare Digits — Company Reference

*For use in editorial work: writing pressroom posts, product descriptions, pitch copy.*

---

## Who We Are

**Rare Digits Production** — Dubai-based software company, 20 years in SMB and holding-structure automation.

We sell accumulated expertise and pattern recognition, not software. We've seen the mistakes (made some ourselves), and the product is what comes from that. We sit on top of a client's existing ERP, CRM, and accounting stack and make the numbers legible to the people who own the business.

## Target Client

SMB owners, shareholders, and senior managers with P&L responsibility who can't tell from their current systems where the profit went or who's responsible. Holding structures where each entity runs a different system and nobody has a consolidated view.

The **shareholder is the primary buyer** — they understand the value of transparency faster than anyone else in the org chart, and they're more motivated to fix the problem than the people who created it. Senior managers are often the internal champions who feel the pain daily and push for the solution.

## People

- **Dmitry Schnellreich** — COO
- **Vitaly Lvov** — Solutions Architect; handles high-level client problem-solving

Contacts: pr@raredigits.io (press) · hi@raredigits.io (general) · +971 52 87-86-777

## Office

1710 Preatoni Tower, Cluster L, Jumeirah Lakes Towers (JLT), Dubai, UAE · timezone +04:00

Team distributed across: Limassol, Porto, Berlin, Copenhagen, Jakarta, Bali, Tbilisi, Miami, Phuket.

---

## Products

### Corsair HQ *(flagship, 2025→)*
Dashboard and ontology layer over a client's existing systems (ERP, CRM, accounting). Built for shareholders and executives: key customised metrics on one screen, alert system for anomalies. The thing that replaces the three-day CFO report.
→ `/tools/corsair/`

### Jeeves
AI assistant trained on the client's own business data and established KPIs. Answers operational questions in natural language using actual company numbers.
→ `/tools/jeeves/`

### Columbus
CRM add-on for revenue growth. Upsell tooling + mapping new prospects through existing client relationships.
→ `/tools/columbus/`  *(placeholder — verify URL)*

### Fanfare
Loyalty program software. Out-of-the-box coupon and obligation issuance.
→ `/tools/fanfare/`  *(placeholder — verify URL)*

### Forecast
Forecasting add-on using regression on historical metrics. Decomposes a metric (committed / recurring / pipeline-weighted / seasonal), forecasts in probabilistic bands (P10–P90) rather than single numbers, and backtests itself against closed-book actuals. Started life as a forecasting module inside **Atlas ERP** (~Oct 2023) and later spun out into its own product.
→ `/tools/forecast/`

### Watchtower
Blockchain transaction parser and analyser. Tracks capital movement across Web3 networks.
→ `/tools/web3/watchtower/`

### Rare Styles
Open-source design library for business information presentation.
→ `/tools/open-source/styles/`

### Atlas ERP *(legacy)*
Odoo fork, was the flagship product for years. Other products were originally built on top of it — e.g. the forecasting module shipped in Atlas around Oct 2023 later spun out into the standalone **Forecast** product. No longer actively sold — not the most efficient solution for most clients. Mention only in historical context.
→ `/tools/atlas/`

---

## Business Model

**License-based** (per seat, monthly or annual). Annual = 10× monthly rate (2 months free).

| Tier | Monthly | Annual |
|---|---|---|
| Junior Associate | $1,200 | $12,000 |
| Associate | $2,500 | $25,000 |
| Consigliere | $4,800 | $48,000 |
| Mr. Wolf | $7,500 | $75,000 |
| NED | $12,000 | $120,000 |

**Integration & implementation** billed hourly (T&M). This covers the setup phase: connecting existing systems, configuring the environment, making everything talk to everything else.

Switched to fully license-based model across all products in 2024–2025.

---

## Distribution Partners

Distributor sales model adopted in early 2025. In most markets, clients buy through a certified partner.

| Partner | Region | Website |
|---|---|---|
| VAQOSA | MENA | vaqosa.com |
| Bonny One Services | Europe | bonny-one.com |
| PROF IT DESIGN | Asia | prof-it-design.com |

*Former partner: Universal.com (MENA, 2023 — no longer active).*

---

## Editorial Voice

See `_editorial/prompts/newsroom-post.md` for the full writing guide, and `_editorial/prompts/product-page.md` for product (`/tools/`) pages.

Short version: always ironic, never cold. The reader is a peer, not a student.

Our audience values us for lifehacks and non-standard-but-effective solutions — the kind of thing that gets passed between practitioners over coffee, not published in HBR. When we write about a problem, we write like someone who solved it at 11pm on a Tuesday and then told a colleague about it the next morning. Direct, a little tired, genuinely useful.

The irony is friendly: we're laughing with the reader at a shared situation, not demonstrating how clever we are. If it reads like it was written for a board presentation at a $10B company, the altitude is wrong. Our reader needs to act by Thursday, not restructure over six months.

---

## Editorial Workflow: 101 → Release → Demo

Every Rare Digits product decision rests on a piece of **101** — a theoretical principle or piece of business wisdom. The principle is the foundation, and we publish it as such. A feature with no 101 underneath it is probably not load-bearing.

The chain runs in this order, and each link points back to the previous one:

1. **Knowledge** — the principle, published in the pressroom as a **101 insight** (see `prompts/101-post.md`). It stands on its own, free of any product mention. This is the *why*.
2. **Product release** — a pressroom news post announcing how a specific product turns that principle into a feature (or how it already solves it inside the product). It links back to the 101 piece. This is the *what*.
3. **Demo** — a working, no-login demo screen the release points to, where the reader sees the principle made operational. This is the *show me*.

So a 101 article is never just content marketing: it is the stated reason a feature exists. When building or describing a product, find the 101 underneath it first. If you can't, stop and find it before writing the release.
