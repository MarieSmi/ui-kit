/*!
 * shop — поведение магазина виджетов: кнопка в шапке раскрывает расширенный вид с деревом категорий,
 * клик по виджету и выбор категории передаются прототипу. Фильтрацию по категории и поиску делает прототип.
 * Без зависимостей, CSS компонента подключается отдельно.
 * https://github.com/MarieSmi/ui-kit/tree/main/components/shop
 */
(function () {
  'use strict';

  function levelOf(item) {
    const m = /(?:^|\s)ml__item--level-(\d+)/.exec(item.className);
    return m ? Number(m[1]) : 0;
  }

  // Прячет пункты дерева категорий под свёрнутыми узлами (master-list: пункты — соседи, вложенность задаёт уровень)
  function syncTree(list) {
    let closed = Infinity;
    Array.prototype.forEach.call(list.children, function (item) {
      const level = levelOf(item);
      if (level <= closed) closed = Infinity;
      item.hidden = level > closed;
      if (closed === Infinity && item.getAttribute('aria-expanded') === 'false') closed = level;
    });
  }

  function mount(root, options) {
    const opts = options || {};

    function setExpanded(on) {
      if (root.classList.contains('is-expanded') === on) return;
      root.classList.toggle('is-expanded', on);
      const btn = root.querySelector('.shop__expand');
      if (btn) btn.setAttribute('aria-expanded', String(on));
      if (opts.onExpand) opts.onExpand(on);
    }

    function onClick(e) {
      if (e.target.closest('.shop__expand')) { setExpanded(!root.classList.contains('is-expanded')); return; }

      const widget = e.target.closest('.shop__widget');
      if (widget && root.contains(widget)) { if (opts.onAdd) opts.onAdd(widget.dataset.shopWidget || null, widget); return; }

      const item = e.target.closest('.shop__master .ml__item');
      if (!item || !root.contains(item)) return;
      if (item.hasAttribute('aria-expanded') && e.target.closest('.ml__arrow')) { // стрелка сворачивает узел
        item.setAttribute('aria-expanded', String(item.getAttribute('aria-expanded') !== 'true'));
        syncTree(item.parentElement);
        return;
      }
      root.querySelectorAll('.shop__master .ml__item').forEach(function (el) {
        const on = el === item;
        el.classList.toggle('is-selected', on);
        if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
      });
      if (opts.onCategory) opts.onCategory(item.dataset.shopCategory || null, item);
    }

    // Крупный виджет — div с role="button": Enter и пробел работают как клик
    function onKey(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const widget = e.target.closest('.shop__widget');
      if (!widget || widget !== e.target || widget.tagName === 'BUTTON') return;
      e.preventDefault();
      widget.click();
    }

    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKey);
    root.querySelectorAll('.shop__master .ml').forEach(syncTree);
    const btn = root.querySelector('.shop__expand');
    if (btn) btn.setAttribute('aria-expanded', String(root.classList.contains('is-expanded')));

    return {
      expand: function (on) { setExpanded(on !== false); },
      get expanded() { return root.classList.contains('is-expanded'); },
      destroy: function () {
        root.removeEventListener('click', onClick);
        root.removeEventListener('keydown', onKey);
      }
    };
  }

  window.Shop = { mount: mount };
})();
