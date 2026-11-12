# text-editor

Окно текстового редактора, выделенное из [table-widget](https://github.com/pershmary/table-widget):
шапка документа, левая и правая панели, полный верхний тулбар, прокручиваемая область редактирования.
Чистые CSS и JS, без зависимостей от остальных компонентов кита.

Вид перенесён из `demo.html` и `css/table-widget.css`; исходный фрейм — `1265:76984`,
ключ файла Figma в исходнике не указан. Повторной сверки с Figma не было.
Кнопка «Сохранить» в исходнике ссылается на `RXao8Os01blfLeZ4xU9rYM / 17654:127765`.
Четыре иконки, которых нет в шрифте кита (данные, комментарий, плитка, вкладки), сохранены
как SVG-контуры из шрифта исходного проекта; дополнительных шрифтов не требуется.
Личная фотография и время из демо заменены на настраиваемые инициалы и подпись версии.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.15.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.15.0/fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.15.0/components/text-editor/text-editor.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.15.0/components/text-editor/text-editor.js"></script>

<div id="editor" style="height: 600px"><p>Текст документа</p></div>
<script>
const editor = TextEditor.mount(document.getElementById('editor'), {
  title: 'Новый документ',
  revision: 'Текущая версия',
  initials: 'АБ',
  onAction({ action, editor }) {
    // Здесь прототип подключает сохранение, форматирование, историю и виджеты.
    console.log(action, editor.elements.document);
  },
  onInput({ content }) { console.log(content.textContent); }
});
</script>
```

CDN-пример доступен после выпуска тега `1.15.0`. До выпуска используйте локальные файлы.
Размер окна задаёт прототип. `.te--fullscreen` даёт высоту `100dvh`; прокрутка документа
и горизонтальная прокрутка длинного тулбара работают внутри окна, без изменений `html`/`body`.
На узком экране шапка и тулбар прокручиваются по горизонтали. Одновременно можно создать несколько окон.
Темы и размеры наследуются из `data-ui-theme` / `data-ui-size`, как у остальных компонентов кита.

## API

`TextEditor.mount(element, options)` возвращает экземпляр. Повторный mount возвращает тот же экземпляр.

| Параметр | По умолчанию | Назначение |
|---|---|---|
| `title` | Новый документ | название в шапке, строка |
| `revision` | Изменения документа | подпись версии |
| `initials` | пустая строка | инициалы в квадрате пользователя |
| `content` | существующие дочерние узлы контейнера | DOM-узел, DocumentFragment или строка обычного текста |
| `editable` | `true` | `contenteditable` области документа |
| `onAction` | — | `{ action, button, originalEvent, editor }` |
| `onInput` | — | `{ content, originalEvent, editor }` |

Методы: `setTitle(string)`, `setContent(nodeOrText)`, `setEditable(boolean)`, `destroy()`.
`destroy()` удаляет слушатели и оболочку, возвращает исходные дочерние узлы контейнера
(их содержимое может быть изменено пользователем). Повторное уничтожение безопасно.
Строки передаются через `textContent`; HTML передавайте подготовленными DOM-узлами.

`elements`: `root`, `head`, `left`, `right`, `toolbar`, `viewport`, `document`.
Через них можно добавить свою панель, заменить подписи, скрыть ненужные кнопки (`hidden`)
или выключить команду (`disabled`). У кнопок есть стабильный `data-te-action`.
Левая панель в исходнике пустая и оставлена слотом.

Клик также отправляет всплывающее DOM-событие `text-editor:action`, данные — в `event.detail`.
Мышь на кнопках сохраняет выделение в документе; клавиатурная навигация работает обычным Tab.
Сохранение, закрытие, масштаб, undo/redo, меню, форматирование и вставку виджетов реализует прототип.
Сам компонент предоставляет нативный ввод текста через `contenteditable`.

### Команды

- Шапка: `undo`, `redo`, `zoom-out`, `zoom`, `zoom-in`, `revision`, `save`, `close`.
- Текст: `text-style`, `bold`, `italic`, `underline`, `strike`, `inline-code`, `text-color`, `highlight-color`, `alignment`.
- Вставка: `bullet-list`, `numbered-list`, `check-list`, `link`, `image`, `table`, `table-options`, `columns`, `emoji`, `code-block`, `info-block`, `quote`, `comment`, `tile`, `signature`, `document-link`, `tabs`.
- Остальной тулбар: `voice`, `assistant`, `toolbar-more`.
- Правая панель: `add`, `data`, `settings`, `sidebar-more`, `help`.

### Классы и состояния

Корень `.te`, части `.te__head`, `.te__left`, `.te__right`, `.te__toolbar`, `.te__viewport`, `.te__document`.
Ширина документа — локальная переменная `--te-document-width` (820px).
Кнопки поддерживают `:hover` / `.is-hover`, `:focus-visible`, `:disabled` / `.is-disabled`.
Корень `.is-scrolled` включает тень под тулбаром; JS обновляет класс по прокрутке своего документа.
`.te__ritem--accent` — акцентная кнопка правой панели.

Покой и hover перенесены из проекта. `is-disabled` и клавиатурный фокус добавлены для интеграции
и доступности; отдельный вариант Active в исходнике не задан. Цвета hover боковых кнопок и
«Сохранить» приблизительно выражены через токены; это явно отмечено в CSS. Новых глобальных токенов нет.

[Рабочий пример](example/index.html) показывает ввод, передачу команд, темы, длинный документ
и отключение редактирования. Все состояния кнопок показаны в каталоге.
