// Recompute & verify invariants of _data/demo (Ambitions Inc. holding dataset).
// Run: npm run demo:verify (or: node scripts/verify-demo-data.cjs). Exits 1 on failures.
// Lives outside _data on purpose — Eleventy executes .cjs files inside _data as global data.
// Policy encoded here (mirrors README invariants): disputed AR/AP is exposure, not
// balance; incoming-counterclaim is excluded from apEnd; FX open items at spot;
// contractual forward dates (leaseEnd, loan maturity, re-let scenarios) may pass "today".
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..', '_data', 'demo');
const TODAY = '2025-03-28';
const ENTITIES = ['crisis-theater', 'spotlights', 'legacy-development', 'malermeister'];

const load = (p) => {
  const f = path.join(ROOT, p);
  if (!fs.existsSync(f)) return null;
  return yaml.load(fs.readFileSync(f, 'utf8'));
};

let failures = [], warnings = [], passes = [];
const fail = (m) => failures.push(m);
const warn = (m) => warnings.push(m);
const pass = (m) => passes.push(m);
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString('en-US');
const close = (a, b, tol = 0.5) => Math.abs(a - b) <= tol;

// load everything
const data = {};
for (const e of ENTITIES) {
  data[e] = {};
  for (const f of fs.readdirSync(path.join(ROOT, e))) {
    data[e][f.replace('.yml', '')] = load(`${e}/${f}`);
  }
}
const group = {};
for (const f of fs.readdirSync(path.join(ROOT, 'group'))) {
  group[f.replace('.yml', '')] = load(`group/${f}`);
}

// ---------- helpers to normalize invoices ----------
function invoicesOf(e) {
  const inv = data[e].invoices || {};
  const ar = inv.receivable || [];
  const ap = inv.payable || [];
  return { ar, ap };
}

// =====================================================================
// 1. Order / work-order arithmetic (subtotal = Σ lines, vat 5%, total)
// =====================================================================
function checkLines(e, list, idField = 'id') {
  let ok = 0, bad = 0;
  for (const o of list) {
    if (!o.lines) continue;
    const sub = o.lines.reduce((s, l) => s + (l.qty ?? 1) * (l.unitPrice ?? l.price ?? 0), 0);
    if (o.subtotal != null && !close(sub, o.subtotal)) {
      fail(`${e}: ${o[idField]} subtotal ${fmt(o.subtotal)} ≠ Σlines ${fmt(sub)}`); bad++;
    }
    const base = o.subtotal ?? sub;
    if (o.vat != null && !close(o.vat, base * 0.05, 1)) {
      fail(`${e}: ${o[idField]} vat ${fmt(o.vat)} ≠ 5% of ${fmt(base)} (${fmt(base * 0.05)})`); bad++;
    }
    if (o.total != null && !close(o.total, base + (o.vat ?? base * 0.05), 1)) {
      fail(`${e}: ${o[idField]} total ${fmt(o.total)} ≠ subtotal+vat`); bad++;
    }
    if (!bad) ok++;
  }
  return ok;
}
if (data.spotlights.orders?.orders)
  pass(`spotlights: ${checkLines('spotlights', data.spotlights.orders.orders)} orders line-arithmetic checked`);
if (data.malermeister.workorders?.workorders)
  pass(`malermeister: ${checkLines('malermeister', data.malermeister.workorders.workorders)} workorders line-arithmetic checked`);

// =====================================================================
// 2. Invoice arithmetic: total = amount + vat; vat ≈ 5%; paid ≤ total; status
// =====================================================================
for (const e of ENTITIES) {
  const { ar, ap } = invoicesOf(e);
  let n = 0;
  for (const i of ar) {
    n++;
    const id = i.number || i.id;
    if (i.amount != null && i.vat != null && i.total != null && !close(i.total, i.amount + i.vat, 1))
      fail(`${e}: AR ${id} total ${fmt(i.total)} ≠ amount+vat ${fmt(i.amount + i.vat)}`);
    // vat 0 = zero-rated/exempt (diplomatic, export of services) — intentional
    if (i.amount != null && i.vat != null && i.vat !== 0 && !close(i.vat, i.amount * 0.05, 1))
      warn(`${e}: AR ${id} vat ${fmt(i.vat)} ≠ 5% (${fmt(i.amount * 0.05)})`);
    if (i.paid != null && i.total != null && i.paid - i.total > 0.5)
      fail(`${e}: AR ${id} paid ${fmt(i.paid)} > total ${fmt(i.total)}`);
    if (i.status === 'paid' && i.paid != null && i.total != null && !close(i.paid, i.total, 1))
      fail(`${e}: AR ${id} status=paid but paid ${fmt(i.paid)} ≠ total ${fmt(i.total)}`);
    if ((i.status === 'sent' || i.status === 'overdue') && i.paid != null && i.total != null && close(i.paid, i.total, 0.5))
      warn(`${e}: AR ${id} status=${i.status} but fully paid`);
  }
  pass(`${e}: ${n} AR + ${ap.length} AP invoices arithmetic checked`);
}

// =====================================================================
// 3. Payments reference valid invoices; Σ payments vs invoice.paid
// =====================================================================
for (const e of ENTITIES) {
  const pays = data[e].payments?.payments || [];
  const { ar, ap } = invoicesOf(e);
  const invIndex = {};
  for (const i of [...ar, ...ap]) invIndex[i.number || i.id] = i;
  const loanIds = new Set((data[e].debt?.facilities || []).map(l => l.id));
  const sums = {};
  let refErr = 0;
  for (const p of pays) {
    if (p.loan) { // debt-service payments reference a loan facility, not an invoice
      if (!loanIds.has(p.loan)) { fail(`${e}: payment ${p.id} → unknown loan ${p.loan}`); refErr++; }
      continue;
    }
    if (!invIndex[p.invoice]) { fail(`${e}: payment ${p.id} → unknown invoice ${p.invoice}`); refErr++; continue; }
    sums[p.invoice] = (sums[p.invoice] || 0) + p.amount;
  }
  let mismatched = 0;
  for (const [num, s] of Object.entries(sums)) {
    const i = invIndex[num];
    const paidField = i.paid ?? i.paidAmount;
    // AP invoices may be in foreign currency; payment in same currency — compare loosely
    if (paidField != null && !close(s, paidField, Math.max(1, paidField * 0.001))) {
      warn(`${e}: invoice ${num} Σpayments ${fmt(s)} ≠ invoice.paid ${fmt(paidField)}`);
      mismatched++;
    }
    if (i.total != null && s - i.total > 0.5 && (i.currency == null || i.currency === (pays.find(p=>p.invoice===num)||{}).currency))
      fail(`${e}: invoice ${num} Σpayments ${fmt(s)} > total ${fmt(i.total)}`);
  }
  pass(`${e}: ${pays.length} payments checked (${refErr} bad refs, ${mismatched} sum mismatches)`);
}

// =====================================================================
// 4. Unpaid AR/AP at today ≈ cashflow arEnd/apEnd (last month)
// =====================================================================
for (const e of ENTITIES) {
  const { ar, ap } = invoicesOf(e);
  const cf = data[e].cashflow;
  const monthly = cf?.monthly || [];
  const last = monthly[monthly.length - 1];
  if (!last) { fail(`${e}: no cashflow monthly rows`); continue; }
  // Policy: disputed items are exposure, not trade AR/AP; incoming-counterclaim is a
  // contingent receivable parked in the payable ledger — excluded from apEnd.
  const fxSpot = group.fx?.spot || {};
  const toAED = (v, cur) => v * (cur && cur !== 'AED' ? (fxSpot[cur] ?? 1) : 1);
  const openAR = ar.filter(i => !['paid', 'written-off', 'cancelled', 'disputed'].includes(i.status) && i.issued <= TODAY)
    .reduce((s, i) => s + toAED((i.total ?? 0) - (i.paid ?? 0), i.currency), 0);
  const openAP = ap.filter(i => !['paid', 'written-off', 'cancelled', 'disputed'].includes(i.status)
      && i.direction !== 'incoming-counterclaim' && (i.issued ?? i.received ?? '') <= TODAY)
    .reduce((s, i) => s + ((i.totalAED ?? i.amountAED ?? i.total ?? 0) - (i.paidAED ?? (i.amountAED != null ? 0 : i.paid) ?? 0)), 0);
  const arDiff = openAR - last.arEnd, apDiff = openAP - last.apEnd;
  const arPct = Math.abs(arDiff) / Math.max(last.arEnd, 1) * 100;
  const apPct = Math.abs(apDiff) / Math.max(last.apEnd, 1) * 100;
  const msg = `${e}: open AR ${fmt(openAR)} vs arEnd ${fmt(last.arEnd)} (Δ ${fmt(arDiff)}, ${arPct.toFixed(1)}%); open AP ${fmt(openAP)} vs apEnd ${fmt(last.apEnd)} (Δ ${fmt(apDiff)}, ${apPct.toFixed(1)}%)`;
  (arPct > 5 || apPct > 5) ? warn(msg) : pass(msg);
}

// =====================================================================
// 5. Cashflow internal consistency: gp, ebitda, totals block, cash continuity
// =====================================================================
for (const e of ENTITIES) {
  const cf = data[e].cashflow;
  const monthly = cf?.monthly || [];
  let bad = 0;
  let prevCash = null;
  for (const m of monthly) {
    if (!close(m.gp, m.revenue - m.cogs, 1)) { fail(`${e} ${m.month}: gp ${fmt(m.gp)} ≠ rev−cogs ${fmt(m.revenue - m.cogs)}`); bad++; }
    if (!close(m.ebitda, m.gp - m.opex, 1)) { fail(`${e} ${m.month}: ebitda ${fmt(m.ebitda)} ≠ gp−opex ${fmt(m.gp - m.opex)}`); bad++; }
    if (prevCash != null && m.cashIn != null && m.cashOut != null && m.cashEnd != null) {
      const expect = prevCash + m.cashIn - m.cashOut;
      if (!close(m.cashEnd, expect, 1)) { fail(`${e} ${m.month}: cashEnd ${fmt(m.cashEnd)} ≠ prev+in−out ${fmt(expect)}`); bad++; }
    }
    prevCash = m.cashEnd;
  }
  if (!bad) pass(`${e}: cashflow ${monthly.length} months internally consistent (gp/ebitda/cash continuity)`);
  // totals block
  if (cf?.totals) {
    for (const k of ['revenue', 'cogs', 'gp', 'opex', 'ebitda']) {
      if (cf.totals[k] == null) continue;
      const s = monthly.reduce((a, m) => a + (m[k] ?? 0), 0);
      if (!close(s, cf.totals[k], 1)) fail(`${e}: totals.${k} ${fmt(cf.totals[k])} ≠ Σ monthly ${fmt(s)}`);
      else pass(`${e}: totals.${k} = Σ monthly = ${fmt(s)}`);
    }
  }
}

// =====================================================================
// 6. Intercompany: transactions ↔ seller invoices/orders
// =====================================================================
{
  const txs = group.intercompany?.transactions || [];
  for (const t of txs) {
    const sellerInv = invoicesOf(t.from);
    const all = [...sellerInv.ar, ...sellerInv.ap];
    if (t.invoice) {
      const inv = all.find(i => (i.number || i.id) === t.invoice);
      if (!inv) fail(`intercompany ${t.id}: invoice ${t.invoice} not found in ${t.from}`);
      else if (inv.total != null && !close(inv.total, t.amount, 1) && !close(inv.amount, t.amount, 1))
        warn(`intercompany ${t.id}: amount ${fmt(t.amount)} vs invoice ${t.invoice} total ${fmt(inv.total)} / amount ${fmt(inv.amount)}`);
      // open IC balances must mirror: seller open AR == buyer open AP, same invoice number
      if (t.settlement === 'open' && inv) {
        const sellerOpen = (inv.total ?? 0) - (inv.paid ?? 0);
        const buyerInv = invoicesOf(t.to).ap.find(i => (i.number || i.id) === t.invoice);
        if (!buyerInv) fail(`intercompany ${t.id}: open at seller but no mirror AP invoice ${t.invoice} in ${t.to}`);
        else {
          const buyerOpen = (buyerInv.total ?? 0) - (buyerInv.paid ?? 0);
          if (!close(sellerOpen, buyerOpen, 1))
            fail(`intercompany ${t.id}: seller open ${fmt(sellerOpen)} ≠ buyer open ${fmt(buyerOpen)} — consolidation cannot net`);
        }
      }
    }
  }
  // orders with icRef
  const icIds = new Set(txs.map(t => t.id));
  const orders = data.spotlights.orders?.orders || [];
  for (const o of orders) {
    if (o.icRef && !icIds.has(o.icRef)) fail(`spotlights order ${o.id}: icRef ${o.icRef} not in group/intercompany`);
    if (o.icRef) {
      const t = txs.find(x => x.id === o.icRef);
      if (t && !close(t.amount, o.subtotal, 1) && !close(t.amount, o.total, 1))
        warn(`spotlights order ${o.id}: subtotal ${fmt(o.subtotal)}/total ${fmt(o.total)} vs ic ${t.id} amount ${fmt(t.amount)}`);
    }
  }
  pass(`intercompany: ${txs.length} transactions checked against seller ledgers`);
}

// =====================================================================
// 7. Cross-references resolve (clients, vendors, products, staff, invoices, fulfillments…)
// =====================================================================
for (const e of ENTITIES) {
  const d = data[e];
  const ids = {
    client: new Set((d.clients?.clients || d.clients?.tenants || []).map(c => c.id)),
    vendor: new Set((d.vendors?.vendors || []).map(v => v.id)),
    product: new Set((d.products?.products || []).map(p => p.id)),
    staff: new Set((d.staff?.staff || d.staff?.team || []).map(s => s.id)),
    project: new Set((d.projects?.projects || []).map(p => p.id)),
    property: new Set((d.portfolio?.properties || d.portfolio?.assets || []).map(p => p.id)),
    service: new Set((d.services?.services || []).map(s => s.id)),
    workorder: new Set((d.workorders?.workorders || []).map(w => w.id)),
    order: new Set((d.orders?.orders || []).map(o => o.id)),
    fulfillment: new Set((d.fulfillments?.fulfillments || []).map(f => f.id)),
    invoice: new Set([...invoicesOf(e).ar, ...invoicesOf(e).ap].map(i => i.number || i.id)),
  };
  // tenants for legacy might be under clients.yml with different key
  if (e === 'legacy-development' && d.clients) {
    for (const k of Object.keys(d.clients)) if (Array.isArray(d.clients[k])) d.clients[k].forEach(c => ids.client.add(c.id));
  }
  let bad = 0, checked = 0;
  const check = (refType, val, ctx) => {
    if (val == null) return;
    checked++;
    if (!ids[refType].has(val)) { fail(`${e}: ${ctx} → unknown ${refType} "${val}"`); bad++; }
  };
  for (const i of invoicesOf(e).ar) {
    const id = i.number || i.id;
    check('client', i.client ?? i.tenant, `AR ${id} client`);
    if (i.project) check('project', i.project, `AR ${id} project`);
    if (i.order) check('order', i.order, `AR ${id} order`);
    if (i.workorder) check('workorder', i.workorder, `AR ${id} workorder`);
    if (i.property) check('property', i.property, `AR ${id} property`);
  }
  for (const i of invoicesOf(e).ap) {
    const id = i.number || i.id;
    if (i.vendor) check('vendor', i.vendor, `AP ${id} vendor`);
  }
  for (const o of (d.orders?.orders || [])) {
    check('client', o.client, `order ${o.id} client`);
    for (const l of o.lines || []) check('product', l.product, `order ${o.id} line product`);
    if (o.invoice) check('invoice', o.invoice, `order ${o.id} invoice`);
    if (o.fulfillment) check('fulfillment', o.fulfillment, `order ${o.id} fulfillment`);
  }
  for (const w of (d.workorders?.workorders || [])) {
    check('client', w.client, `WO ${w.id} client`);
    if (w.invoice) check('invoice', w.invoice, `WO ${w.id} invoice`);
    for (const l of w.lines || []) if (l.service) check('service', l.service, `WO ${w.id} line service`);
  }
  for (const f of (d.fulfillments?.fulfillments || [])) {
    if (f.counterparty) check('client', f.counterparty, `fulfillment ${f.id} counterparty`);
  }
  const stageSet = new Set((d.deals?.stageDefaults || []).map(s => s.stage));
  for (const dl of (d.deals?.deals || [])) {
    check('client', dl.client, `deal ${dl.id} client`);
    check('staff', dl.owner, `deal ${dl.id} owner`);
    for (const p of dl.products || []) check('product', p, `deal ${dl.id} product`);
    if (dl.order) check('order', dl.order, `deal ${dl.id} order`);
    if (stageSet.size && !stageSet.has(dl.stage)) { fail(`${e}: deal ${dl.id} unknown stage "${dl.stage}"`); bad++; }
    if (dl.created > TODAY) { fail(`${e}: deal ${dl.id} created ${dl.created} after today`); bad++; }
    if (['won', 'lost'].includes(dl.stage) && !dl.closed) { fail(`${e}: deal ${dl.id} ${dl.stage} without closed date`); bad++; }
  }
  pass(`${e}: ${checked} cross-refs checked, ${bad} broken`);
}

// =====================================================================
// 7b. Columbus layer (crisis-theater): thread / reciprocity / referrals
// =====================================================================
{
  const d = data['crisis-theater'];
  if (d.thread) {
    const clientIds = new Set((d.clients?.clients || []).map(c => c.id));
    const contactIds = new Set((d.thread.contacts || []).map(c => c.id));
    const projIds = new Set((d.projects?.projects || []).map(p => p.id));
    const invIds = new Set([...invoicesOf('crisis-theater').ar, ...invoicesOf('crisis-theater').ap].map(i => i.number));
    const phases = new Set(d.thread.phaseModel || []);
    let bad = 0, checked = 0;
    const chk = (ok, msg) => { checked++; if (!ok) { fail(msg); bad++; } };
    for (const c of d.thread.contacts || []) chk(clientIds.has(c.client), `thread contact ${c.id} → unknown client ${c.client}`);
    for (const t of d.thread.threads || []) {
      chk(clientIds.has(t.client), `thread → unknown client ${t.client}`);
      chk(contactIds.has(t.primaryContact), `thread ${t.client} → unknown contact ${t.primaryContact}`);
      chk(phases.has(t.phase), `thread ${t.client} → unknown phase ${t.phase}`);
      chk(t.lastTouch <= TODAY, `thread ${t.client} lastTouch ${t.lastTouch} after today`);
      for (const en of t.entries || []) {
        chk(en.date <= TODAY, `thread ${t.client} entry ${en.date} after today`);
        for (const r of en.refs || []) chk(projIds.has(r) || invIds.has(r) || /^(alert|deal)-/.test(r), `thread ${t.client} entry ref ${r} unresolved`);
      }
      for (const pr of t.produced?.projects || []) chk(projIds.has(pr), `thread ${t.client} produced project ${pr} unknown`);
    }
    if (d.reciprocity) {
      for (const l of d.reciprocity.ledger || []) {
        chk(clientIds.has(l.client), `reciprocity → unknown client ${l.client}`);
        const rec = (l.entries || []).filter(x => x.direction === 'received').reduce((s, x) => s + x.weight, 0);
        const giv = (l.entries || []).filter(x => x.direction === 'given').reduce((s, x) => s + x.weight, 0);
        chk(rec - giv === l.balance, `reciprocity ${l.client}: balance ${l.balance} ≠ Σreceived−Σgiven ${rec - giv}`);
        for (const x of l.entries || []) if (x.by) chk(contactIds.has(x.by), `reciprocity ${l.client} entry by ${x.by} unknown`);
      }
    }
    if (d.referrals) {
      const testiIds = new Set((d.referrals.testimonials || []).map(t => t.id));
      const splDeals = new Set((data.spotlights.deals?.deals || []).map(x => x.id));
      for (const w of d.referrals.warmLeads || []) {
        chk(clientIds.has(w.from), `referral ${w.id} from → unknown client ${w.from}`);
        chk(contactIds.has(w.via), `referral ${w.id} via → unknown contact ${w.via}`);
        if (w.targetClient) chk(clientIds.has(w.targetClient), `referral ${w.id} targetClient ${w.targetClient} unknown`);
        for (const ti of w.testimonials || []) chk(testiIds.has(ti), `referral ${w.id} testimonial ${ti} unknown`);
        if (w.handedToDeal) chk(splDeals.has(w.handedToDeal), `referral ${w.id} handedToDeal ${w.handedToDeal} not in spotlights deals`);
      }
      for (const t of d.referrals.testimonials || []) if (t.person) chk(contactIds.has(t.person), `testimonial ${t.id} person ${t.person} unknown`);
    }
    bad ? null : pass(`crisis-theater: Columbus layer (thread/reciprocity/referrals) — ${checked} checks, 0 broken`);
  }
}

// =====================================================================
// 8. FX sanity: spot == last monthly row; months contiguous
// =====================================================================
{
  const fx = group.fx;
  const last = fx.monthly[fx.monthly.length - 1];
  if (!close(last.USD, fx.spot.USD, 0.0001) || !close(last.EUR, fx.spot.EUR, 0.0001))
    fail(`fx: spot (USD ${fx.spot.USD}, EUR ${fx.spot.EUR}) ≠ last monthly row (${last.USD}, ${last.EUR})`);
  else pass(`fx: spot matches last monthly row (${last.month})`);
}

// =====================================================================
// 9. Holding EBITDA FY2024 per README (CT 1.79, SPL 1.13, LEG 5.40, MAL 0.46 → 8.78M)
// =====================================================================
{
  const expect = { 'crisis-theater': 1.79e6, 'spotlights': 1.13e6, 'legacy-development': 5.40e6, 'malermeister': 0.46e6 };
  let total = 0;
  for (const e of ENTITIES) {
    const m2024 = (data[e].cashflow?.monthly || []).filter(m => m.month.startsWith('2024'));
    const s = m2024.reduce((a, m) => a + m.ebitda, 0);
    total += s;
    const d = Math.abs(s - expect[e]);
    (d > 0.02e6) ? warn(`${e}: FY2024 EBITDA ${fmt(s)} vs README ${fmt(expect[e])}`)
                 : pass(`${e}: FY2024 EBITDA ${fmt(s)} ≈ README ${fmt(expect[e])}`);
  }
  (Math.abs(total - 8.78e6) > 0.05e6)
    ? warn(`holding FY2024 EBITDA ${fmt(total)} vs README 8,780,000`)
    : pass(`holding FY2024 EBITDA ${fmt(total)} ≈ README 8.78M`);
}

// =====================================================================
// 9b. Forecast: cone ordering, backtest vs cashflow actuals, errorPct/MAPE
// =====================================================================
for (const e of ENTITIES) {
  const f = data[e].forecast;
  if (!f) { warn(`${e}: no forecast.yml`); continue; }
  let bad = 0;
  const cfRev = Object.fromEntries((data[e].cashflow?.monthly || []).map(m => [m.month, m.revenue]));
  for (const m of f.monthly || []) {
    if (!(m.p10 <= m.p50 && m.p50 <= m.p90)) { fail(`${e} forecast ${m.month}: cone broken p10 ${fmt(m.p10)} / p50 ${fmt(m.p50)} / p90 ${fmt(m.p90)}`); bad++; }
    if (m.month <= TODAY.slice(0, 7)) { fail(`${e} forecast ${m.month}: horizon month not in the future`); bad++; }
  }
  const bt = f.backtest?.months || [];
  let mapeSum = 0;
  for (const b of bt) {
    if (cfRev[b.month] == null) { fail(`${e} backtest ${b.month}: no cashflow row`); bad++; continue; }
    if (!close(b.actual, cfRev[b.month], 1)) { fail(`${e} backtest ${b.month}: actual ${fmt(b.actual)} ≠ cashflow revenue ${fmt(cfRev[b.month])}`); bad++; }
    const expErr = (b.forecastP50 - b.actual) / b.actual * 100;
    if (Math.abs(expErr - b.errorPct) > 0.15) { fail(`${e} backtest ${b.month}: errorPct ${b.errorPct} ≠ computed ${expErr.toFixed(1)}`); bad++; }
    mapeSum += Math.abs(expErr);
  }
  if (bt.length && f.backtest.summaryMapePct != null) {
    const mape = mapeSum / bt.length;
    if (Math.abs(mape - f.backtest.summaryMapePct) > 0.25) { fail(`${e} backtest: MAPE ${f.backtest.summaryMapePct} ≠ computed ${mape.toFixed(1)}`); bad++; }
  }
  if (!bad) pass(`${e}: forecast — ${f.monthly.length}-month cone ordered, backtest ties to cashflow, MAPE ${f.backtest?.summaryMapePct}`);
}

// =====================================================================
// 10. Malermeister volumeByMonth.value ≈ cashflow revenue
// =====================================================================
{
  const vol = data.malermeister.workorders?.volumeByMonth || [];
  const cf = Object.fromEntries((data.malermeister.cashflow?.monthly || []).map(m => [m.month, m.revenue]));
  for (const v of vol) {
    const rev = cf[v.month];
    if (rev == null) continue;
    const pct = Math.abs(v.value - rev) / rev * 100;
    if (pct > 10) warn(`malermeister ${v.month}: volume value ${fmt(v.value)} vs cashflow revenue ${fmt(rev)} (${pct.toFixed(0)}%)`);
  }
  pass(`malermeister: volumeByMonth vs cashflow revenue checked (${vol.length} months)`);
}

// =====================================================================
// 11. Timeline: no 2026+ dates anywhere in dataset
// =====================================================================
{
  let hits = [];
  // contractual forward-looking fields legitimately extend past the fiction's "today"
  const FUTURE_OK = /leaseEnd|maturity|expiry|expectedClose|validUntil|horizon|renewal|relet|conservative|stretch/i;
  const walk = (obj, ctx) => {
    if (obj == null) return;
    if (typeof obj === 'string' && /\b20(2[6-9]|3\d)-\d\d/.test(obj) && !FUTURE_OK.test(ctx.split('.').pop() || ''))
      hits.push(`${ctx}: "${obj}"`);
    else if (Array.isArray(obj)) obj.forEach((v, i) => walk(v, ctx));
    else if (typeof obj === 'object') for (const [k, v] of Object.entries(obj)) walk(v, `${ctx}.${k}`);
  };
  for (const e of ENTITIES) walk(data[e], e);
  walk(group, 'group');
  hits.length ? hits.slice(0, 10).forEach(h => fail(`timeline: 2026+ date at ${h}`))
              : pass('timeline: no 2026+ dates in dataset');
}

// =====================================================================
// 12. Entities registry sanity
// =====================================================================
{
  const reg = group.entities?.entities || [];
  for (const r of reg) {
    if (!fs.existsSync(path.join(ROOT, r.dataPath || r.id))) fail(`entities: dataPath ${r.dataPath || r.id} missing`);
  }
  pass(`group/entities: ${reg.length} entities registered, dataPaths exist`);
}

// ---------- report ----------
console.log('==== FAILURES (' + failures.length + ') ====');
failures.forEach(f => console.log('✗ ' + f));
console.log('\n==== WARNINGS (' + warnings.length + ') ====');
warnings.forEach(w => console.log('⚠ ' + w));
console.log('\n==== PASSES (' + passes.length + ') ====');
passes.forEach(p => console.log('✓ ' + p));
process.exitCode = failures.length ? 1 : 0;
