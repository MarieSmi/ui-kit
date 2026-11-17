# shop

Компонент ui-kit: магазин виджетов конструктора — список виджетов, которые добавляются на страницу, и расширенный
вид с деревом категорий. Наборы «Магазин», «Виджет магазина» и «Контент сайдбара» (Тип=Магазин) библиотеки Figma
«⚙️Builder-components», секция «Правый сайдбар»
([`5:28436`](https://www.figma.com/design/rHabzni5OI5D4fxBLQdj2m/?node-id=5-28436)).

Магазин — содержимое вкладки «Магазин» компонента [`right-sidebar`](../right-sidebar/), но работает и отдельно.

Цвета и размеры берутся из токенов кита, поэтому магазин перекрашивается вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/scroll-shadow/scroll-shadow.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/shop/shop.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/scroll-shadow/scroll-shadow.js"></script>
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.20.0/components/shop/shop.js"></script>
```

`tokens.css` подключается первым. `scroll-shadow` — тень прокрутки списка и дерева, общий компонент кита
(с версии 1.20.0). `fonts.css` нужен для Inter и глифов иконок (cbuc-icons, cbuc-icons24).

Шапка и дерево категорий — слоты, их стили магазин не содержит. Для разметки из этого README подключите ещё
`components/right-sidebar/right-sidebar.css` (шапка `.rsb__head`) и `components/master-list/master-list.css`
(дерево `.ml`).

## Разметка

```html
<section class="shop" id="shop">
  <div class="shop__head">
    <header class="rsb__head">
      <div class="rsb__title">
        <h3 class="rsb__name">Виджеты</h3>
        <button type="button" class="shop__expand" aria-label="Категории"></button>
      </div>
      <div class="rsb__tools">
        <button type="button" class="shop__filter" aria-label="Фильтр"></button>
        <label class="rsb__search"><input class="rsb__search-input" type="search" placeholder="Найти"></label>
      </div>
    </header>
  </div>

  <div class="shop__body">
    <nav class="shop__master">
      <ul class="ml ml--nav">…категории…</ul>
    </nav>

    <div class="shop__list">
      <div class="shop__grid shop__grid--small">…виджеты small…</div>
      <div class="shop__grid shop__grid--medium">…виджеты medium…</div>
      <section class="shop__section">
        <h4 class="shop__section-title">Основные возможности</h4>
        <div class="shop__cards">…виджеты big…</div>
      </section>
    </div>
  </div>
</section>

<script>
  Shop.mount(document.getElementById('shop'), { onAdd: function (key) { /* добавить виджет на страницу */ } });
</script>
```

Магазин занимает высоту родителя, список виджетов прокручивается внутри.

**В правом сайдбаре** магазин ставится в панель-слот `.rsb__panel--bare`: она без фона и обрезки, поэтому
расширенный магазин может раздвинуться за её пределы.

```html
<section class="rsb__panel rsb__panel--bare" data-rsb-panel="shop">
  <section class="shop">…</section>
</section>
```

## Виджет магазина

| Figma, «Размер» | Класс | Вид |
|---|---|---|
| small | `.shop__widget--small` | плитка высотой 40 с иконкой 24; название скрыто, задайте `title` |
| medium | `.shop__widget--medium` | строка высотой 32: иконка 16 и название |
| big | `.shop__widget--big` | название, описание в две строки и превью |

```html
<button type="button" class="shop__widget shop__widget--medium" data-shop-widget="text">
  <span class="shop__widget-icon">&#xeac9;</span>
  <span class="shop__widget-name">Текст</span>
</button>

<div class="shop__widget shop__widget--big" role="button" tabindex="0" data-shop-widget="contacts">
  <span class="shop__widget-text">
    <span class="shop__widget-name">Мои контакты</span>
    <span class="shop__widget-desc">Закрепите контакты для быстрого доступа</span>
  </span>
  <span class="shop__preview">
    …превью: картинка или разметка…
    <span class="shop__plus"></span>
  </span>
</div>
```

- `data-shop-widget` — ключ виджета, он приходит в `onAdd`.
- Название и описание у `big` необязательны (свойства «Заголовок» и «Описание» в Figma): без них остаётся
  одно превью.
- `.shop__preview` — слот. Картинок превью в ките нет: поставьте `<img>` или свою разметку.
- `.shop__plus` — круглый плюс в центре превью (свойство «Плюс»), виден при наведении.

| Состояние | Класс | Псевдокласс |
|---|---|---|
| ⛔ Hover | `.is-hover` | `:hover` |

При наведении у `small` и `medium` появляется рамка, у `big` — рамка на превью и плюс.

**Сетки.** `.shop__grid--small` — четыре виджета в ряд, `.shop__grid--medium` — две колонки. Крупные виджеты
идут столбцом в `.shop__cards` внутри раздела `.shop__section` с заголовком `.shop__section-title`.

## Расширенный магазин

`.shop.is-expanded` — «Открытие расширенного = on»:

- слева появляется дерево категорий `.shop__master` шириной 220;
- магазин становится шире (578) и раздвигается влево поверх страницы; место в потоке остаётся 350;
- появляется тень и кнопка фильтра `.shop__filter` в шапке;
- иконка кнопки `.shop__expand` меняется на «свернуть».

Дерево категорий — компонент кита [`master-list`](../master-list/) (`.ml.ml--nav`) в слоте `.shop__master`.
Категории нужен `data-shop-category` — ключ, который приходит в `onCategory`.

## Поведение

```js
var shop = Shop.mount(element, {
  onAdd: function (key, el) {},       // клик по виджету: ключ из data-shop-widget
  onCategory: function (key, el) {},  // выбрана категория: ключ из data-shop-category
  onExpand: function (open) {}        // расширенный магазин открыт или закрыт
});

shop.expand(true);   // открыть расширенный магазин; expand(false) — закрыть
shop.expanded;       // открыт ли он
shop.destroy();      // снять обработчики
```

- Кнопка `.shop__expand` открывает и закрывает расширенный магазин.
- Тень прокрутки у списка `.shop__list` и дерева `.shop__master` — компонент кита
  [`scroll-shadow`](../scroll-shadow/): `mount` ставит им класс `.scroll-shadow` и следит за прокруткой.
  Подключите `scroll-shadow.css` и `scroll-shadow.js` раньше `shop.js`, иначе тени нет.
- Клик по категории отмечает её (`.is-selected`, `aria-current`) и вызывает `onCategory`.
- Клик по стрелке узла дерева сворачивает его: вложенным категориям ставится `hidden`.
- У крупного виджета (`div` с `role="button"`) Enter и пробел работают как клик.

Список виджетов по категории и по поиску магазин не фильтрует — это делает прототип. Кнопка фильтра ничего
не открывает.

## Что не входит

- Свойство «Тег» виджета: в макете везде выключено.
- Картинки превью.
- Окно фильтра и сам поиск.

## Допущения

- Дерево категорий в макете собрано из `componentsMaster/navigation` — устаревшего набора. В слот ставится
  `master-list` кита; счётчик категории — `.ml__count.ml__count--secondary`.
- Наведение на кнопки `.shop__expand` и `.shop__filter` в макете не описано: у первой темнеет иконка.
- Полосы прокрутки скрыты: в макете их нет, а обычная полоса сужает сетку виджетов. Прокрутка — колесом и жестом.
- Иконки «2 колонки» и «3 колонки» — коды из макета `U+EAC3` и `U+EAEE` в `cbuc-icons24` (CbucIcons 1.6.3).

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- рамка наведения: в макете `#7B62F8` с прозрачностью 40 % без переменной; взят токен
  `--border-info_border-color` (то же значение) и 40 % через `color-mix`; толщина 1px;
- ширина магазина 350px и дерева категорий 220px;
- высота виджета `medium` 32px;
- плюс на превью 36×36px;
- смещение тени 0 0.

## Пример

[example/index.html](example/index.html) — рабочий магазин с деревом категорий, на фоне конструктора
`--components-constructor-constructor_background-color`. В превью — картинка из примера компонента `widget`. Запустите статический сервер
в корне кита, например `npx serve`, и откройте `/components/shop/example/`.
