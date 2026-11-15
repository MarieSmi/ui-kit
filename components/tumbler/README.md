# tumbler

Компонент ui-kit: переключатель из 2–4 вариантов на общей подложке — вид списка, «ПК / Моб» в шапке конструктора.
Только CSS, без JS.

Перенесён из кода Saby — `Controls/Tumbler:Control`. В Figma это component set `tumblerHorizontal` библиотеки
«⚙️ Default components» (`nuC4KFMiS36uDWDUp9wKGl`). Виды, размеры и состояния взяты из кода и живого примера
Saby Components, с макетом не сверялись; ключ component set не проверен.

Цвета и размеры берутся из токенов кита, поэтому тумблер перекрашивается вместе с `data-ui-theme`
и меняет размер с `data-ui-size`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/tumbler/tumbler.css">
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter и глифов иконок (cbuc-icons).

## Разметка

Пункт — `label` с радиокнопкой. Выбор по клику работает без JS, выбранный пункт — тот, у чьей радиокнопки `checked`:

```html
<div class="tumbler" role="radiogroup" aria-label="Вид">
  <label class="tumbler__item">
    <input class="tumbler__input" type="radio" name="view" value="tile" checked>
    <span class="tumbler__caption">Плитка</span>
  </label>
  <label class="tumbler__item">
    <input class="tumbler__input" type="radio" name="view" value="list">
    <span class="tumbler__caption">Список</span>
  </label>
</div>
```

У радиокнопок одного тумблера общий `name`. Выбранное значение — `value` отмеченной радиокнопки.

Второй вариант — кнопки; выбранную отмечает прототип классом `.is-selected` или `aria-checked="true"`:

```html
<div class="tumbler" role="radiogroup" aria-label="Устройство">
  <button type="button" class="tumbler__item is-selected" role="radio" aria-checked="true" title="Компьютер">
    <span class="tumbler__icon" aria-hidden="true">&#xe731;</span>
  </button>
  <button type="button" class="tumbler__item" role="radio" aria-checked="false" title="Телефон">
    <span class="tumbler__icon" aria-hidden="true">&#xe637;</span>
  </button>
</div>
```

Содержимое пункта — в таком порядке: `.tumbler__caption`, `.tumbler__icon`, `.tumbler__counter`; любой можно
пропустить. Иконка — глиф `cbuc-icons` (коды — на странице «Иконки» каталога) или `svg`, размер 16px.
У пункта-иконки без подписи задайте `title`.

## Классы

**Подложка** — `contrastBackground`:

| Класс | Saby | Как выглядит |
|---|---|---|
| без класса | `false` | бледная подложка, выбранный пункт — белый с тенью |
| `.tumbler--contrast` | `true` | белая подложка с тенью, выбранный пункт — тёмный с белым текстом; для серых областей |

**Размер** — `inlineHeight`: высота подложки, поля пункта и размер шрифта.

| Класс | Высота | Поля пункта | Шрифт |
|---|---|---|---|
| `.tumbler--size-xs` | 16 | 6 | 12 |
| `.tumbler--size-s` | 20 | 10 | 13 |
| без класса (`default`) или `.tumbler--size-m` | 24 | 12 | 14 |
| `.tumbler--size-l` | 28 | 12 | 15 |
| `.tumbler--size-xl` | 32 | 16 | 16 |
| `.tumbler--size-2xl` | 36 | 16 | 17 |
| `.tumbler--size-3xl` | 40 | 20 | 18 |
| `.tumbler--size-4xl` | 44 | 20 | 20 |
| `.tumbler--size-5xl` | 48 | 24 | 24 |

С размера `2xl` тень выбранного пункта и контрастной подложки крупнее. Счётчик всегда 14px.

**Направление** — `direction`: без класса пункты в ряд, `.tumbler--vertical` — столбцом, высота по содержимому.

**Состояния:**

| Состояние | Где | Класс | Атрибут или псевдокласс |
|---|---|---|---|
| выбран | пункт | `.is-selected` | `checked` у `.tumbler__input`, `aria-checked="true"` |
| наведение | пункт | `.is-hover` | `:hover` |
| только чтение | `.tumbler` | `.is-readonly` | — |

При наведении невыбранный пункт темнеет и получает бледный фон. В `readOnly` подложку заменяет рамка, невыбранные
пункты бледные, клики не проходят. Радиокнопкам при этом задайте `disabled`, чтобы выбор не менялся с клавиатуры.
Отдельного вида фокуса нет: при фокусе с клавиатуры — обводка браузера вокруг пункта.

## Отличия от Saby

- Фон выбранного пункта не переезжает плавно: в Saby его двигает JS, здесь выбранный пункт просто перекрашивается.
- Нет `backgroundStyle` (цветные подложки `primary`, `secondary`, `success` и другие), `allowEmptySelection`,
  `workspaceWidth`, `itemTemplate` и стилей счётчика и иконки (`mainCounterStyle`, `iconStyle`, `iconSize`).
- Зазор между пунктами — `gap` и поля подложки, а не отступ справа у каждого пункта; размеры те же.
- Рамка в `readOnly` — внутренняя тень, а не `border`.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- зазор 1px между пунктами и до края подложки;
- смещение теней: `0 0` у обычной, `0 4px` у крупной;
- толщина рамки и обводки выбранного пункта в `readOnly` — 1px;
- отступ обводки фокуса 1px.

## Пример

[example/index.html](example/index.html) — обе подложки, все размеры, подписи, иконки, счётчик, состояния и
вертикальный вид. Запустите статический сервер в корне кита, например `npx serve`, и откройте
`/components/tumbler/example/`.
