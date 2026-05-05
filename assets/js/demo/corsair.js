/* ============================================================
 * Corsair HQ Demo — modal + scenario interactions
 * Uses native <dialog> element for popups; no framework deps.
 * ============================================================ */
(function () {
    'use strict';

    // ---------- Modal opener ----------
    function openModal(id) {
        var dlg = document.getElementById(id);
        if (!dlg) return;
        if (typeof dlg.showModal === 'function') {
            dlg.showModal();
        } else {
            // graceful fallback for very old browsers
            dlg.setAttribute('open', '');
        }
    }

    function closeModal(dlg) {
        if (!dlg) return;
        if (typeof dlg.close === 'function') {
            dlg.close();
        } else {
            dlg.removeAttribute('open');
        }
    }

    // open: data-modal="modal-id" anywhere
    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-modal]');
        if (trigger) {
            e.preventDefault();
            openModal(trigger.getAttribute('data-modal'));
            return;
        }
        var closer = e.target.closest('[data-close-modal]');
        if (closer) {
            e.preventDefault();
            closeModal(closer.closest('dialog'));
            return;
        }
        // backdrop click closes
        if (e.target.tagName === 'DIALOG' && e.target.classList.contains('corsair-modal')) {
            var rect = e.target.getBoundingClientRect();
            var inside = rect.top <= e.clientY && e.clientY <= rect.top + rect.height
                && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
            if (!inside) closeModal(e.target);
        }
    });

    // ---------- Scenario toggles (Forecast page) ----------
    // Each .scenario-toggle has data-impact="<AED int>" and data-scenario="<id>"
    // Recompute summary tiles + forecast bars based on which toggles are .active
    function recomputeForecast() {
        var rail = document.querySelector('.scenario-rail');
        if (!rail) return;

        var monthlyOpex = parseInt(rail.dataset.monthlyOpex || '2785000', 10);
        var baseUnrestricted = parseInt(rail.dataset.baseUnrestricted || '9100000', 10);

        var totalImpact = 0;
        document.querySelectorAll('.scenario-toggle.active').forEach(function (t) {
            totalImpact += parseInt(t.dataset.impact || '0', 10);
        });

        var bars = document.querySelectorAll('.forecast-chart .fc-bar');
        if (!bars.length) return;
        var maxBarVal = parseInt(rail.dataset.barMax || '15000000', 10);

        // Update bars and find end-of-horizon + lowest week
        var endOfHorizon = baseUnrestricted + totalImpact;
        var lowestWeek = baseUnrestricted + totalImpact;
        bars.forEach(function (bar, idx) {
            var baseVal = parseInt(bar.dataset.base || '0', 10);
            // Impact ramps in over 8 weeks then full
            var impactAtWeek = totalImpact * Math.min(1, idx / 8);
            var v = baseVal + impactAtWeek;
            var pct = Math.max(2, Math.round((v / maxBarVal) * 100));
            bar.style.height = pct + '%';
            bar.classList.remove('danger', 'warn', 'good');
            if (v < 4000000) bar.classList.add('danger');
            else if (v < 7000000) bar.classList.add('warn');
            else bar.classList.add('good');
            if (idx === bars.length - 1) endOfHorizon = v;
            if (v < lowestWeek) lowestWeek = v;
        });

        // Runway based on starting cash + impact, against full burn
        var startingCashWithImpact = baseUnrestricted + totalImpact;
        var newRunwayDays = Math.round((startingCashWithImpact / monthlyOpex) * 30);

        // Update summary tiles
        var cashEl = document.getElementById('forecast-cash-value');
        var runwayEl = document.getElementById('forecast-runway-value');
        var deltaEl = document.getElementById('forecast-delta-value');
        var lowestEl = document.getElementById('forecast-lowest-value');

        if (cashEl) cashEl.textContent = (endOfHorizon / 1000000).toFixed(1) + 'M';
        if (lowestEl) lowestEl.textContent = (lowestWeek / 1000000).toFixed(1) + 'M';
        if (runwayEl) {
            runwayEl.textContent = newRunwayDays + 'd';
            runwayEl.className = 'forecast-value ' +
                (newRunwayDays >= 90 ? 'green' : newRunwayDays >= 60 ? '' : 'red');
        }
        if (deltaEl) {
            if (totalImpact === 0) {
                deltaEl.className = 'forecast-delta';
                deltaEl.textContent = 'base case · no toggles applied';
            } else {
                var sign = totalImpact >= 0 ? '+' : '−';
                var dCls = totalImpact > 0 ? 'up' : 'down';
                deltaEl.className = 'forecast-delta ' + dCls;
                deltaEl.textContent = sign + (Math.abs(totalImpact) / 1000).toFixed(0) + 'K vs base case';
            }
        }
    }

    document.addEventListener('click', function (e) {
        var t = e.target.closest('.scenario-toggle');
        if (!t) return;
        e.preventDefault();
        t.classList.toggle('active');
        recomputeForecast();
    });

    // initialise once on load (in case some toggles start active)
    document.addEventListener('DOMContentLoaded', recomputeForecast);
})();
