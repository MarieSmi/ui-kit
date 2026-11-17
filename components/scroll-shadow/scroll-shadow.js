/*!
 * scroll-shadow — ставит классы теней на прокручиваемые блоки .scroll-shadow:
 * .is-scrolled — блок прокручен вниз (тень сверху), .is-more-below — ниже есть содержимое (тень снизу).
 * ScrollShadow.mount(root): следит за root и всеми .scroll-shadow внутри, в том числе добавленными позже;
 * пересчитывает при прокрутке, смене размера блока и его содержимого.
 * Без зависимостей, CSS компонента подключается отдельно.
 * https://github.com/MarieSmi/ui-kit/tree/main/components/scroll-shadow
 */
(function () {
  'use strict';

  function sync(el) {
    el.classList.toggle('is-scrolled', el.scrollTop > 0);
    el.classList.toggle('is-more-below', el.scrollTop + el.clientHeight < el.scrollHeight - 1); // 1px — дробные размеры
  }

  function mount(root) {
    if (!root || root.nodeType !== 1) throw new TypeError('ScrollShadow.mount: нужен DOM-элемент');
    function blocks() {
      const list = Array.prototype.slice.call(root.querySelectorAll('.scroll-shadow'));
      if (root.classList.contains('scroll-shadow')) list.unshift(root);
      return list;
    }
    const sizes = window.ResizeObserver ? new ResizeObserver(function () { refresh(); }) : null;
    let watched = [];
    function refresh() {
      const list = blocks();
      if (sizes) list.forEach(function (el) { if (watched.indexOf(el) < 0) { sizes.observe(el); watched.push(el); } });
      list.forEach(sync);
    }
    // scroll не всплывает — ловим на погружении, тогда работают и блоки, добавленные после mount
    function onScroll(e) {
      const el = e.target;
      if (el.nodeType === 1 && el.classList.contains('scroll-shadow') && root.contains(el)) sync(el);
    }
    // Содержимое изменилось — нижняя тень могла появиться или пропасть
    let queued = false;
    const changes = window.MutationObserver ? new MutationObserver(function () {
      if (queued) return;
      queued = true;
      (window.requestAnimationFrame || setTimeout)(function () { queued = false; refresh(); });
    }) : null;

    root.addEventListener('scroll', onScroll, true);
    if (changes) changes.observe(root, { childList: true, subtree: true, characterData: true });
    refresh();
    return {
      refresh: refresh, // после программной смены scrollTop
      destroy: function () {
        root.removeEventListener('scroll', onScroll, true);
        if (sizes) sizes.disconnect();
        if (changes) changes.disconnect();
        watched = [];
      }
    };
  }

  window.ScrollShadow = { mount: mount };
})();
