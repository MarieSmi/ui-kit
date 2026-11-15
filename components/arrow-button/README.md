# arrow-button

Компонент ui-kit: кнопка со стрелкой — листание галереи и списка, раскрытие, переход дальше. Только CSS, без JS.

Перенесена из кода Saby — `Controls/extButtons:ArrowButton`. В Figma это component set `arrow/arrowButton`
библиотеки «⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`, ключ `766f785726d4cc1b95706a78fd3beaf89ffbaa9d`).
Виды, размеры и состояния взяты из кода и живого примера Saby Components, с макетом не сверялись.

Цвета и размеры берутся из токенов кита, поэтому кнопка перекрашивается вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/arrow-button/arrow-button.css">
```

`tokens.css` подключается первым. Шрифты не нужны: стрелку рисует сам компонент.

## Разметка

```html
<button type="button" class="arrow-button" aria-label="Дальше"></button>
<button type="button" class="arrow-button arrow-button--stretched arrow-button--left arrow-button--size-5xl" aria-label="Назад"></button>
```

Кнопка пустая: стрелка — маска на `::before`. Подпись для скринридера — в `aria-label`.

## Классы

**Вид** — `viewMode`:

| Класс | Saby | Как выглядит |
|---|---|---|
| без класса | `filled` | круг с бледной подложкой, при наведении — рамка |
| `.arrow-button--ghost` | `ghost` | без подложки, подложка появляется при наведении |
| `.arrow-button--link` | `link` | только стрелка, при наведении темнеет |
| `.arrow-button--stretched` | `stretched` | вытянутая плашка для листания; без стиля — полупрозрачная тёмная с белой стрелкой |
| `.arrow-button--stretched-ghost` | `stretched-ghost` | вытянутая без подложки |

**Стиль подложки** — `buttonStyle`, для `filled` и `stretched`:

| Класс | Saby | Как выглядит |
|---|---|---|
| без класса | `pale` у `filled`; у `stretched` — без стиля | бледная подложка; у `stretched` — полупрозрачная тёмная |
| `.arrow-button--style-default` | `default` | белая подложка с тенью, тёмная стрелка |
| `.arrow-button--style-pale` | `pale` у `stretched` | бледная подложка вместо полупрозрачной |

**Направление** — `direction`: без класса вправо, `.arrow-button--left`, `.arrow-button--up`, `.arrow-button--down`.
У `stretched` вверх и вниз кнопка лежит: ширина и высота меняются местами.

**Размер** — `inlineHeight`:

| Класс | Высота | Стрелка | `stretched`, ширина |
|---|---|---|---|
| `.arrow-button--size-s` | 20 | 16 | 14 |
| без класса или `.arrow-button--size-m` | 24 | 16 | 14 |
| `.arrow-button--size-mt` | 26 | 16 | 14 |
| `.arrow-button--size-xl` | 32 | 24 | 20 |
| `.arrow-button--size-5xl` | 48 | 32 | 28 |

**Состояния:**

| Состояние | Класс | Псевдокласс |
|---|---|---|
| наведение | `.is-hover` | `:hover` |
| нажатие | `.is-active` | `:active` |
| недоступна | `.is-readonly` | `:disabled` |

Отдельного вида фокуса нет: при фокусе с клавиатуры остаётся обводка браузера.

## Отличия от Saby

- Нет параметра `translucent` (`dark` / `light`) для круглой кнопки: в ките нет токенов цвета стрелки на
  полупрозрачной подложке. Полупрозрачная тёмная есть только у `stretched` без стиля.
- `stretched` вверх и вниз в Saby — повёрнутая кнопка, место под неё остаётся вертикальным. Здесь кнопка
  действительно лежит: ширина и высота меняются местами.
- `readOnly` у `link` и `ghost` — только бледная стрелка, без рамки. В Saby недоступный `link` превращается
  в `stretched` с рамкой.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- толщина рамки 1px;
- смещение тени у `style-default`: `0 0`, у размера 5xl — `0 4px`.

Цвет стрелки на полупрозрачной подложке — `--icon-contrast_icon-color`: токена `translucent_on_icon-color`
в ките нет, значение то же (`#fff`). Фон нажатой `style-default` — `--background-active_background-color`,
как у кнопки кита.

## Пример

[example/index.html](example/index.html) — все виды, стили, направления, размеры и состояния. Запустите
статический сервер в корне кита, например `npx serve`, и откройте `/components/arrow-button/example/`.
