# toolbar

Компонент ui-kit: плавающий тулбар. Только CSS, без JS.

С версии 1.20.0 вид сверен по двум источникам. Из каждого взято то, где информации больше:

- макет Figma «Тулбар в конструкторах» (`xf4ot0TI7serEN9WyA5TVo`): component set «Круглый плавающий (Сайты)» `1592:91557`,
  «Кнопка тулбара» `154:83822`, палитры — коллекция «Тулбар | Палитра»;
- код saby-components: `ExtControls/_floatingToolbar/PlatformToolbar`.

До 1.20.0 тулбар был сделан по странице «Плавающий тулбар» библиотеки «⚙️Builder-components»
(`rHabzni5OI5D4fxBLQdj2m`, `854:7085`). Классы с тех пор не менялись, менялся только вид.

Цвета, размеры и шрифт берутся из токенов кита, поэтому тулбар перекрашивается вместе с `data-ui-theme`.
Ручка перетаскивания (6dots) и `button_expander` в кит не входят.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/toolbar/toolbar.css">
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
  <span class="tb__caption">Заголовок 2</span>
  <span class="tb__arrow" aria-hidden="true"></span>
</button>
```

Разделитель — `<span class="tb__sep" aria-hidden="true"></span>` между кнопками.

## Размеры

Тулбар высотой 36px: кнопки 32×32 (`inline_height_xl`), отступы внутри тулбара и между кнопками `offset_3xs`.
Скругление тулбара — `border-radius_m` + `offset_3xs`, у кнопок — `border-radius_m`, отступ внутри кнопки `offset_2xs`.
Тень `shadow_c`, обводка снаружи 1px.

## Классы

**Стиль тулбара:**

| Класс | Макет («Тулбар \| Палитра») | Код Saby | Как выглядит |
|---|---|---|---|
| — | — | default | белый фон; hover и click фиолетовые, иконки обычного цвета |
| `.tb--style-info` | Бледная фиолетовая | constructor | светло-фиолетовый фон, обводка; иконки серые, при click фиолетовые |
| `.tb--style-contrast` | Акцентная фиолетовая | contrast | насыщенный фиолетовый фон без обводки, тёмные иконки |
| `.tb--style-unaccented` | Серая | — | серый фон без обводки, серые иконки |
| `.tb--style-success` | — | success | светло-зелёный фон, обводка; hover и click зелёные |

Стиль ставится только на тулбар: кнопки берут цвета от него, своего класса стиля у кнопки нет.

**Кнопки:**

| Класс | Figma | Иконка |
|---|---|---|
| `.tb__btn` | «Кнопка тулбара» | цвет от стиля тулбара |
| `.tb__btn.tb__btn--delete` | «Кнопка тулбара» с иконкой удаления (раньше `Bricks/deleteButton`) | красная |
| `.tb__btn.tb__btn--success` | `_Bricks/successButton` (прежний макет) | зелёная |

Внутри кнопки: `.tb__icon`, `.tb__caption` (`text`, текст — `name`), `.tb__arrow` (`arrow`).
Стрелка смотрит вниз, у выбранной кнопки — вверх; глиф рисует CSS.

**Разделитель** (есть в коде, в новом макете не используется): `.tb__sep`, `.tb__sep.tb__sep--style-contrast` (линия темнее).

**Состояния** — свойства `hover` и `click` у «Кнопки тулбара»:

| Figma | Класс | Псевдокласс / атрибут |
|---|---|---|
| `hover=true` | `.is-hover` | `:hover` |
| `click=true` | `.is-selected` | `aria-pressed="true"` |
| `hover=true, click=true` | `.is-selected.is-hover` | `aria-pressed="true"` + `:hover` |

При наведении на выбранную кнопку фон становится «Актив-Ховер», иконка возвращается к обычному цвету.
Состояния Focus нет ни в макете, ни в коде: при фокусе с клавиатуры рисуется обводка браузера внутри кнопки.

## Допущения

- Стиль без класса и `.tb--style-success` есть только в коде. Состояние select + hover и цвета иконок для них
  сделаны по образцу остальных стилей.
- Палитра «Редактор по месту» в кит не входит.
- Стрелка у подписи всегда цвета `secondary_icon-color`, как в макете. Отступы между иконкой, подписью и стрелкой
  одинаковые, `offset_2xs`.
- Иконка удаления и подтверждения не меняет цвет при наведении.
- Hover у кнопки подтверждения в тулбаре info в макете нет: взят фон hover остальных кнопок info.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- толщина обводки тулбара и линии разделителя 1px;
- обводка info — токен `border-info_border-color` с прозрачностью 20 %, success — `border-success_border-color` с 25 %;
- скругление тулбара 14px: в макете без переменной, в CSS — формула из кода;
- смещение тени shadow_c 0 0;
- межбуквенный интервал подписи −1,41 %;
- отступ обводки фокуса −2px.

## Пример

[example/index.html](example/index.html) — наборы по всем стилям с переключением темы. Запустите статический
сервер в корне кита, например `npx serve`, и откройте `/components/toolbar/example/`.
