/*!
 * right-sidebar — поведение правого сайдбара конструктора: пункты тулбара открывают и закрывают панели вкладок,
 * в режиме «По ховеру» панель открывается наведением и закрепляется кликом, кнопка разворота .rsb__dock переключает
 * вписанный и висящий режимы, стрелки строк сворачивают дерево.
 * Без зависимостей, CSS компонента подключается отдельно.
 * https://github.com/MarieSmi/ui-kit/tree/main/components/right-sidebar
 *
 * Разметка: пункт — .rsb__item[data-rsb-tab="ключ"], панель — .rsb__panel[data-rsb-panel="ключ"]. См. README.
 */
(function () {
  'use strict';

  const CLOSE_DELAY = 200; // мс: пауза перед закрытием панели, открытой наведением

  function levelOf(row) {
    const m = /(?:^|\s)rsb__row--level-(\d+)/.exec(row.className);
    return m ? Number(m[1]) : 1;
  }

  // Прячет строки под свёрнутыми узлами. Строки дерева — соседи в одном контейнере, вложенность задаёт уровень
  function syncTree(box) {
    let closed = Infinity; // уровень ближайшего свёрнутого предка
    Array.prototype.forEach.call(box.children, function (row) {
      if (!row.matches('.rsb__field, .rsb__layer')) return;
      const level = levelOf(row);
      if (level <= closed) closed = Infinity;
      row.hidden = level > closed;
      if (closed === Infinity && row.getAttribute('aria-expanded') === 'false') closed = level;
    });
  }

  function mount(root, options) {
    const opts = options || {};
    const qa = function (s) { return Array.from(root.querySelectorAll(s)); };
    const items = qa('[data-rsb-tab]');
    const panels = qa('[data-rsb-panel]');
    const floating = function () { return root.classList.contains('rsb--hover') || root.classList.contains('rsb--pinned'); };
    let byHover = root.classList.contains('rsb--hover'); // сайдбар работает по наведению: закрепление вернётся в этот режим
    let timer = null;

    function current() {
      const p = panels.find(function (el) { return el.classList.contains('is-open'); });
      return p ? p.dataset.rsbPanel : null;
    }

    function show(key) {
      const was = current();
      items.forEach(function (it) {
        const on = it.dataset.rsbTab === key;
        it.classList.toggle('is-active', on);
        it.setAttribute('aria-pressed', String(on));
        if (on) root.style.setProperty('--rsb-panel-top', it.offsetTop + 'px');
      });
      panels.forEach(function (p) { p.classList.toggle('is-open', p.dataset.rsbPanel === key); });
      syncDock();
      if (was !== key && opts.onTab) opts.onTab(key);
    }

    function setPinned(on) {
      if (!byHover && !root.classList.contains('rsb--pinned')) return; // вписанный сайдбар не закрепляется
      byHover = true;
      root.classList.toggle('rsb--pinned', on);
      root.classList.toggle('rsb--hover', !on);
      syncDock();
    }

    // Кнопка разворота: вписанный сайдбар уходит в режим «По ховеру» с закрытой панелью,
    // висящий (по ховеру или закреплённый) становится вписанным с той же вкладкой, без вкладки — с первой
    function setDocked(on) {
      if (on === !floating()) return;
      clearTimeout(timer);
      const key = current() || (items[0] && items[0].dataset.rsbTab) || null;
      root.classList.remove('rsb--pinned');
      root.classList.toggle('rsb--hover', !on);
      byHover = !on;
      show(on ? key : null);
      syncDock();
      if (opts.onDock) opts.onDock(on);
    }
    // Глиф и подпись кнопки в слоте .rsb__dock: «Свернуть» (U+EBFB) у вписанного с открытой панелью, иначе «Развернуть» (U+EBFA)
    function syncDock() {
      const dock = root.querySelector('.rsb__dock');
      if (!dock) return;
      const collapse = !floating() && !!current();
      const btn = dock.querySelector('button') || dock;
      const icon = dock.querySelector('.btn__icon');
      const label = collapse ? 'Свернуть панель' : 'Развернуть панель';
      btn.setAttribute('aria-label', label);
      btn.title = label;
      if (icon) icon.textContent = collapse ? '' : '';
    }

    function onClick(e) {
      if (e.target.closest('.rsb__dock')) { setDocked(floating()); return; }
      const item = e.target.closest('[data-rsb-tab]');
      if (item && root.contains(item)) {
        const key = item.dataset.rsbTab;
        if (root.classList.contains('rsb--hover')) { setPinned(true); show(key); }      // наведение → закрепить
        else if (current() === key) { if (byHover) setPinned(false); show(null); }     // повторный клик закрывает
        else show(key);
        return;
      }
      const arrow = e.target.closest('.rsb__arrow');
      const row = arrow && arrow.parentElement;
      if (row && root.contains(row) && row.hasAttribute('aria-expanded')) {
        const open = row.getAttribute('aria-expanded') !== 'true';
        row.setAttribute('aria-expanded', String(open));
        syncTree(row.parentElement);
        if (opts.onToggle) opts.onToggle(row, open);
      }
    }

    function onOver(e) {
      if (!root.classList.contains('rsb--hover')) return;
      clearTimeout(timer);
      const item = e.target.closest('[data-rsb-tab]');
      if (item && root.contains(item)) show(item.dataset.rsbTab);
    }
    function onLeave() {
      if (!root.classList.contains('rsb--hover')) return;
      clearTimeout(timer);
      timer = setTimeout(function () { show(null); }, CLOSE_DELAY);
    }

    root.addEventListener('click', onClick);
    root.addEventListener('mouseover', onOver);
    root.addEventListener('mouseleave', onLeave);

    qa('.rsb__content').forEach(syncTree);
    const start = current();
    if (start) show(start); // расставить is-active и верх панели по разметке
    else items.forEach(function (it) { it.setAttribute('aria-pressed', 'false'); });
    syncDock();

    return {
      open: function (key) { show(key); },
      close: function () { show(null); },
      pin: function (on) { setPinned(on !== false); },
      dock: function (on) { setDocked(on !== false); },
      get tab() { return current(); },
      get floating() { return floating(); },
      destroy: function () {
        clearTimeout(timer);
        root.removeEventListener('click', onClick);
        root.removeEventListener('mouseover', onOver);
        root.removeEventListener('mouseleave', onLeave);
      }
    };
  }

  window.RightSidebar = { mount: mount };
})();
