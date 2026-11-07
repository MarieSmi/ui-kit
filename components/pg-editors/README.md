# pg-editors

Редакторы PropertyGrid из прототипа STV: **размер, тень, отступы, скругления, фон, границы** и общее окно цвета. Вид — по
библиотеке PropertyGrid (`lw5BTOhkhczQmdiTvlnhnG`, раздел «Оформление» `23882:236259`), логика — из STV. Каждый редактор
подключается отдельно, разметку строит `pg-editors.js`. Рабочий пример — [`example/index.html`](example/index.html).

Редакторы только возвращают значения. Как применить их к макету, решает прототип; для этого есть помощники `PGEditors.css`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.14.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.14.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.14.0/components/pg-editors/pg-editors.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.14.0/components/pg-editors/pg-editors.js"></script>
```

Иконки — глифы `cbuc-icons` и `cbuc-icons24`, текст — Inter. Шрифты подключает проект, например через `fonts/fonts.css` кита.

## Разметка и запуск

Редактор рисуется в пустом элементе. Подпись строки — своя, для сетки «подпись — редактор» есть `.pge-form` и `.pge-label`:

```html
<div class="pge-form">
  <span class="pge-label">Тень</span><div id="shadow"></div>
  <span class="pge-label">Скругления</span><div id="radius"></div>
</div>
<script>
  const shadow = PGEditors.shadow(document.getElementById('shadow'), {
    value: { color: '#000000', opacity: 6, x: 0, y: 0, blur: 8, spread: 0 },
    onChange(v) { widget.style.boxShadow = PGEditors.css.shadow(v); },
  });
  shadow.get(); shadow.set(value); shadow.destroy();
</script>
```

Общие параметры: `value` — начальное значение (недостающие поля берутся по умолчанию), `onChange(value)` — при любой
правке, `onClear()` — необязательно: если передан, у редактора появляется крестик ✕ (по умолчанию крестика нет), `label` — подпись для `aria-label` и заголовка окна цвета,
`layer` — куда открывать окна.

## Редакторы

| Редактор | Значение | По умолчанию | Что умеет |
|---|---|---|---|
| `PGEditors.size` | `{ w, h, minW, maxW, minH, maxH }`, у осей `{ mode, px, pct }` | ширина и высота `fill`, Min/Max нет | Подписи «Ширина», «Высота» рисует сам. Клик по единице открывает меню величин: фиксированная (px), относительная (%), по контенту (auto), заполнить; «Добавить» — Min/Max только своей оси, у них ✕. Ввод числа в «по контенту» и «заполнить» делает ось фиксированной. `actual(axis)` — фактический размер для `'w'` и `'h'`: серая подсказка и значение при переходе в px |
| `PGEditors.shadow` | `{ color, opacity, x, y, blur, spread }` | `#000000`, 6 %, 0 / 0 / 8 / 0 | Бабл открывает окно цвета тени: HEX, непрозрачность, 5 готовых теней, «Другой цвет», сброс. «Параметры тени» и «+» — окно «Тень» с цветом и ползунками X, Y, блюр, размах. Правки видны сразу, ✓ и клик мимо сохраняют, ✕ и Esc возвращают прежнее. `default` — значение для сброса |
| `PGEditors.padding` | `{ top, right, bottom, left, split }` | 12 со всех сторон | Два поля — по горизонтали и вертикали — или блок по сторонам. `max` — предел, 100 |
| `PGEditors.radius` | `{ tl, tr, br, bl, split }` | 8 | Одно поле или блок по углам. `max` — предел, 100 |
| `PGEditors.border` | `{ color, opacity, style, top, right, bottom, left, split }` | `#a39c97`, сплошная, 1 | Кружок цвета с окном, меню типа линии (сплошная / пунктир), толщина одной цифрой или по сторонам. `max` — 20. Крестик стоит у толщины |
| `PGEditors.background` | `{ color, opacity }` | `#ffffff`, 100 % | Кружок с окном цвета: тумблер «Цвет / Картинка», палитра с «нет цвета» (`color: null`), HEX, непрозрачность, «Другой цвет». «Картинка», «Градиент», «Текстура» и пипетка показаны выключенными |

`split: true` — раскрыт блок по сторонам или углам. При сворачивании значения выравниваются по первому: скругления и
границы — по верхнему левому, отступы — по горизонтали слева и по вертикали сверху. Числа принимаются по Enter или при уходе с
поля, неверный ввод возвращает прежнее значение.

У границ и фона можно передать свою палитру `palette` — массив `#hex`, `null` — «нет цвета». Палитры по умолчанию — в
`PGEditors.palettes`.

## Окно цвета отдельно

```js
PGEditors.color(button, {
  title: 'Текст', color: '#000000', opacity: 100, palette: PGEditors.palettes.text,
  default: { color: '#000000', opacity: 100 },   // для кнопки сброса
  background: false,                              // true — тумблер «Цвет / Картинка» и заливка палитры градиентом в белый
  onApply(color, opacity) {},                     // клик по цвету и ✓; ✕, Esc и клик мимо — без вызова
});
```

## Применение к макету

| Помощник | Результат |
|---|---|
| `PGEditors.css.size(v)` | объект `{ width, height, minWidth, maxWidth, minHeight, maxHeight }`: px и % как есть, «заполнить» — `100%`, «по контенту» — `fit-content` |
| `PGEditors.css.shadow(v)` | строка для `box-shadow` |
| `PGEditors.css.radius(v)` | строка для `border-radius` |
| `PGEditors.css.padding(v)` | строка для `padding` или `margin` |
| `PGEditors.css.border(v)` | объект `{ borderStyle, borderColor, borderWidth }` для `Object.assign(el.style, …)` |
| `PGEditors.css.background(v)` | заливка как в макете: белый сплошной, остальные цвета — градиентом в белый |
| `PGEditors.css.rgba(hex, opacity)` | `rgba(…)` |

## Окна и масштаб

Окна открываются в ближайшем предке с атрибутом `data-pge-layer`, иначе в `layer` из параметров, иначе в `body`. Внутри
`demo-frame` поставьте `data-pge-layer` на сцену, тогда окна будут масштабироваться вместе с ней. Окна стоят рядом с кнопкой,
как в макете: окно цвета — на 16 px (у фона на 19 px) левее и на 68 px выше кружка.

## Что не вошло

- Несколько значений в тени и фоне (`Количество=2`, `3`): в STV их нет.
- Картинка, градиент, текстура и пипетка в окне цвета — только для вида.
- Сверка с Figma не проводилась: вид и поведение перенесены из STV как есть.
