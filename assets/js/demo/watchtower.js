/* ============================================================================
   watchtower.js — runtime for the Watchtower demo (blockchain network monitor).

   Drives the period segmented control (24H / 7D / 30D) and the Overview layout
   switcher (Grid / Briefing / Dense), regenerating all period-derived series,
   KPIs and charts. Big charts are rendered with RareCharts (Line / Donut /
   Gauge); the KPI sparklines and the grouped inbound/outbound bars are small
   hand-built inline SVG.

   All figures are synthetic and generated deterministically from fixed seeds so
   the numbers stay consistent across screens and reloads. Swap renderVals() for
   real RPC / indexer queries on a production build.

   Page contract:
     <body class="wt" data-wt-screen="overview|transactions|staking|alerts">
     period buttons:  [data-wt-period="24h|7d|30d"]
     layout buttons:  [data-wt-layout-btn="grid|briefing|dense"]
     layout sections: [data-wt-layout="grid|briefing|dense"]
     text slots:      [data-val="<key>"]
     chart slots:     [data-chart="spark|flow|tvl|staking|health|donut|txbars"]
   ============================================================================ */

(function () {
  'use strict';

  var COLORS = {
    primary: '#5b54f0', teal: '#19b3a6', pos: '#16a34a',
    grid: '#f0f1f5', track: '#eef0f3', ink: '#1a1d23'
  };

  /* ---- deterministic PRNG + series (ported from the design reference) ---- */
  function rng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function mkSeries(n, base, vol, seed) {
    var r = rng(seed), out = [];
    for (var i = 0; i < n; i++) {
      var wave = Math.sin((i / Math.max(1, n - 1)) * Math.PI * 1.6 + seed) * 0.10;
      out.push(base * (1 + wave + (r() - 0.5) * vol));
    }
    return out;
  }
  function fmt(n) {
    var a = Math.abs(n);
    if (a >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (a >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return String(Math.round(n));
  }
  function usd(n) {
    var a = Math.abs(n);
    if (a >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (a >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
    return '$' + Math.round(n);
  }

  /* ---- date axis for the period ----------------------------------------- */
  function axisDates(n, period) {
    var out = [], now = new Date('2026-06-18T09:00:00');
    var stepMs = period === '24h' ? 3600e3 : 86400e3;
    for (var i = n - 1; i >= 0; i--) out.push(new Date(now.getTime() - i * stepMs));
    return out;
  }
  function toSeries(values, dates) {
    return values.map(function (v, i) { return { date: dates[i], value: v }; });
  }

  /* ---- hand-built micro charts ------------------------------------------ */
  function mkSpark(series, color) {
    var W = 200, H = 34, p = 4;
    var mn = Math.min.apply(null, series), mx = Math.max.apply(null, series), rg = (mx - mn) || 1;
    var x = function (i) { return (i / (series.length - 1)) * W; };
    var y = function (v) { return p + (1 - (v - mn) / rg) * (H - 2 * p); };
    var d = '';
    series.forEach(function (v, i) { d += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1) + ' '; });
    var gid = 'wtsp' + Math.round(Math.random() * 1e6);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + color + '" stop-opacity=".22"/>' +
      '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + d + 'L' + W + ' ' + H + ' L0 ' + H + ' Z" fill="url(#' + gid + ')"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' +
      '</svg>';
  }
  function mkGroupedBars(layers, h) {
    var W = 640, H = h || 190, p = 12, n = layers[0].series.length;
    var all = []; layers.forEach(function (l) { all = all.concat(l.series); });
    var mx = Math.max.apply(null, all) * 1.06;
    var gw = W / n, bw = Math.min(13, (gw * 0.62) / layers.length);
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" style="width:100%;height:' + H + 'px;display:block">';
    [0, 0.5, 1].forEach(function (f) {
      var gy = p + f * (H - 2 * p);
      svg += '<line x1="0" x2="' + W + '" y1="' + gy + '" y2="' + gy + '" stroke="' + COLORS.grid + '" stroke-width="1"/>';
    });
    for (var i = 0; i < n; i++) {
      layers.forEach(function (l, li) {
        var v = l.series[i], bh = (v / mx) * (H - 2 * p);
        var x = i * gw + gw / 2 - (layers.length * bw) / 2 + li * bw;
        svg += '<rect x="' + x.toFixed(1) + '" y="' + (H - p - bh).toFixed(1) + '" width="' +
          Math.max(2, bw - 2) + '" height="' + Math.max(0, bh).toFixed(1) + '" rx="2" fill="' + l.color + '" opacity=".92"/>';
      });
    }
    return svg + '</svg>';
  }

  /* ---- all period-derived values (mirrors the reference renderVals) ------ */
  function renderVals(period) {
    var n = period === '24h' ? 24 : period === '7d' ? 7 : 30;
    var mult = period === '24h' ? 1 : period === '7d' ? 6.9 : 30;
    var dates = axisDates(n, period);
    var periodLabel = period === '24h' ? 'last 24h' : period === '7d' ? 'last 7 days' : 'last 30 days';

    var inflow = mkSeries(n, 1240000, 0.12, 11);
    var outflow = mkSeries(n, 1190000, 0.12, 47);
    var active = mkSeries(n, 312000, 0.10, 23);
    var tvl = mkSeries(n, 4.82e9, 0.05, 31);
    var stake = mkSeries(n, 67.4, 0.008, 9);

    var avg = function (s) { return s.reduce(function (a, b) { return a + b; }, 0) / s.length; };
    var inTot = avg(inflow) * mult, outTot = avg(outflow) * mult, net = inTot - outTot;
    var perHour = period === '24h' ? 24 : 1;

    return {
      period: period, periodLabel: periodLabel, dates: dates,
      series: { inflow: inflow, outflow: outflow, active: active, tvl: tvl, stake: stake },
      val: {
        periodLabel: periodLabel,
        kpiInbound: fmt(inTot),    kpiInboundSub: 'avg ' + fmt(inTot / n / perHour) + '/h',
        kpiOutbound: fmt(outTot),  kpiOutboundSub: 'avg ' + fmt(outTot / n / perHour) + '/h',
        kpiActive: fmt(active[active.length - 1] * (period === '24h' ? 1 : mult * 0.6)),
        flowInTotal: fmt(inTot), flowOutTotal: fmt(outTot),
        flowNet: (net >= 0 ? '+' : '') + fmt(net),
        tvlValue: usd(tvl[tvl.length - 1]),
        txTotal: fmt(inTot + outTot),
        txFailed: fmt((inTot + outTot) * 0.006) + ' failed'
      }
    };
  }

  /* ---- decentralization donut data -------------------------------------- */
  var DONUT = [
    { label: 'Stride Labs', value: 8.4, color: '#5b54f0' },
    { label: 'Cosmostation', value: 7.1, color: '#7a72f5' },
    { label: 'Figment', value: 6.2, color: '#19b3a6' },
    { label: 'Allnodes', value: 5.5, color: '#5cc4ba' },
    { label: 'others (171)', value: 72.8, color: '#c7cad6' }
  ];

  /* ---- rare-charts factories -------------------------------------------- */
  var RC = window.RareCharts;
  var d3 = RC && RC.d3;

  function lineChart(host, seriesDefs, opts) {
    if (!RC) return null;
    var c = new RC.Line(host, Object.assign({
      height: opts.height || 190,
      margin: { top: 10, right: 54, bottom: 24, left: 12 },
      curve: 'monotone',
      area: true, areaBaseline: 'min',
      legend: [], endLabels: false,
      xTicks: 5,
      xTickFormat: function (dd) { return d3.timeFormat(opts.period === '24h' ? '%H:00' : '%d %b')(dd); },
      yTickFormat: opts.yFmt
    }, opts.extra || {}));
    c.setData(seriesDefs);
    return c;
  }

  function buildChart(node, vals) {
    var type = node.getAttribute('data-chart');
    var period = vals.period;

    if (type === 'spark') {
      var key = node.getAttribute('data-spark');
      var color = node.getAttribute('data-color') || COLORS.primary;
      var s = key === 'staking' ? vals.series.stake : vals.series[key] || vals.series.inflow;
      node.innerHTML = mkSpark(s, color);
      return;
    }
    if (type === 'txbars') {
      node.innerHTML = mkGroupedBars(
        [{ series: vals.series.inflow, color: COLORS.primary },
         { series: vals.series.outflow, color: COLORS.teal }], 190);
      return;
    }

    if (!RC) return;
    node.innerHTML = '';

    if (type === 'flow') {
      lineChart(node, [
        { name: 'Inbound', color: COLORS.primary, values: toSeries(vals.series.inflow, vals.dates) },
        { name: 'Outbound', color: COLORS.teal, values: toSeries(vals.series.outflow, vals.dates) }
      ], { period: period, height: +node.dataset.h || 190, yFmt: function (v) { return fmt(v); } });
    } else if (type === 'tvl') {
      lineChart(node, [
        { name: 'TVL', color: COLORS.primary, values: toSeries(vals.series.tvl, vals.dates) }
      ], { period: period, height: +node.dataset.h || 120, yFmt: function (v) { return usd(v); } });
    } else if (type === 'staking') {
      lineChart(node, [
        { name: 'Staking ratio', color: COLORS.pos, values: toSeries(vals.series.stake, vals.dates) }
      ], { period: period, height: +node.dataset.h || 170, yFmt: function (v) { return v.toFixed(0) + '%'; } });
    } else if (type === 'health') {
      new RC.Gauge(node, {
        height: +node.dataset.h || 150, color: COLORS.pos,
        thickness: 0.16, cornerRadius: 8,
        centerText: function (v) { return String(v); }, centerLabel: '/ 100'
      }).setData(86);
    } else if (type === 'donut') {
      new RC.Donut(node, {
        height: +node.dataset.h || 150, innerRadius: 0.66, legend: [],
        centerText: function () { return '19'; }, centerLabel: 'Nakamoto'
      }).setData(DONUT);
    }
  }

  /* ---- render one section (overview layout, or a whole simple screen) ---- */
  function renderSection(section, vals) {
    if (!section) return;
    section.querySelectorAll('[data-val]').forEach(function (el) {
      var key = el.getAttribute('data-val');
      if (vals.val[key] != null) el.textContent = vals.val[key];
    });
    section.querySelectorAll('[data-chart]').forEach(function (node) { buildChart(node, vals); });
  }

  /* ---- wiring ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var screen = document.body.getAttribute('data-wt-screen');
    var period = localStorage.getItem('wt-period') || '24h';
    var layout = localStorage.getItem('wt-layout') || 'grid';

    function activeSection() {
      if (screen === 'overview') return document.querySelector('[data-wt-layout].is-active');
      return document.querySelector('[data-wt-content]') || document.body;
    }

    function paintPeriodBtns() {
      document.querySelectorAll('[data-wt-period]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-wt-period') === period);
      });
    }
    function paintLayoutBtns() {
      document.querySelectorAll('[data-wt-layout-btn]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-wt-layout-btn') === layout);
      });
    }

    function mountLayout() {
      document.querySelectorAll('[data-wt-layout]').forEach(function (s) {
        s.classList.toggle('is-active', s.getAttribute('data-wt-layout') === layout);
      });
    }

    function render() {
      var vals = renderVals(period);
      renderSection(activeSection(), vals);
    }

    paintPeriodBtns();
    document.querySelectorAll('[data-wt-period]').forEach(function (b) {
      b.addEventListener('click', function () {
        period = b.getAttribute('data-wt-period');
        localStorage.setItem('wt-period', period);
        paintPeriodBtns();
        render();
      });
    });

    if (screen === 'overview') {
      paintLayoutBtns();
      mountLayout();
      document.querySelectorAll('[data-wt-layout-btn]').forEach(function (b) {
        b.addEventListener('click', function () {
          layout = b.getAttribute('data-wt-layout-btn');
          localStorage.setItem('wt-layout', layout);
          paintLayoutBtns();
          mountLayout();
          render();
        });
      });
    }

    render();
  });
})();
