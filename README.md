# ui-kit

Компоненты и токены для интерактивных HTML-прототипов по макетам Figma.

- **Токены** — `tokens.css`: цвета, отступы, радиусы и типографика как CSS-переменные с именами из Figma.
- **Компоненты** — `components/<имя>/`: у каждого свой CSS и, если нужно, JS.
- **Шрифты** — `fonts/`: Inter и иконочные шрифты из макетов, подключаются через `fonts/fonts.css`.
- **Каталог** — `catalog/index.html`: все токены и компоненты с переключением темы и размера.
  Открывается через локальный сервер (`npx serve` в корне кита). Версия для артефакта Claude, где
  всё вшито в один файл, собирается командой `python3 tools/catalog/build-artifact.py <файл>`.

Зависимостей нет, собирать ничего не нужно.

## Подключение

Файлы раздаёт jsDelivr прямо из GitHub по тегу:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.3.1/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.3.1/components/<имя>/<имя>.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.3.1/components/<имя>/<имя>.js"></script>
```

- `tokens.css` подключается **первым**: компоненты берут значения из его переменных.
- Версия в адресе (`@1.3.1`) — git-тег. Подключённый прототип не меняется сам, новую версию нужно указать явно.
- Во всех адресах одного прототипа должна стоять одна и та же версия.
- В артефактах Claude адреса `cdn.jsdelivr.net/gh/` не работают: там код кита вшивается в файл.

## Шрифты

Компоненты шрифты не подключают: они только называют `font-family` через токены. Шрифты из кита
прототип подключает сам, отдельным файлом:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.3.1/fonts/fonts.css">
```

| Шрифт | Файлы | Где используется |
|---|---|---|
| Inter 400 / 500 / 600, прямой и курсив | `fonts/Inter/`: переменные `woff2`, запасные `ttf` | текст, `--font-font-family-default` |
| cbuc-icons | `fonts/cbuc-icons.ttf` | иконки 16 и 32 px, `--icon-font-family-*` |
| cbuc-icons24 | `fonts/cbuc-icons24.ttf` | иконки 24 px, `--icon-font-family-m_icon_font-family` |
| Accordion-Font | `fonts/Accordion-Font.ttf` | иконки аккордеона |

Шрифтов тем Large и mobile (SF Pro, sbis-mobile-icons) в ките нет.

## Токены

`tokens.css` собран из библиотеки Figma
[🌍 Global Variables](https://www.figma.com/design/mcpY3I5yWjkPfnk1IdEiqw/): 521 переменная из
коллекций globalColor (274), globalSize (225) и globalShadow (22). Значения по умолчанию лежат в
`:root`, остальные режимы переключаются атрибутами на `<html>`:

```html
<html data-ui-theme="default-dark" data-ui-size="large">
```

| Атрибут | Значения | Без атрибута |
|---|---|---|
| `data-ui-theme` — цвета и тени | `default-dark`, `large-light`, `dark-v3`, `large-dark`, `pink`, `dark-v2`, `blackblue`, `gray` | Default Light |
| `data-ui-size` — размеры и шрифты | `mobile`, `large`, `large-mobile` | default |

Префикс `ui-` в атрибутах нужен, чтобы не конфликтовать с `data-theme`, который хост артефактов Claude
ставит на `<html>` для светлой и тёмной темы.

Алиасы из Figma сохранены как ссылки: `--icon-danger_icon-color` в тёмной теме ссылается на
`var(--text-danger_text-color)`, поэтому меняется вместе с ним.

**Обновить токены.** `tokens.css` руками не правится. Попросите Claude перевыгрузить переменные из
Figma: он обновит файлы в `tools/tokens/`, запустит `python3 tools/tokens/build.py` и покажет, что
изменилось. Изменение имени или удаление переменной в Figma — мажорная версия кита.

## Состав

| Компонент | Папка | Макет Figma | С версии |
|---|---|---|---|
| Вспомогательная область: шапка, сцена, панель сценариев | [`components/demo-frame`](components/demo-frame/) | `xMQ3ZEN4AUINgwjVoxR8hS` · `18715:93398` | 1.0.0 |
| Кнопка: 8 видов, стили, размеры m / xl / 5xl, кнопка-иконка | [`components/button`](components/button/) | `nuC4KFMiS36uDWDUp9wKGl` · `322:2761` | 1.1.0 |
| Чекбокс: outlined / filled / ghost, resetValue, третье состояние, подпись слева | [`components/checkbox`](components/checkbox/) | `nuC4KFMiS36uDWDUp9wKGl` · `14613:12425` | 1.2.0 |

Связь компонентов Figma с классами кита — в [`figma-map.json`](figma-map.json): ключи component set и
соответствие их свойств классам. По ней инстанс из макета переводится в разметку кита.

## Как добавить компонент

Компонент попадает в кит, когда он нужен хотя бы во втором прототипе.

1. **Проверь макет.** Компонент в Figma — настоящий компонент с вариантами, без detached-копий. Состояния
   — варианты свойства `State` с одинаковыми значениями во всём ките: `Default`, `Hover`, `Active`,
   `Focus`, `Disabled`.
2. **Создай папку** `components/<имя>/` с файлами `<имя>.css` и, если нужно, `<имя>.js`.
3. **Пиши только на токенах.** Никаких hex и размеров числами там, где есть токен. Если нужного токена нет,
   сначала добавь его в `tokens.css` с именем из Figma.
4. **Добавь компонент в каталог** — во всех вариантах и состояниях.
5. **Допиши строку в таблицу «Состав»** и запись в `CHANGELOG.md`.
6. **Выпусти версию** (ниже).

### Правила именования

| Что | Правило | Пример |
|---|---|---|
| Папка и файлы | имя компонента латиницей, kebab-case | `components/pin/pin.css` |
| Классы | короткий префикс компонента, дальше BEM | `.pin`, `.pin__dot`, `.df-head__title` |
| Варианты | модификатор с именем свойства и значения из Figma | `.pin--type-click` |
| Состояния | класс `is-*` по значению `State` из Figma | `.is-hover`, `.is-disabled` |
| Токены | имя переменной из Figma в нижнем регистре, `/` и пробелы → `-` | `Border/unaccented_border-color` → `--border-unaccented_border-color` |
| JS | один глобальный объект на компонент, PascalCase | `DemoFrame.mount({...})` |

Состояния, которые браузер ставит сам (`:hover`, `:focus-visible`, `:disabled`), стилизуются и через
псевдокласс, и через класс `is-*`. Класс нужен каталогу и сценариям демо, чтобы показать состояние без мыши.

## Новая версия

Версии по [semver](https://semver.org/lang/ru/):

- **патч** `1.0.1` — исправления, вид и API не меняются;
- **минор** `1.1.0` — новый компонент, вариант или токен, старое работает как раньше;
- **мажор** `2.0.0` — что-то переименовано или удалено, прототипы при переходе могут разъехаться.

1. Закоммить изменения в `main` и допиши `CHANGELOG.md`.
2. Поставь тег и отправь его: `git tag 1.1.0 && git push origin 1.1.0`.
3. В прототипе поменяй версию во всех адресах кита.
