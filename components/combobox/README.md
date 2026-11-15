# combobox

Компонент ui-kit: поле выбора значения из списка со стрелкой — в оформлении поля ввода. Меню открывается
под полем. Только CSS, без JS.

Перенесено из кода Saby — `Controls/ComboBox`. В Figma компонент называется «Поле выбора». В библиотеке
«⚙️ Default components» его нет; одноимённый component set `combobox` есть в библиотеке
«📚Дополнительные компоненты» (ключ `7ddf71e1584dcafd8f47a111d21e25a8d3eb840f`). Варианты и состояния взяты
из кода и живого примера Saby Components, с макетом не сверялись.

Цвета, размеры и шрифт берутся из токенов кита, поэтому поле перекрашивается вместе с `data-ui-theme`.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.17.0/components/combobox/combobox.css">
```

`tokens.css` подключается первым. Текст набран шрифтом **Inter**, стрелка — глиф шрифта **cbuc-icons**;
оба подключает проект (`fonts/fonts.css`).

## Разметка

```html
<div class="combobox" style="width: 200px">
  <button type="button" class="combobox__field" aria-haspopup="listbox" aria-expanded="false">
    <span class="combobox__value">Российский рубль</span>
  </button>
  <ul class="combobox__menu" role="listbox" hidden>
    <li class="combobox__item is-selected" role="option">Российский рубль</li>
    <li class="combobox__item" role="option">Доллар США</li>
    <li class="combobox__item" role="option">Евро</li>
  </ul>
</div>
```

- Стрелку ставит сам компонент. Ширину поля задаёт прототип на `.combobox`; без неё поле — по тексту.
- Пустое поле: класс `.combobox--empty`, текст подсказки — в `.combobox__value`.
- Меню можно не писать, если прототипу достаточно самого поля.

## Меню

Компонент меню только оформляет. Открывает и закрывает его прототип: снимает и ставит атрибут `hidden`
у `.combobox__menu` и класс `.is-open` у `.combobox`. Выбор пункта — тоже в прототипе: класс `.is-selected`
на пункте и новый текст в `.combobox__value`.

```js
const box = document.querySelector('.combobox'), menu = box.querySelector('.combobox__menu');
box.querySelector('.combobox__field').onclick = () => { menu.hidden = !menu.hidden; box.classList.toggle('is-open', !menu.hidden); };
menu.onclick = (e) => {
  const item = e.target.closest('.combobox__item'); if (!item) return;
  for (const li of menu.children) li.classList.toggle('is-selected', li === item);
  box.querySelector('.combobox__value').textContent = item.textContent;
  menu.hidden = true; box.classList.remove('is-open');
};
```

Меню стоит под полем и сдвинуто влево на 17px, чтобы текст пункта встал под текст поля; оно не уже поля.
Родитель с `overflow: hidden` меню обрежет.

## Классы

| Класс | Saby | Что делает |
|---|---|---|
| `.combobox--empty` | пустое значение, `placeholder` | текст цвета подсказки |
| `.combobox--contrast` | `contrastBackground` | белое поле для серого фона; линия появляется при наведении |
| `.combobox--border-visible` | `borderVisibility=visible` | рамка со всех сторон |
| `.combobox--border-hidden` | `borderVisibility=hidden` | без линии |
| `.combobox--size-m` / `-l` / `-xl` | `inlineHeight` | высота 24 (по умолчанию) / 28 / 32 |

Без классов рамки — `borderVisibility=partial`: линия снизу.

**Состояния** — на `.combobox`:

| Состояние | Класс | Псевдокласс |
|---|---|---|
| наведение | `.is-hover` | `:hover`, `:focus-within` |
| меню открыто | `.is-open` | — |
| недоступно | `.is-readonly` | `:disabled` у `.combobox__field` |
| ошибка | `.is-invalid` | — |

**Пункты меню:** выбранный — `.is-selected` или `aria-selected="true"`, наведение — `.is-hover` и `:hover`.

## Отличия от Saby

- Меню не открывается само, не подстраивается под край окна и не листается: это разметка под полем.
- Нет пункта «не выбрано» как отдельного параметра (`emptyText`): это обычный пункт и обычный текст в поле.
- Нет тега, обязательности (`required`), `fontSize`, `fontColorStyle`, `fontWeight`, выравнивания текста вправо
  и вида ошибки `invalidAccent`.
- Высот три: m, l, xl.
- У меню нет прозрачной рамки 1px, как у окна Saby: пункты на 1px левее.

## Значения без токена

Помечены в CSS комментарием `/* нет токена */`:

- толщина линии и рамки 1px, в том числе в расчёте сдвига меню;
- смещение тени меню `0 0`; цвет второго слоя тени — `--color-shadow-color_a` (отдельного токена нет);
- маркер выбранного пункта: кружок 6px в поле 12px, отступ справа 3px.

## Пример

[example/index.html](example/index.html) — поле по состояниям на обычном и сером фоне и рабочее меню.
Запустите статический сервер в корне кита, например `npx serve`, и откройте `/components/combobox/example/`.
