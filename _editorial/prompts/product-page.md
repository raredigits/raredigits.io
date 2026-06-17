# Prompt: Product Page

*Calibrated on `tools/forecast/index.md` (June 2026). That page is the reference for **voice**, not for structure: never reuse its headings, its running example, or its metaphors. Every product gets its own scene, its own analogy, its own jokes.*

## Who It's For

One reader: the owner or senior manager of an SMB, the person with P&L responsibility who signs for the tool. Not a procurement officer ticking off features, not an engineer. Someone running a business who recognises a familiar headache the instant it's described. Write to that person, in the second person, as a peer who has sat in the same room.

## The Job of the Page

A product page has work to do, in roughly this order. This is the *arc*, not a template. Vary the headings, the example, and the running image for every product.

1. **Make the reader recognise himself.** Open on the absurd everyday reality of his operation: the meeting that always happens, the number everyone repeats, the spreadsheet nobody trusts. He should think "this is my Tuesday." No product and no company name yet. Keep this opening light and airy: short sentences, one idea each, comic escalation rather than a dense packed paragraph. Density belongs in the middle of the page, never at the entrance.
2. **Tell him he isn't alone, and that smart people already solved this.** The relief of learning the problem has a name and that serious practitioners, often in some adjacent and credible field, cracked it long ago. Borrow authority from somewhere real.
3. **Show how it works, and why.** Plainly. Explain any piece of jargon the first time it appears, in words a non-specialist actually uses, before you lean on it. No black boxes.
4. **Hand him the lifehack.** The concrete, slightly contrarian move he can use, framed as the kind of thing passed between practitioners over coffee, not published in HBR. This is the gift. Make it portable enough to repeat at his next stand-up.
5. **Then the unexpected bonuses.** The second-order pleasures he didn't buy it for but will love: the argument that ends, the alert that saves a Monday, the medal he can finally earn.
6. **Close with an invitation.** See the live demo, then let's talk about putting it on your own systems. Low pressure, no manufactured urgency.

## Voice

The Matt Levine register from `newsroom-post.md`: a seasoned practitioner, warm, dry, quietly ironic, telling you how it really goes. Professional but informal, the way a sharp colleague talks, not the way a deck reads.

- **Exaggerate the absurd, hard.** Start from a real, recognisable situation, then crank the dial past realism into comedy: the integrator who arrives like a plumber and leaves an invoice, a licence that costs the annual budget of a small country, a committee convened just to find out how much cash is in the bank. The realism makes the reader nod; the exaggeration makes the line stick. Aim the absurdity at the system, the software and the vendors, never at the reader and never at a group of people.
- **Be concrete.** Real industries, real job titles, a specific Tuesday. A named protagonist and one running scenario beat ten abstractions. "One CFO we know" beats "many companies."
- **Lead from psychology.** Explain why smart people make the intuitive-but-wrong choice (he wanted to be liked; a bigger number felt like progress), then reveal the counterintuitive move that actually works. The reader is the hero who was never handed the right tool, never the cautionary tale.
- **Use plain analogies the reader already trusts** (the weather forecast, the medal, gravity) to carry the unfamiliar idea across.
- **Earn your phrases.** Don't drop a clever line before the reader has seen why it's true. Set it up, then land it.
- **Let a motif recur.** A single controlling image or running word, planted early and paid off late, makes the page read like one author instead of three.
- **Vary the rhythm.** Let one short sentence land after a long one. Every section should move the argument forward; if a paragraph only restates the last one, cut it.

## Illustrate It

Where it earns its place, add a visual: a chart, a screenshot, an annotated dashboard, a cartoon or a meme. A picture of the idea (the widening fan, the alert firing) can do the work of a paragraph. Mark placeholders clearly when the real asset isn't ready yet.

## Hard Rules

These override instinct, and they override the style of older pages.

- **No bullet points in body copy.** If it's the substance of the argument, write it as prose. A list flattens the thing that should land.
- **No em-dashes.** A comma, a colon, a full stop, or a fresh sentence does the job. LLM prose reaches for the dash constantly; don't. (En-dashes in true ranges like P10–P90 are fine.)
- **No "it's not X, it's Y" / "X, not Y" antithesis as a crutch.** It's the reflex of marketing decks and Twitter threads, and it reads as borrowed confidence. State the point in a plain sentence.
- **No deck or thread tropes:** no "imagine a world where," no "what if I told you," no triads of one-word sentences for drama, none of "game-changer / seamless / robust / leverage / synergy / end-to-end / best-in-class."
- **Never** "In today's fast-paced business environment."

## The Close

End every product page with the same two beats, worded freshly each time: an invitation to open the live demo (no login, no sales call), then an invitation to talk about implementing it on the reader's own stack. Keep the existing includes (`special/bookDemo.html`) where present.

## The Exception: Open-Source Project Pages

Some `/tools/` pages are open-source projects, not commercial products (e.g. `tools/open-source/styles/`). These deliberately depart from the methodology above, while keeping the same voice, irony and tone.

What stays: the problem-first opening (still open on the absurdity the reader recognises, never on the product), the Matt Levine register, and every hard rule.

What changes:

- **No demo, no feature row, no commercial mechanics.** Don't sell capabilities. The project speaks for itself.
- **The link goes to the project's own home**, not to a sales flow: external docs and the repo (for Rare Styles, `raredigits.art` and GitHub). Point the reader there and let them explore.
- **A different CTA.** Not "book a demo." The two beats are: *have a proper look, it's free and open*, and then, for the people who need it backed in production, *there is a commercial licence with a warranty and an SLA*. Frame the paid tier in plain words (a guarantee that it works, a phone number that answers at 2am), never as upsell pressure.
- **Manifesto is allowed.** These pages can carry the project's own philosophy and sign-off line; lean into that identity rather than forcing the standard arc.

## Before You Write

Read `_editorial/company.md` for the facts, `_editorial/prompts/newsroom-post.md` for the register, and `_editorial/prompts/markup.md` for the styling rule (use Rare Styles classes; new styles go in `assets/css/modules/`, never invented inline).

Then **stop and confirm the spine with the user before drafting a word.** Don't guess these three and start writing; the whole page hangs off them, and getting them wrong wastes a full draft. Propose options (two or three each, with a recommendation) and let the user pick or redirect:

1. **The opening absurd scene** — which everyday reality of the reader's operation the page opens on. The "this is my Tuesday" moment.
2. **The lifehack** — the one concrete, slightly contrarian move the page hands over. The thing worth repeating at a stand-up.
3. **The running motif** — the single controlling image or word planted early and paid off late, that makes the page feel like one author.

Use `AskUserQuestion` (or a plain numbered list if the choices need explaining) to put these in front of the user. Only once all three are agreed do you draft. If you can't even propose candidates for all three, you don't understand the product well enough yet; go read more first.

## Self-Check

- Would the reader screenshot one line and send it to a colleague? If no line is that good, keep working.
- Is there a bullet or an em-dash hiding anywhere? Remove it.
- Did you reuse a heading, example, or metaphor from another page? Replace it.
- Is the reader ever the butt of the joke? Fix it. He's the hero.
- Does every section advance the argument? Cut anything that only restates.
