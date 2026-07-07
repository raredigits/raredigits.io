# Фаза 1 — контракт схемы данных

Единый YAML-контракт для холдинга и бизнесов. Утверждаем **до** генерации данных — потом дорого менять. Мастер-план: [[_index]].

Опорные образцы уже в репозитории: `_data/demo/corsair/*.yml` (Crisis Theater). Контракт — это их обобщение + слой группы + полиморфные отгрузки.

---

## Принципы

- **YAML**, по файлу на сущность, папка на бизнес: `_data/demo/<entity>/<sentity>.yml`. Eleventy отдаёт как `demo.<entity>.<sentity>`.
- **Ссылки по id**, не по вложенности. Инвойс ссылается на проект/заказ и клиента по id (как уже сделано в `invoices.yml` → `project`, `client`). Платёж ссылается на инвойс.
- **Внутренняя согласованность** — закон: сумма платежей по инвойсу ≤ его total; строки cashflow = агрегат проводок; payroll в opex = сумма staff salaries; forecast стыкуется с историей.
- **Только токены** для любого цвета/иконки — material symbol name + hex из палитры (как в `units[].color`).
- Каждый бизнес объявляет свой **тип** и **подписи** (в т.ч. ярлык отгрузок) в `company.yml`, чтобы UI читался обобщённо.

---

## Слой группы — `_data/demo/group/`

### `profile.yml`
Профиль холдинга: legalName (Ambitions Inc.), HQ, фискальный календарь (yearEnd, reportingCurrency, FX-таблица курсов к валюте отчётности), reportingPeriod, today.

### `entities.yml`
Реестр бизнесов — единственный источник правды о составе группы:
```yaml
entities:
  - id: "crisis-theater"
    name: "The Crisis Theater"
    type: "events"            # events | distribution | realestate | services
    status: "active"
    currency: "AED"
    ownership: 1.0            # доля холдинга
    fulfillmentLabel: "Завершённые работы"
    products: ["corsair", "atlas", "forecast", "columbus"]  # какие демо-приложения смотрят на этот бизнес
    color: "#8B5CF6"
    dataPath: "crisis-theater"
```

### `fx.yml`
Курсы к валюте отчётности (AED): `spot` (текущий) + помесячный ряд (USD пеггед, EUR плавает) + годовые средние. Нужен для пересчёта периодов при консолидации и делает EUR-шок (Nov 2024 → Feb 2025) явным. FX gain/loss считает metrics-слой (booked vs settlement), не хранится.

### `intercompany.yml`
Внутригрупповые сделки и правила элиминации:
```yaml
relationships:
  - from: "spotlights"        # продавец
    to: "crisis-theater"      # покупатель
    nature: "equipment-supply"
    eliminateOnConsolidation: true
transactions:
  - id: "ic-2024-014"
    from: "spotlights"
    to: "crisis-theater"
    invoice: "SPL-2024-088"   # ссылка на инвойс продавца
    amount: 420000
    currency: "AED"
    date: "2024-11-02"
```

---

## Контракт бизнеса — `_data/demo/<entity>/`

Общая часть (есть у всех). ⬩ — уже существует у Crisis Theater, ✚ — добавить/унифицировать.

| Файл | Назначение | Статус у Crisis Theater |
|---|---|---|
| `company.yml` | профиль, фискал, банки, **type**, **fulfillmentLabel**, units | ⬩ есть (добить type/label) |
| `clients.yml` | клиенты / аккаунты (CRM + ERP) | ⬩ есть |
| `vendors.yml` | поставщики | ⬩ есть |
| `staff.yml` | персонал с зарплатами (salaryMonthly) | ⬩ есть |
| `invoices.yml` | AR + AP, VAT, статусы | ⬩ есть |
| `payments.yml` | **платежи отдельной сущностью** (id, invoice, date, amount, bank, method) | ✚ сейчас зашиты внутрь invoices |
| `commitments.yml` | **предстоящие платежи** — payroll/аренда/VAT/налог/займы/дивиденды (cadence, nextDue, amount). KPI для дашбордов и Jeeves — см. [[kpi-ar-ap-commitments]] | ✚ новая сущность, по всем бизнесам |
| `fulfillments.yml` | **отгрузки** (полиморфно, см. ниже) | ✚ нет |
| `cashflow.yml` | помесячный P&L + кэш (единые колонки) | ⬩ есть (27 мес) |
| `targets.yml` | план/факт по воронке sales→production→deliveries→payments | ⬩ есть |
| `alerts.yml` | правила + активные алерты | ⬩ есть |
| `jeeves.yml` | AI-подсказки (опц., где есть Jeeves) | ⬩ есть |
| `forecast.yml` | помесячный прогноз P10/P50/P90 (Apr–Dec 2025) + драйверы сценариев + 6-мес backtest (actual = cashflow). Питает Forecast | ⬩ есть у всех четырёх (2026-07) |

Тип-специфичные файлы:

| Файл | Для кого | Назначение |
|---|---|---|
| `projects.yml` | events, realestate | проекты/объекты (есть у Crisis Theater) |
| `products.yml` | distribution | каталог (узкий, дорогой ассортимент) |
| `orders.yml` | distribution | заказы / PO |
| `deals.yml` | distribution (Spotlights) | пайплайн продаж для канбана Atlas: stageDefaults (new 0.10 → negotiation 0.70), сделки с client/owner/products/probability; won → ссылка на order (2026-07) |
| `portfolio.yml` | realestate | объекты недвижимости (rent, occupancy, marketValue, loan) |
| `debt.yml` | realestate (где крупный долг) | кредитные facilities (lender, outstanding, rate, debt service, DSCR, covenant) |
| `tickets.yml` | realestate, services | заявки на починку/ремонт (→ fulfillment при закрытии) |
| `valuation.yml` | realestate | помесячная переоценка активов (asset value); non-cash, не в EBITDA — слой total return |
| `workorders.yml` | services (Malermeister) | заказ-наряды |

CRM-слой Columbus (только Crisis Theater — решение 3 в [[wire-up-and-consolidation]]):

| Файл | Назначение |
|---|---|
| `thread.yml` | контакты у клиентов + треды отношений: фазы (`phaseModel`), записи, «мелочи», обещания (kept/broken), quiet-detection (`quietAfterDays` vs `lastTouch`) |
| `reciprocity.yml` | реестр взаимности: entries given/received с весами 1–3, `balance = Σ received − Σ given`, статус overdrawn |
| `referrals.yml` | тёплые лиды: from/via по существующим отношениям, fitScore, чек-лист ask, тестимониалы; cross-sell в группу через `handedToDeal` |

Инварианты проверяются скриптом: `npm run demo:verify` (`scripts/verify-demo-data.cjs`).

---

## Полиморфные отгрузки — `fulfillments.yml`

Базовая форма, одинаковая у всех (UI рисует по ней):
```yaml
fulfillments:
  - id: "f-..."
    date: "2025-02-14"
    status: "completed"       # planned | in-progress | completed | accepted | invoiced
    counterparty: "<client-id>"
    source: "<project|order|workorder-id>"
    value: 0                  # признанная стоимость
    currency: "AED"
```
Тип-специфичные поля поверх базы:

| Тип | Доп. поля | Подпись |
|---|---|---|
| events (Crisis Theater) | `deliverable`, `eventDate` | «Завершённые работы» |
| distribution (Spotlights) | `shipmentNo`, `carrier`, `items[]`, `deliveryStatus`, `pod` (proof of delivery) | «Отгрузки» |
| realestate (Legacy) | `unit`, `handoverType` (новый объект / ремонт / тикет), `ticketRef` | «Сдача / закрытые тикеты» |
| services (Malermeister) | `vehicle`, `workorder`, `bay` | «Выданные авто» |

---

## Открытые вопросы

Наследуются из [[_index]]: валюта отчётности группы и валюты бизнесов; каноническое «сегодня»; элиминация intercompany в консолидации. Решить здесь же при утверждении контракта.

## Статус
- [ ] Контракт группы (`profile`/`entities`/`intercompany`) утверждён
- [ ] Контракт бизнеса (общая часть) утверждён
- [ ] Полиморфные отгрузки утверждены
- [ ] → переход к Фазе 2 (слой группы) и Фазе 3 (переезд Crisis Theater)
