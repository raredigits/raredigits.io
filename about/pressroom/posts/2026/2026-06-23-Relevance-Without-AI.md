---
layout: post
body_class: text-content
title:  "Relevance Without the Model"
tldr: “Join the development of a relevant-content engine with venture potential, or just use it for free.”
date:   2026-06-23T10:00:00+04:00
img: "/assets/img/pressroom/2026/show-me-more.jpg"
permalink: /pressroom/relevance-without-ai/
category: Release
labels: [design, kitchen]
---

<section class="lead">Whatever you are doing on the internet, one number quietly decides whether it is working: how long a person stays. The blogger wants to be read to the end. The online store wants a bigger basket. The media site wants to serve one more banner before you leave. Different businesses, the same prayer, which is that you do not close the tab.</section>

There is one move that serves all three, and it is old enough to be boring. You offer the reader something else. Another piece on the topic they just finished, the adjacent headline, the “customers also bought” shelf. Keep someone one click deeper and you have earned your extra minute, your extra impression, your extra item in the cart. The idea is intuitive, and it has been paying rent for decades.

<div class="text-content-fullwidth-caption">
  <img src="{{img}}" >
</div>

The hard part was always the choosing. Which something else? The big players answer that with serious algorithms trained on their enormous datasets, and they are pretty good at it. The blogger and the webshop owner have neither the dataset nor the team, so the question lands on them with no obvious answer.

In the vibe-coding era the low-hanging fruit looks like *delegating the task to AI*. Hand the model the current page and your archive, let it multiply its matrices in the dark, and let it hand back *something relevant*. It will even write the code to automate this. You just pay for the tokens, and you pray the something it hands back actually exists on your site, and is not a beautifully titled post you never wrote. And there is the first problem, because the thing runs on a meter that behaves like toilet paper in a lockdown, a small fee on every move, climbing for reasons nobody can explain and never, ever stopping. Then come the duller risks. You now depend on someone else’s infrastructure and someone else’s pricing, and the morning the provider schedules maintenance, your related posts quietly go blank.

There is an older rule underneath all of this. You do not hand the work that matters to a contractor who invents things with complete confidence. We have parted ways with people for less, and at least the people knew when they were guessing.

One of the quieter costs of vibe-coding is that you stop thinking about the problem. You hand the search for a solution to a machine that predicts the next word, and you ship whatever it predicts. So let us actually look at the problem. A reader who just read the post titled “11ty tips” and finished it probably wants another piece on 11ty, and very likely a few more tips. There is no intelligence in that, and you do not need AI to see it. What you need is to surface a few posts under the same tag, freshest first. We have shipped enough sites to know it gets you most of the way on the first try, for nothing.

An online store is the same shape: the catalogue already knows which items share a category, and “people also bought” is largely that join. Not rocket science.

<div class="highlight">You know your own users and your own content better than a model trained on strangers ever will.</div>

That edge is free, and it is already yours.

## Get Relation to the Undervalued Relations

Today we released it as a [free library](https://github.com/raredigits/11ty/tree/main/11ty-rare-related-posts) that collects the relevant posts inside any 11ty project. It is simple, works out of the box, and looks a little like magic.

Current stage: an MVP, v0.1.0, open-source, free of charge, ready for implementation and testing. Issues, questions, and arguments belong in the repo.

The main reason we are writing, though, is **to invite you in**. Today it does one honest thing well, and we want to learn how far the plain approach stretches before it genuinely needs a model: weighting by recency, by author, by what a reader has already seen. Try it, run it on your own project, break it, and tell us where it bends.

We would rather build this in the open and grow it into a real commercial product together.

The repo is the place to start.
