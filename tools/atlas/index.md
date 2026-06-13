---
layout: page
body_class: text-content
title: Atlas ERP
offset: solutions
remark: 'Current version: v.2.4.6'
permalink: /tools/atlas/
---

<style>
/* TEMP — screenshot placeholders until the redesign visuals are final.
   Remove this block (and swap .shot-ph blocks for <img>) when shots land. */
.shot-ph {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    text-align: center;
    min-height: 320px;
    padding: var(--space-lg);
    background:
        repeating-linear-gradient(45deg, var(--gray-lightest), var(--gray-lightest) 12px, var(--bg-color-light) 12px, var(--bg-color-light) 24px);
    border: 2px dashed var(--border-color);
    border-radius: var(--space-sm);
    color: var(--text-color-light);
}
.shot-ph .shot-ph__tag {
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: .1em;
    border: 1px solid var(--border-color);
    border-radius: var(--space-lg);
    padding: 2px 10px;
}
.shot-ph .shot-ph__what { max-width: 38ch; line-height: 1.4em; }
.shot-ph--tall { min-height: 460px; }
</style>

<div class="lead">
    <p><strong>The pitch:</strong> the world's most capable open-source ERP, wearing an interface that a modern neobank would be proud to ship.</p>
    <p><strong>The trick:</strong> we didn't rebuild the engine. We rebuilt the dashboard you actually look at.</p>
</div>

<div class="text-content-fullwidth-caption">
    <div>{% include "special/constructionNotice.html" %}</div>
    <cite>The owner's dashboard. See it <a href="/demo/odoo/dashboard/">live in the demo →</a></cite>
</div>

Atlas ERP is what happens when engineers who actually run businesses get fed up with ERP interfaces designed by people who clearly never had to use one under deadline pressure.

We took [Odoo](https://www.odoo.com) — one of the most powerful open-source ERP platforms on the planet — and performed radical interface surgery. The result is an ERP that doesn't require a PhD in menu navigation to find the number you came for.

<div class="highlight">It's the familiar spreadsheet you already trust — reborn as an app from a startlingly modern neobank.</div>

## Odoo Under the Hood — On Purpose

Building your own ERP from scratch is a great way to spend three years and a fortune reinventing accounting. We didn't. Atlas sits on a real Odoo core, and that's the point — you inherit a mature, battle-tested platform instead of a clever prototype:

- **Documentation that already exists.** Thousands of pages, in many languages, written and maintained by a community far larger than any single vendor's support desk.
- **An integrator on every continent.** Tens of thousands of certified Odoo partners worldwide. You're never locked into one phone number, and you're never the only client who's seen your problem.
- **Dozens of modules, ready to plug in.** Inventory, manufacturing, payroll, point of sale, e-commerce, projects — the catalogue is already built and tested. We connect what you need instead of coding it from zero.
- **An open core you can audit.** No black box. The engine running your business is inspectable, extensible, and going nowhere.

In short: the boring, load-bearing parts are someone else's solved problem. We spend our effort where it actually moves the needle — on what you see.

## The Surgery — Our Design System

The redesign isn't a fresh coat of paint. It's a design system, built on **20 years of automating SMBs and holding structures** and one stubborn observation: the person who owns the business is almost never the person the ERP was designed for.

So we designed for them instead. Every screen answers a decision-maker's question before it answers a database's:

<div class="wide-background">
  <div class="wide-background-text-content-wrapper gray-light-bg">
    <div class="feature-row">
        <div class="feature-row__item">
            <div>
                <h3>The number is the hero.</h3>
                <p>Not "Unrestricted Cash Balance" in 11px grey. The actual figure, big, in plain words — "cash you can spend." Tabular digits that line up, so 2.4M and 240K never play tricks on you.</p>
            </div>
            <div class="shot-ph">
                <span class="shot-ph__tag">Screenshot placeholder</span>
                <p class="shot-ph__what"><strong>KPI strip.</strong><br>Four tiles: cash, revenue vs plan, runway, what needs you — with deltas and one accent colour used sparingly.</p>
            </div>
        </div>
        <div class="feature-row__item">
            <div>
                <h3>An invoice, not a form.</h3>
                <p>The same <code>account.move</code> Odoo has always had — reorganised so the customer sees one amount and one button, and you see exactly where it stands on a status the size of a thought, not a spreadsheet.</p>
            </div>
            <div class="shot-ph">
                <span class="shot-ph__tag">Screenshot placeholder</span>
                <p class="shot-ph__what"><strong>Invoice document.</strong><br>Clean payment sheet, status stepper (Draft → Sent → Paid), pay panel and timeline. <a href="/demo/odoo/invoice/">Live →</a></p>
            </div>
        </div>
        <div class="feature-row__item">
            <div>
                <h3>The pipeline tells you what's slipping.</h3>
                <p>Odoo's CRM kanban, kept — but the deal going stale and the deal about to sign no longer hide inside identical cards. Priority, age and status surface themselves.</p>
            </div>
            <div class="shot-ph">
                <span class="shot-ph__tag">Screenshot placeholder</span>
                <p class="shot-ph__what"><strong>Sales pipeline (kanban).</strong><br>Stage columns with weighted totals, deal cards with priority and "stale" flags. <a href="/demo/odoo/pipeline/">Live →</a></p>
            </div>
        </div>
    </div>
  </div>
</div>

The system underneath this is **Rare Styles**, our open-source library for presenting business information. Same tokens, same typography, same restraint on every screen — which is why a dashboard, an invoice and a pipeline all feel like one product instead of three teams' worth of opinions.

## See It for Yourself

We built a working demo of the reimagined screens — no login, no sales call required. Click around the launcher to move between the dashboard, an invoice and the sales pipeline.

<div class="highlight"><a href="/demo/odoo/dashboard/">→ Open the live Atlas demo</a></div>

It's the same Odoo a hundred thousand businesses already run. We just put the question the owner actually asks — *is the money okay, and what needs me?* — at the top of the screen.

{% include "special/bookDemo.html" %}
