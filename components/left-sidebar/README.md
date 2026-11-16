# left-sidebar

Компонент ui-kit: левый сайдбар конструктора — панель «Страницы» со списком страниц сайта, меню «⋮» страницы
и окно настройки страницы. Набор «Левый сайдбар» библиотеки Figma «⚙️Builder-components»
([`5:28393`](https://www.figma.com/design/rHabzni5OI5D4fxBLQdj2m/?node-id=5-28393)).

Перенесён из прототипа «Компоненты» (popups): вид и значения взяты оттуда и с макетом не сверялись.
Режимы и кнопка разворота устроены как у [`right-sidebar`](../right-sidebar/).

Цвета и размеры берутся из токенов кита, поэтому сайдбар перекрашивается вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.19.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.19.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.19.0/components/button/button.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.19.0/components/left-sidebar/left-sidebar.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.19.0/components/left-sidebar/left-sidebar.js"></script>
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter и глифов иконок (cbuc-icons, cbuc-icons24).
`button.css` — для кнопок в слотах: «+», разворот, «⋮», ✓ и ✕ переименования.

Для окна настройки страницы подключите ещё `property-editor.css`, `input.css`, `switch.css` и `chips.css`:
окно — это `.pe` кита, его строки — компоненты кита. Сайдбар их только расставляет. JS этих компонентов не нужен.

## Разметка

```html
<aside class="lsb" id="sidebar" aria-label="Страницы">
  <div class="lsb__lines" aria-hidden="true"></div>
  <div class="lsb__panel">
    <header class="lsb__head">
      <div class="lsb__title">
        <h3 class="lsb__name">Страницы</h3>
        <button type="button" class="btn btn--filled btn--style-pale btn--size-m" data-lsb-add aria-label="Добавить страницу"><span class="btn__icon">&#xEADD;</span></button>
      </div>
      <div class="lsb__toggle">
        <button type="button" class="btn btn--filled btn--style-pale btn--icon"><span class="btn__icon"></span></button>
      </div>
    </header>
    <div class="lsb__list"></div>
  </div>
  <div class="lsb__menu" hidden>…меню «⋮»…</div>
  <section class="pe lsb__settings" hidden>…окно настройки…</section>
</aside>

<script>
  LeftSidebar.mount(document.getElementById('sidebar'), {
    pages: [{ id: 1, name: 'Главная' }, { id: 2, name: 'Меню' }],
    active: 2
  });
</script>
```

Строки списка и линии JS строит по данным. Меню и окно необязательны: без `.lsb__menu` у строк нет «⋮»,
без `.lsb__settings` «+» и «Настроить» только вызывают `onAction`. Полная разметка меню и окна —
в [примере](example/index.html).

Сайдбар занимает высоту родителя: родитель — flex-контейнер или задаёт высоту. Своего фона у сайдбара нет:
в макете под ним фон конструктора `--components-constructor-constructor_background-color`, его задаёт страница.

## Состояние сайдбара

| Состояние | Класс | Что происходит |
|---|---|---|
| Вписан | без класса | Панель стоит в потоке, ширина сайдбара 358. |
| По ховеру | `.lsb--hover` | Сайдбар — колонка линий (52). Наведение на линии открывает панель поверх страницы, с тенью. |
| Закреплен | `.lsb--pinned` | То же, но панель не закрывается при уходе курсора. Ставится только из кода: `pin()`. |

Висящая панель открыта — `.is-open` у `.lsb`. Линии — по одной на страницу, у открытой длиннее и цветом маркера.

**Кнопка разворота** — слот `.lsb__toggle` с кнопкой кита. Глиф, `aria-label` и `title` ставит JS:

| Режим | Иконка | Подпись | Клик |
|---|---|---|---|
| вписан | `U+EBFA` | «Свернуть панель» | переводит в «По ховеру» |
| по ховеру, закреплён | `U+EBFB` | «Закрепить панель» | делает вписанным |

## Строки

**Страница** — `.lsb__page`: маркер `.lsb__marker`, название `.lsb__page-name`, команды `.lsb__cmds` со слотом «⋮»
(`.btn.btn--link.btn--style-label.btn--size-m.btn--icon`, глиф `U+E9D9`). Команды видны при наведении.

| Состояние | Класс | Атрибут или псевдокласс |
|---|---|---|
| наведение | `.is-hover` | `:hover` |
| открыта | `.is-active` | `aria-selected="true"` |
| скрыта | `.is-off` | — |
| открыто меню «⋮» | `.is-menu` | — |
| переименование (Edit=on) | `.is-edit` | — |

При переименовании название заменяется полем `input.lsb__input`, рядом слоты `.lsb__save` с кнопками ✓
(`.lsb__save-ok`) и ✕ (`.lsb__save-cancel`).

**Группа** — `.lsb__group`: иконка `img.lsb__group-icon` (24px) и название `.lsb__group-name`. С `aria-expanded`
у группы появляется стрелка, клик сворачивает её страницы. Если в списке есть группа, у списка класс `.has-groups`,
и названия всех страниц выровнены по тексту заголовков групп.

## Меню «⋮»

`.lsb__menu` — меню действий страницы (Figma «Расширенный конструктор»
[`17009:434390`](https://www.figma.com/design/G3QPR5r3X5ox6DmPwj6rJ7/?node-id=17009-434390)).

```html
<div class="lsb__menu" role="menu" aria-label="Действия" hidden>
  <div class="lsb__menu-top"><div class="lsb__menu-head">Действия</div><button type="button" class="lsb__menu-close" aria-label="Закрыть"></button></div>
  <button type="button" class="lsb__menu-item" role="menuitem" data-lsb-act="settings"><span class="lsb__menu-icon">&#xE61B;</span><span class="lsb__menu-text">Настроить</span></button>
  <button type="button" class="lsb__menu-item lsb__menu-item--danger" role="menuitem" data-lsb-act="delete"><span class="lsb__menu-icon">&#xEB72;</span><span class="lsb__menu-text">Удалить</span></button>
</div>
```

| Действие | `data-lsb-act` | Иконка | Что делает |
|---|---|---|---|
| Сделать главной | `home` | `U+E64C` | ставит странице `home: true`, остальным `false` |
| Настроить | `settings` | `U+E61B` | открывает окно настройки на месте меню |
| Скопировать ссылку | `link` | `U+E6A7` | копирует `/адрес` в буфер обмена |
| Дублировать | `duplicate` | `U+E669` | копия встаёт под исходную и открывается, адрес не копируется |
| Скрыть | `hide` | `U+E651` | прячет или показывает страницу; подпись меняется на «Показать» |
| Удалить | `delete` | `U+EB72` | удаляет страницу, открывается предыдущая |

Меню встаёт так, что крестик приходится на место «⋮». У страниц группы остаются только «Настроить»
и «Скопировать ссылку». Последнюю видимую страницу скрыть нельзя; после удаления последней создаётся «Страница 1».

## Окно настройки страницы

`.pe.lsb__settings` — окно редактора свойств кита (`property-editor`), содержимое — Figma «Расширенный конструктор»
[`30037:38001`](https://www.figma.com/design/G3QPR5r3X5ox6DmPwj6rJ7/?node-id=30037-38001). Оно же — окно новой страницы.

| Строка | Разметка |
|---|---|
| Название | `.pe__name-input` в шапке |
| Адрес | `.lsb__addr`: «/» и `.input` с `input[data-lsb-field="addr"]` |
| Доступ | ссылка `.btn--link.lsb__value[data-lsb-pick="access"]` и меню `[data-lsb-pick-menu="access"]` |
| Индексация | `.switch.switch--caption-start.lsb__index` с `input[data-lsb-field="noindex"]` |
| Способ отображения | ссылка `[data-lsb-pick="mode"]` и меню `[data-lsb-pick-menu="mode"]` |
| SEO | карточка `[data-pe-row="seo"]` с `.lsb__seo`: поле `[data-lsb-field="seo"]`, кнопка `[data-lsb-description-add]`, поле `[data-lsb-description]` с `textarea[data-lsb-field="seoDescription"]` |
| Чипс SEO | `.chips[data-pe-chip="seo"]` в `.pe__chips` |

**Меню значения** — `.lsb__pick`: заголовок `.lsb__pick-head`, радиопункты `.lsb__pick-item[data-value]`
с подписью `.lsb__pick-text`, круглый крестик `.lsb__pick-close`. Выбранный пункт — `aria-checked="true"`
(или `.is-selected`), наведение — `.is-hover`. Меню встаёт выбранным пунктом на место ссылки.

Поведение окна:

- «+» открывает окно новой страницы поверх кнопки, «Настроить» — окно страницы на месте меню.
- У новой страницы название пустое, «Новая страница» — плейсхолдер, каретка сразу в поле.
- Подсказка адреса — название транслитом (`LeftSidebar.slug`), SEO-заголовок идёт за названием, пока его не правили.
- «Сохранить» или Enter в названии сохраняют; «Закрыть», Esc или клик мимо окна закрывают без сохранения.
- «Сбросить» возвращает значения по умолчанию. Чипс SEO показывает карточку SEO, крестик в ней убирает.

## Поведение

```js
var sidebar = LeftSidebar.mount(element, {
  pages: [{ id: 1, name: 'Главная', home: true }, { id: 4, name: 'Вход', group: 'account' }],
  groups: [{ id: 'account', name: 'Личный кабинет', icon: 'account.svg' }],
  active: 1,
  collapsible: false,                // стрелка у групп
  onSelect: function (page) {},      // открыта страница
  onChange: function (pages) {},     // список изменился: переименование, добавление, удаление, скрытие, настройки
  onAction: function (act, page) {}, // действие меню, 'add' или 'settings'; false — отменить действие по умолчанию
  onDock: function (docked) {}       // кнопка разворота: true — вписан, false — по ховеру
});

sidebar.pages;            // копия списка страниц
sidebar.active;           // id открытой страницы
sidebar.select(id);       // открыть страницу
sidebar.setPages(list);   // заменить список; setPages(list, id) — и открыть страницу
sidebar.rename(id);       // начать переименование
sidebar.openSettings(id); // окно настройки; openSettings(null) — новая страница
sidebar.closeSettings();
sidebar.dock(true);       // сделать вписанным; dock(false) — «По ховеру»
sidebar.pin(true);        // закрепить висящую панель; pin(false) — вернуть «По ховеру»
sidebar.destroy();        // снять обработчики
```

Поля страницы: `id`, `name`, `off` (скрыта), `home`, `group`, а также поля окна — `addr`, `access`
(`public` или `authorized`), `noindex`, `mode` (`page`, `window`, `both`), `seo`, `seoDescription`
(`null` — SEO или описание не заданы). Порядок в списке: страницы без группы, потом группы в порядке `groups`.

- Клик по строке открывает страницу, двойной клик — переименование. Enter или ✓ сохраняют, Esc или ✕ отменяют,
  клик мимо сохраняет. Пустое название не сохраняется.
- По ховеру панель закрывается через 200 мс после ухода курсора, если не открыты меню или окно и нет переименования.
- Клик мимо меню закрывает его.

## Что не входит

- Перетаскивание окна настройки за шапку и перетаскивание страниц в списке.
- Подсказка-пин у «+» из прототипа.
- Свойства, общие с окнами кнопок в popups: список «Способа отображения» задаёт разметка.

## Допущения

- Вид и значения перенесены из popups, с Figma не сверялись. Голые hex заменены токенами по смыслу.
- «Закреплен» ставится только из кода: панель по ховеру закрывает линии, кликнуть по ним нельзя.
- В popups «Сделать главной», «Скопировать ссылку» и «Скрыть» только закрывали меню; здесь они меняют данные.
- Крестик меню «⋮» — глиф `U+E66C`, в popups — картинка.
- Окно работает без `PropertyEditor.mount`: чипс, крестик SEO, сброс и кнопки шапки обрабатывает сайдбар.
- Меню «⋮» и меню значения — части сайдбара: отдельного компонента меню в ките нет.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- ширина панели 350, колонки линий 52, окна 400, меню «⋮» 240, минимальная меню значения 200;
- верхний отступ линий 100px, толщина линии 2px, маркер страницы 3px;
- зазор 5px в строке, сдвиг названий при группах 30px, высота поля переименования 18px;
- размер названия панели 18px, разрядка −1.41 % и 1.25px у заголовков меню;
- рамка меню «⋮» 2px, точка пункта 7px и её место 14px, отступ заголовка меню значения 22px, сдвиг крестика −14px;
- фон крестика меню значения при наведении `#aaaaaad9`;
- смещение тени 0 0.

## Пример

[example/index.html](example/index.html) — рабочий сайдбар со страницами, меню и окном настройки.
Запустите статический сервер в корне кита, например `npx serve`, и откройте `/components/left-sidebar/example/`.
