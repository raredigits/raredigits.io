# Prompt: Pressroom Post

## Editorial Voice

Reference: Matt Levine, Bloomberg Money Stuff — but grounded in 20 years of SMB automation work.

The key register to hit: **a seasoned practitioner who has seen this exact situation play out dozens of times and knows precisely how it ends.** Not a clever observer from the outside. Someone who was in the room when the decision was made, watched the project slip from 3 months to 18, and helped clean up the aftermath.

What this sounds like in practice:

- **Accumulated pattern recognition.** "Here's how this always goes" — specific, past-tense scenarios that ring true because they're real. The reader recognizes the situation instantly.
- **Quiet confidence, not arrogance.** The tone isn't "look how smart we are." It's "we've done this enough times that we stopped being surprised." There's warmth in that — it means the reader isn't alone in having lived through it.
- **Earned irony.** The humor comes from recognition, not cleverness. We're not mocking corporate culture from a distance — we've been inside it, billed hours in it, inherited other people's decisions in it.
- **The insight lands because it's hard-won.** When we say "a simple API call," we say it because we wrote the 6-month integration proposal that preceded it. We know what the alternatives actually cost.

Core editorial stance: most enterprise software problems are solved the expensive way not because there's no simple solution, but because nobody with the seniority to make the decision has time to find out. We say this out loud because we've spent 20 years being the people who find out.

The primary reader is a **shareholder, founder, or senior manager with P&L responsibility** — a CFO, COO, or divisional head who answers for the numbers. They are not interested in features. They are interested in: where is the money, who is responsible for the current situation, and why does the report take three days to produce. The shareholder buys; the senior manager often initiates the conversation. Write for both, but let the shareholder's perspective drive the framing.

## Company Context

**Rare Digits** — Dubai-based software company, 20 years in SMB and holding-structure automation.

We sell accumulated expertise, not software. We've seen the mistakes (made some ourselves), and the product is the pattern recognition that comes from that.

**What we actually do:** We sit on top of a client's existing ERP, CRM, and accounting stack and make the numbers legible to the people who own the business. One screen, key metrics, alert system. The insight that used to take a CFO three days now takes a shareholder three minutes.

**Target client:** SMB owners, shareholders, and senior managers (CFO, COO, divisional heads) who can't tell from their current systems where the profit went or who's responsible. Holding structures where each entity runs a different system and nobody has a consolidated view. The shareholder is the primary buyer — they understand the value of transparency faster than anyone else in the org chart. Senior managers are the internal champions who feel the pain daily and push for the solution.

**Office:** Preatoni Tower, Cluster L, JLT, Dubai, UAE. Team distributed across Limassol, Porto, Berlin, Copenhagen, Jakarta, Bali, Tbilisi, Miami, Phuket.

**Sales model:** Per-seat licensing (monthly or annual). Integration and implementation billed T&M (hourly). In MENA, Europe, and Asia — sold through certified distribution partners.

**Distribution partners:**

- VAQOSA — MENA
- Bonny One Services — Europe
- PROF IT DESIGN — Asia

## Products

**Corsair HQ** *(flagship, 2025→)* — Dashboard and ontology layer over a client's existing systems (ERP, CRM, accounting). Built for shareholders and executives: key customised metrics on one screen, alert system for anomalies. The thing that replaces the three-day report.

**Jeeves** — AI assistant trained on the client's own business data and KPIs. Answers operational questions in natural language using actual company numbers.

**Columbus** — CRM add-on for revenue growth. Upsell tooling + mapping new prospects through existing client relationships.

**Fanfare** — Loyalty program software. Out-of-the-box coupon and obligation issuance.

**Forecast** — Forecasting add-on using regression on historical metrics.

**Watchtower** — Blockchain transaction parser and analyser. Tracks capital movement across Web3 networks.

**Rare Styles** — Open-source design library for business information presentation.

**Atlas ERP** *(legacy, Odoo fork)* — Was the flagship product for years. Now de-emphasised; other products are built on top of it. We no longer actively sell it — it's not the most efficient solution for most clients. Mention only in historical context.

## People

- **Dmitry Schnellreich** — COO. Can be named in posts.
- **Vitaly Lvov** — Solutions Architect. Handles high-level client problem-solving. Can be named in posts.
- Otherwise: "the client," "one CFO we know," "the project manager who left in month four."

## Front Matter Template

```yaml
---
title:  "Post Title Here"
date:   YYYY-MM-DDTHH:MM:SS+04:00
permalink: /pressroom/Slug-Here/
category: Release | Internal Affairs | Industry | Partnership
labels: [tag1, tag2]
---
```

**Categories:**

- `Release` — product launches, new features
- `Internal Affairs` — company news, office, team
- `Industry` — market commentary, trends, practitioner insights
- `Partnership` — integrations, clients, distributor announcements

**Common labels:** `automate`, `kitchen`, `blessing`, `erp`, `ai`, `finance`, `hr`, `crm`, `sales`, `marketing`, `partnership`, `web3`

**Additional labels for principles posts:** `principles`, `101`

## Post Structure

1. **The pattern** — open with a scenario the reader has lived. Specific enough to be real: an industry, a job title, a familiar Tuesday afternoon. No product mention, no company mention.
2. **How it always goes** — trace the typical trajectory with insider precision. Use present or past tense, not hypothetical. The project manager leaves at month four. The vendor recommends a new module. The spreadsheet becomes load-bearing.
3. **What we've learned** — the hard-won insight, stated plainly. One or two sentences. This is where the 20 years lives.
4. **The actual thing** — what we built or did. Specific. If there's a query or API call that proves the point, show it. The contrast with step 2 should be almost uncomfortable.
5. **Callout** — a distilled observation that sounds like it came from someone who's cleaned up this mess before: `<div class="highlight">The sentence here.</div>`
6. **Closing** — practical, low-pressure. What the reader can do with this information. Link to product only if it genuinely helps: `[Product Name](/tools/product/)`.

For partnership announcements, use the boilerplate block at the end:

```html
<div class="boilerplate">
    <p>About [Company]: ...</p>
</div>
```

## Style Rules

- Write the lede about the situation, not the company and not the product.
- Specificity signals experience. Finance, logistics, HR, retail — name the industry when it helps. "One CFO we know" is better than "many companies."
- "We've seen this" is more authoritative than "studies show." Use it.
- Don't editorialize about what *might* go wrong. Say what *does* go wrong, in present tense.
- Irony is welcome; sarcasm at the reader's expense is not. The reader is the hero of this story, not the cautionary tale.
- When revising old posts, preserve the product positioning and commercial context of the publication year unless the goal is explicitly to repurpose the post for current positioning.
- Avoid: "excited," "thrilled," "game-changer," "leverage," "synergy," "seamless," "robust," "end-to-end," "best-in-class."
- Never write "In today's fast-paced business environment."
- No em-dashes. A comma, colon, or full stop does the job; LLM prose overuses the dash. (En-dashes in true ranges like P10–P90 are fine.)
- No bullet points in body copy. If it's the substance of the argument, write it as prose.
- No "it's not X, it's Y" / "X, not Y" antithesis as a rhetorical crutch — it's the reflex of marketing decks and Twitter threads. State the point plainly.
- Prefer concrete, lived examples and plain analogies the reader already trusts. Lead from the psychology of the people in the scene: the intuitive wrong move first, then the counterintuitive one that works.
- Length: 400–700 words for announcements, 200–400 for company notes, 600–900 for industry posts.

For **product pages** specifically (the `/tools/` pages), see `_editorial/prompts/product-page.md` for the full arc and rules.

For any **markup** in a post (callouts, boilerplate, embeds), see `_editorial/prompts/markup.md`: use Rare Styles classes, never invent new ones inline; genuinely new styles go in `assets/css/modules/`.

## Prompt to Claude

```text
Write a Rare Digits pressroom post about: [TOPIC]

Category: [Release / Internal Affairs / Industry / Partnership]

The pattern this addresses (how it usually goes, in practice):
- [describe the typical situation the reader has lived through]
- [what normally happens next]
- [what it costs — in time, money, or dignity]

What we've learned after doing this many times:
- [the hard-won insight]

Key facts about this specific post:
- [fact 1]
- [fact 2]
- [fact 3]

Voice: a seasoned practitioner, 20 years in SMB automation. Matt Levine register —
simple, warm, quietly ironic. Starts with the pattern, not the product.
The reader should feel: "someone finally said this out loud."
Include a permalink slug suggestion.
```
