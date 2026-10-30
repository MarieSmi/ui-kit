# input

Компонент ui-kit: поля ввода — однострочное, многострочное, дата и время. Библиотека Figma «⚙️ Default components»
(`nuC4KFMiS36uDWDUp9wKGl`), страница «✅ Поля ввода» (`47:449`): `Input/text` (`15786:3347`), `Input/textArea`
(`15769:14088`), `Input/date` (`15769:13000`), `Input/time` (`15769:13857`) и их детали из секции «🧱 bricks».
`Input/lookup` в кит не входит. Только CSS, без JS.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.9.0/components/input/input.css">
```

`tokens.css` подключается первым. `fonts.css` нужен для Inter и глифов иконок (cbuc-icons).

## Разметка

```html
<label class="input">
  <span class="input__label">Метка<span class="input__required"></span></span>
  <span class="input__body">
    <span class="input__field">
      <input class="input__control" placeholder="text">
      <span class="input__icon" aria-hidden="true">&#xe66c;</span>
    </span>
    <span class="input__counter">0/100</span>
  </span>
</label>
```

Обязательны `.input`, `.input__body`, `.input__field` и `.input__control`. Без метки `.input__label` не пишется;
звёздочка `.input__required`, иконка `.input__icon` и счётчик `.input__counter` — по необходимости. Линия
под полем — нижняя граница `.input__field`. Ширину задаёт прототип: поле занимает всю ширину родителя.

**Многострочное** — `.input--textarea` и `<textarea class="input__control" rows="1">`. Растёт по тексту
(`field-sizing: content`; где свойство не поддерживается, высоту задаёт `rows`).

**Дата** — `.input--date`, поле 56px с маской в плейсхолдере. Период — второе поле через тире, календарь — иконка:

```html
<label class="input input--date">
  <span class="input__label">Метка</span>
  <span class="input__body">
    <span class="input__field"><input class="input__control" inputmode="numeric" maxlength="8"
      placeholder="&nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;."></span>
    <span class="input__dash"></span>
    <span class="input__field"><input class="input__control" inputmode="numeric" maxlength="8"
      placeholder="&nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;."></span>
    <span class="input__icon" aria-hidden="true">&#xe75f;</span>
  </span>
</label>
```

**Время** — `.input--time`: одно поле 36px с плейсхолдером `&nbsp;&nbsp;&nbsp;&nbsp;:` и `maxlength="5"`.

Формат даты (ДД.ММ.ГГ) и времени (ЧЧ:ММ), проверку, календарь и число в счётчике делает прототип.

## Классы

| Figma | Класс | Что это |
|---|---|---|
| `labelPosition=left` | — | метка слева, по базовой линии текста |
| `labelPosition=top` | `.input--label-top` | метка над полем |
| `jumpingLabel=true` | `.input--jumping` | метка XS над полем; у пустого поля без фокуса лежит в поле вместо плейсхолдера. Только у однострочного, нужен `placeholder` |
| `inlineHeight=m / l / xl` | `.input--size-m` / `-l` / `-xl` | высота 24 / 28 / 32px; по умолчанию m. Нет у многострочного |
| `contrastBackground=true` | `.input--contrast` | белая подложка с отступом 4px, линия только при фокусе |
| `required=true` | `.input--required` | красное свечение на линии слева |
| `oldRequired=true` | `.input__required` в метке | красная звёздочка |
| `iconVisible=true` | `.input__icon` в `.input__field` | глиф U+E66C (крестик), только у однострочного |
| `counterVisible=true` | `.input__counter` | «0/100» справа под линией |
| `period=true` | `.input__dash` и второе `.input__field` | только у даты |
| `calendar=true` | `.input__icon` после полей | глиф U+E75F, только у даты |

**Состояния:**

| Figma | Класс | Псевдокласс | Что меняется |
|---|---|---|---|
| `focus=true` | `.is-focus` на `.input` или `.input__field` | `:focus-within` у `.input__field` | линия темнеет; на контрастном фоне появляется. У даты с периодом — только у поля в фокусе |
| `_hover=true` | `.is-hover` | `:hover` | только у многострочного: линия темнеет |
| `text=true` | — | не `:placeholder-shown` | значение цвета текста; свечение `required` у многострочного, даты и времени скрывается |

## Допущения

- Прыгающая метка: в макете один вид (метка XS сверху), поведение «лежит в поле, пока пусто» — допущение.
- У многострочного поля фокуса в макете нет: вид при фокусе не меняется.
- У однострочного поля в макете нет свойства «заполнено», поэтому свечение `required` остаётся и с текстом.
- Курсор — обычный курсор браузера цвета текста, деталь `caretCursor` не воспроизводится.
- Свечение `required` в макете — градиент с цветами без токенов; в ките он собран из `--border-danger_border-color`
  с прозрачностью.
- Числа без токена (зазор 2 / 4px у l / xl, ширина даты 56px и времени 36px, высота метки XS 15px, линия 1px)
  помечены в CSS `/* нет токена */`.
- Ключи component set не прочитаны (Figma MCP вернул 403) — в `figma-map.json` стоит `null`, связь по узлам.
