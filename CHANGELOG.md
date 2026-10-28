# Изменения

## Не выпущено

- Каркас кита: README, правила для Claude.
- `tokens.css`: 521 токен из Figma «🌍 Global Variables» — цвета, размеры, тени; темы через
  `data-ui-theme`, размеры через `data-ui-size` (префикс `ui-` — чтобы не конфликтовать с `data-theme`
  хоста артефактов). Генератор и выгрузка — `tools/tokens/`.
- `demo-frame` переехал в `components/demo-frame/` и перешёл на токены. Вид в светлой теме не
  изменился, API `DemoFrame.mount` тот же.
- Каталог `catalog/index.html`: токены по группам, превью размеров и теней, живая рамка демо.
