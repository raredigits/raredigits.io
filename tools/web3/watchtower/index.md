---
layout: page
body_class: text-content
title: Watchtower
offset: solutions
remark: 'Current version: v.1.1.2'
permalink: /tools/web3/watchtower/
scripts: [charts]
---

<style>
/* framed demo screenshots, captured from the live /demo/ screens */
.shot { display: block; width: 100%; height: auto; border: 1px solid var(--border-color); border-radius: var(--space-sm); box-shadow: var(--shadow-sm); margin-top: var(--space-sm); }
</style>

<div class="full-width">
  <img src="/assets/img/pressroom/2025/watchtower.jpg" alt="Watchtower" />
</div>

<div class="lead">
    <p>Your desk watches the price. So does everyone else's, which is the problem. You learn what a position did the way the whole market learns it, from the chart, after it has already done it. Yet three hours before the candle moved, a wallet dormant for two years walked two million tokens onto an exchange in full public view, timestamped, on the most transparent ledger in financial history. Smartest money in the world, reading the scoreboard.</p>
</div>

## The one market that lets you see the hand

In ordinary markets you do not get to watch the order flow. The big players pay handsomely to keep it that way, and you get the closing price and a press release. Crypto did something careless with that arrangement: it wrote every transfer to a public wall, permanently, with a timestamp, for anybody to read. The whale and the intern leave the same footprints in the same wet cement.

The people who move real size worked this out years ago. The OTC desks, the market makers, the analysts whose entire job is to be unsurprised, stopped reading sentiment threads and started reading wallets, because the ledger is the one room in finance where money cannot lie about where it is going. The small operator and the giant fund get exactly the same intelligence. Most of the small operators are still staring at the candle.

## What the flows are actually saying

The signal is not mystical. It is specific, and most of it comes down to which way the coins are walking.

Tokens moving toward an exchange are usually being lined up to sell. An exchange deposit address is a labelled wallet the exchange controls, and coins arriving there are coins getting dressed for the door. Watchtower knows those addresses by name, so a large transfer in is intent, not noise, and you see it the moment it confirms instead of the next morning on a forum. Coins walking the other way, into cold storage, are the opposite tell: somebody is settling in for a while.

Then there is the conviction of the people who already locked their coins up. The staking ratio is the share of supply that holders have bonded to the network to earn yield and help secure it; the unbonding queue is the line of people waiting to un-bond and leave. A ratio that climbs while the queue stays empty is a comfortable network. A queue that suddenly lengthens is the first scrape of chairs.

Underneath sits the plumbing, which works or quietly does not: how reliably blocks are produced, whether the validators are online, whether the chain just rewrote a slice of its own recent history. None of this is a black box. Watchtower parses the chain itself, EVM-compatible networks and Cosmos SDK chains, labels the wallets that matter, and watches the flows across the window you pick: a day, a week, a month.

<div class="text-content-caption card-dashboard-bordered">
    <div id="watchtower-flows-demo"></div>
    <cite>The 2.41M-token deposit hits the exchange while the price is still at its high. The price worked out what it meant three days later. The decision was visible the whole time.</cite>
</div>

## Watch the money, not the price

So here is the move, and it repeats well on your next call: watch the money, not the price. The price is the scoreboard, honest and lagging and emotional, because it is the sum of everyone reacting to things that already happened. The flows are the players walking onto the pitch before the whistle. By the time two million tokens have slid into an exchange wallet at three in the morning, the sell is decided, and the red candle the next afternoon is just the part everyone is allowed to see. Net flow, coins in minus coins out across the wallets that matter, is the closest thing this market has to a tell, and it sits in plain view the whole time.

<div class="highlight">The price tells you what already happened. The wallets tell you what is about to.</div>

## The things you didn't buy it for

You bought a pair of eyes. The free pleasures are mostly about sleeping better and winning arguments.

The alert fires while you sleep. A dormant wallet wakes at three in the morning and empties into a known exchange address, and instead of finding out in a panicked group chat over breakfast, you wake to a single line that already said so. You get to decide before the rest of the market does, which is the only edge that has ever mattered.

The argument ends, too. Someone on the call is certain the whales are accumulating, someone else is certain the chain is creaking, both running on feeling. You put the dashboard on the screen, and the debate about moods becomes a short look at what the wallets and the validators actually did this week.

If the chain is your own, the view turns inward. Uptime, missed blocks, a depth-two reorg that healed itself inside one block, a slashing event or the quiet relief of none: you hear it from a calm alert rather than from the first furious user in your Discord, who is, reliably, the worst monitoring system ever deployed.

<div class="wide-background margin-y-md">
  <div class="wide-background-text-content-wrapper gray-light-bg">
    <div class="feature-row">
        <div class="feature-row__item">
            <div>
                <h3>The network at a glance.</h3>
                <p>Flow, health, decentralisation and the day's whale movements on one screen. Switch between a calm grid, a top-down briefing and a dense analyst view, and slide the window from a day to a month to watch every number recompute.</p>
            </div>
            <a href="/demo/watchtower/overview/"><img class="shot" src="/assets/img/demo/watchtower-overview.jpg" alt="Watchtower overview: transaction flow, network health gauge, decentralisation donut and TVL" loading="lazy"></a>
        </div>
        <div class="feature-row__item">
            <div>
                <h3>Every large transfer, named.</h3>
                <p>Inbound against outbound volume, and a running list of the big movements with the nature of each read straight off the chain: exchange inflow, validator unbond, DeFi deposit, the lot, with the addresses on both ends.</p>
            </div>
            <a href="/demo/watchtower/transactions/"><img class="shot" src="/assets/img/demo/watchtower-transactions.jpg" alt="Watchtower transactions: inbound vs outbound bars, whale transfer table and transaction mix" loading="lazy"></a>
        </div>
        <div class="feature-row__item">
            <div>
                <h3>Who actually secures the chain.</h3>
                <p>The staking ratio over time, the bonding and rewards picture, and the full validator set ranked by voting power, each with its commission, its uptime, and a plain health flag when one starts to slip.</p>
            </div>
            <a href="/demo/watchtower/staking/"><img class="shot" src="/assets/img/demo/watchtower-staking.jpg" alt="Watchtower staking: staking ratio chart, bonding and rewards, and the validator set table" loading="lazy"></a>
        </div>
        <div class="feature-row__item">
            <div>
                <h3>The line that wakes you up.</h3>
                <p>Whale inflows, mempool spikes, missed blocks, reorgs and slashing, sorted by severity, every one written as a sentence you can act on rather than a log line you have to decode.</p>
            </div>
            <a href="/demo/watchtower/alerts/"><img class="shot" src="/assets/img/demo/watchtower-alerts.jpg" alt="Watchtower alerts: severity stat cards and a feed of on-chain anomalies" loading="lazy"></a>
        </div>
    </div>
  </div>
</div>

## From the tower

All of this is one idea wearing four screens. A tower earns its keep for one reason: from the top you see the weather crossing the water long before it reaches the harbour, while the people on the quay are still enjoying the sun. The chain has been broadcasting that weather the whole time, openly, to anyone who bothered to climb. Watchtower is the climb.

It reads EVM-compatible networks and Cosmos SDK chains today, most of the territory where digital money currently wanders, and it picks up new ground as the money finds it.

## See it for yourself

We built a working demo on a fictional network. No login, no sales call, nobody emailing you afterwards. Open it, push the window from a day to a month, click into a whale transfer, watch a validator drift into the amber. Then, if you want the same eyes on the chains you actually hold, that is a short conversation about your own stack.

<div class="caption">→ <a href="/demo/watchtower/overview/">Open the live Watchtower demo</a></div>

{% include "special/bookDemo.html" %}

<script src="/assets/js/charts/pressroom/watchtower-flows-example.js" defer></script>
