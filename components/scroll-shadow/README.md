# scroll-shadow — тень прокрутки

Полоса 8px у края прокручиваемого блока, за которым есть ещё содержимое: сверху — пока блок прокручен вниз,
снизу — пока ниже есть что прокрутить. Макет — «⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`), набор
`scroll-shadow`, свойство `position`: `top` (`15499:1120`) и `bottom` (`15499:1122`). Варианты `left` и `right` в ките
пока не сделаны. Перенесена из
прототипа «Компоненты» (popups).

Это общая тень кита: компоненты с прокруткой (`shop`, `text-editor`) берут её отсюда, свою не рисуют.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@<версия>/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@<версия>/components/scroll-shadow/scroll-shadow.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@<версия>/components/scroll-shadow/scroll-shadow.js"></script>
```

## Разметка

Класс `.scroll-shadow` — на сам прокручиваемый блок (с `overflow: auto`):

```html
<div class="my-list scroll-shadow" style="--scroll-shadow-inset: 12px">…</div>
<script>ScrollShadow.mount(document.querySelector('.my-list'));</script>
```

| Класс / переменная | Что делает |
|---|---|
| `.scroll-shadow` | блок с тенями сверху и снизу; они занимают его `::before` и `::after` и места в потоке не занимают |
| `.scroll-shadow--top` | только тень сверху |
| `.scroll-shadow--bottom` | только тень снизу |
| `.is-scrolled` | видна тень сверху: блок прокручен вниз; ставит JS |
| `.is-more-below` | видна тень снизу: ниже есть содержимое; ставит JS |
| `--scroll-shadow-inset` | боковой отступ блока: тень выходит за него и тянется на всю ширину. По умолчанию 0 |

Тени прилипают к краям блока (`position: sticky`), поэтому у блока должны быть свободны `::before` и `::after`.

## Поведение

```js
var shadow = ScrollShadow.mount(root); // root и все .scroll-shadow внутри, в том числе добавленные позже
shadow.refresh();                      // пересчитать после программной смены scrollTop
// Смену размера блока и его содержимого JS отслеживает сам
shadow.destroy();                      // снять обработчик
```

## Токены

| Что | Токен |
|---|---|
| Высота | `--offset-offset_s` (8px) |
| Цвет у края блока | `--components-scroll-shadow_start-color_scroll` |
| Цвет к содержимому | `--components-scroll-shadow_end-color_scroll` |

В макете градиент не привязан к переменным: значения `#00000026` → `#00000000` совпадают с токенами.
