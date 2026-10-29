# toolbar

Компонент ui-kit: плавающий тулбар со страницы «Плавающий тулбар» библиотеки Figma «⚙️Builder-components»
(`rHabzni5OI5D4fxBLQdj2m`, узел `854:7085`). Только CSS, без JS.

Цвета, размеры и шрифт берутся из токенов кита, поэтому тулбар перекрашивается вместе с `data-ui-theme`.
Ручка перетаскивания (6dots) и `button_expander` в кит не входят.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.6.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.6.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.6.0/components/toolbar/toolbar.css">
```

`tokens.css` подключается первым. Иконки — глифы шрифта `cbuc-icons24`, стрелка у подписи — `cbuc-icons`,
подпись набрана **Inter**. Шрифты подключает проект, например через `fonts/fonts.css` кита.

## Разметка

```html
<div class="tb tb--style-info" role="toolbar" aria-label="Виджет">
  <button type="button" class="tb__btn" aria-label="Назад"><span class="tb__icon" aria-hidden="true">&#xe9a9;</span></button>
  <button type="button" class="tb__btn" aria-label="Настройки"><span class="tb__icon" aria-hidden="true">&#xe75d;</span></button>
  <button type="button" class="tb__btn tb__btn--delete" aria-label="Удалить"><span class="tb__icon" aria-hidden="true">&#xeb72;</span></button>
  <button type="button" class="tb__btn" aria-label="Ещё"><span class="tb__icon" aria-hidden="true">&#xeab4;</span></button>
</div>
```

Кнопка с подписью и стрелкой:

```html
<button type="button" class="tb__btn">
  <span class="tb__icon" aria-hidden="true">&#xe9e2;</span>
  <span class="tb__caption">Текст</span>
  <span class="tb__arrow" aria-hidden="true"></span>
</button>
```

Разделитель — `<span class="tb__sep" aria-hidden="true"></span>` между кнопками.

## Классы

**Стиль тулбара** — `style` у component set `toolbar`:

| Класс | Figma | Как выглядит |
|---|---|---|
| — | `style=default` | белый фон, серая рамка; hover серый, select голубой |
| `.tb--style-info` | `style=info` | светло-фиолетовый фон; hover и select фиолетовые |
| `.tb--style-success` | `style=success` | светло-зелёный фон; hover и select зелёные |

Стиль ставится только на тулбар: кнопки берут цвета от него, своего класса стиля у кнопки нет.

**Кнопки:**

| Класс | Figma | Иконка |
|---|---|---|
| `.tb__btn` | `Bricks/button` (и «назад» — тот же набор) | цвет иконки обычный |
| `.tb__btn.tb__btn--delete` | `Bricks/deleteButton` | красная |
| `.tb__btn.tb__btn--success` | `_Bricks/successButton` | зелёная |

Внутри кнопки: `.tb__icon` (`icon`), `.tb__caption` (`text`, текст — `Name`), `.tb__arrow` (`arrow`).
Стрелка смотрит вниз, у выбранной кнопки — вверх; глиф рисует CSS.

**Разделитель** — `_Bricks/toobar/separator`: `.tb__sep` (`style=default`), `.tb__sep.tb__sep--style-contrast`
(`style=contrast`, линия темнее).

**Состояния:**

| Figma | Класс | Псевдокласс / атрибут |
|---|---|---|
| `⛔ hover=true` (`hover` у successButton) | `.is-hover` | `:hover` |
| `select=true` | `.is-selected` | `aria-pressed="true"` |

`select` в макете есть только у `Bricks/button`. Сочетания hover + select в макете нет: выбранная кнопка при
наведении не меняется. Состояния Focus в макете нет: при фокусе с клавиатуры рисуется обводка браузера внутри кнопки.

## Допущения

- Hover у кнопки подтверждения в тулбаре info в макете нет: взят фон hover остальных кнопок info.
- Рамка тулбара рисуется поверх кнопок, как stroke INSIDE в Figma: размер тулбара равен сумме кнопок (144×32 у четырёх).

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- толщина рамки тулбара и линии разделителя 1px;
- рамка info и success — токен `border-*_border-color` с прозрачностью 20 %;
- смещение тени shadow_c 0 0;
- межбуквенный интервал подписи −1,41 %;
- отступ обводки фокуса −2px.

## Пример

[example/index.html](example/index.html) — наборы как в макете с переключением темы. Запустите статический
сервер в корне кита, например `npx serve`, и откройте `/components/toolbar/example/`.
