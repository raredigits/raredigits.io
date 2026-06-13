# Аудит сайта — список задач для обсуждения

---

## 🔴 Починить сразу (ошибки и сломанное)

### Сломанные ссылки
- `_includes/footer.html` — пять ссылок на тиры прайсинга (Junior Associate и т.д.) ведут в `href=""` — пустые
- `tools/open-source/index.md` — три проекта (11ty Scripts Collection, Pontivox, BookKeeper) с пустыми `href=""`

---

## 🟡 Контент и позиционирование

### Запрещённые слова (нарушают стайлгайд)
- `tools/corsair/index.md` — "works seamlessly with all major cloud solutions"
- `about/pressroom/posts/2024/2024-11-18-Introducing-Corsair-HQ.md` — "seamlessly"
- `about/pressroom/posts/2024/2024-06-03-KGSY-partnership.md` — "robust"
- `about/pressroom/posts/2024/2024-05-06-Website-security.md` — "robust"

### Atlas ERP — legacy, а страница активная
- `tools/atlas/index.md` — продукт больше не продаётся, но страница выглядит как полноценная продуктовая. Решить: оставить как историческую справку или снять с продажи явно.

### Tinder-референсы в about/
- `about/index.md` — упоминания Tinder в контексте B2B-компании для акционеров. Выглядит неуместно для целевой аудитории.

---

## 🟡 Страницы-заглушки (есть продукт, нет страницы)

Следующие инструменты существуют, но страницы пустые (только construction notice):
- `tools/forecast/index.md` — Forecast App v.1.9.2
- `tools/columbus/index.md` — Columbus CRM v.3.0.1
- `tools/fanfare/index.md` — Fanfare v.1.0.5
- `tools/web3/watchtower/index.md` — Watchtower v.0.1.2 (частичный контент)

Отдельный вопрос: в `tools/index.md` есть карточки-заглушки без названий — непонятно, что это за продукты.

---

## 🟡 Навигация и структура

### Hamburger-меню
Мобильная навигация не реализована. При сужении экрана меню исчезает или ломается. Нужен hamburger-компонент. Варианты реализации:
- CSS-only (checkbox hack) — без JS, просто
- JS-toggle с `aria-expanded` — доступнее
- Интегрировать в rare-styles или сделать локально в `_includes/`

### Продуктовая страница tools/
- Corsair HQ и Jeeves присутствуют отдельными секциями, но не в общей сетке продуктов — несогласованность
- Rare Styles не показан в основной сетке (только в open-source секции)

### Footer — пустые ссылки на тиры
Пять тиров (Junior Associate → NED) в футере ведут в никуда. Либо убрать список тиров из футера, либо дать им ссылку на `/about/pricing/` с якорем.

---

## 🟢 Полезно сделать, но не срочно

### Главная страница
Вынесено в отдельный файл `_editorial/backlog/homepage.md` — там детальный список с обоснованием.

### Имя файла "Whatchtower"
- `about/pressroom/posts/2025/2025-02-03-Introducing-Whatchtower.md` — опечатка в имени файла (лишняя "h"). Технически можно переименовать, но это изменит permalink если он производится из имени файла. Проверить: permalink прописан явно или генерируется автоматически?

### Комментарий в index.html
- Закомментированная vacation-секция ссылается на `/pressroom/Vacation-Notice/` — уже не актуальный путь. Некритично (закомментировано), но лучше подчистить.

### Описания продуктов на tools-страницах
Там где есть контент — он написан в разное время разными голосами. После обновления `_editorial/company.md` и промптов — хорошая база для синхронизации описаний с текущим позиционированием.
