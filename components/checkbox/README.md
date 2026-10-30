# checkbox

Компонент ui-kit: чекбокс из component set `checkbox` библиотеки Figma «⚙️ Default components»
(`nuC4KFMiS36uDWDUp9wKGl`, узел `14613:12425`). Только CSS, без JS.

Цвета, размеры и шрифт берутся из токенов кита, поэтому чекбокс перекрашивается вместе с `data-ui-theme`
и меняет размер вместе с `data-ui-size`. Вариант с иконкой вместо подписи (`captionTemplate=icon`) в кит не входит.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.8.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.8.0/components/checkbox/checkbox.css">
```

`tokens.css` подключается первым. Подпись набрана шрифтом **Inter**, его подключает проект.

## Разметка

```html
<label class="checkbox checkbox--outlined">
  <input class="checkbox__input" type="checkbox">
  <span class="checkbox__box"></span>
  <span class="checkbox__caption">Содержание</span>
</label>
```

Порядок элементов всегда такой: `input`, квадрат, подпись. Подпись слева от квадрата ставит класс
`.checkbox--caption-start`, разметку менять не нужно. Без подписи `.checkbox__caption` можно не писать.

`input` настоящий: он невидим, но работает в форме, с клавиатуры и по клику на подпись.

## Классы

**Вид** — `viewMode`, обязателен:

| Класс | Figma | Как выглядит |
|---|---|---|
| `.checkbox--outlined` | `viewMode=outlined` | белый квадрат с рамкой, оранжевая галочка |
| `.checkbox--filled` | `viewMode=filled` | со значением — залит цветом primary, белая галочка |
| `.checkbox--ghost` | `viewMode=ghost` | рамка без фона, оранжевая галочка |
| `.checkbox--outlined .checkbox--reset` | `resetValue=true` | серая подложка без рамки; со значением — светлая заливка primary |

`resetValue` в макете есть только у `outlined`, поэтому `.checkbox--reset` ставится вместе с `.checkbox--outlined`.

**Подпись слева** — `captionPosition=start`: `.checkbox--caption-start`.

**Значение и состояния:**

| Figma | Класс | Псевдокласс |
|---|---|---|
| `value=true` | — | `:checked` у `input` (атрибут `checked`) |
| `triState=true` | `.is-indeterminate` | `:indeterminate` у `input` |
| `_hover=true` | `.is-hover` | `:hover` |
| `readOnly=true` | `.is-readonly` | `:disabled` у `input` |

Третье состояние у `input` ставит только JS: `input.indeterminate = true`, атрибута для него нет. По клику
браузер снимает его и переключает обычное значение. Класс `.is-indeterminate` нужен, чтобы показать
состояние без JS. Пока класс стоит, клик квадрат не меняет.

`readOnly` в макете есть только у `outlined` без `resetValue`. У других видов `:disabled` и
`.is-readonly` вид не меняют. Со значением в макете остаётся одна галочка или квадрат без рамки,
а подпись обычного цвета. Наведения у `readOnly` нет.

Состояния Focus в макете нет: при фокусе с клавиатуры вокруг квадрата рисуется обводка браузера.

Для состояний CSS использует `:has()`: Chrome 105+, Safari 15.4+, Firefox 121+.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- векторы рамки, галочки и квадрата — пути из макета в квадрате 13×13; они растягиваются на размер квадрата
  из токена, поэтому толщина рамки и скругление тоже меняются вместе с ним;
- отступ квадрата снизу 6px;
- прозрачность маркера третьего состояния 55 % у `outlined` и `ghost`;
- межбуквенный интервал подписи −1,41 %;
- отступ обводки фокуса 1px.

## Пример

[example/index.html](example/index.html) — все виды, значения и состояния с переключением темы, размера
и положения подписи. Запустите статический сервер в корне кита, например `npx serve`, и откройте
`/components/checkbox/example/`.
