# builder-header

Компонент ui-kit: шапка окна конструктора в режиме чтения и в режиме редактирования файла.

Перенесена из прототипа [builder-file-standarts](https://pupsik3.github.io/builder-file-standarts/)
(`app/viewer.js` → `header()`, `app/styles.css` → `.viewer-header`). Макета в Figma нет, раскладка и размеры
взяты из прототипа и не сверены.

Кнопки, переключатель размеров экрана и крестик — компоненты кита [`button`](../button/),
[`tumbler`](../tumbler/) и [`close-button`](../close-button/), их вид и состояния — как в ките. Шапка задаёт
только раскладку, разделители, последнюю редакцию, размер «Изменить» и «Сохранить» и зелёный кружок галочки.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/button/button.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/tumbler/tumbler.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/close-button/close-button.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/builder-header/builder-header.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/builder-header/builder-header.js"></script>
```

`fonts.css` нужен для Inter и глифов иконок (cbuc-icons, cbuc-icons24). JS необязателен: без него
разметку пишет прототип.

## Состав

| Блок | Разметка | Чтение | Редактирование |
|---|---|---|---|
| Иконка типа и название | `.bhd__title` > `.bhd__title-icon` (глиф cbuc-icons24) + `.bhd__name` | ✓ | ✓ |
| Размеры экрана, по центру | `.bhd__center` > `.tumbler.tumbler--size-m`, пункты-кнопки с `aria-checked` | ✓ | ✓ |
| Отменить, повторить, сбросить, предпросмотр | `.bhd__history` > `.btn.btn--ghost.btn--style-secondary.btn--size-xl.btn--icon` | — | ✓ |
| Масштаб | `.bhd__zoom` > `.btn.btn--link.btn--style-secondary.btn--size-m` (−, «100%», +) | ✓ | ✓ |
| Последняя редакция | `.bhd__revision` > `.bhd__revision-image` + дата | ✓ | — |
| «Изменить» | `.btn.btn--same-outlined.btn--style-secondary.btn--size-m.bhd__pill.bhd__pill--edit` | ✓ | — |
| «Сохранить» с галочкой | `.btn.btn--same-outlined.btn--style-success.btn--size-m.bhd__pill.bhd__pill--save` > `.bhd__save-check` | — | ✓ |
| Крестик | `.close-button.close-button--functional-button.close-button--size-l` | ✓ | ✓ |

- Режим редактирования — `.bhd--editing` на корне. Фон окна (в редакторе
  `--components-constructor-constructor_background-color`) задаёт прототип, у шапки своего фона нет.
- Блоки независимы: ненужный блок просто не выводится. Так собираются шапки других типов файлов —
  например, SabyDoc показывает «последнюю редакцию» и в редактировании.
- Состояния кнопок, тумблера и крестика — у самих компонентов кита (`:hover` / `.is-hover`, `:active` / `.is-active`,
  `disabled`).
- `.bhd__pill` задаёт кнопке размер из прототипа: 116 × 26 (`--btn-h: 26px`), подпись слева, иконка справа.
  Зелёный кружок 26 у «Сохранить» — `.bhd__save-check`, своего такого у кнопки кита нет.

### Отличия от прототипа

Компоненты кита взяты как есть, поэтому вид немного отличается от исходника:

- тумблер: подложка `contrast-pale` вместо `#00000009`, пункты 40 × 22 вместо 39 × 20, иконка 16 вместо 14,
  у выбранного пункта тень `shadow_d`;
- история: иконка 24 (cbuc-icons24) вместо 20;
- «−» и «+» масштаба: иконка 16 вместо 24, цвет `icon-secondary` вместо `text-secondary`.

## Разметка

```html
<header class="bhd bhd--editing">
  <div class="bhd__title"><span class="bhd__title-icon" aria-hidden="true">&#xeb5f;</span><span class="bhd__name">Онлайн-сервис доставки еды</span></div>
  <div class="bhd__center">
    <div class="tumbler tumbler--size-m" role="radiogroup" aria-label="Размер экрана">
      <button type="button" class="tumbler__item" role="radio" aria-checked="true" title="Компьютер"><span class="tumbler__icon" aria-hidden="true">&#xe730;</span></button>
      <button type="button" class="tumbler__item" role="radio" aria-checked="false" title="Планшет"><span class="tumbler__icon" aria-hidden="true">&#xe637;</span></button>
      <button type="button" class="tumbler__item" role="radio" aria-checked="false" title="Другие размеры"><span class="tumbler__icon" aria-hidden="true">&#xeab4;</span></button>
    </div>
  </div>
  <div class="bhd__actions">
    <div class="bhd__history">
      <button type="button" class="btn btn--ghost btn--style-secondary btn--size-xl btn--icon" aria-label="Отменить"><span class="btn__icon" aria-hidden="true">&#xe6cf;</span></button>
      <button type="button" class="btn btn--ghost btn--style-secondary btn--size-xl btn--icon" aria-label="Повторить"><span class="btn__icon" aria-hidden="true">&#xe6ca;</span></button>
      <button type="button" class="btn btn--ghost btn--style-secondary btn--size-xl btn--icon" aria-label="Сбросить" disabled><span class="btn__icon" aria-hidden="true">&#xe629;</span></button>
      <button type="button" class="btn btn--ghost btn--style-secondary btn--size-xl btn--icon" aria-label="Предпросмотр"><span class="btn__icon" aria-hidden="true">&#xeab9;</span></button>
    </div>
    <div class="bhd__zoom">
      <button type="button" class="btn btn--link btn--style-secondary btn--size-m btn--icon" aria-label="Уменьшить масштаб"><span class="btn__icon" aria-hidden="true">&#xe6ea;</span></button>
      <button type="button" class="btn btn--link btn--style-secondary btn--size-m">100%</button>
      <button type="button" class="btn btn--link btn--style-secondary btn--size-m btn--icon" aria-label="Увеличить масштаб"><span class="btn__icon" aria-hidden="true">&#xe6e9;</span></button>
    </div>
    <button type="button" class="btn btn--same-outlined btn--style-success btn--size-m bhd__pill bhd__pill--save">Сохранить<span class="bhd__save-check" aria-hidden="true">&#xe75e;</span></button>
    <button type="button" class="close-button close-button--functional-button close-button--size-l" aria-label="Закрыть"></button>
  </div>
</header>
```

В режиме чтения вместо `.bhd__history` и «Сохранить» стоят последняя редакция и «Изменить»:

```html
<div class="bhd__revision"><img class="bhd__revision-image" src="avatar.png" alt=""><span>15 окт</span></div>
<button type="button" class="btn btn--same-outlined btn--style-secondary btn--size-m bhd__pill bhd__pill--edit">Изменить<span class="btn__icon" aria-hidden="true">&#xe660;</span></button>
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
