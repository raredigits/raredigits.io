# Бизнес: The Crisis Theater — переезд в холдинг

Существующий, самый богатый датасет. Тип — **events** (experiential продакшн, Дубай, AED). Сейчас живёт в `_data/demo/corsair/` и питает Corsair HQ. Задача — переселить под контракт холдинга и добить недостающие сущности, **ничего не сломав** на 8 экранах Corsair. Контракт — [[schema-contract]], план — [[_index]].

> Важно: `corsair` — имя **продукта** (Corsair HQ), а не компании. Сейчас папка данных названа по продукту — отсюда путаница. URL `/demo/corsair/` остаётся (это продукт). Меняем только **неймспейс данных**.

---

## Что уже есть (не трогаем содержимое, только переезжаем)

`company, clients, vendors, staff, projects, invoices, cashflow (27 мес), targets, alerts, jeeves` + навигация и key-persons. Профиль: The Crisis Theater FZ-LLC, «Designed Disasters. Delivered Joy.», AED, FX-пег 3.6725, «сегодня» 2025-03-28.

## Что добить под контракт

- ✚ `payments.yml` — вынести платежи отдельной сущностью (сейчас зашиты полями `paid`/`paidDate` внутри `invoices.yml`). Инвойсы оставить, добавить нормализованные платежи со ссылкой `invoice`.
- ✚ `fulfillments.yml` — отгрузки типа **events**: завершённые работы / сданные этапы (`deliverable`, `eventDate`), ссылка на `projects`. Источник — `projects` со статусом delivered/closed + `targets.production`.
- ✚ `company.yml` — добавить `type: "events"` и `fulfillmentLabel: "Завершённые работы"`.
- ✚ Добавить запись в `group/entities.yml` и пары внутригрупповых сделок в `group/intercompany.yml` (закупка/аренда оборудования у Spotlights).

---

## Rename: `_data/demo/corsair/` → `crisis-theater/`

Сквозной, но механический рефактор (образец процесса — [[task-rename-demo-atlas]]).

### 1. Переместить файлы данных (`git mv`)
`_data/demo/corsair/*.yml` → `_data/demo/crisis-theater/*.yml`. Заодно переименовать `corsairNav.yml` → `nav.yml`, `corsairKeyPersons.yml` → `key-persons.yml` (убрать продуктовый префикс из имён).

### 2. Решить ключ доступа в шаблонах
Eleventy отдаёт папку как `demo['crisis-theater']` (дефис → доступ через скобки). Варианты: (а) папка `crisisTheater` (camelCase, тогда `demo.crisisTheater.*`); (б) папка `crisis-theater` + везде обращаться `demo[entity.dataPath]` для обобщённого кода. Рекомендация: **(б)** — готовит почву под обобщённый рендер по всем бизнесам. Зафиксировать при старте.

### 3. Обновить ссылки `demo.corsair.*` (точный список — grep ниже)
Экраны (`demo/corsair/<screen>/index.html`): `index` (dashboard), `forecast`, `settings`, `money`, `production`, `reconcile`, `finance`, `notification`, `staff`.
Инклуды: `_includes/special/demo/corsair/header.html`, `_includes/special/demo/corsair/modals/unit-drilldown.html`, `_includes/special/demo/corsair/modals/umbrella-casefile.html`.

### 4. Проверка, что ничего не осталось
```
grep -rn "demo\.corsair\|demo/corsair/.*\.yml\|corsairNav\|corsairKeyPersons" --include="*.html" --include="*.njk" --include="*.md" . | grep -v _site | grep -v node_modules
```

### Не трогаем
- URL `/demo/corsair/*` и папку `demo/corsair/` (разметка экранов) — это продукт Corsair, не компания.
- Путь инклудов `_includes/special/demo/corsair/` — продуктовый; можно оставить (низкий приоритет на переименование).
- `_site/` пересоберётся сам.

---

## Статус
- [x] `payments.yml` вынесен (31 платежа: 25 AR + 6 AP, сгенерированы из invoices.yml)
- [x] `fulfillments.yml` (events) собран (28 завершённых работ из delivered/closed проектов)
- [x] `company.yml` — type: "events" + fulfillmentLabel: "Completed works"
- [x] Rename выполнен: `_data/demo/corsair/` → `crisis-theater/`; `corsairNav`→`nav.yml`, `corsairKeyPersons`→`keyPersons.yml`; все ссылки → `demo["crisis-theater"]` (Liquid bracket-доступ, hyphen-ключ); grep чист
- [x] Запись в `group/entities.yml` (dataPath: "crisis-theater") + 4 intercompany-сделки со Spotlights
- [x] Сборка проверена: дашборд/money/staff/production привязали данные (бренд, кэш, воронка, nav, keyPersons, AR/AP) — `undefined` нет

> Решение по ключу: выбран **kebab `crisis-theater`** (как остальные папки-сущности), доступ `demo["crisis-theater"]`. URL `/demo/corsair/`, layout `demo/corsair` и инклуды `_includes/special/demo/corsair/` оставлены — это имя **продукта** Corsair, не компании.
