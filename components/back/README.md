# back

Компонент ui-kit: кнопка «Назад» с заголовком — возврат к предыдущему экрану и одновременно его название.
Только CSS, без JS.

Перенесена из кода Saby — `Controls/heading:Back`. В Figma компонент называется `BackButton`; в библиотеке
«⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`) найден component set `other / backButtonArrow`
(ключ `9ae5caa5b9998c31f0e5967b76fa58c7a8f24efe`). Варианты и состояния взяты из кода и живого примера
Saby Components, с макетом не сверялись.

Цвета, размеры и шрифт берутся из токенов кита, поэтому кнопка перекрашивается вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/back/back.css">
```

`tokens.css` подключается первым. Заголовок набран шрифтом **Inter**, его подключает проект.

## Разметка

```html
<button type="button" class="back">
  <span class="back__icon"></span>
  <span class="back__caption">Ресторан «Ромашка»</span>
</button>
```

Порядок всегда такой: стрелка, заголовок. Стрелку рисует сам компонент — маска на `::before` у `.back__icon`.
Длинный заголовок обрезается многоточием, когда кнопке не хватает ширины родителя.

## Классы

**Размер** — `fontSize`. От него зависят высота стрелки и размер круга:

| Класс | Шрифт | Круг `functionalButton` |
|---|---|---|
| `.back--size-m` | 14 | 16 |
| `.back--size-l` | 15 | 24 |
| `.back--size-xl` | 16 | 24 |
| `.back--size-2xl` | 17 | 24 |
| без класса или `.back--size-3xl` | 18 | 24 |
| `.back--size-4xl` | 20 | 28 |
| `.back--size-5xl` | 24 | 32 |

**Цвет заголовка** — `fontColorStyle`: без класса `primary`, `.back--color-default`, `.back--color-secondary`,
`.back--color-link`, `.back--color-label`.

**Цвет стрелки** — `iconStyle`: без класса `secondary`, `.back--icon-default`, `.back--icon-primary`,
`.back--icon-link`, `.back--icon-label`.

**Стрелка в круге** — `iconViewMode=functionalButton`: `.back--functional-button`. Подложка круга —
`buttonStyle`: без класса `pale` (бледная), `.back--style-default` — белая с тенью.

**Перенос заголовка** — `textOverflow=none`: `.back--wrap`. Без класса заголовок в одну строку с многоточием.

**Состояния:**

| Состояние | Класс | Псевдокласс | Что меняется |
|---|---|---|---|
| наведение | `.is-hover` | `:hover` | цвет заголовка; цвет стрелки или подложка круга |
| нажатие | `.is-active` | `:active` | то же, подложка круга темнее |
| недоступна | `.is-readonly` | `:disabled` | вид покоя, не нажимается |

Отдельного вида фокуса нет: при фокусе с клавиатуры остаётся обводка браузера.

## Отличия от Saby

- Нет вида `viewMode=fade` (двойная стрелка с подсветкой под курсором): ему нужен JS.
- Нет `beforeCaptionTemplate` (содержимое между стрелкой и заголовком) и `textTransform`.
- Цветов заголовка и стрелки перенесено по пять; остальные стили (`danger`, `success`, `warning`, `info`,
  `unaccented`, `contrast`) в кит не входят.
- Размеры `xs`, `s`, `6xl`, `7xl` не перенесены.
- Подсказка с полным заголовком при обрезке в Saby считается кодом; здесь её ставит прототип атрибутом `title`.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- высота стрелки: 0,72 размера шрифта + 2px (у 5xl без прибавки), округление вверх до целого;
- сдвиг стрелки на 1px ниже базовой линии;
- толщина рамки 1px в расчёте отступа слева и высоты стрелки в круге;
- смещение тени `0 0` у `style-default`.

## Пример

[example/index.html](example/index.html) — размеры, цвета, круг и состояния. Запустите статический сервер
в корне кита, например `npx serve`, и откройте `/components/back/example/`.
