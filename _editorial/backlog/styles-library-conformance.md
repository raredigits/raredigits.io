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

### Fan chart — сырой инлайн-SVG
- `.fanchart` + `.band/.median/.actual/.plan/.grid/.nowline/.dot/.nowlabel`.
- На странице уже подключён **rare-charts@v0.9.6**, который знает про band / quantile / forecast.
- → Проверить, рисует ли rare-charts P10–P90 cone; если да — выкинуть ручной SVG. Если нет — оставить, но переименовать (см. ниже) и не плодить generic-классы.

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

1. Сначала подтвердить возможности rare-charts (есть ли fan/cone) — от этого зависит судьба `.fanchart`.
2. Переписать `forecast.css` на `.table-*` / `.grid-cols-*` / `.card*`, синхронизируя 4 файла разметки выше.
3. Затем тем же подходом ревизовать `odoo-fintech.css`.
