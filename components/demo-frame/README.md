# demo-frame

Компонент ui-kit. До переезда жил в отдельном репозитории `MarieSmi/demo-frame` (версия 1.0.0).

Рамка для интерактивных демо-прототипов. В ней три части:

- шапка с названием, версией и статусом согласования;
- сцена фиксированного размера (по умолчанию 1600×900);
- вспомогательная панель справа: устройство, сценарии, ссылки и команда.

Все три части масштабируются вместе под размер окна. Зависимостей нет: один CSS и один JS.
Цвета и тени берутся из токенов кита, поэтому рамка перекрашивается вместе с `data-theme`.
Размеры рамки фиксированы и от `data-size` не зависят.

Вынесено из [accordion-setup](https://github.com/MarieSmi/accordion-setup)
(макет панели: Figma `xMQ3ZEN4AUINgwjVoxR8hS`, узел `18715:93398`).

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.0.0/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.0.0/components/demo-frame/demo-frame.css">
<script src="https://cdn.jsdelivr.net/gh/MarieSmi/ui-kit@1.0.0/components/demo-frame/demo-frame.js"></script>
```

`tokens.css` подключается первым. Версия в адресе — тег кита, правила версий — в README кита.

**Переход со старого адреса.** Прототипы на `MarieSmi/demo-frame@1.0.0` продолжают работать. Чтобы
перейти на кит, замените оба адреса на три адреса выше. API `DemoFrame.mount` не изменился.

Рамка набрана шрифтом **Inter**, и подключать его должен сам проект. Если в проекте Inter нет, добавьте:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
```

## Сцена

Сцена — это элемент проекта размером 1600×900. Рамка его не создаёт, а только расставляет: задаёт ему
`transform` (сдвиг и масштаб) и `transform-origin: 0 0`. В исходном положении сцена должна стоять в левом
верхнем углу окна:

```css
html, body { margin: 0; height: 100%; overflow: hidden; }
.stage { position: absolute; left: 0; top: 0; width: 1600px; height: 900px; }
```

Если сцена лежит внутри обёртки, у обёртки не должно быть своих отступов и прокрутки. Подойдёт, например,
`position: fixed; inset: 0; overflow: hidden`.

## Запуск

```js
const frame = DemoFrame.mount({
  stage: document.getElementById('stage'),

  head: {
    title: 'Название демо',
    version: '27.1100',                 // необязательно
    href: 'https://…',                  // необязательно: ссылка «‹ назад» на заголовке
    status: 'Запущено согласование 30.09.26', // необязательно
  },

  devices: [
    { id: 'laptop', icon: 'laptop', label: 'Ноутбук', disabled: true },
    { id: 'monitor', icon: 'monitor', label: 'Монитор', size: '1600х900', name: 'монитор' },
  ],
  device: 'monitor',                    // выбранное устройство; по умолчанию первое доступное

  // Сценарии вверху панели. Пункт: { id, title, disabled?, hidden?, variants? }.
  // Группа: { group: 'Заголовок', items: [...], hidden? }. Пункты подряд без группы — в одном блоке.
  scenarios: [
    { id: 'demo', title: 'Общее демо' },
    { group: 'Добавление вкладки', items: [
      { id: 'tab-toolbar', title: 'Из тулбара', variants: [
        { id: 'plus', title: 'Плюс в тулбаре' },
        { id: 'link', title: '+вкладка' },
      ] },
      { id: 'later', title: 'Пока не сделан', disabled: true },
    ] },
  ],
  bottomScenarios: [ /* то же самое — блок внизу панели, над ссылками */ ],

  links: [{ title: 'Макет в Figma', href: 'https://…' }],
  team: [
    { label: 'Design', name: 'Имя Фамилия', links: [{ title: 'Описание', href: 'https://…' }] },
    { label: 'Develop' },
  ],

  value: { scenario: 'demo' },          // сценарий, отмеченный при запуске (onChange при этом не вызывается)
  onChange({ scenario, variant }, prev) {
    // сценарий выбран в панели — показать его на сцене
  },
  onDevice(id) {},                      // выбрано другое устройство
  onScale(scale) {},                    // изменился масштаб (при запуске и при изменении размера окна)
});
```

### Как работают сценарии

- Во всей панели может быть выбран только один сценарий, включая блок `bottomScenarios`.
- **Вилка** — это сценарий с `variants`. Если выбрать сам сценарий, включится его первый доступный
  вариант. У выбранного варианта отмечен и родительский сценарий.
- `disabled` показывает сценарий серым: его нельзя выбрать. `hidden` убирает сценарий или группу из
  панели, а в конфиге они остаются.

### Что возвращает `mount`

| | |
|---|---|
| `frame.scale` | текущий масштаб. Нужен, чтобы пересчитать координаты мыши в координаты сцены: `(clientX - stageRect.left) / frame.scale` |
| `frame.value` | `{ scenario, variant }` — выбранный сценарий |
| `frame.select(id, variant?)` | выбрать сценарий из кода (`onChange` вызывается) |
| `frame.device`, `frame.setDevice(id)` | устройство |
| `frame.fit()` | пересчитать расстановку вручную |
| `frame.head`, `frame.panel`, `frame.root` | элементы рамки |
| `frame.destroy()` | убрать рамку |

### Размеры

Размеры по умолчанию взяты из макета. Любой из них можно поменять при запуске:

| параметр | по умолчанию | |
|---|---|---|
| `width`, `height` | `1600`, `900` | размер сцены |
| `headHeight` | `80` | высота шапки; без `head` шапки нет |
| `gap` | `16` | зазор между сценой и панелью |
| `panelWidth` | `300` | ширина панели |
| `left` | `4` | отступ рамки от левого края окна |
| `viewport` | окно | элемент, под размер которого масштабируется рамка |

## Пример

[example/index.html](example/index.html) — минимальное демо. Чтобы его открыть, запустите статический
сервер в корне кита, например `npx serve`, и откройте `/components/demo-frame/example/`.
