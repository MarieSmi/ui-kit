# breadcrumbs

Компонент ui-kit: хлебные крошки — путь до текущей папки. Вместе с кнопкой «Назад» образуют шапку проводника.
Только CSS, без JS.

Перенесены из кода Saby — `Controls/breadcrumbs:Path` и `Controls/breadcrumbs:HeadingPath`. В Figma это
component set `BreadCrumbs` библиотеки «⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`, ключ
`ec58fe67289d747836e1448a69047e2cf0c37a62`). Варианты и состояния взяты из кода и живого примера
Saby Components, с макетом не сверялись.

Цвета, размеры и шрифт берутся из токенов кита, поэтому крошки перекрашиваются вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/breadcrumbs/breadcrumbs.css">
```

`tokens.css` подключается первым. Текст набран шрифтом **Inter**, «домик» — глиф шрифта **cbuc-icons**;
оба подключает проект (`fonts/fonts.css`). Для шапки проводника нужен ещё компонент `back`.

## Разметка

**Только крошки:**

```html
<nav class="breadcrumbs" aria-label="Путь">
  <span class="breadcrumbs__middle">
    <a class="breadcrumbs__crumb" href="#">Диск</a>
    <a class="breadcrumbs__crumb" href="#">Сайты</a>
    <a class="breadcrumbs__crumb" href="#">Шеф-Экспресс</a>
    <span class="breadcrumbs__dots">...</span>
  </span>
  <a class="breadcrumbs__crumb breadcrumbs__crumb--last" href="#">Изображения</a>
</nav>
```

- Все крошки, кроме последней, лежат в `.breadcrumbs__middle`; после них — `.breadcrumbs__dots`.
- Последняя крошка — снаружи, с классом `.breadcrumbs__crumb--last`.
- Путь из одной крошки — только `<a class="breadcrumbs__crumb breadcrumbs__crumb--last">` без `.breadcrumbs__middle`.
- Стрелки между крошками рисует сам компонент.
- Крошка — `<a>` или `<button type="button">`.

**Шапка проводника** — текущая папка на кнопке «Назад», в крошках её нет:

```html
<div class="breadcrumbs-path">
  <div class="breadcrumbs-path__back">
    <button type="button" class="back back--color-default back--icon-primary">
      <span class="back__icon"></span><span class="back__caption">Авторская кухня</span>
    </button>
  </div>
  <div class="breadcrumbs-path__crumbs">
    <button type="button" class="breadcrumbs-path__home" aria-label="В корень">&#xe920;</button>
    <nav class="breadcrumbs breadcrumbs--size-m" aria-label="Путь">…</nav>
  </div>
</div>
```

В проводнике Saby кнопка «Назад» размера 3xl, крошки — m.

## Сворачивание в «…»

Работает без JS. Крошки в `.breadcrumbs__middle` стоят в одну строку и обрезаются по ширине. Пока они
помещаются, `.breadcrumbs__dots` не виден. Когда места не хватает, справа от них появляется «…» и закрывает
обрезанный текст. Последняя крошка занимает не больше половины ширины и обрезается многоточием.

- Ширину пути задаёт родитель: крошки занимают всю его ширину, не больше.
- Фон под «…» — `--background-background-color`. Если крошки стоят на другом фоне, задайте его переменной:
  `style="--bc-bg: var(--background-unaccented_background-color)"`.
- Меню скрытых крошек по клику на «…» компонент не открывает. Полный путь можно положить в `title`.

## Классы

**Размер** — `fontSize`: без класса или `.breadcrumbs--size-xs` (12), `.breadcrumbs--size-s` (13),
`.breadcrumbs--size-m` (14), `.breadcrumbs--size-l` (15). Высота строки всегда 24.

**Цвет** — `fontColorStyle`: без класса — цвет меток, `.breadcrumbs--color-link` — цвет ссылок. Стрелки
между крошками всегда цвета меток.

**Шапка проводника:**

| Класс | Что это |
|---|---|
| `.breadcrumbs-path` | строка: кнопка «Назад», «домик», крошки |
| `.breadcrumbs-path--multiline` | `displayMode=multiline`: крошки строкой над кнопкой |
| `.breadcrumbs-path__back` | место под кнопку «Назад», не шире половины |
| `.breadcrumbs-path__crumbs` | «домик» и крошки |
| `.breadcrumbs-path__home` | «домик» — переход в корень, глиф `&#xe920;` |

**Состояния:**

| Состояние | Класс | Псевдокласс |
|---|---|---|
| наведение на крошку, «…» или «домик» | `.is-hover` на этом элементе | `:hover` |
| путь недоступен | `.is-readonly` на `.breadcrumbs` | — |

Отдельного вида фокуса нет: при фокусе с клавиатуры остаётся обводка браузера.

## Отличия от Saby

- Цвет наведения у крошек цвета ссылок — `--text-link_hover_text-color`. В коде Saby для наведения указан
  только цвет меток; что происходит с цветом ссылок, по коду не видно.
- Размытый край у «…» — тень подложки, а не отдельный слой с размытием. Ширина подложки — 2em.
- Нет места под обводку перетаскивания (по 1px у крошек), кнопки меню пути и стрелки действий у «Назад».
- Цветов текста два: метки и ссылки.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- наименьшая ширина текста крошки 28px;
- размытый край «…»: сдвиг 6px, размытие 4px, ширина подложки 2em;
- запас 6px к половине ширины у кнопки «Назад».

## Пример

[example/index.html](example/index.html) — крошки, длинный путь в рамках разной ширины и шапка проводника.
Запустите статический сервер в корне кита, например `npx serve`, и откройте `/components/breadcrumbs/example/`.
