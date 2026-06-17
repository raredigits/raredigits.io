# Таск: переименовать `/demo/odoo/` → `/demo/atlas/`

**Зачем:** мы продаём не голый Odoo, а Atlas (Odoo под капотом + наша дизайн-система). URL `/demo/odoo/` сбивает позиционирование — демо должно жить под `/demo/atlas/`.

Контекст экранов — [[atlas-demo-screens]].

---

## Объём (пути `/demo/odoo/` → `/demo/atlas/`)

### 1. Переместить папки
- `demo/odoo/dashboard/` → `demo/atlas/dashboard/`
- `demo/odoo/invoice/`   → `demo/atlas/invoice/`
- `demo/odoo/pipeline/`  → `demo/atlas/pipeline/`

### 2. `permalink` во фронтматтере (по одному на файл)
- `demo/atlas/dashboard/index.html` → `/demo/atlas/dashboard/`
- `demo/atlas/invoice/index.html`   → `/demo/atlas/invoice/`
- `demo/atlas/pipeline/index.html`  → `/demo/atlas/pipeline/`

### 3. Внутренние ссылки в самих экранах
- **dashboard**: сайдбар (invoice, pipeline) + ссылка «Open board →» на пайплайн
- **invoice**: сайдбар (dashboard, pipeline) + «Invoicing»-крошка (`/demo/odoo/invoice/`)
- **pipeline**: сайдбар (dashboard, invoice)

### 4. Ссылки на странице продукта `tools/atlas/index.md`
Четыре вхождения: cite под hero (`/dashboard/`), «Live →» в invoice- и pipeline-карточках, и CTA «Open the live Atlas demo» (`/dashboard/`).

### 5. Ссылки в editorial-доках
- `_editorial/backlog/odoo-fintech-demo.md` — раздел «Технические решения» и чек-лист статуса (4 вхождения).
- `_editorial/backlog/atlas-demo-screens.md` — таблицы экранов и заголовки (обновить пути).

Проверка, что ничего не осталось:
```
grep -rn "/demo/odoo/" --include="*.html" --include="*.md" . | grep -v _site | grep -v node_modules
```

---

## Опционально (бóльший радиус — отдельным решением)

- **Файл модуля** `assets/css/modules/odoo-fintech.css` → `atlas-demo.css` (или `fin.css`). Внимание: его подключают **6 файлов** — три экрана Atlas **и три экрана Forecast** (`demo/forecast/{cockpit,scenarios,revenue}`), плюс упоминания в [[forecast-demo]]. Если переименовывать — обновить все `<link>` и доки. Низкий приоритет: имя файла не торчит наружу.
- **Файл доки** `_editorial/backlog/odoo-fintech-demo.md` → `atlas-design.md` и обновить `[[odoo-fintech-demo]]`-ссылки в [[atlas-demo-screens]] и [[forecast-demo]].

---

## Не забыть
- `_site/` пересоберётся сам — править не нужно.
- Если на демо уже есть внешние ссылки (питч, переписка) — старые `/demo/odoo/` отвалятся. При необходимости оставить редирект (на GH Pages — через дублирующий `permalink` или мету-редирект).

## Статус
- [x] Выполнено 16.06.2026 — папка `demo/odoo` → `demo/atlas` (через `git mv`), permalinks, внутренние ссылки экранов, ссылки на `tools/atlas/index.md` и в editorial-доках обновлены. Опциональная часть (переименование файла модуля `odoo-fintech.css`) — **не делали** (затрагивает Forecast-демо, низкий приоритет).
