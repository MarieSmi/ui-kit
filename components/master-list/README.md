# master-list

Компонент ui-kit: список мастер-области двухколоночного реестра — пункты с полоской выбора, стрелкой дерева,
счётчиками и переключателем, заголовок группы над ними. Библиотека Figma «⚙️ Default components»
(`nuC4KFMiS36uDWDUp9wKGl`), страница «✅ Списки для двухколоночных реестров» (`7571:22445`): component set
«Список» (`25581:1272`) и «Навигация» (`34211:1076`). Заголовок группы — component set `grouping` (`14187:114`)
со страницы «✅ Группировка». Только CSS, без JS.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/components/master-list/master-list.css">
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter и глифов стрелок (cbuc-icons).

## Разметка

```html
<div class="ml__group ml__group--header-right">
  <button type="button" class="ml__group-header">
    <span class="ml__group-expander" aria-hidden="true"></span>
    <span class="ml__group-caption">Текст</span>
  </button>
</div>
<ul class="ml ml--nav">
  <li class="ml__item is-selected">
    <span class="ml__caption">Все</span>
    <span class="ml__counter"><span class="ml__count">12</span><span class="ml__count ml__count--secondary">34</span></span>
  </li>
  <li class="ml__item" aria-expanded="true">
    <span class="ml__arrow" aria-hidden="true"></span>
    <span class="ml__caption">Задачи</span>
  </li>
  <li class="ml__item ml__item--level-1">
    <span class="ml__arrow ml__arrow--empty" aria-hidden="true"></span>
    <span class="ml__caption">Входящие</span>
    <span class="ml__switch" role="switch" aria-checked="true" aria-label="Показывать"></span>
  </li>
</ul>
```

Пункт `.ml__item` — любой тег (`li`, `a`, `button`). Содержимое пункта по порядку: `.ml__icon` или `.ml__arrow`,
`.ml__caption`, справа `.ml__counter` или `.ml__switch`. Положение стрелки (`iconPosition` / `arrowPosition`
в Figma) — порядок `.ml__arrow` и `.ml__caption` в разметке.

Выбор, раскрытие узлов и переключатель пишет прототип: ставит `aria-current` (или `.is-selected`),
`aria-expanded`, `aria-checked` и прячет свёрнутые ветки атрибутом `hidden`.

## Классы

| Figma | Класс | Что это |
|---|---|---|
| набор «Список» | `.ml` | пункты без заливки, фон при наведении и выборе |
| набор «Навигация» | `.ml.ml--nav` | серая заливка пунктов в покое |
| `itemType=counter` | `.ml__counter` | основное число `.ml__count` и второе `.ml__count--secondary` |
| `itemType=counter with click` | `.ml__counter--click` | белая плашка при наведении на пункт, рамка — на счётчик |
| `itemType=counter with two click` | `.ml__counter--two-click` | каждое число — своя кнопка, подчёркивание при наведении |
| `itemType=arrow` | `.ml__counter--arrow` | круглая кнопка-стрелка, видна только при наведении на пункт |
| `itemType=switch` (Навигация) | `.ml__switch` | переключатель 24×16, включён — `aria-checked="true"` |
| `iconsView arrowState=down` | `.ml__arrow--down` | узел раскрыт; то же — `aria-expanded="true"` у пункта |
| `iconsView arrowType=fill` | `.ml__arrow--fill` | залитая стрелка 12px |
| `offsetHierarhy level=1 / 2 / 3` | `.ml__item--level-1` / `-2` / `-3` | отступ 20 / 40 / 60px |
| — | `.ml__arrow--empty` | место под стрелку у листа дерева |
| `iconVisible` | `.ml__icon` | иконка перед подписью: глиф или svg |
| `grouping` | `.ml__group` | линия и заголовок группы |
| `headerPosition=right / center` | `.ml__group--header-right` / `--header-center` | по умолчанию left |
| `lineVisible=false` | `.ml__group--no-line` | заголовок без линии |
| `_header style=black` | `.ml__group--style-black` | тёмный текст; по умолчанию label |

**Состояния:**

| Figma | Класс | Псевдокласс / атрибут |
|---|---|---|
| `selected=true` | `.is-selected` на `.ml__item` | `aria-current` |
| `⛔ hover=true` | `.is-hover` на `.ml__item` | `:hover` |
| `counter state=hoverOnCounter` | `.is-hover` на `.ml__counter` (two click — на `.ml__count`) | `:hover` |
| `iconsView ⛔hover=true` | `.is-hover` на `.ml__arrow` | `:hover` |
| `switch selected=true` | `.is-selected` на `.ml__switch` | `aria-checked="true"` |
| `switch hover=true` | `.is-hover` на `.ml__switch` | `:hover` |
| `_header _hover=true` | `.is-hover` на `.ml__group-header` | `:hover` |

## Дерево

Уровень пункта — `.ml__item--level-N`, узел — `aria-expanded` и стрелка `.ml__arrow`. Листу внутри узла
ставится пустая стрелка `.ml__arrow--empty`: без неё подпись листа встаёт вровень с подписью родителя.
Дети узла — пункты ниже него с уровнем глубже; при сворачивании прототип ставит им `hidden`.

## Допущения

- Высота строки подписи — токен `line-height_m` (18px): в макете `normal`, у Inter это 18,4px и пункт 31,4px.
- Полоска выбора — на 7px от верха и в «Навигации», где в макете 6,5px: полпикселя размыли бы полоску.
- Выбранный пункт при наведении не меняется: в макете цвет у них одинаковый.
- Переключатель по умолчанию выключен; readOnly и resetValue из `switch` не перенесены.
- Цвет текста заголовка группы в стиле black — токен `text-color`: в макете чёрный без переменной.
- Свёрнутой группы в макете нет: стрелка заголовка всегда вниз.
- Корневые листья (без родителя) пустую стрелку не получают — как в примере MasterDetail.
- Фокуса и disabled в макете нет: остаётся обводка браузера по `:focus-visible`.
- Пример MasterDetail в макете (`7577:23863`) собран из устаревших `_componentsMaster/navigation`
  и `_doubleCounter`: разделитель между числами и иконка после подписи в кит не перенесены.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- полоска выбора 3×16px;
- отступ подписи 3px сверху и снизу, отступ 1px под глифами;
- шаг уровня дерева 20px;
- скругление плашки счётчика 100px, рамка и линия группы 1px, отступ 1px у обычного счётчика;
- межбуквенный интервал −1,41 %.

## Пример

[example/index.html](example/index.html) — MasterDetail с группой и деревом, «Список» и «Навигация» по
`itemType`, заголовок группы; вид стрелок (`arrowType`) переключается для всей страницы. Запустите
статический сервер в корне кита, например `npx serve`, и откройте `/components/master-list/example/`
(со слешем на конце).
