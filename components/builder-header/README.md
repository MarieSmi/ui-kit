# builder-header

Компонент ui-kit: шапка окна конструктора в режиме чтения и в режиме редактирования файла.

Перенесена из прототипа [builder-file-standarts](https://pupsik3.github.io/builder-file-standarts/)
(`app/viewer.js` → `header()`, `app/styles.css` → `.viewer-header`). Макета в Figma нет, вид и значения
взяты из прототипа и не сверены.

Цвета и размеры берутся из токенов кита. Пять цветов без токена (подложка переключателя размеров, наведение
и нажатие на его кнопки, иконка выбранного размера, дата последней редакции) заданы для светлой темы и помечены
`/* нет токена */`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/builder-header/builder-header.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/builder-header/builder-header.js"></script>
```

`fonts.css` нужен для Inter и глифов иконок (cbuc-icons, cbuc-icons24). JS необязателен: без него
разметку пишет прототип.

## Состав

| Блок | Класс | Чтение | Редактирование |
|---|---|---|---|
| Иконка типа и название | `.bhd__title` > `.bhd__icon.bhd__icon--24` + `.bhd__name` | ✓ | ✓ |
| Переключатель размеров экрана, по центру | `.bhd__center` > `.bhd__devices` > `.bhd__btn.bhd__device[aria-pressed]` | ✓ | ✓ |
| Отменить, повторить, сбросить, предпросмотр | `.bhd__history` > `.bhd__btn` | — | ✓ |
| Масштаб | `.bhd__zoom` > `.bhd__btn`, `.bhd__zoom-value`, `.bhd__btn` | ✓ | ✓ |
| Последняя редакция | `.bhd__revision` > `.bhd__revision-image` + дата | ✓ | — |
| «Изменить» | `.bhd__pill.bhd__pill--edit` | ✓ | — |
| «Сохранить» с галочкой | `.bhd__pill.bhd__pill--save` > `.bhd__pill-check` | — | ✓ |
| Крестик | `.bhd__close` | ✓ | ✓ |

- Режим редактирования — `.bhd--editing` на корне. Фон окна (в редакторе
  `--components-constructor-constructor_background-color`) задаёт прототип, у шапки своего фона нет.
- Блоки независимы: ненужный блок просто не выводится. Так собираются шапки других типов файлов —
  например, SabyDoc показывает «последнюю редакцию» и в редактировании.
- Наведение и нажатие — `:hover` / `:active` и классы `.is-hover` / `.is-active`; неактивная кнопка истории —
  `disabled` или `.is-disabled`.
- Иконки — глифы: 24 px — `.bhd__icon--24` (cbuc-icons24), 20 px — `--20`, 14 px — `--14`, без модификатора — 16 px.

## Разметка

```html
<header class="bhd bhd--editing">
  <div class="bhd__title"><span class="bhd__icon bhd__icon--24" aria-hidden="true">&#xeb5f;</span><span class="bhd__name">Онлайн-сервис доставки еды</span></div>
  <div class="bhd__center">
    <div class="bhd__devices" role="group" aria-label="Размер экрана">
      <button type="button" class="bhd__btn bhd__device" aria-label="Компьютер" aria-pressed="true"><span class="bhd__icon bhd__icon--14" aria-hidden="true">&#xe730;</span></button>
      <button type="button" class="bhd__btn bhd__device" aria-label="Планшет" aria-pressed="false"><span class="bhd__icon bhd__icon--14" aria-hidden="true">&#xe637;</span></button>
      <button type="button" class="bhd__btn bhd__device" aria-label="Другие размеры" aria-pressed="false"><span class="bhd__icon bhd__icon--14" aria-hidden="true">&#xeab4;</span></button>
    </div>
  </div>
  <div class="bhd__actions">
    <div class="bhd__history">
      <button type="button" class="bhd__btn" aria-label="Отменить"><span class="bhd__icon bhd__icon--20" aria-hidden="true">&#xe6cf;</span></button>
      <button type="button" class="bhd__btn" aria-label="Повторить"><span class="bhd__icon bhd__icon--20" aria-hidden="true">&#xe6ca;</span></button>
      <button type="button" class="bhd__btn" aria-label="Сбросить" disabled><span class="bhd__icon bhd__icon--20" aria-hidden="true">&#xe629;</span></button>
      <button type="button" class="bhd__btn" aria-label="Предпросмотр"><span class="bhd__icon bhd__icon--20" aria-hidden="true">&#xeab9;</span></button>
    </div>
    <div class="bhd__zoom">
      <button type="button" class="bhd__btn" aria-label="Уменьшить масштаб"><span class="bhd__icon bhd__icon--24" aria-hidden="true">&#xe6ea;</span></button>
      <button type="button" class="bhd__zoom-value">100%</button>
      <button type="button" class="bhd__btn" aria-label="Увеличить масштаб"><span class="bhd__icon bhd__icon--24" aria-hidden="true">&#xe6e9;</span></button>
    </div>
    <button type="button" class="bhd__pill bhd__pill--save">Сохранить <span class="bhd__pill-check"><span class="bhd__icon" aria-hidden="true">&#xe75e;</span></span></button>
    <button type="button" class="bhd__close" aria-label="Закрыть"></button>
  </div>
</header>
```

В режиме чтения вместо `.bhd__history` и «Сохранить» стоят последняя редакция и «Изменить»:

```html
<div class="bhd__revision"><img class="bhd__revision-image" src="avatar.png" alt=""><span>15 окт</span></div>
<button type="button" class="bhd__pill bhd__pill--edit">Изменить <span class="bhd__icon" aria-hidden="true">&#xe660;</span></button>
```

## JS

`BuilderHeader.mount` строит разметку в пустом `<header>` по параметрам и перестраивает её при смене режима.

```js
const header = BuilderHeader.mount(document.querySelector('#header'), {
  title: 'Онлайн-сервис доставки еды',
  icon: 'EB5F',               // глиф cbuc-icons24 в названии; '' — без иконки
  mode: 'read',               // 'read' | 'edit'
  editable: true,             // кнопка «Изменить» в чтении
  devices: true,              // true — компьютер / планшет / «⋯»; [] — без переключателя;
                              // или свой список [{ id, label, glyph }]
  device: 'desktop',
  history: { undo: true, redo: true, reset: false, preview: true }, // false — кнопка неактивна, null — нет кнопки
  zoom: 100, zoomStep: 10, zoomMin: 10, zoomMax: 400,              // zoom: null — без масштаба
  revision: { image: 'avatar.png', date: '15 окт' },               // editing: true — показывать и в редактировании
  close: true,

  onEdit() {},                // «Изменить»; return false — остаться в чтении
  onSave() {},                // «Сохранить»; return false — остаться в редактировании
  onMode(mode) {},            // режим сменился
  onClose() {},
  onUndo() {}, onRedo() {}, onReset() {}, onPreview() {},
  onDevice(id) {},
  onZoom(value) {},
  onZoomReset() {},           // клик по «100%»; без обработчика масштаб сбрасывается к 100
});
```

| API | Что делает |
|---|---|
| `header.mode`, `header.setMode('edit' \| 'read')` | режим |
| `header.device`, `header.setDevice(id)` | размер экрана |
| `header.zoom`, `header.setZoom(value)` | масштаб, в границах `zoomMin` … `zoomMax` |
| `header.setTitle(text)` | название |
| `header.setHistory({ undo: false })` | доступность кнопок истории |
| `header.setRevision({ image, date } \| null)` | последняя редакция |
| `header.update(options)` | любые параметры сразу, с перестройкой |
| `header.destroy()` | снять обработчики и очистить шапку |

Пример — [`example/index.html`](example/index.html).
