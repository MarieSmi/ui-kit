# property-editor

Компонент ui-kit: окно редактора свойств со страницы «Окно редактора свойств» библиотеки Figma «⚙️Builder-components»
(`rHabzni5OI5D4fxBLQdj2m`, страница `4607:4970`, окно `4625:846`, шапка `4608:7879`). Вид и варианты — CSS с классами,
поведение чипсов, крестиков и названия — необязательный `property-editor.js`, по образцу прототипа `widget-settings-demo`.

Цвета, размеры и шрифт берутся из токенов кита, поэтому окно перекрашивается вместе с `data-ui-theme`. Рабочий пример —
[`example/index.html`](example/index.html).

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.12.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.12.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.12.0/components/property-editor/property-editor.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.12.0/components/property-editor/property-editor.js"></script>
<!-- только если в окне есть кнопки «Опциональное свойство» -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.12.0/components/chips/chips.css">
```

`tokens.css` подключается первым. Иконки — глифы шрифтов `cbuc-icons24` и `cbuc-icons`, текст набран **Inter**. Шрифты
подключает проект, например через `fonts/fonts.css` кита.

## Разметка

```html
<section class="pe" aria-label="Редактор свойств">
  <header class="pe__head">
    <span class="pe__name pe__name--static">Название виджета</span>
    <div class="pe__cmds">
      <button type="button" class="pe__reset" aria-label="Сбросить настройки">&#xe629;</button>
      <button type="button" class="pe__done" aria-label="Сохранить и выйти">&#xe75e;</button>
      <button type="button" class="pe__close" aria-label="Закрыть">&#xe66c;</button>
    </div>
  </header>
  <div class="pe__body">
    <div class="pe__card">
      <div class="pe__title">Заголовок группы</div>
      <div class="pe__rows">
        <div class="pe__row"><span class="pe__label">Метка</span><span class="pe__editor is-readonly">Редактор</span></div>
      </div>
    </div>
    <div class="pe__chips">
      <button type="button" class="chips chips--optional"><span class="chips__caption">Скругления</span></button>
    </div>
  </div>
</section>
```

`.pe__card` и `.pe__chips` — слоты «Настройки» и «Чипсы»: внутри может быть любая разметка. Если чипсы не нужны
(`ShowЧипсы=false`), `.pe__chips` не добавляйте. Вместо `.pe__editor` в строку можно поставить свой редактор.

## Шапка

| Вариант в Figma | Разметка |
|---|---|
| `Название=Не меняется` | `<span class="pe__name pe__name--static">` |
| `Название=Изменяется` | `<button class="pe__name">`, наведение `:hover` или `.is-hover` |
| `Empty=on` | `.pe__name.is-empty` или `placeholder` у поля правки |
| `Edit=on` | `<label class="pe__name pe__name--edit"><input class="pe__name-input"></label>` |
| `Иконка=true` | `<span class="pe__icon">` с глифом перед именем. Глиф по умолчанию `&#xebb9;` — с `.pe__icon--s`, его нет в `cbuc-icons24` кита |
| `Тип=Измененное имя` | свой глиф в `.pe__icon` и `.pe__mark` с подсказкой `.pe__hint` после имени |
| `Тип=Провал` | `<button class="pe__back">&#xeb9e;</button>` вместо `.pe__icon`, у `.pe__reset` — `disabled` |

Подсказка `.pe__hint` появляется при наведении на метку или с классом `.is-open` на `.pe__mark`. Имя в ней — `.pe__hint-text`.

## Блоки

| Блок | Классы |
|---|---|
| Размер | `.pe__card--size` → `.pe__size` с парами `.pe__label` + `.pe__dim`, рядом `.pe__arrow` |
| Поле размера | `.pe__dim` с `.pe__dim-value` и `.pe__dim-unit`. `Type=auto` и `fill` — `.pe__dim--auto`, значение бледное |
| Скругления | `.pe__row--style`: `.pe__label--style` и `.pe__row-body` с `.pe__num` (`.pe__corners`), `.pe__spacer`, `.pe__switch`, `.pe__x` |
| Границы | `.pe__row--style`: `.pe__label--style` и `.pe__row-body` с `.pe__swatch`, `.pe__line`, `.pe__num--edge`, `.pe__spacer`, `.pe__switch`, `.pe__x` |
| Тень, Фон | `.pe__row--style`: `.pe__label--style` и `.pe__row-body` с `.pe__bubble` (`.pe__swatch` внутри), `.pe__x`. У тени значение пишется как `#000000, 0.14` |

Цвет задаётся переменной на `.pe__bubble` или `.pe__swatch`: `style="--pe-color: #a39c97"`, ею же окрашена подложка пилюли.
`.pe__swatch--alpha` показывает прозрачность половиной кружка, её доля — `--pe-alpha`, например `14%`. `.pe__switch.is-active` — включённый переключатель (`Active=on`).

## Поведение

Необязательный `property-editor.js`: вид берётся из макета, логика — из прототипа `widget-settings-demo`. Полная разметка —
в [примере](example/index.html).

```js
const editor = PropertyEditor.mount(document.querySelector('.pe'), {
  onChange(state) {},       // при любом изменении, описание state ниже
  onDone(state) {},         // кнопка «Сохранить и выйти»
  onClose(state) {},        // кнопка «Закрыть»; окно само не закрывается
  actualSize(axis) {},      // необязательно: фактический размер для 'w' и 'h', показывается в «по контенту» и «заполнить»
});
editor.getState(); editor.reset(); editor.destroy();
```

`state`: `{ name, rows, dims, edges, line, split, colors, shadow }`.

| Разметка | Что делает |
|---|---|
| `data-pe-row="ключ"` у строки, `hidden` — убрана | строка, которую показывают и убирают |
| `data-pe-chip="ключ"` у чипсы | показывает строку и исчезает. Облачко без строк и `.pe__chips` без чипсов схлопываются |
| `data-pe-clear` у крестика | убирает строку и возвращает чипсу |
| `data-pe-also="ключ"` у строки | её крестик убирает и указанную строку: без фона нет тени. Чипса включает только свою строку |
| `.pe__name-input` в `<label class="pe__name">` | правка на месте, Enter завершает, Esc возвращает прежнее. `data-pe-default` — имя по умолчанию, иначе начальное значение |
| `.pe__mark` с `.pe__hint-text` | видна, когда имя непустое и отличается от имени по умолчанию; клик возвращает его |
| `data-pe-dim="w"` или `"h"` у `.pe__dim` | клик по `.pe__dim-unit` открывает меню величин с Min/Max своей оси. Ввод числа в «по контенту» и «заполнить» делает ось фиксированной |
| `.pe__line` в строке | меню типа линии: сплошная или пунктир (`.pe__line--dashed`) |
| `data-pe-split="corners"` или `"sides"` у `.pe__switch`, `data-pe-max` — предел | раскрывает блок по углам или сторонам вместо `.pe__num`. При сворачивании значения выравниваются по первому |
| `data-pe-color="#hex"`, `data-pe-title` у `.pe__bubble` или `.pe__swatch` | окно выбора цвета: клик по цвету и ✓ применяют, ✕, Esc и клик мимо отменяют, «+» — системный выбор цвета |
| `data-pe-shadow="#hex"`, `data-pe-opacity`, `-x`, `-y`, `-blur`, `-spread` у `.pe__bubble` | окно тени с ползунками: правки видны сразу, ✓ и клик мимо сохраняют, ✕ и Esc возвращают прежнее |
| `.pe__reset` | возвращает всё к состоянию на момент `mount` |

Текст значения кладётся в `.pe__bubble-text`.

Строки внутри `.pe__rows` выравниваются по общей колонке меток: её ширина — самая длинная видимая метка группы, редактор стоит в
8px от неё. Убранные строки в расчёт не входят.

## Что не вошло

- Несколько значений в Тени и Фоне (`Количество=2`, `3`) и кнопка «плюс»: в `widget-settings-demo` их нет.
- Пипетка, градиенты, текстура и картинка в окне выбора цвета показаны, но выключены, как в `widget-settings-demo`.
- Прозрачность цвета: полей для неё в макете нет, значение тени задаётся только через `data-pe-opacity`.
