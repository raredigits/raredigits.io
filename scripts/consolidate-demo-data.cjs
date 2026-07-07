// Ambitions Inc. — reference consolidation over _data/demo (the future Consolidation API).
// Sum entity cashflows on the common column contract, eliminate intercompany revenue,
// net open intercompany balances out of group AR/AP. FX is a no-op today (all entity
// cashflows are AED); rates live in group/fx.yml for when that changes.
//
// Run:    node scripts/consolidate-demo-data.cjs          (prints the group report)
// Wire:   wrap as _data/demo/consolidated.cjs — Eleventy executes .cjs in _data as
//         global data, so templates get demo.consolidated at build time.
// Acceptance numbers: _editorial/backlog/demo/wiring-handbook.md.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..', '_data', 'demo');
const load = (p) => yaml.load(fs.readFileSync(path.join(ROOT, p), 'utf8'));

function consolidate() {
  const entities = load('group/entities.yml').entities.filter((e) => e.status === 'active');
  const ic = load('group/intercompany.yml');
  const fx = load('group/fx.yml');
  const profile = load('group/profile.yml');

  const cashflows = {};
  for (const e of entities) cashflows[e.id] = load(`${e.dataPath || e.id}/cashflow.yml`).monthly;

  // intercompany revenue to eliminate, by month
  const icRevByMonth = {};
  for (const t of ic.transactions) {
    const m = t.date.slice(0, 7);
    icRevByMonth[m] = (icRevByMonth[m] || 0) + t.amount;
  }

  // union of months across entities (CT starts 2023-01, others 2024-01)
  const months = [...new Set(Object.values(cashflows).flat().map((r) => r.month))].sort();

  const monthly = months.map((month) => {
    const row = { month, revenue: 0, cogs: 0, gp: 0, opex: 0, ebitda: 0, cashEnd: 0, arEnd: 0, apEnd: 0, headcount: 0, byEntity: {} };
    for (const e of entities) {
      const r = cashflows[e.id].find((x) => x.month === month);
      if (!r) continue;
      for (const k of ['revenue', 'cogs', 'gp', 'opex', 'ebitda', 'cashEnd', 'arEnd', 'apEnd', 'headcount']) row[k] += r[k] ?? 0;
      row.byEntity[e.id] = { revenue: r.revenue, ebitda: r.ebitda, color: e.color };
    }
    row.icEliminated = icRevByMonth[month] || 0;
    row.revenueConsolidated = row.revenue - row.icEliminated;
    // gross profit nets identically (seller's revenue vs buyer's cogs); EBITDA is unaffected
    row.cogsConsolidated = row.cogs - row.icEliminated;
    return row;
  });

  // open intercompany balances net out of group AR and AP symmetrically (VAT-inclusive)
  const openIC = ic.transactions
    .filter((t) => t.settlement === 'open')
    .reduce((s, t) => s + t.amount * 1.05, 0);
  const last = monthly[monthly.length - 1];

  const sumWindow = (from, to, key) =>
    monthly.filter((m) => m.month >= from && m.month <= to).reduce((s, m) => s + m[key], 0);

  return {
    asOf: fx.spot.asOf,
    reportingCurrency: profile.reportingCurrency || 'AED',
    entities: entities.map((e) => ({ id: e.id, name: e.name, type: e.type, color: e.color, currency: e.currency })),
    monthly,
    position: {
      cash: last.cashEnd,
      arGross: last.arEnd,
      apGross: last.apEnd,
      icNetted: openIC,
      arExternal: last.arEnd - openIC,
      apExternal: last.apEnd - openIC,
      headcount: last.headcount,
    },
    fy2024: {
      revenueGross: sumWindow('2024-01', '2024-12', 'revenue'),
      icEliminated: sumWindow('2024-01', '2024-12', 'icEliminated'),
      revenue: sumWindow('2024-01', '2024-12', 'revenueConsolidated'),
      ebitda: sumWindow('2024-01', '2024-12', 'ebitda'),
    },
    q1_2025: {
      revenueGross: sumWindow('2025-01', '2025-03', 'revenue'),
      icEliminated: sumWindow('2025-01', '2025-03', 'icEliminated'),
      revenue: sumWindow('2025-01', '2025-03', 'revenueConsolidated'),
      ebitda: sumWindow('2025-01', '2025-03', 'ebitda'),
    },
  };
}

module.exports = consolidate;

if (require.main === module) {
  const c = consolidate();
  const M = (n) => (n / 1e6).toFixed(2) + 'M';
  console.log(`Ambitions Inc. — consolidated (${c.reportingCurrency}, as of ${c.asOf})`);
  console.log(`FY2024:  revenue ${M(c.fy2024.revenue)} (gross ${M(c.fy2024.revenueGross)} − IC ${M(c.fy2024.icEliminated)}) | EBITDA ${M(c.fy2024.ebitda)}`);
  console.log(`Q1-2025: revenue ${M(c.q1_2025.revenue)} (gross ${M(c.q1_2025.revenueGross)} − IC ${M(c.q1_2025.icEliminated)}) | EBITDA ${M(c.q1_2025.ebitda)}`);
  console.log(`Position: cash ${M(c.position.cash)} | external AR ${M(c.position.arExternal)} | external AP ${M(c.position.apExternal)} | headcount ${c.position.headcount}`);
}
