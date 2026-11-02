# chips

Компонент ui-kit: чипс — кнопка-метка с подписью, иконкой и счётчиком. Библиотека Figma «⚙️ Default components»
(`nuC4KFMiS36uDWDUp9wKGl`), страница «✅ Чипсы» (`20059:3431`): component set `web/chips` (`20059:4296`) и
`web/roundChips` (`20059:4457`). Сюда же входят кнопки строки «Добавление данных» — `_buttons` (`18813:5910`) и кнопка опционального свойства из
«⚙️Builder-components» (`4608:8103`).
Только CSS, без JS.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.13.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.13.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.13.0/components/chips/chips.css">
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter и глифов иконок (cbuc-icons, cbuc-icons24).

## Разметка

```html
<button type="button" class="chips chips--contrast" aria-pressed="false">
  <span class="chips__caption">Значение</span>
  <span class="chips__icon" aria-hidden="true">&#xe9e2;</span>
  <span class="chips__counter">12</span>
</button>
```

Содержимое — любой набор из `.chips__caption`, `.chips__icon`, `.chips__counter`. Положение иконки
(`iconPosition` в Figma) — порядок элементов: `right` — подпись, иконка, счётчик; `left` — иконка первой;
`only` — без подписи. Иконка — глиф шрифта иконок или svg.

Выбор по клику пишет прототип: ставит `aria-pressed="true"` (или класс `.is-selected`) нужным чипсам.

## Классы

| Figma | Класс | Что это |
|---|---|---|
| `inlineHeight=M / L / XL / 5XL` | `.chips--size-m` / `-l` / `-xl` / `-5xl` | высота 24 / 28 / 32 / 48px; **по умолчанию l** |
| `contrast=true` | `.chips--contrast` | белый фон с тенью; без класса — неконтрастный, бледная заливка |
| `viewMode=ghost` | `.chips--ghost` | без заливки, только у неконтрастных |
| `selectedStyle=primary / secondary` | `.chips--style-primary` / `-secondary` | цвет выбранного контрастного чипса |
| `selectedStyle=contrast` | `.chips--style-contrast` | у неконтрастных, выглядит как default |
| `web/roundChips` | `.chips--round` | круг со стороной в высоту, число в `.chips__caption` |

**Состояния:**

| Figma | Класс | Псевдокласс / атрибут |
|---|---|---|
| `⛔hover=true` | `.is-hover` | `:hover` |
| `selected=true` | `.is-selected` | `aria-pressed="true"` |
| `readonly=true` | `.is-readonly` | `:disabled` |

| Вид | Покой | Наведение | Выбран |
|---|---|---|---|
| контрастный | белый, тень `shadow_d` | тень `shadow_b` | заливка `item_selected` (primary / secondary — их цвет), белый текст, без тени |
| неконтрастный | бледная заливка (ghost — без) | рамка `hover_border` | белый, рамка `unaccented_hover_border` |

## Добавление данных

Кнопки строки `extendedBlockList` (страница «✅ Добавление данных», `18813:1884`), только размер M:

```html
<button type="button" class="chips chips--add chips--add-contrast"><span class="chips__caption">Кнопка</span></button>
<button type="button" class="chips chips--add chips--add-contrast chips--icon" aria-label="Ещё">
  <span class="chips__icon" aria-hidden="true">&#xeab4;</span>
</button>
```

| Figma | Класс | Покой | Наведение |
|---|---|---|---|
| `style=default` | `.chips--add-default` (по умолчанию) | бледная заливка | заливка `pale_hover` |
| `style=contrast` | `.chips--add-contrast` | белый фон | рамка `hover_border` |
| `style=filter` | `.chips--add-filter` | без заливки | белый фон |
| `button=icon` | `.chips--icon` | квадрат 24px с глифом «…» (U+EAB4, cbuc-icons24) | |

Строку целиком («+», кнопки, «…») собирает прототип.

## Опциональные свойства

Кнопка опционального свойства, библиотека «⚙️Builder-components» (`rHabzni5OI5D4fxBLQdj2m`), страница «Окно редактора
свойств» (`4607:4970`), component set «Опциональное свойство» (`4608:8103`). Только высота L:

```html
<button type="button" class="chips chips--optional">
  <span class="chips__icon" aria-hidden="true">&#xeac2;</span>
  <span class="chips__caption">Ограничения</span>
</button>
<button type="button" class="chips chips--optional chips--icon" aria-label="Ограничения">
  <span class="chips__icon" aria-hidden="true">&#xeac2;</span>
</button>
```

| Figma | Класс | Что это |
|---|---|---|
| — | `.chips--optional` | фон `default_contrast_background`, серая подпись, иконка 24px (U+EAC2, cbuc-icons24) |
| `ховер=true` | `.is-hover`, `:hover` | фон `background-color`, рамка `hover_border` |
| `iconButton=true` | `.chips--icon` | квадрат 28px, только иконка |
| `iconVisible=false` | без `.chips__icon` | только подпись |

## Допущения

- Размер по умолчанию — l (в Figma по умолчанию M).
- У выбранного и readonly наведения в макете нет: при наведении они не меняются.
- readonly в макете есть только у контрастных default. У остальных `.is-readonly` / `:disabled` только
  выключает наведение.
- primary и secondary отличаются от default только у выбранного контрастного; у неконтрастных выбранный
  одинаков при любом стиле и у ghost — так в макете.
- У 5XL тень в покое — `shadow_b`, как в макете.
- Ширина круглого чипса фиксирована: длинное число в круг не поместится.
- У «Добавление данных» и опциональных свойств классы размера не действуют, `selected` и `readonly` в макете нет.
- Фокуса в макете нет: остаётся обводка браузера по `:focus-visible`.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- смещение теней 0 0;
- толщина рамки 1px;
- межбуквенный интервал −1,41 % у «Добавление данных» и опциональных свойств;
- подъём иконки на 2px у опциональных свойств.

## Пример

[example/index.html](example/index.html) — все варианты и состояния, группа с выбором по клику. Запустите
статический сервер в корне кита, например `npx serve`, и откройте `/components/chips/example/`.
