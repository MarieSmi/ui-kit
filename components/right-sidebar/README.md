# right-sidebar

Компонент ui-kit: правый сайдбар конструктора — узкий тулбар с пунктами и панели вкладок («Магазин», «Данные»,
«Слои») слева от него. Секция «Правый сайдбар» библиотеки Figma «⚙️Builder-components»
([`5:28436`](https://www.figma.com/design/rHabzni5OI5D4fxBLQdj2m/?node-id=5-28436)).

В компонент входят: тулбар и его пункты, шапка панели, строки вкладок «Поля» и «Слои», три состояния сайдбара
и поведение на JS. Содержимое вкладки «Магазин» — отдельный компонент `shop`.

Цвета и размеры берутся из токенов кита, поэтому сайдбар перекрашивается вместе с `data-ui-theme`
(кроме фона пунктов тулбара, см. «Значения без токена»).

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.18.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.18.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.18.0/components/right-sidebar/right-sidebar.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.18.0/components/right-sidebar/right-sidebar.js"></script>
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter и глифов иконок (cbuc-icons, cbuc-icons24).
Для кнопки разворота в слоте `.rsb__dock` подключите ещё `components/button/button.css`.

## Разметка

```html
<aside class="rsb" id="sidebar">
  <div class="rsb__panels">
    <section class="rsb__panel is-open" data-rsb-panel="data">
      <header class="rsb__head">
        <div class="rsb__title"><h3 class="rsb__name">Данные</h3></div>
        <div class="rsb__tools">
          <label class="rsb__search"><input class="rsb__search-input" type="search" placeholder="Найти"></label>
        </div>
      </header>
      <div class="rsb__content" role="tree">…строки…</div>
    </section>
    <section class="rsb__panel" data-rsb-panel="layers">…</section>
  </div>

  <div class="rsb__bar">
    <div class="rsb__items">
      <button type="button" class="rsb__item rsb__item--shop" data-rsb-tab="shop" aria-label="Магазин">
        <span class="rsb__icon">&#xeadd;</span>
      </button>
      <button type="button" class="rsb__item" data-rsb-tab="data" aria-label="Данные">
        <span class="rsb__icon">&#xebbc;</span>
      </button>
      <button type="button" class="rsb__item" data-rsb-tab="layers" aria-label="Слои">
        <span class="rsb__icon">&#xebf9;</span>
      </button>
    </div>
    <div class="rsb__dock">
      <button type="button" class="btn btn--filled btn--style-pale btn--size-xl btn--icon" aria-label="Развернуть панель"><span class="btn__icon">&#xebfa;</span></button>
    </div>
    <div class="rsb__informers"><button type="button" class="rsb__help" aria-label="Помощь">?</button></div>
  </div>
</aside>

<script>
  RightSidebar.mount(document.getElementById('sidebar'));
</script>
```

Пункт и его панель связаны ключом: `data-rsb-tab` у пункта, `data-rsb-panel` у панели. Открыта панель с `.is-open`.
Сайдбар занимает высоту родителя: родитель — flex-контейнер или задаёт высоту.

Своего фона у сайдбара нет: тулбар лежит на фоне страницы. В макете это фон конструктора —
`--components-constructor-constructor_background-color`; его задаёт страница прототипа.

**Панель-слот.** `.rsb__panel.rsb__panel--bare` — панель без фона и обрезки: её содержимое — готовый блок
на всю панель, который сам задаёт фон. Так ставится магазин ([`shop`](../shop/)): в расширенном виде он
раздвигается влево за пределы панели.

## Состояние сайдбара

| Figma, «Состояние» | Класс | Что происходит |
|---|---|---|
| Вписан | без класса | Панель стоит в потоке слева от тулбара, ширина сайдбара 54 или 412. |
| По ховеру | `.rsb--hover` | Сайдбар занимает только тулбар (54). Панель висит поверх страницы, с тенью. |
| Закреплен | `.rsb--pinned` | То же, что «По ховеру», но панель не закрывается при уходе курсора. |

«Вкладка = Свернут» — ни одной панели с `.is-open`.

Висящая панель встаёт верхом на уровень своего пункта и занимает высоту содержимого. Отступ сверху —
переменная `--rsb-panel-top`, её ставит JS.

## Пункт тулбара

| Figma, «Тип» | Класс |
|---|---|
| Раздел | `.rsb__item` |
| Магазин | `.rsb__item.rsb__item--shop` — иконка акцентная |
| МагазинRound | `.rsb__item.rsb__item--round` — иконка в круглой кнопке, без фона и маркера |

| Состояние | Класс | Атрибут или псевдокласс |
|---|---|---|
| Active | `.is-active` | `aria-selected="true"` |
| ⛔ Hover | `.is-hover` | `:hover` |

Иконка — глиф в `.rsb__icon`: шрифт и размер m (`cbuc-icons24`, 24px). Магазин `U+EADD`, «Данные» `U+EBBC`, «Слои» `U+EBF9`.

## Кнопка разворота панели

`.rsb__dock` — свободное место тулбара между пунктами и «?». Набор «Кнопка разворота панели»
файла «Расширенный конструктор» ([`22358:147715`](https://www.figma.com/design/G3QPR5r3X5ox6DmPwj6rJ7/?node-id=22358-147715)).

- Вверху этого места — слот для кнопки. В нём кнопка-иконка кита [`button`](../button/):
  `.btn.btn--filled.btn--style-pale.btn--size-xl.btn--icon` с глифом в `.btn__icon`. Это тот же набор `filled`,
  что в макете. Нужен `components/button/button.css`.
- Кликабельна вся область `.rsb__dock`, не только кнопка. В покое кнопки не видно: она появляется при наведении
  на тулбар (`.rsb__bar:hover` или `.rsb__bar.is-hover`) и при фокусе с клавиатуры. Наведение на саму область —
  вариант Hover=on: фон темнее.
- Сайдбар меняет у кнопки в слоте только её переменные: при наведении на область — фон `pale_hover_color`
  и иконку `secondary_icon-color`, как в варианте Hover=on. Шрифт и размер иконки — m кнопки xl
  (`cbuc-icons24`, 24px), как в макете.
- Глиф ставит JS по состоянию сайдбара:

```html
<div class="rsb__dock">
  <button type="button" class="btn btn--filled btn--style-pale btn--size-xl btn--icon" aria-label="Развернуть панель"><span class="btn__icon">&#xebfa;</span></button>
</div>
```


| Figma, «Состояние» | Иконка | Когда |
|---|---|---|
| Свернуть | `»` `U+EBFB` | сайдбар вписан и панель открыта |
| Развернуть | `«` `U+EBFA` | по ховеру, закреплён или вписан без открытой панели |

| Состояние | Класс | Псевдокласс |
|---|---|---|
| Hover | `.is-hover` на `.rsb__dock` | `:hover` на `.rsb__dock` |

Что делает клик — в разделе «Поведение». Глиф, `aria-label` и `title` кнопки («Свернуть панель» или
«Развернуть панель») ставит JS.

## Шапка панели

**Тип «Панель»** — название слева, справа поиск:

- `.rsb__title` — название `.rsb__name`; после него можно поставить кнопку (в макете «Доп. кнопка»).
- `.rsb__tools` — правая часть: поиск `.rsb__search` с `input.rsb__search-input`, рядом любые кнопки.
  Шапка без поиска — пустой или пропущенный `.rsb__tools`.

**Тип «Виджет»** — `.rsb__head.rsb__head--widget`: строка с названием и командами, под ней путь.

```html
<header class="rsb__head rsb__head--widget">
  <div class="rsb__head-row">
    <div class="rsb__title"><h3 class="rsb__name">Строка</h3></div>
    <div class="rsb__head-cmds">…кнопки «Сбросить», «Удалить»…</div>
  </div>
  <div class="rsb__path">…хлебные крошки…</div>
</header>
```

Кнопки и хлебные крошки — слоты: в них ставятся компоненты кита `button` (`.btn.btn--size-m.btn--icon`)
и `breadcrumbs` (`.breadcrumbs.breadcrumbs--size-m`). Сайдбар их не стилизует и от них не зависит.

## Строки вкладок

Строки лежат в `.rsb__content` подряд, без вложенных списков. Вложенность задаёт класс уровня:
`.rsb__row--level-2` … `.rsb__row--level-5`, шаг 20px; первый уровень — без класса.

**Поле данных** — `.rsb__field`:

```html
<div class="rsb__field rsb__field--object" role="treeitem" aria-expanded="true">
  <span class="rsb__row-name">Аккаунт</span><button type="button" class="rsb__arrow"></button>
  <span class="rsb__type">Аккаунт</span>
</div>
<div class="rsb__field rsb__row--level-2" role="treeitem">
  <span class="rsb__row-name">Номер лицевого счета</span><span class="rsb__type">Число</span>
</div>
```

| Figma, «Иерархия» | Класс | Вид |
|---|---|---|
| Поле | `.rsb__field` | 14px |
| Узел | `.rsb__field.rsb__field--node` | 16px, стрелка после названия |
| Объект | `.rsb__field.rsb__field--object` | 16px, жирный, стрелка после названия |

**Слой** — `.rsb__layer`:

```html
<div class="rsb__layer rsb__row--level-2" role="treeitem" aria-expanded="true">
  <button type="button" class="rsb__arrow"></button>
  <span class="rsb__row-icon">&#xeaee;</span><span class="rsb__row-name">Строка</span>
  <span class="rsb__cmds">
    <button type="button" class="rsb__cmd rsb__cmd--m" aria-label="Скрыть">&#xe651;</button>
    <button type="button" class="rsb__cmd rsb__cmd--danger" aria-label="Удалить">&#xeb72;</button>
  </span>
</div>
```

У слоя без вложенных строк стрелка остаётся в разметке с классом `.rsb__arrow--empty`: она невидима, но держит
название на своём уровне. Команды `.rsb__cmds` видны только при наведении на строку.

| Состояние | Класс | Атрибут или псевдокласс |
|---|---|---|
| наведение (поле и слой) | `.is-hover` | `:hover` |
| слой выбран (Active) | `.is-active` | `aria-selected="true"` |
| узел раскрыт | — | `aria-expanded="true"` у строки |
| узел свёрнут | — | `aria-expanded="false"` у строки |

Свёрнутый узел только меняет стрелку. Прячет вложенные строки JS: ставит им `hidden`.

## Поведение

```js
var sidebar = RightSidebar.mount(element, {
  onTab: function (key) {},          // открыта вкладка key; null — панель закрыта
  onToggle: function (row, open) {}, // строка дерева раскрыта или свёрнута
  onDock: function (docked) {}       // кнопка разворота: true — сайдбар вписан, false — по ховеру
});

sidebar.open('layers');  // открыть вкладку
sidebar.close();         // свернуть панель
sidebar.pin(true);       // закрепить висящую панель; pin(false) — вернуть «По ховеру»
sidebar.dock(true);      // сделать вписанным; dock(false) — перевести в «По ховеру»
sidebar.tab;             // ключ открытой вкладки или null
sidebar.destroy();       // снять обработчики
```

- **Вписан.** Клик по пункту открывает его панель, клик по активному пункту сворачивает.
- **По ховеру.** Наведение на пункт открывает панель; она закрывается через 200 мс после ухода курсора
  с сайдбара. Клик по пункту закрепляет: класс меняется на `.rsb--pinned`.
- **Закреплен.** Клик по другому пункту переключает панель, клик по активному закрывает её и возвращает
  `.rsb--hover`, если сайдбар был закреплён из этого режима.
- **Кнопка разворота.** Во вписанном сайдбаре переводит его в «По ховеру» и закрывает панель. В режимах
  «По ховеру» и «Закреплен» делает сайдбар вписанным с той же вкладкой; если вкладка не открыта — с первой.
- **Дерево.** Клик по стрелке строки меняет `aria-expanded` и прячет или показывает строки глубже уровнем.

Без JS сайдбар остаётся статичным: состояние задаётся классами.

## Что не входит

- Содержимое вкладки «Магазин» — компонент `shop`.
- У «Пункта списка» — состояния Disable и Edit, опции «Доступ», «Три точки», «Переключатель».
- У «Записей» — типы «Датасет», «Расчетное поле», «Вариативный» и состояние Edit.
- В шапке — опции «Стрелки», «Фильтр», «Плюс», «Кнопка сайдбара»: это кнопки, они ставятся в `.rsb__tools`
  и `.rsb__title` как слоты.
- Набор «_Поле - Архив» (`5:28846`): в макете помечен архивным.

## Допущения

- «По ховеру» и «Закреплен» в макете выглядят одинаково; разница в поведении — допущение.
- Знак «?» в кнопке помощи набран текстом: в макете это вектор.
- Кнопка разворота взята из файла «Расширенный конструктор»: в «⚙️Builder-components» её нет.
- В «Расширенном конструкторе» у вписанного сайдбара на «Свернут» нарисовано «Развернуть», а клик ведёт
  в «По ховеру». Сделано как в макете.
- Повторный клик по активному пункту во вписанном сайдбаре закрывает панель и оставляет сайдбар вписанным.
  В «Расширенном конструкторе» он переводит сайдбар в «По ховеру» — это не перенесено.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- фон пункта тулбара: наведение `#f9f9f9`, активный `#f2f2f2` — переменные библиотеки «Accordion Variables»,
  в токены кита не входят и с `data-ui-theme` не меняются;
- ширина панели 350px и тулбара 54px, пункт 44×48px;
- маркер активного пункта 4×32px, скругление 3px, стоит на 48px от левого края пункта — правее тулбара;
- размер названия панели 18px, отступ шапки «Виджет» сверху 11px;
- ширина поиска 163px, рамки 1px;
- высота кнопки разворота с отступами 56px;
- высота строки поля 30px и слоя 31px, шаг вложенности 20px, маркер слоя 3px;
- смещение тени 0 0.

## Пример

[example/index.html](example/index.html) — рабочий сайдбар с тремя вкладками и переключателем «По ховеру».
Запустите статический сервер в корне кита, например `npx serve`, и откройте `/components/right-sidebar/example/`.
