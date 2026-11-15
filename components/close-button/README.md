# close-button

Компонент ui-kit: кнопка закрытия окна или панели (крестик). Только CSS, без JS.

Перенесена из кода Saby — `Controls/extButtons:CloseButton`. В Figma это component set `close/closeButton`
библиотеки «⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`, ключ `8514357ba189f7dc239ccd8cce495173b10c8c99`).
Виды, размеры и состояния взяты из кода, с макетом не сверялись.

Цвета и размеры берутся из токенов кита, поэтому кнопка перекрашивается вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/close-button/close-button.css">
```

`tokens.css` подключается первым. Шрифты не нужны: крестик рисует сам компонент.

## Разметка

```html
<button type="button" class="close-button" aria-label="Закрыть"></button>
```

Кнопка пустая: крестик — маска на `::before`. Подпись для скринридера — в `aria-label`.

## Классы

**Вид** — `viewMode`:

| Класс | Saby | Как выглядит | Где используется |
|---|---|---|---|
| без класса или `.close-button--tool-button` | `toolButton` | без подложки, подложка появляется при наведении | своя панель или плашка |
| `.close-button--link-button` | `linkButton`, `link` | без подложки, при наведении темнеет крестик; размер всегда s | диалог |
| `.close-button--functional-button` | `functionalButton` | бледная круглая подложка | stack-окно |
| `.close-button--external` | `external` | полупрозрачный круг, белый крестик | поверх картинки, снаружи окна |
| `.close-button--external-wide` | `externalWide` | полупрозрачная плашка, крестик справа, слева место под содержимое | снаружи окна |

**Размер** — `size`, меняет площадь нажатия, крестик остаётся 12px:

| Класс | Сторона |
|---|---|
| `.close-button--size-s` | 24 |
| без класса или `.close-button--size-m` | 28 |
| `.close-button--size-l` | 32 |

**Отступ справа** — `.close-button--offset`: 8px, у `functionalButton` 5px. В Saby отступ включён по умолчанию
и снимается `offset="null"`; в ките наоборот — по умолчанию отступа нет.

**Состояния:**

| Состояние | Класс | Псевдокласс |
|---|---|---|
| наведение | `.is-hover` | `:hover` |
| нажатие | `.is-active` | `:active` |

Недоступного состояния у кнопки закрытия в Saby нет. Отдельного вида фокуса нет: при фокусе с клавиатуры
остаётся обводка браузера.

## Отличия от Saby

- `externalWide` в Saby растягивается на 100 % ширины родителя. Здесь ширину задаёт прототип, минимум — 56px.
- Отступ справа включается классом, а не выключается.
- Виды `link` и `linkButton` в коде Saby одинаковые — в ките один класс.

## Значения без токена

Нет: все цвета и размеры — токены. Путь крестика взят из `CloseButton.tsx`.

## Пример

[example/index.html](example/index.html) — все виды, размеры и состояния. Запустите статический сервер
в корне кита, например `npx serve`, и откройте `/components/close-button/example/`.
