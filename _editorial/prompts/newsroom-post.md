# Prompt: Newsroom Post

## Editorial Voice

Reference: Matt Levine, Bloomberg Money Stuff — but grounded in 20 years of enterprise implementation work.

The key register to hit: **a seasoned practitioner who has seen this exact situation play out dozens of times and knows precisely how it ends.** Not a clever observer from the outside. Someone who was in the room when the decision was made, watched the project slip from 3 months to 18, and helped clean up the aftermath.

What this sounds like in practice:

- **Accumulated pattern recognition.** "Here's how this always goes" — specific, past-tense scenarios that ring true because they're real. The reader recognizes the situation instantly.
- **Quiet confidence, not arrogance.** The tone isn't "look how smart we are." It's "we've done this enough times that we stopped being surprised." There's warmth in that — it means the reader isn't alone in having lived through it.
- **Earned irony.** The humor comes from recognition, not cleverness. We're not mocking corporate culture from a distance — we've been inside it, billed hours in it, inherited other people's decisions in it.
- **The insight lands because it's hard-won.** When we say "a simple API call," we say it because we wrote the 6-month integration proposal that preceded it. We know what the alternatives actually cost.

Core editorial stance: most enterprise software problems are solved the expensive way not because there's no simple solution, but because nobody with the seniority to make the decision has time to find out. We say this out loud because we've spent 20 years being the people who find out.

## Context

Site: raredigits.io — Rare Digits, Dubai-based software company.  
Products: Atlas ERP, Corsair HQ, Jeeves GPT, Fanfare, Columbus, Forecast, Watchower.

## Front Matter Template

```yaml
---
title:  "Post Title Here"
date:   YYYY-MM-DDTHH:MM:SS+04:00
permalink: /newsroom/Slug-Here/
category: Release | Internal Affairs | Industry | Partnership
labels: [tag1, tag2]
---
```

**Categories:**

- `Release` — product launches, new features
- `Internal Affairs` — company news, office, team
- `Industry` — market commentary, trends
- `Partnership` — integrations, clients, announcements

**Common labels:** `automate`, `kitchen`, `blessing`, `erp`, `ai`, `finance`, `hr`, `crm`

## Structure

1. **The pattern** — open with a scenario the reader has lived. Specific enough to be real: an industry, a job title, a familiar Tuesday afternoon. No product mention, no company mention.
2. **How it always goes** — trace the typical trajectory with insider precision. Use present or past tense, not hypothetical. The project manager leaves at month four. The vendor recommends a new module. The spreadsheet becomes load-bearing.
3. **What we've learned** — the hard-won insight, stated plainly. One or two sentences. This is where the 20 years lives.
4. **The actual thing** — what we built or did. Specific. If there's a query or API call that proves the point, show it. The contrast with step 2 should be almost uncomfortable.
5. **Callout** — a distilled observation that sounds like it came from someone who's cleaned up this mess before: `<div class="highlight">The sentence here.</div>`
6. **Closing** — practical, low-pressure. What the reader can do with this information. Link to product only if it genuinely helps: `[Product Name](/tools/product/)`.

## Style Rules

- Write the lede about the situation, not the company and not the product.
- Specificity signals experience. Finance, logistics, HR, retail — name the industry when it helps. "One CFO we know" is better than "many companies."
- "We've seen this" is more authoritative than "studies show." Use it.
- Don't editorialize about what *might* go wrong. Say what *does* go wrong, in present tense.
- Named staff: Dmitry Schnellreich (COO). Otherwise: "the client," "one CFO we know," "the project manager who left in month four."
- Irony is welcome; sarcasm at the reader's expense is not. The reader is the hero of this story, not the cautionary tale.
- Avoid: "excited," "thrilled," "game-changer," "leverage," "synergy," "seamless," "robust," "end-to-end," "best-in-class."
- Never write "In today's fast-paced business environment."
- Length: 400–700 words for announcements, 200–400 for company notes.

## Prompt to Claude

```text
Write a Rare Digits newsroom post about: [TOPIC]

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

Voice: a seasoned practitioner, 20 years in enterprise software. Matt Levine register —
simple, warm, quietly ironic. Starts with the pattern, not the product.
The reader should feel: "someone finally said this out loud."
Include a permalink slug suggestion.
```
