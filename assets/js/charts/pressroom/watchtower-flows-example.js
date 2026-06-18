/* Watchtower product page — "watch the money, not the price" illustration.
   Bars = net HLX flowing into exchange deposit wallets (left axis); line = HLX
   price (right axis). The 2.41M-token inflow spike lands while the price is
   still at its high, and the candle only rolls over in the days after, the
   same whale move the live Alerts screen flags. Synthetic data. */
(function () {
  if (!window.RareCharts) return;
  const d3 = RareCharts.d3;

  const dates = [
    '2026-06-03','2026-06-04','2026-06-05','2026-06-06','2026-06-07','2026-06-08',
    '2026-06-09','2026-06-10','2026-06-11','2026-06-12','2026-06-13','2026-06-14',
    '2026-06-15','2026-06-16','2026-06-17','2026-06-18'
  ].map(d => new Date(d));

  // HLX price index, right axis
  const price = [6.30,6.35,6.42,6.49,6.55,6.60,6.66,6.70,6.64,6.52,6.39,6.28,6.21,6.17,6.23,6.30];
  // Net thousands of HLX moving INTO labelled exchange wallets, left axis.
  // Negative = net withdrawal (coins leaving to cold storage). The 2,410 spike
  // on 11 Jun is the whale deposit; the price only sags afterwards.
  const inflow = [-140,-90,-160,-50,-110,-70,-40,160,2410,1500,820,260,-60,-130,-210,-80];

  const ACCENT = '#5b54f0', INFLOW = '#dc2626';

  new RareCharts.DualAxes('#watchtower-flows-demo', {
    height: 360,
    subtitle: 'Net HLX into exchange wallets (bars) against the HLX price (line)',
    source: 'Synthetic demo data',
    legend: [
      { label: 'Net exchange inflow', color: INFLOW, type: 'bar' },
      { label: 'HLX price', color: ACCENT },
    ],
    curve: 'monotone',
    crosshair: true,
    endLabels: false,
    y1Title: 'Price',
    y2Title: 'Net inflow · K HLX',
    y1Domain: [6.0, 6.85],
    y2Domain: [-500, 2700],
    y1TickFormat: v => '$' + d3.format('.2f')(v),
    y2TickFormat: v => Math.abs(v) < 1e-6 ? '0' : d3.format('+,')(v),
    xTickFormat: d => d3.timeFormat('%d %b')(d),
    annotations: [
      { date: new Date('2026-06-11'), label: '2.41M HLX to a CEX wallet', color: '#8a93a3', strokeDash: '3,3' },
    ],
    tooltipFormat: ({ date, points }) => `
      <div style="color:#8a93a3">${d3.timeFormat('%d %b %Y')(date)}</div>
      ${points.map(p => `<div style="color:${p.color}">${p.name}: ${p.fmt}</div>`).join('')}
    `,
  }).setData([
    { name: 'Net exchange inflow', axis: 'y2', type: 'bar', color: INFLOW,
      values: dates.map((dt, i) => ({ date: dt, value: inflow[i] })) },
    { name: 'HLX price', axis: 'y1', type: 'line', color: ACCENT, strokeWidth: 2.5,
      values: dates.map((dt, i) => ({ date: dt, value: price[i] })) },
  ]);
})();
