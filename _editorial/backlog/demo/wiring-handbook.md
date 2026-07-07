# Wiring handbook — пересборка демо-интерфейсов на датасете

**Назначение: единственный документ, который нужно прочитать перед фазой wiring.**
План фазы: [[wire-up-and-consolidation]]. Словарь данных: `_data/demo/README.md`.
Состояние на 2026-07-07: **данные готовы и самодостаточны** — все обещанные экраны
Atlas / Columbus / Forecast / Corsair обеспечены данными; консолидация холдинга
собирается из YAML чистой арифметикой (референс: `scripts/consolidate-demo-data.cjs`).

## Якоря (не передоговариваемся)

- Фикшн-«сегодня» **2025-03-28**, валюта отчётности **AED**, USD пег 3.6725, EUR spot 3.95.
- Интегрити-чек: **`npm run demo:verify`** (`scripts/verify-demo-data.cjs`) — обязан давать
  0 failures после любой правки данных. Он же кодирует учётную политику:
  disputed = exposure (вне AR/AP), `incoming-counterclaim` = условный актив (вне AP),
  открытые FX-позиции по споту, открытые intercompany-балансы зеркальны в обеих книгах.
- Eleventy исполняет `.cjs` внутри `_data` как глобальные данные — поэтому verify живёт в
  `scripts/`. Этот же механизм — штатный путь для вычисляемой консолидации на этапе wiring
  (обернуть `consolidate-demo-data.cjs` в `_data/demo/consolidated.cjs`).
- Liquid-доступ к дефисным ключам — только скобками: `demo["crisis-theater"]`.
- Реестр бизнесов/цветов/dataPath — `group/entities.yml`; переключатель сущностей читает его.

## Продукт → бизнес → данные → экраны

| Продукт | Бизнес | Экран | Данные |
|---|---|---|---|
| **Corsair** | crisis-theater (позже — вся группа) | уже подключён (8 стр.) | см. «рассинхроны» ниже |
| **Atlas** | spotlights | dashboard | `cashflow` (посл. строка), `commitments`, `alerts` |
| | | invoice-документ | `invoices` + `payments` (образец: `SPL-2025-091` paid, `SPL-2025-098` intercompany) |
| | | pipeline kanban | **`deals.yml`**: `stageDefaults` (new 0.10 → negotiation 0.70), карточка = title/client/value/owner/nextStep; weighted = Σ value×probability по открытым стадиям (won/lost вне доски — для win-rate) |
| | | склад (если делаем) | `products.yml` — полный `stock` (onHand/reserved/onOrder/reorderPoint, 240 кабинетов «в пути с декабря») |
| **Columbus** | crisis-theater | clients | `clients.yml` + контакты из `thread.yml#contacts` |
| | | thread | **`thread.yml`**: фазы (`phaseModel`), entries (type/title/body/refs), `smallThings`, `promises` (kept/broken), `produced`; quiet-алерт = today − `lastTouch` > `quietAfterDays` (живой кейс — Aldira, молчит с 2025-02-15) |
| | | ledger | **`reciprocity.yml`**: `balance = Σ received − Σ given` (weights 1–3), `status: overdrawn` → красным (кейс — DTCM) |
| | | warm-leads | **`referrals.yml`**: from/via → fitScore → чек-лист `ask` → `testimonials`; кросс-селл в группу: `handedToDeal: deal-2503-021` (Meraas → Spotlights) |
| **Forecast** | все 4 + группа | cockpit / fan-chart | **`forecast.yml`**: история из `cashflow` (revenue), конус `monthly[].p10/p50/p90` + `plan` (Apr–Dec 2025) |
| | | backtest strip | `backtest.months` (actual ≡ cashflow), `summaryMapePct`; у Legacy — структурный разрыв (114% miss, показан честно) |
| | | scenarios | `scenarios.drivers` (base/conservative/stretch, у каждого бизнеса свои) + `scenarios.cases` (revenueFY2025) |
| **Jeeves** | все 4 | нуджи в Corsair | `jeeves.yml` — 6 линз; правила анти-галлюцинаций: [[jeeves-spec]] |

Watchtower и Fanfare — вне этого датасета (осознанно, решение 2026-07-06).

## Консолидация — референс и приёмочные числа

`node scripts/consolidate-demo-data.cjs` — алгоритм: Σ помесячных `cashflow` четырёх
бизнесов → минус intercompany-выручка из `group/intercompany.yml#transactions` → открытые
IC-балансы (`settlement: "open"`) неттятся из AR и AP одновременно. FX сейчас no-op
(cashflow всех бизнесов в AED); слой курсов готов в `group/fx.yml`.

Приёмочный тест wiring-а — экраны должны показать ровно это:

| Метрика | Значение (AED) |
|---|---|
| FY2024 consolidated revenue | **74.69M** (76.12M gross − 1.43M IC) |
| FY2024 EBITDA | **8.78M** (CT 1.79 + SPL 1.13 + LEG 5.40 + MAL 0.46) |
| Q1-2025 consolidated revenue | **20.84M** (21.56M − 0.72M IC) |
| Q1-2025 EBITDA | **0.69M** (февраль −1.27M — единственный убыточный месяц группы) |
| Cash @ today | **25.17M** |
| External AR / AP @ today | **5.54M / 2.87M** (6.30/3.63 минус IC-неттинг 0.756M с обеих сторон) |
| Headcount | **52** |

## Известные хардкод-рассинхроны (чинить при wiring, не в данных)

- `demo/corsair/forecast/`, `demo/corsair/reconcile/`, `_includes/special/demo/corsair/modals/monday-digest.html`
  частично хардкодят числа: digest говорит «ADNOC 1.82M due Apr 29», в данных
  `TCT-2025-014` = 1,102,500, Net 90 от 2025-02-01. Источник правды — данные.
- Atlas/Forecast/Columbus хардкодят «Meridian» (EUR, Sofia Ortiz) — ретайрится целиком;
  Watchtower хардкодит «Helios» — не трогаем.
- `crisis-theater/keyPersons.yml` — сатира про внутренний менеджмент, НЕ клиентские
  контакты. Контакты для CRM — `thread.yml#contacts`.
- Forecast-массивы в `<script>` (`const actuals/trend/p50/plan/band`) → заменить чтением
  `forecast.yml` + `cashflow` (fan-chart остаётся на rare-charts).
- У проспектов в `spotlights/clients.yml` (`status: "prospect"`) `paymentTerms`/`creditLimit`
  = null — UI должен это переживать.

## Чек-лист фазы wiring (из [[wire-up-and-consolidation]], дополнено)

- [ ] Переключатель сущностей (по `group/entities.yml`) + обобщённый рендер
- [ ] `_data/demo/consolidated.cjs` (обёртка над `scripts/consolidate-demo-data.cjs`)
- [ ] Atlas → spotlights (dashboard / invoice / pipeline на `deals.yml`)
- [ ] Columbus → crisis-theater (clients / thread / ledger / warm-leads)
- [ ] Forecast → per-entity + группа (`forecast.yml`)
- [ ] Corsair: рассинхроны выше + консолидированный режим
- [ ] После каждого шага: `npm run demo:verify` (0 failures) + `npm run build` + приёмочные числа
