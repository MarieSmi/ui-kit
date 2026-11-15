# tabs

Компонент ui-kit: вкладки — переключение разделов карточки, панели или окна. Выбранная вкладка выделена цветом
и маркером снизу. Только CSS, без JS.

Перенесены из кода Saby — `Controls/tabs:Buttons`. В Figma это component set `tabs/horizontal` библиотеки
«⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`). Виды и состояния взяты из кода и живого примера
Saby Components, с макетом не сверялись; ключ component set не проверен.

Цвета и размеры берутся из токенов кита, поэтому вкладки перекрашиваются вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/tabs/tabs.css">
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter и глифов иконок (cbuc-icons).

## Разметка

Вкладка — `label` с радиокнопкой. Выбор по клику работает без JS, выбрана та, у чьей радиокнопки `checked`:

```html
<div class="tabs" role="tablist">
  <label class="tabs__item">
    <input class="tabs__input" type="radio" name="section" value="pages" checked>
    <span class="tabs__caption" data-caption="Страницы">Страницы</span>
  </label>
  <label class="tabs__item">
    <input class="tabs__input" type="radio" name="section" value="widgets">
    <span class="tabs__caption" data-caption="Виджеты">Виджеты</span>
  </label>
</div>
```

У радиокнопок одной строки общий `name`. Показывать содержимое выбранного раздела — дело прототипа:
по `value` отмеченной радиокнопки или правилом `:has(.tabs__input[value="…"]:checked)`.

Второй вариант — кнопки; выбранную отмечает прототип классом `.is-selected` или `aria-selected="true"`:

```html
<button type="button" class="tabs__item is-selected" role="tab" aria-selected="true">
  <span class="tabs__caption" data-caption="Страницы">Страницы</span>
</button>
```

`data-caption` повторяет текст подписи. С ним вкладка сразу занимает ширину жирной подписи и не толкает соседей,
когда её выбирают. Без атрибута всё работает, но соседние вкладки сдвигаются на 1–3 px.

**Содержимое вкладки** — в таком порядке: `.tabs__caption`, `.tabs__icon`, `.tabs__counter`; любой можно пропустить.
Иконка — глиф `cbuc-icons` (коды — на странице «Иконки» каталога) или `svg`, размер 16px. У вкладки-иконки
без подписи задайте `title`.

**Выравнивание.** Вкладки идут слева направо в порядке разметки. `<span class="tabs__space"></span>` занимает
свободное место: вкладки до него прижаты влево, после — вправо. В карточке вкладки справа — `.tabs__space` первым;
в панели слева — без него. В `.tabs__space` можно положить своё содержимое.

```html
<div class="tabs" role="tablist">
  <label class="tabs__item tabs__item--main">…Параметры сайта…</label>
  <span class="tabs__space"></span>
  <label class="tabs__item">…SEO…</label>
  <label class="tabs__item">…Домен…</label>
</div>
```

## Классы

**Стиль выбранной вкладки** — `selectedStyle`:

| Класс | Saby | Текст выбранной | Маркер |
|---|---|---|---|
| без класса | `primary` | акцентный, жирный | акцентный |
| `.tabs--style-secondary` | `secondary` | вторичный, жирный | цвета ссылки |
| `.tabs--style-unaccented` | `unaccented` | обычный, не жирный | тёмный |

**Остальное:**

| Класс | Saby | Что делает |
|---|---|---|
| без класса | `inlineHeight="s"` и `"l"` | высота 32 |
| `.tabs--size-4xl` | `inlineHeight="4xl"` | высота 43 |
| `.tabs--no-border` | `borderVisible={false}` | без линии под вкладками |
| `.tabs--padding-null` | `horizontalPadding="null"` | крайние вкладки без отступа от края |
| `.tabs__item--main` | `isMainTab` | главная вкладка: заголовок 20px, жирный, маркер короткий |

Между вкладками 24px, от края до крайней вкладки 12px.

**Состояния вкладки:**

| Состояние | Класс | Атрибут или псевдокласс |
|---|---|---|
| выбрана | `.is-selected` | `checked` у `.tabs__input`, `aria-selected="true"` |
| наведение | `.is-hover` | `:hover` |

При наведении под невыбранной вкладкой появляется бледный маркер. Счётчик бледный, у выбранной вкладки —
акцентный. Отдельного вида фокуса нет: при фокусе с клавиатуры — обводка браузера вокруг вкладки.

## Отличия от Saby

- Маркер не переезжает плавно (`animationMode="immediate"`): в Saby его двигает JS.
- Нет вертикальных вкладок (`direction="vertical"`), адаптивного режима с кнопкой «Ещё», стиля `wide`,
  `fontColorStyle`, `itemTemplate`, `additionalCaption`, стилей счётчика и иконки, остальных цветов маркера
  (`link`, `label`, `danger` и другие).
- Выравнивание — порядок разметки и `.tabs__space`, а не `align` у каждой вкладки.
- Ширину под жирную подпись резервирует `data-caption`, а не скрытая копия вкладки.
- Подпись выровнена по центру строки, а не по базовой линии: текст на 0,4 px ниже, чем в Saby.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- толщина линии под вкладками 1px;
- ширина маркера главной вкладки 42px;
- высота `4xl` — 43px;
- отступ обводки фокуса 1px.

Высота строки 32px в Saby — `--item_height_tabs`; такого токена в ките нет, взят `--inline_height-inline_height_xl`
с тем же значением.

## Пример

[example/index.html](example/index.html) — карточка, главная вкладка, иконки и счётчики, стили, высота и
наведение. Запустите статический сервер в корне кита, например `npx serve`, и откройте `/components/tabs/example/`.
