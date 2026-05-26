---
title: "The Simple Search Problem (And the Part That Isn’t)"
date:   2025-10-29T10:00:00+04:00
permalink: /newsroom/Search-Engine/
category: Insights
labels: [kitchen]
---

Somewhere in the backlog of every company with a content-heavy website there’s a ticket that says “add search.” It usually sits there for a while. Then someone prioritizes it. Then it reaches a developer.

Then the ticket grows.

Three days later there’s a Slack thread about Elasticsearch vs. Typesense vs. Algolia. Someone mentions a managed Kubernetes option. Someone else points out that Algolia has a free tier, but the pricing scales uncomfortably after a certain query volume. A fourth option gets posted. The original ticket now has eleven comments and no search.

We’ve watched this happen enough times to have stopped being surprised. The actual problem — visitors can’t find posts on a static site — needs about two hours to solve. The conversation around it reliably takes three weeks.

## How a two-hour problem becomes a sprint

The pattern is consistent across industries and company sizes. A reasonable person identifies a real need. The need gets translated into a technical requirement. The technical requirement attracts people who find technical requirements interesting. The scope expands to accommodate what’s possible rather than what was asked for. Six weeks later there’s a architecture diagram and a Jira board, and the person who raised the original need has mostly stopped asking.

This is not a technology problem. It’s what happens when the distance between “we need X” and “we’re shipping X” gets filled with interesting decisions instead of boring ones.

## Boring, correct, and costs nothing

[Pagefind](https://pagefind.app). Client-side, runs in the browser, no server, no API key, no invoice arriving at the end of a high-traffic month. You build the site, Pagefind indexes the output, the index deploys alongside the HTML. Works offline. Free.

We documented the full implementation at [Rare Styles](https://raredigits.art/scripts/search/) — every step, every configuration option. If you’re on Eleventy or any static site generator, it’s an afternoon.

<div class="highlight">The integration that “requires infrastructure planning” is usually a build step and two JavaScript files.</div>

### The part where we ruin “Objective” search for you

Once search is working, the next question is always: how do we make the results *better*? The answer is weights — you tell the engine which pages matter more than others, which fields rank above which. It’s not complicated. It works.

But it forces you to make explicit a decision that was previously invisible: what order should information appear in?

“Search is objective” is something people say when the weighting function is not visible to them. The data is all there — nothing hidden, nothing removed. Just a particular ordering, which is a choice, made by someone, for reasons that may or may not still apply.

This is true for a search box on a marketing site. It’s true for recommendation engines. It’s true for LLMs, which look brilliant and neutral right up until you realize someone spent an extraordinary amount of time deciding what to weight and how. In finance, the same number tells a different story depending on which line it appears under.

The question is never whether the data is accurate. The question is who decided what comes first.
