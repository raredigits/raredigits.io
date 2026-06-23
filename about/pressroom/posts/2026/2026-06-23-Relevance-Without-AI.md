---
layout: post
body_class: text-content
title:  "Relevance Without the Model"
tldr: "Deciding what's relevant to the current page is usually a job for shared tags and a sort order, not AI. Here's a small open-source plugin that proves it, and the start of something bigger."
date:   2026-06-23T10:00:00+04:00
img: "/assets/img/illustrations/rare-development.jpg"
permalink: /pressroom/Relevance-Without-AI/
category: Release
labels: [design, kitchen]
---

<section class="lead">The instinct now, when a page needs to suggest what to read next, is to reach for a model: feed every article to an embedding, store the vectors, ask the machine which ones feel similar. It works. It also bills monthly, and it turns an afternoon's work into a small infrastructure project that depends on someone else's uptime and someone else's pricing.</section>

Most of the time you do not need any of it. A reader who just finished a piece tagged "cash flow" probably wants another piece tagged "cash flow," and when there are several, the most recent one is a fair guess. There is no intelligence in that. You count how many topics two posts share, and you sort by date. We have shipped enough sites to know it gets you most of the way on the first try, for nothing.

The expensive answer wins by default anyway, usually for a dull reason: nobody with the authority to choose has the time to check whether the cheap one would have done the job.

## So We Wrote the Cheap One Down

It is a small plugin for [Eleventy](https://www.11ty.dev/), the generator this site runs on. An editor can pin the follow-ups by hand when they have an opinion. When they do not, it fills the gap by shared topics, freshest first. A post we would rather not resurface gets a single line in its front matter, `relation: off`, and it leaves the suggestions. No model, no vectors, no monthly bill.

```sh
npm install @raredigits/11ty-rare-related-posts
```

<div class="highlight">Simple logic solves more than it gets credit for, mostly because nobody tries it before buying the complicated thing.</div>

It is on npm now, MIT-licensed, with the source [on GitHub](https://github.com/raredigits/11ty/tree/main/11ty-rare-related-posts). Today it does one honest thing well. The question we find interesting is how far this plain approach stretches before it genuinely needs a model: weighting by recency, by author, by what a reader has already seen. We think there is a real product in there, and we would rather build it in the open. If you want to push it further with us, the repo is the place to start.
