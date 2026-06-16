---
title:  "Forecasting Methods, Ranked by Honesty"
date:   2023-10-16T10:30:00+08:00
permalink: /pressroom/Forecasting-Methods/
category: Insights
labels: [finance, forecast, erp]
---

<div class="lead">You forecast all the time, you just don’t call it that. Every time you reorder stock, sign a lease or decide whether you can afford one more hire, you are placing a bet on a number that hasn’t happened yet. The only real question is whether you do it deliberately or just wing it.</div>

So it is worth knowing how the professionals actually predict the future, which turns out to be far less intimidating than the people selling it would prefer. There is a whole menu, running from a shrug to a supercomputer, and the quietly funny part, the thing this note is really about, is that the shrug often wins. No statistics degree required.

## The Cheap Methods That Win

The simplest forecast in the world is “next month will look like this month,” with its slightly cleverer cousin, “next December will look like last December.” It feels like cheating, the way you can guess this Friday’s restaurant covers from last Friday’s numbers. It is also the number you should be quietly embarrassed if you can’t beat, and most teams, checked honestly, can’t. On a steady business it lands within ten or fifteen percent of reality, *which is better* than half the dashboards in your building. Treat the shrug as the bar every cleverer method has to clear, because a surprising number never do.

One step up, you stop overreacting to single months. Take the last several, blend them, and lean a little harder on the recent ones. You already judge a supplier this way, on their general behaviour lately and not on the one week a pipe burst. Add a nudge for the direction things are drifting and a small correction for the fact that some months are simply busier, and you have a technique old enough to draw a pension that still quietly outperforms most of what came after it. The forecasting world has run bake-offs for thirty years, and the result barely moves: plain averages, sensibly combined, keep humiliating the clever stuff.

The most useful idea in the whole field is also one of the oldest. Any business number is really three things stacked on top of each other, the way the sea is. There is the slow tide, your underlying growth or decline. There is the daily rhythm, the busy season and the dead one that return like clockwork. And there are the waves, the random noise nobody can call. Pull the three apart, draw a line through the tide, set the seasonal rhythm back on top, and you get a forecast you can explain to a human being. “September dips because September always dips” is a sentence you can say out loud in a board meeting. Whatever the neural network is doing in there is not.

## The Fancy End, and the Salesperson

Then come the methods with reputations. The econometrician’s favourite is a magnificent animal, and like a racehorse it performs only *under very particular conditions*: a long, clean, well-behaved history, a smooth track, and a specialist on staff to feed and walk it. Give it the short, lumpy, frequently-rewritten history a real company actually has, and it behaves like a thoroughbred dropped into a muddy field. It panics, mistakes the mud for the race, and gallops off confidently in the wrong direction.

Then, inevitably, **the AI**. Modern machine learning genuinely can shave a few points off your error, on one condition nobody likes to say loudly: you must feed it years of clean, consistent history from a business that barely changed. Picture a prodigy with a photographic memory who reads your entire archive over lunch. If the archive is good, they are dazzling. If it is eighteen chaotic months from a company that rebranded twice and once booked the same invoice three times, the prodigy memorises the chaos, mistakes and all, and recites it back with total confidence. Most firms are cracking a single walnut and being sold a hydraulic press.

And underneath all of it sits the oldest method of all, the human who simply knows the big contract is closing because they had lunch with the client. This is irreplaceable for the one thing no model can see, the deal that lives in a handshake before it ever reaches the data. Left unsupervised, it is also a slow-motion disaster, because **optimism compounds**. Every deal is ninety percent closed, the way every fishing story is about the one that nearly got away, and when you lay a whole sales team’s hopes end to end you get a pipeline that would buy the building you rent and a quarter that still comes in light.

## The Two Habits That Matter More

Here is the secret the industry is oddly shy about: which method you pick matters far less than two habits almost nobody keeps.

The first is **to give a range instead of a single number**. Your phone says the drive takes thirty-five to fifty minutes, because it has the sense not to pretend it knows the exact one. A doctor gives an expecting couple a due week, since the baby has its own view on the precise day. A range is not cold feet. A tight one tells you to commit, a wide one tells you *to keep something in reserve*, and that gap is the most useful thing on the page. A lone confident figure tells you nothing about which of those two worlds you are standing in.

The second is **to keep score**. A forecast nobody checks against what actually happened only tells you how the forecaster feels. It is the difference between a gambler who writes down every hand and the fellow at the table who remembers only his winnings. Grade each forecast once the real number lands: how far off, in which direction, how often reality fell inside the range. A track record is the only credential a forecast has ever had.

<div class="highlight">A forecast with no range and no score is just a wish in a spreadsheet, dressed for the meeting.</div>

## Which Is the Whole Point

When we sat down to build our own forecasting, this was the bet we made. We passed on the thoroughbred and the prodigy, because at the data sizes real businesses have, the extra sliver of accuracy they might buy is not worth a number nobody in the room can explain. We took the boring, sturdy, century-old approach, taught it to report a range, and made it keep its own score out loud, every month.

**UPD:** Boring is carrying a lot of weight in that sentence, and it earns it. After enough quarters spent cleaning up confident wrong numbers, boring starts to look a great deal like wisdom. If you would like to see what that looks like in practice, that is precisely what [Forecast](/tools/forecast/) is.
