# Prompt: 101 Post

## Purpose

A 101 post is a practical management principle for owners, shareholders, founders, and senior managers with P&L responsibility.

The point is not to explain a topic from first principles like a textbook.
The point is to give the reader a durable mental model they can use to assess the current situation and identify the realistic options available.

## What Makes It "101"

This is foundational knowledge:

- simple enough to remember
- sharp enough to use under pressure
- broad enough to apply across multiple situations

If a reader remembers only one sentence from the post, that sentence should still improve the next decision they make.

## Structure

1. **The principle** — title as a blunt statement.
2. **The scene** — a familiar business situation where the principle is being ignored.
3. **The hidden logic** — why smart people still end up here.
4. **What the principle reveals** — what becomes visible once you look through this lens.
5. **Available options** — what actions or decision paths become possible after that.
6. **Callout** — one sentence that survives being quoted out of context.

## Voice

Same practitioner register as pressroom and principles posts. Calm, specific, slightly ironic, never academic.

The reader should feel:
"This is basic, but not simplistic. I should probably have had this framework earlier."

## Front Matter

```yaml
---
title:  "101: Principle Title"
date:   YYYY-MM-DDTHH:MM:SS+04:00
permalink: /pressroom/Slug-Here/
category: Industry
labels: [principles, 101]
---
```

## Writing Rules

- Do not write as if teaching a class.
- Do not define terms unless the definition changes a decision.
- Do not list generic best practices.
- Show what the principle helps the reader notice, decide, avoid, or escalate.
- End with options, not vibes.

For the callout and any other markup, see `_editorial/prompts/markup.md`: use Rare Styles classes, never invent new ones inline; genuinely new styles go in `assets/css/modules/`.

## Prompt Template

```text
Write a Rare Digits 101 post about: [PRINCIPLE]

What this principle helps a business owner or senior manager understand:
- [what becomes visible]
- [what failure mode it explains]
- [what options it creates]

A familiar situation where this principle is missing:
- [scene]
- [how people usually misread it]
- [what it costs]

Voice: a seasoned practitioner with 20 years in SMB automation.
No textbook tone. No motivational language. The reader should come away
with a clearer view of reality and a better option set.
```
