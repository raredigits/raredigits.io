# Бизнес: Spotlights Ltd — дистрибьютор pro-AV / сценического оборудования

Новый бизнес, собирается **с нуля** по контракту [[schema-contract]]. Тип — **distribution**. Узкий ассортимент дорогих позиций (LED-стены, световые риги, звуковые комплекты, моторы/лебёдки, контроллеры). План — [[_index]].

Почему именно pro-AV/staging: даёт естественные **внутригрупповые** сделки — продаёт/сдаёт оборудование Crisis Theater (события) и оснащает объекты Legacy Development. Это оживляет консолидацию и элиминацию (см. `group/intercompany.yml`).

«Отгрузка» здесь буквальная: **доставка товара** — `shipmentNo`, перевозчик, позиции, статус доставки, proof-of-delivery.

---

## Легенда (черновик, утвердить)

- Профиль: Spotlights Ltd, дистрибуция профессионального AV/сценического оборудования. Валюта: AED опер. + USD на импорт (поставщики — ЕС/Китай). Холдинг владеет 100%.
- «Сегодня» и фискальный календарь — общие с группой (см. открытый вопрос 2 в [[_index]]).
- Масштаб поменьше Crisis Theater: десяток-другой B2B-клиентов (event-агентства, отели, девелоперы, в т.ч. свои Crisis Theater и Legacy), 8–15 человек персонала, узкий каталог высокого чека.

## Цепочка данных (должна биться насквозь)

`products` → `orders` (заказ клиента / PO поставщику) → `fulfillments` (отгрузка) → `invoices` (AR/AP) → `payments` → `cashflow`. Плюс `clients`, `vendors`, `staff` (с зарплатами), `targets` (воронка), `alerts`.

Специфика дистрибуции, которую стоит показать (хороший материал для ERP/Atlas):
- **Склад/остатки** в `products.yml` (on-hand, reserved, on-order, lead time) — даёт алерты «дефицит под подтверждённый заказ».
- **Маржа на позицию** (закуп vs продажа) — узкий ассортимент → маржа читаема.
- **Backorder / частичная отгрузка** — статусы fulfillment.
- **Импорт**: валютный риск (USD-закуп / AED-продажа), пошлины — связывает с мультивалютной консолидацией.

## Файлы

`company.yml` (type: distribution, fulfillmentLabel: «Отгрузки»), `products.yml`, `orders.yml`, `fulfillments.yml` (shipments), `clients.yml`, `vendors.yml`, `staff.yml`, `invoices.yml`, `payments.yml`, `cashflow.yml`, `targets.yml`, `alerts.yml`. Запись в `group/entities.yml` + intercompany-сделки с Crisis Theater и Legacy.

## Открытые вопросы
- Валюта (AED+USD?) — см. вопрос 1 в [[_index]].
- Какой продукт-демо «смотрит» на Spotlights в первую очередь. Кандидат — **Atlas ERP** (каталог + отгрузки + сверка): лучший фит под операционный ERP. См. [[wire-up-and-consolidation]].

## Статус
- [x] Легенда и валюта утверждены (AED опер. + USD/EUR импорт; «сегодня» 2025-03-28)
- [x] `company.yml` (type: distribution, units = продуктовые линии, банки AED/USD/EUR)
- [x] `products.yml` (10 SKU: узкий каталог + остатки on-hand/reserved/on-order + маржа)
- [x] `clients.yml` (12, вкл. intercompany cl-crisis-theater / cl-legacy), `vendors.yml` (12, вкл. фрахт/таможню), `staff.yml` (13, payroll 236.5K/мес, найм Aug-2024)
- [x] `orders` (16) → `fulfillments` (14, shipmentNo/carrier/POD) → `invoices` (AR 14 + AP 8) → `payments` (15) — референциальная целостность пройдена, арифметика сходится
- [x] `targets.yml` (воронка sales→deliveries→payments, план/факт) + `alerts.yml` (6 правил + 6 активных)
- [x] Согласовано с `cashflow.yml`: непогашенные AR 2.76M ≈ arEnd 2.70M, AP 1.40M ≈ apEnd 1.40M; intercompany суммы совпали с `group/intercompany.yml`
- [x] Запись в `group/entities.yml` + 4 intercompany-сделки (Lantern Bay 2024/25, Ancient Moon, Legacy fit-out)
- [ ] Подключение к Atlas-экранам — Фаза 5 ([[wire-up-and-consolidation]])
