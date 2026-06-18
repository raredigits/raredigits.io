# Аудит: соответствие демо-модулей библиотеке Rare Styles

Проверка `assets/css/modules/*.css` против настоящей библиотеки — подключаемого CDN-билда `rare-styles@v0.6.15/rare.min.css` (`_includes/head.html`) и `rare-charts@v0.9.6`. Правило задано в `_editorial/prompts/markup.md`: не изобретаем то, что уже есть в библиотеке; новые стили — в `assets/css/modules/` на токенах; именование в идиоме библиотеки.

Вывод: `forecast.css` и `odoo-fintech.css` держат правильную дисциплину токенов и структуру файла, но **(1) переизобретают готовые компоненты библиотеки и (2) написаны не в той идиоме именования.** Ниже что заменить.

Контекст по библиотеке: 1342 класса; идиома — **kebab-case compound** (`.table-numeric`, `.card-dashboard-bordered`, `.grid-cols-3`), BEM `__`/`--` только у ~17 классов (`.card-grid__item`). То есть тяжёлый BEM-диалект модулей (`.scenario__value`, `.kpi__label`) — НЕ стиль библиотеки.

---

## 🟡 forecast.css — переизобретённые компоненты

Файлы разметки, которые придётся синхронизировать при правке: `demo/forecast/cockpit/index.html`, `demo/forecast/scenarios/index.html`, `demo/forecast/revenue/index.html`, `tools/forecast/index.md`.

### Таблица `.ftable`
- Руками: `.ftable`, `.ftable .r` (числа вправо), `.month`, `.band`, `.basis`, `tr.is-now`.
- В библиотеке есть: `.table-numeric`, `.table-small`, `.table-striped`, `.table-section`, `.table-scroll`.
- → Перевести на библиотечные `.table-*`; собственным оставить только то, чего в них нет (напр. инлайн-полоса `.rangebar`).

### Гриды (рисуются через `display:grid` вручную)
- `.scenario-grid` (repeat(3,1fr)), `.season` (repeat(12,1fr)), `.decomp__legend`, `.lever`, `.backtest__row`.
- В библиотеке есть: `.grid-cols-2…12`, `.grid-cols-fit`, `.grid-cols-fill`.
- → Раскладку отдать библиотечным `.grid-cols-*`; в модуле оставить только специфику внутренностей.

### Карточки `.scenario`
- Руками: `.scenario`, `.scenario--base/--down/--up`, `.scenario__name/__value/__prob/__assumptions`.
- В библиотеке есть: `.card`, `.card-header`, `.card-hover`, `.card-grid`, `.card-grid--cols-3`.
- → Строить на `.card` + `.card-grid--cols-3`; собственным оставить акцентную полосу-цвет сценария и список допущений.

### Fan chart — сырой инлайн-SVG ✅ СДЕЛАНО 18.06.2026
- Было: `.fanchart` + `.band/.median/.actual/.plan/.grid/.nowline/.dot/.nowlabel`.
- **Гейтовый вопрос закрыт:** rare-charts@v0.9.6 умеет нативную серию `band` — данные `{date, lower, upper}`, своя легенда `rc-legend-band`, тултип с диапазоном. То есть P10–P90 cone рисуется библиотекой.
- Сделано: cockpit и revenue переведены на `RareCharts.Line` с band-серией; ручной SVG `.fanchart` и его generic-классы-коллизии (`.grid` переопределял layout-систему библиотеки, `.band/.median/.actual/.plan`) удалены из `forecast.css` вместе с мёртвыми токенами. Бонус: cockpit-конус теперь живой — перерисовывается на переключении сценариев.
- Замечание: `RareCharts.Line` поддерживает только line/band-серии (НЕ bar). На revenue actuals были барами — переведены в сплошную линию (единый канон солид/дашед/конус).

---

## 🟡 Коллизии и именование (оба модуля)

- `.grid` — в библиотеке это система раскладки (`.grid`, `.grid-cols-*`); `forecast.css` переопределяет `.grid` под линии сетки внутри `.fanchart`. Коллизия.
- Голые generic-классы через descendant-селектор: `.fanchart .band/.actual/.plan/.dot`, `.ftable .r/.month/.band/.basis`, `.v`, `.chart-legend .key/.swatch`. Заменить на scoped kebab-имена (`.fanchart-band`, а не `.fanchart .band`).
- BEM-диалект `block__element--modifier` (`.scenario__value`, `.kpi__label`, `.decomp__seg--committed`) — привести к идиоме библиотеки `.component-variant`, кроме случаев расширения настоящих BEM-компонентов библиотеки.
- `.tag-method` — в библиотеке есть `.tag`; связать (вариант `.tag-*`).
- `.season__m` — нечитаемо, → `.season-month`.

---

## 🟢 Что НЕ трогать

- Токены `--fc-*` / `--fin-*` выведены из библиотечных hue — дисциплина верная, оставить.
- `.pill`, `.meter`, `.stepper`, `.modal`, `.kanban` в `odoo-fintech.css` — в библиотеке аналогов нет, это законные новые компоненты модуля (но имена тоже привести к kebab-идиоме при ревизии).

---

## Порядок

1. ✅ Подтвердить возможности rare-charts (есть band) — сделано, см. fan chart выше.
2. ⚠️ Переписать `forecast.css` на `.table-*` / `.grid-cols-*` / `.card*` — **НЕ делали по итогам проверки.** Библиотечные классы не ложатся чисто на эти таблицы/карточки:
   - `.table-numeric` правит-выравнивает ВСЕ нефирстовые колонки (`td:not(:first-child){text-align:right}`), а в `.ftable` есть текстовые колонки («Where in the band», «Basis») — они уедут вправо.
   - `.table-small` ставит `width:fit-content` (не полноширинная таблица).
   - `.card-grid` рассчитан на мелкие плитки (default 5 колонок, `.card-grid__item`), а `.scenario` — крупные контентные карточки.
   - Вывод: форсить эти классы = ломать вёрстку ради идиомы при нулевом визуальном выигрыше. `.ftable` / `.scenario` остаются легитимными компонентами модуля. Косметический BEM→kebab-ренейм внутренностей (`.scenario__value` и т.п.) — отдельная низкоприоритетная задача, не делали.
3. ⏸ `odoo-fintech.css` idiom-pass — отложено (отдельная инфра-итерация, не питч).
