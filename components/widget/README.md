# widget

Компонент ui-kit: рамка виджета в конструкторе — компонент «Виджет» библиотеки Figma «⚙️Builder-components»
(`rHabzni5OI5D4fxBLQdj2m`, узел `131:17349`). Только CSS, без JS.

Виджет — обёртка: содержимое внутри может быть любым. Компонент рисует рамку при наведении и выделении,
кружки на серединах сторон и располагает над виджетом плавающий тулбар. Сам тулбар — компонент кита
[`toolbar`](../toolbar/): виджет его стили не трогает, только показывает и ставит на место.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/components/toolbar/toolbar.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/components/widget/widget.css">
```

`tokens.css` подключается первым. `toolbar.css` и шрифты нужны, только если у виджета есть тулбар.

## Разметка

```html
<div class="wg is-active">
  <div class="wg__content">…любое содержимое…</div>

  <button type="button" class="wg__plus wg__plus--up" aria-label="Добавить виджет сверху"></button>
  <button type="button" class="wg__plus wg__plus--down" aria-label="Добавить виджет снизу"></button>
  <button type="button" class="wg__plus wg__plus--left" aria-label="Добавить виджет слева"></button>
  <button type="button" class="wg__plus wg__plus--right" aria-label="Добавить виджет справа"></button>

  <div class="wg__toolbar">
    <div class="tb tb--style-info" role="toolbar" aria-label="Виджет">
      <button type="button" class="tb__btn" aria-label="Настройки"><span class="tb__icon" aria-hidden="true">&#xe75d;</span></button>
      <button type="button" class="tb__btn tb__btn--delete" aria-label="Удалить"><span class="tb__icon" aria-hidden="true">&#xeb72;</span></button>
      <button type="button" class="tb__btn" aria-label="Ещё"><span class="tb__icon" aria-hidden="true">&#xeab4;</span></button>
    </div>
  </div>
</div>
```

Размер виджета задаёт прототип (`width`, `height` или сетка). Кружки и тулбар выходят за границы виджета:
оставьте вокруг место — 10px по бокам и снизу, 40px сверху.

## Классы

| Класс | Figma | Что это |
|---|---|---|
| `.wg` | «Виджет» | контейнер, рамка рисуется поверх содержимого |
| `.wg__content` | `_Контент виджета` | содержимое: обрезается по скруглению рамки |
| `.wg__plus.wg__plus--up` / `--down` / `--left` / `--right` | `Plus_up` / `Plus_down` / `Plus_left` / `Plus_right` | кружок 8px, кнопка 20×20 |
| `.wg__toolbar` | `Плавающий тулбар` | слот для `.tb` над левым верхним углом |
| `.wg--level-2` | `Уровень=2` | родитель — виджет, внутри которого другие виджеты: пунктирная рамка, без активного состояния |

Кружки и тулбар необязательны, как свойства `Плюсы Вертикальные` (up, down), `Плюсы Горизонтальные`
(left, right) и `Плавающий тулбар` в Figma: ненужные элементы просто не добавляйте в разметку.

Обработчики кликов по кружкам и кнопкам тулбара пишет прототип.

**Состояния:**

| Figma | Класс | Псевдокласс | Как выглядит |
|---|---|---|---|
| `Hover=off, Active=off` | — | — | без рамки (у родителя — пунктир info 60 %) |
| `⛔ Hover=on` | `.is-hover` | `:hover` | рамка info 60 % |
| `Active=on` | `.is-active` | — | рамка info, кружки и тулбар |
| `⛔ Hover=on, Active=on` | `.is-hover.is-active` | — | как `Active=on` |

Активным виджет делает прототип: ставит и снимает класс `.is-active`, например по клику. У родителя
(`.wg--level-2`) активного состояния нет: класс `.is-active` на нём ничего не меняет, кружки и тулбар ему не нужны.

**Состояния кружка** — компонент `Plus` (`399:49380`):

| Figma | Класс | Псевдокласс | Как выглядит |
|---|---|---|---|
| `Hover=false, Active=false` | — | — | белый кружок 8px с рамкой info |
| `Hover=false, Active=true` | `.is-active` | `:hover`, `:focus-visible` | кружок 16px info с белым плюсом |
| `Hover=true, Active=true` | `.is-hover` | `:active` | то же, цвет info hover |

## Пустое состояние

Пустой виджет — вариант `_Контент виджета = Пустая ячейка` (`402:9447`) с командами «Колонки», «Виджет»,
«Строки» (`Экшены пустого состояния`, `4587:4958`). Вместо обычного `.wg__content` в виджет кладётся:

```html
<div class="wg__content wg__empty">
  <div class="wg__actions">
    <button type="button" class="wg__action wg__action--cols" aria-label="Колонки"><span class="wg__action-caption" aria-hidden="true">Колонки</span></button>
    <button type="button" class="wg__action wg__action--widget" aria-label="Виджет"><span class="wg__action-caption" aria-hidden="true">Виджет</span></button>
    <button type="button" class="wg__action wg__action--rows" aria-label="Строки"><span class="wg__action-caption" aria-hidden="true">Строки</span></button>
  </div>
</div>
```

Иконки рисует CSS по модификатору, подпись — `.wg__action-caption`. Набор команд фиксированный, как в макете.

**Размер** (`Размер виджета` / `Размер экшена`) выбирается сам по ширине ячейки, без JS и классов
(container query):

| Ширина виджета | Figma | Команды |
|---|---|---|
| меньше 266px | `Size #3` | только иконки 24px, между командами 12px |
| 266–325px | `Size #2` | иконка и подпись, команда 70px |
| от 326px | `Size #1` | иконка и подпись, команда 90px; у «Виджет» подложка-градиент |

**Состояния команды** — `hover` (`:hover`, `.is-hover`): иконка темнее; в `Size #1` у типовой команды
появляется белый фон, у «Виджет» — градиент насыщеннее.

## Допущения

- `Уровень=2` в макете есть только в покое. При hover родитель выглядит как виджет (уровень 1):
  пунктир сменяется сплошной рамкой.
- Кружки и тулбар у неактивного виджета скрыты через `visibility` (в макете — `opacity 0`), чтобы по ним
  нельзя было кликнуть.
- У активного виджета `z-index: 1`, чтобы тулбар и кружки были поверх соседей.
- Тулбар стоит на `offset_s` выше виджета (в макете `top −40px` при высоте тулбара 32px): в других размерах
  отступ меняется вместе с токеном.
- Кружки стоят центром на внешнем крае виджета (в макете вынесены на 1px дальше) и рисуются поверх рамки.
- У кружка наведение и фокус с клавиатуры дают `Active=true`, а тёмный вариант `Hover=true, Active=true` —
  нажатие (`:active`). Что именно означает этот вариант, в макете не подписано.
- Слой «Команды на виджете» в макете всегда скрыт и в кит не входит.
- Пороги размера пустой ячейки — ширины вариантов в макете (168, 266, 326px): `Size #2` с 266px, `Size #1` с 326px.
- Градиент под «Виджет» в `Size #1` в макете задан цветами без переменных (#FCF0E4, #FFE9E0); в ките он
  собран из токенов `background-primary_hover` и `background-primary_active`, чтобы перекрашивался с темой.
- Иконка «Строки» в макете — глиф U+EAC3, но в шрифте `cbuc-icons24` кита на этом месте другой знак («=»),
  а иконки строк нет. Пока шрифт не обновлён, «Строки» — глиф «Колонки» (U+EAEE), повёрнутый на 90°.
- Фокуса у команд в макете нет: обводка браузера внутрь кнопки.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- толщина рамки виджета и кружка 1px;
- прозрачность рамки при hover и у уровня 2 — 60 %;
- кнопка кружка 20×20 и её вынос −10px за край (половина кнопки);
- ширина команды пустой ячейки 70 и 90px, пороги размера 266 и 326px;
- эллипс и центр градиента «Виджет» (229×150px с центром 24, 125px);
- межбуквенный интервал подписи команды −1,41 %, отступ обводки фокуса −2px.

## Пример

[example/index.html](example/index.html) — варианты как в макете и живой пример с выделением по клику.
Запустите статический сервер в корне кита, например `npx serve`, и откройте `/components/widget/example/`.
