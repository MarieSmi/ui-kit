# accordion

Компонент ui-kit: аккордеон и сайдбар — навигация по разделам продукта. Аккордеон — разделы с иконкой, названием
и маркером выбранного. Сайдбар добавляет над ним шапку с логотипом продукта, кнопкой сворачивания и названием
схемы навигации. Только CSS, без JS.

Перенесены из кода Saby — `NavigationPanels/accordion:View` и `NavigationPanels/sidebars:Sidebar`, светлая тема
`navigation_theme-default`. В Figma — «Аккордеон [30.07.26]». Вид и состояния взяты из кода и живого примера
Saby Components, с макетом не сверялись; ключ компонента в Figma не читался.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/accordion/accordion.css">
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter, иконок разделов (Accordion-Font), логотипа (Maison Neue Extended) и птички
в шапке (cbuc-icons24).

## Разметка

Сайдбар целиком:

```html
<aside class="sidebar">
  <div class="sidebar__header">
    <div class="sidebar__top">
      <a class="sidebar__bird" href="#" aria-label="Saby">&#xe9e2;</a>
      <a class="sidebar__logo" href="#">
        <span class="sidebar__logo-name">saby</span><span class="sidebar__logo-title">design</span>
      </a>
    </div>
    <div class="sidebar__bottom">
      <label class="sidebar__toggle" title="Свернуть или развернуть">
        <input class="sidebar__toggle-input" type="checkbox" aria-label="Свернуть меню">
      </label>
      <span class="sidebar__scheme">конструктор сайтов</span>
    </div>
  </div>
  <nav class="accordion" aria-label="Разделы">
    <a class="accordion__item is-selected" href="#" aria-current="page">
      <span class="accordion__icon" aria-hidden="true">&#xe9eb;</span>
      <span class="accordion__title">Сайты</span>
    </a>
    <a class="accordion__item" href="#">
      <span class="accordion__icon" aria-hidden="true">&#xe943;</span>
      <span class="accordion__short">Стиль</span>
      <span class="accordion__title">Оформление</span>
    </a>
  </nav>
</aside>
```

Сайдбар занимает всю высоту родителя; родитель — `display: flex` или блок с заданной высотой. Аккордеон
прокручивается внутри, если разделы не помещаются.

**Аккордеон без шапки** — `<nav class="accordion">` сам по себе, когда шапку рисует другой компонент.

**Сворачивание.** Кнопка сворачивания — `label` с флажком: клик сворачивает и разворачивает сайдбар без JS.
Если состоянием управляет прототип, кнопка — `<button class="sidebar__toggle">`, а свёрнутый вид задаёт класс
`.sidebar--compact`.

**Иконка раздела** — глиф шрифта `Accordion-Font` (набор иконок аккордеона Saby) или `svg` внутри
`.accordion__icon`: 20px в развёрнутом виде, 24px в свёрнутом. Коды глифов — в разделе «Иконки» ниже.

**Короткое название** `.accordion__short` показывается под иконкой в свёрнутом виде. Без него там стоит полное
название, длинное обрезается многоточием.

**Подразделы и группы:**

```html
<a class="accordion__item is-active" href="#">…Сайты…</a>
<a class="accordion__item accordion__item--sub is-selected" href="#" aria-current="page">
  <span class="accordion__title">Статистика сайтов</span>
</a>
<a class="accordion__item" href="#">…Виджеты…</a>
<div class="accordion__group"></div>     <!-- линия между группами -->
<a class="accordion__item" href="#">…Аналитика…</a>
<div class="accordion__spacer"></div>    <!-- прижимает следующие разделы к низу -->
<a class="accordion__item" href="#">…Настройки…</a>
```

Подраздел стоит сразу после своего раздела и виден, только когда выбран. Его разделу в это время задаётся
`.is-active`: у них общая подложка.

## Классы

| Класс | Saby | Что делает |
|---|---|---|
| `.sidebar` | `Sidebar` | сайдбар 200px: шапка и аккордеон |
| `.sidebar--compact` | `accordionExpanded={false}` | свёрнутый сайдбар 56px: без логотипа и названия схемы |
| `.accordion` | `Accordion` | аккордеон 200px |
| `.accordion--compact` | `expanded={false}` | свёрнутый аккордеон 56px: иконка 24px и короткое название под ней |
| `.accordion__item--sub` | раздел с `parent` | подраздел: без иконки, с отступом, виден только выбранный |
| `.accordion__group` | смена `groupId` | линия между группами |
| `.accordion__spacer` | группа `footer` | свободное место, прижимает следующие разделы к низу |

**Состояния раздела:**

| Состояние | Класс | Атрибут или псевдокласс |
|---|---|---|
| выбран | `.is-selected` | `aria-current="page"` |
| выбран его подраздел | `.is-active` | — |
| наведение | `.is-hover` | `:hover` |

Выбранный раздел — светлая подложка, чёрный текст и синий маркер слева. Раздел с выбранным подразделом —
подложка без маркера, маркер стоит у подраздела. В свёрнутом виде подразделы скрыты, маркер переходит на раздел.

**Кнопка сворачивания** — `.sidebar__toggle`: иконка «≡», при наведении (`:hover`, `.is-hover`) — круглая кнопка
со стрелками «свернуть» или «развернуть».

## Иконки

Шрифт `fonts/Accordion-Font.ttf` — 235 глифов `U+E900`–`U+E9F4` без имён. Имена Saby (`NavigationPanels-icons/accordion`)
сопоставлены глифам сравнением с SVG набора `accordion_m` по форме. Часто нужные:

| Иконка | Код | Иконка | Код |
|---|---|---|---|
| Home | `&#xe9eb;` | Statistics | `&#xe954;` |
| Screenshots | `&#xe9d5;` | Analytics | `&#xe905;` |
| EditForm | `&#xe943;` | Setting | `&#xe92d;` |
| SabyDisk | `&#xe96d;` | Queue | `&#xe968;` |
| Formats | `&#xe945;` | Market | `&#xe931;` |
| Application | `&#xe901;` | System | `&#xe9de;` |
| Company | `&#xe93f;` | Menu | `&#xe91f;` |

У большинства иконок есть закрашенный вариант `-Fill` с другим кодом.

<details>
<summary>Все 224 сопоставленные иконки</summary>

Сходство с SVG не ниже 85 %. Ещё 26 имён набора сопоставить надёжно не удалось (в шрифте 235 глифов, в наборе
250 имён): Assembly, Auction, BusinessTrip, CallBackgrounds, Clients, Close, Division, Documents, Events, FNS,
Inspections, Lenta, Money-UZ, Open, Quarantine, Refund, Selling, Showcase, Unpack, WriteOff и их `-Fill` —
перед использованием сверьте глиф с SVG из `NavigationPanels-icons/accordion_m` в Saby.

| Иконка | Код | Код `-Fill` |
|---|---|---|
| Accepted | `e904` | `e9b6` |
| Accounting | `e93d` | `e9bb` |
| Acollapse | `e91e` | — |
| Aexpand | `e91d` | — |
| Analytics | `e905` | `e9b9` |
| Answers | `e937` | — |
| Application | `e901` | `e9c7` |
| Ashop | `e929` | `e9c8` |
| Authorities | `e906` | `e9b7` |
| Bell | `e96a` | `e98c` |
| Bonus | `e900` | `e9a1` |
| Bonus-EN | `e98b` | `e9a1` |
| Bookkeeping | `e927` | `e9c0` |
| Business | `e940` | `e9e1` |
| Businesses | `e95a` | `e9cc` |
| Calendar | `e93b` | `e994` |
| Call | `e915` | `e98f` |
| Cameras | `e9ce` | `e9cf` |
| Canavication | `e92b` | `e9ad` |
| Cashbox | `e926` | `e997` |
| CBPlus | `e96b` | — |
| CBRF | `e907` | `e9be` |
| Channels | `e941` | `e9a6` |
| ChatBot | `e97c` | — |
| ClientChat | `e951` | `e9ba` |
| Clients | — | `e9a5` |
| Collation | `e908` | `e9b8` |
| Company | `e93f` | `e999` |
| Contacts | `e928` | `e98e` |
| Contract | `e9f1` | `e9f2` |
| Corn | `e980` | — |
| Courses | `e959` | — |
| Debt | `e988` | `e9c9` |
| Deeds | `e93c` | `e990` |
| Deleted | `e9db` | `e9dc` |
| Discount | `e942` | — |
| DiscountCard | `e972` | `e99d` |
| Documents | — | `e9a4` |
| EditForm | `e943` | `e9d1` |
| Egais | `e925` | — |
| Ereport | `e92a` | `e99a` |
| Extra | `e914` | — |
| FieldWork | `e977` | `e99b` |
| FNS | — | `e9b0` |
| Formats | `e945` | — |
| FSRAR | `e910` | `e9b3` |
| FSS | `e90a` | — |
| Fuel | `e9d2` | `e9d3` |
| GanttChart | `e9e8` | — |
| Gift | `e989` | `e9dd` |
| Groups | `e978` | — |
| Heart | `e95c` | `e9a0` |
| Help | `e947` | — |
| Home | `e9eb` | `e9ec` |
| Import | `e917` | — |
| Inbox | `e903` | `e9a8` |
| Information | `e983` | — |
| Knowledge | `e913` | `e993` |
| Letter | `e976` | `e9f4` |
| Lock | `e97a` | — |
| Lunch | `e97d` | — |
| Map | `e95e` | `e99c` |
| Market | `e931` | `e9cd` |
| Marketing | `e912` | `e9e0` |
| MarkExpand | `e921` | — |
| Marking | `e967` | `e9ab` |
| MarkRight | `e922` | — |
| Meetings | `e979` | `e995` |
| Mercury | `e92c` | — |
| Minzdrav | `e953` | `e9b5` |
| Models | `e94a` | — |
| Money | `e936` | `e9bf` |
| Money-KZ | `e9e2` | `e9e3` |
| Money-RU | `e936` | `e9bf` |
| Money-TM | `e9e6` | `e9e7` |
| Money-UZ | — | `e9e5` |
| MVD | `e90b` | `e9b4` |
| News | `e960` | `e98d` |
| Nomenclature | `e930` | `e998` |
| Offer | `e97e` | `e9ac` |
| OfficeCheck | `e94c` | — |
| Operations | `e94e` | — |
| Order | `e984` | `e9c4` |
| OurCompany | `e911` | `e9ae` |
| Outbox | `e902` | `e9a9` |
| Pack | `e918` | — |
| Patterns | `e950` | — |
| Payments | `e946` | — |
| PFR | `e90c` | — |
| Phone | `e96c` | — |
| Plus | `e920` | — |
| Presto | `e935` | `e9c6` |
| Production | `e932` | — |
| Profile | `e962` | `e9a7` |
| ProfileSaby | `e974` | `e9a3` |
| Promokod | `e955` | `e99f` |
| Property | `e916` | `e9d4` |
| Purchase | `e92e` | — |
| Purchases | `e964` | `e99e` |
| Queue | `e968` | — |
| Relabelling | `e919` | — |
| Request | `e9ed` | `e9ee` |
| RequestCategory | `e9ef` | `e9f0` |
| Restaurant | `e987` | — |
| Reviews | `e91c` | `e9a2` |
| RPN | `e90d` | `e9b2` |
| SabyDisk | `e96d` | `e992` |
| Salon | `e93a` | `e9c3` |
| SbisBird | `e933` | `e98a` |
| Screenshots | `e9d5` | — |
| Screwdriver | `e957` | `e9cb` |
| Selling | — | `e9c2` |
| Service | `e970` | — |
| Setting | `e92d` | `e996` |
| SFR | `e97f` | `e9d0` |
| Signed | `e9d9` | `e9da` |
| Staff | `e938` | `e991` |
| STAT | `e90e` | `e9b1` |
| Statistics | `e954` | `e9aa` |
| Stock | `e92f` | — |
| Stoplist | `e985` | `e9c5` |
| Subscribers | `e956` | — |
| Substitutions | `e958` | `e9e9` |
| Support | `e90f` | `e9bd` |
| Surveyors | `e96e` | — |
| System | `e9de` | `e9df` |
| Table | `e986` | `e9c1` |
| TaxAccounting | `e948` | — |
| Timesheet | `e94b` | `e9af` |
| Tires | `e9ea` | — |
| Transport | `e971` | — |
| Unlock | `e97b` | — |
| Vacancy | `e934` | `e9ca` |
| Vacation | `e94d` | `e9f3` |
| VideoCallRec | `e9d6` | `e9d7` |
| View | `e923` | — |
| Wages | `e94f` | `e9bc` |

</details>

## Цвета

Цвета темы навигации Saby в токены кита не входят. Они заданы переменными на `.sidebar` и `.accordion`,
прототип может переопределить их на этих элементах:

| Переменная | Значение | Что красит |
|---|---|---|
| `--acc-bg` | `#eaeaea` | фон сайдбара и аккордеона |
| `--acc-item-hover` | `#f9f9f9` | подложка раздела при наведении |
| `--acc-item-active` | `#f2f2f2` | подложка выбранного раздела |
| `--acc-fg` | `#333333` | текст и иконка раздела |
| `--acc-fg-active` | `#000000` | текст и иконка выбранного раздела |
| `--acc-separator` | `#d7d7d7` | линия между группами |
| `--acc-marker` | `--extra-brand_color` | маркер выбранного раздела |
| `--acc-logo` | `--extra-brand_color` | «saby» в логотипе и птичка |
| `--acc-bird-bg` | `#f1f2f5` | фон кнопки с птичкой |
| `--acc-toggle-bg`, `--acc-toggle-fg` | `#e2e2e2`, `#7694b8` | кнопка сворачивания при наведении |

Из-за этого аккордеон не перекрашивается вместе с `data-ui-theme`: в тёмных темах кита он остаётся светлым.

## Отличия от Saby

- Логотип набран шрифтом Maison Neue Extended, как в Saby (`NavigationPanels/Logotype`): файлы — `fonts/MaisonNeue/`, скачаны с cdn.saby.ru (версия 1.0.4), подключает `fonts.css`.
- Длинное название раздела обрезается многоточием, в Saby оно плавно затухает к краю.
- Нет подменю, счётчиков и панелей по счётчику, кнопки «+» быстрого создания, меню «птички», панели выбора
  приложений и схем навигации, акцентных разделов (`accented`), своих картинок вместо иконок.
- Нет синей темы `onlinenavigation` и горизонтального (мобильного) вида.
- Один шрифт иконок на оба размера: в Saby для 20px есть отдельный `Accordion-Font-20`, в ките его нет —
  глиф 20px рисуется тем же `Accordion-Font`.
- Кнопка сворачивания при наведении — та же иконка на круглой подложке; в Saby на её месте появляется
  отдельная кнопка, и соседнее название схемы не сдвигается за счёт отрицательного отступа.
- В свёрнутом виде при наведении на раздел в Saby короткое название сменяется полным — здесь нет.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- цвета из таблицы выше;
- ширина 200px и 56px;
- маркер 30px и 34px в высоту, линия группы 3px;
- шрифт иконок `"Accordion-Font"`: токена `--icon-font-family-*` для него нет;
- поля иконки 14px и 10px, отступ названия подраздела 48px;
- высоты строк: название 30px, короткое название 13px, логотип 20px и 34px, нижняя строка шапки 37px с отступом 5px;
- разрядка названия схемы 0.6px, отступы обводки фокуса.

## Пример

[example/index.html](example/index.html) — сайдбар с живым сворачиванием, свёрнутый, подразделы и группы,
аккордеон без шапки. Запустите статический сервер в корне кита, например `npx serve`, и откройте
`/components/accordion/example/`.
