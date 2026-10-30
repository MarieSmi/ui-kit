# button

Компонент ui-kit: кнопка из секции «Базовые» на странице «✅ Кнопки» библиотеки Figma
«⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`, узел `322:2761`). Только CSS, без JS.

Цвета, размеры и шрифты берутся из токенов кита, поэтому кнопка перекрашивается вместе с `data-ui-theme`
и меняет размер вместе с `data-ui-size`. Типовые кнопки (done, close, plus, toggle, bigSeparator, arrow)
сюда не входят — это отдельные компоненты.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.8.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.8.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.8.0/components/button/button.css">
```

`tokens.css` подключается первым. Текст кнопки набран шрифтом **Inter**, иконки в макете — шрифтами
`cbuc-icons` и `cbuc-icons24`. Все три есть в ките и подключаются через `fonts/fonts.css`. Кнопка от него
не зависит: если проект подключает шрифты сам, эту строку можно убрать.

## Разметка

```html
<button class="btn btn--filled btn--style-primary">Кнопка</button>

<button class="btn btn--outlined btn--style-secondary btn--size-m">
  <span class="btn__icon">&#xe9e2;</span>
  Кнопка
</button>

<button class="btn btn--ghost btn--style-danger btn--icon" aria-label="Удалить">
  <span class="btn__icon">&#xe9e2;</span>
</button>
```

Иконка может стоять до текста или после него, зазор одинаковый. Работает и на `<a>`.

**Иконка.** В макете это глиф шрифта иконок: `font-family` и `font-size` у `.btn__icon` уже заданы токенами
по размеру кнопки (16 / 24 / 32 px; для 24 px — шрифт `cbuc-icons24`), поэтому с `fonts/fonts.css`
достаточно самого символа: `<span class="btn__icon">&#xe9e2;</span>`. Глиф встаёт в рамку как в макете:
расхождение с Figma меньше 0,5 px. Если шрифта нет, вставьте `svg` с
`viewBox` во весь размер иконки (`0 0 16 16`, `0 0 24 24`, `0 0 32 32`) — он растягивается на всю рамку
и красится в цвет иконки. Глиф занимает рамку не целиком, поэтому svg-иконку берите из Figma вместе с
полями, а не обрезанную по контуру.

## Классы

**Вид** — один из component set в Figma, обязателен:

| Класс | Набор Figma | Как выглядит | Стили |
|---|---|---|---|
| `.btn--filled` | `filled` | заливка цветом стиля, светлый текст, тень | primary, secondary, success, danger, warning, info, default, unaccented, pale, brand |
| `.btn--outlined` | `outlined` | белая, рамка цветом стиля | primary, secondary, success, danger, warning, info, default |
| `.btn--same-outlined` | `same_outlined` | белая, бледная рамка, иконка цветом стиля | primary, secondary, success, danger, warning, info, default, brand |
| `.btn--same` | `same` | полупрозрачная заливка цветом стиля, тёмный текст | primary, secondary, success, danger, warning, info, unaccented |
| `.btn--ghost` | `ghost` | без фона, текст цветом стиля; подложка при наведении | primary, secondary, success, danger, warning, info, default, unaccented, link, label |
| `.btn--link` | `link` | ссылка: без отступов, подчёркивание при наведении | primary, secondary, success, danger, warning, info, default, unaccented, link, label, brand |
| `.btn--square` | `square` | прямоугольник со светлой заливкой и рамкой цветом стиля | primary, secondary, success, danger, warning, info, default |
| `.btn--translucent` | `translucent` | полупрозрачная поверх картинки | dark, light |

**Стиль** — `.btn--style-<buttonStyle>`, значения в таблице выше.

**Размер** — `inlineHeight`: `.btn--size-m` (24), `.btn--size-xl` (32, по умолчанию), `.btn--size-5xl` (48).

**Кнопка-иконка** — `iconButton=true`: `.btn--icon`, квадрат без отступов.

**Подчёркивание у ссылки** — `underlineVisible=true`: `.btn--underline`, только для `.btn--link`.

**Состояния** — классы и псевдоклассы, которые браузер ставит сам:

| Figma | Класс | Псевдокласс |
|---|---|---|
| `hover=true` | `.is-hover` | `:hover` |
| `press=true` | `.is-active` | `:active` |
| `readOnly=true` | `.is-readonly` | `:disabled` |

Состояния Focus в макете нет: у кнопки остаётся обводка браузера.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- толщина рамки 1px и отступ заливки `square` от края на 1px;
- смещения теней: `shadow_d`, `shadow_b` — 0 0, `box-shadow_contrast_big_button` (у `filled` размера 5xl) — 0 4;
  размытие и цвет теней — токены;
- прозрачность слоёв: `same` — 15 / 25 / 35 % (покой / наведение / нажатие), `square` — заливка 75 %,
  рамка 40 %, у стиля default 75 / 85 %;
- межбуквенный интервал текста −1,41 %.

**Замена переменной.** Фон нажатой кнопки default у `filled` и `square` в Figma задан переменной
`Components/Button/default_active_background-color_button`, которой нет в выгрузке «🌍 Global Variables».
В Figma она ссылается на `Background/active_background-color`, поэтому в ките взят токен
`--background-active_background-color`. В темах Large переменная ссылается на
`Background/Contrast/secondary_active_contrast_background-color`, которой в ките тоже нет, — там цвет
может отличаться от макета.

## Пример

[example/index.html](example/index.html) — все виды, стили и состояния с переключением темы и размера.
Запустите статический сервер в корне кита, например `npx serve`, и откройте `/components/button/example/`.
