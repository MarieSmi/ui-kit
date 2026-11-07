/*!
 * pg-editors — редакторы PropertyGrid: размер, тень, отступы, скругления, фон, границы, а также окно цвета.
 * Логика перенесена из прототипа STV, вид — по библиотеке PropertyGrid. Без зависимостей, CSS подключается отдельно.
 * https://github.com/MarieSmi/ui-kit/tree/main/components/pg-editors
 *
 *   const ed = PGEditors.radius(el, { value, onChange(value) {}, onClear() {} });
 *   ed.get(); ed.set(value); ed.destroy();
 *
 * Редактор рисуется внутри el. Окна открываются в ближайшем предке с атрибутом data-pge-layer
 * (или в options.layer, иначе в body) — так они масштабируются вместе со сценой demo-frame.
 */
(function () {
  'use strict';

  // ---------- Глифы и векторные иконки ----------
  const G = { reset: '', check: '', close: '', format: '', sides: '', plus: '', corners: '' };
  const SVG = {
    radius: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path d="M7.5 11.5H9.5C10.6046 11.5 11.5 10.6046 11.5 9.5V7.5"/><path d="M7.5 0.5H9.5C10.6046 0.5 11.5 1.39543 11.5 2.5V4.5"/><path d="M4.5 11.5H2.5C1.39543 11.5 0.5 10.6046 0.5 9.5V7.5"/><path d="M4.5 0.5H2.5C1.39543 0.5 0.5 1.39543 0.5 2.5V4.5"/></g></svg>',
    padH: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><g fill="currentColor"><rect x="0" y="1" width="1" height="10" rx=".5"/><rect x="11" y="1" width="1" height="10" rx=".5"/></g><rect x="3.5" y="3.5" width="5" height="5" rx="1.5" fill="none" stroke="currentColor"/></svg>',
    padV: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><g fill="currentColor"><rect x="1" y="0" width="10" height="1" rx=".5"/><rect x="1" y="11" width="10" height="1" rx=".5"/></g><rect x="3.5" y="3.5" width="5" height="5" rx="1.5" fill="none" stroke="currentColor"/></svg>',
    corner: function (k) { return '<svg class="pge__corner pge__corner--' + k + '" viewBox="0 0 16 16" aria-hidden="true"><path d="M15 1H7C3.68629 1 1 3.68629 1 7V15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'; },
    pipette: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M12.2337 0.64521L10.5286 2.35089L10.3306 2.15463C9.72406 1.54564 8.66847 1.54143 8.05011 2.16053C7.42332 2.78636 7.42332 3.80724 8.05011 4.43476L8.24724 4.63186L1.4857 11.3914C0.995394 11.8816 0.769616 12.5841 0.869026 13.2706L0.382929 13.7583C-0.12844 14.2468 -0.126755 15.1279 0.382929 15.6164C0.869868 16.1277 1.75192 16.1277 2.24223 15.6173L2.72832 15.1296C3.41324 15.2307 4.11837 15.0032 4.60868 14.5138L11.3702 7.75431L11.5665 7.95057C12.1941 8.57809 13.2144 8.57809 13.847 7.94551C14.4738 7.31799 14.4738 6.29711 13.847 5.67128L13.6516 5.47333L15.3567 3.7685C16.2152 2.94472 16.2143 1.4673 15.355 0.64521C14.9254 0.215632 14.3601 0 13.7948 0C13.2295 0 12.6634 0.215632 12.2337 0.64521ZM10.8252 3.24542L12.8294 1.24157C13.3441 0.726072 14.2447 0.726071 14.7611 1.24325C15.2902 1.75032 15.291 2.66423 14.7611 3.17214L12.7569 5.176C12.5918 5.33941 12.5918 5.60726 12.7569 5.77151L13.2506 6.26595C13.5496 6.56412 13.5496 7.05098 13.2464 7.35505C12.9473 7.65407 12.462 7.65407 12.1621 7.35505L8.64572 3.83925C8.34749 3.54023 8.34749 3.05422 8.65078 2.75099C8.94058 2.45786 9.44521 2.45786 9.73502 2.75099L10.2295 3.24542C10.3121 3.32713 10.4199 3.36756 10.5278 3.36756C10.6356 3.36756 10.7434 3.32713 10.8252 3.24542ZM0.978545 14.3538L1.62471 13.7069C1.73086 13.6008 1.77129 13.4466 1.73423 13.3026C1.60954 12.8216 1.73844 12.3306 2.08132 11.9869L8.8437 5.22738L10.7746 7.15795L4.01307 13.9183C3.67103 14.2603 3.17988 14.39 2.69799 14.2654C2.55141 14.2283 2.39808 14.2696 2.29277 14.3749L1.64745 15.0218C1.55057 15.122 1.44021 15.1641 1.33238 15.1641C0.968435 15.1641 0.637351 14.6823 0.978545 14.3538Z"/></svg>',
    // «Нет цвета»: кружок 28, перечёркнутый «/» (цвет — Border/unaccented_border-color)
    none: '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M23.9 4.1L4.1 23.9" stroke="#d2d6da"/><circle cx="14" cy="14" r="13.5" fill="none" stroke="#d2d6da"/></svg>',
    close: '<svg viewBox="0 0 28 28" aria-hidden="true"><path fill="currentColor" d="M19.79 18.88C19.93 18.99 20 19.14 20 19.33C20 19.53 19.93 19.68 19.79 19.79C19.74 19.88 19.67 19.93 19.58 19.96C19.5 19.99 19.42 20 19.33 20C19.25 20 19.17 19.99 19.08 19.96C19 19.93 18.93 19.88 18.88 19.79L14 14.96L9.13 19.79C9.07 19.88 9 19.93 8.92 19.96C8.83 19.99 8.75 20 8.67 20C8.58 20 8.5 19.99 8.42 19.96C8.33 19.93 8.26 19.88 8.21 19.79C8.07 19.68 8 19.53 8 19.33C8 19.14 8.07 18.99 8.21 18.88L13.04 14L8.21 9.13C8.07 9.01 8 8.86 8 8.67C8 8.47 8.07 8.32 8.21 8.21C8.32 8.07 8.47 8 8.67 8C8.86 8 9.01 8.07 9.13 8.21L14 13.04L18.88 8.21C18.99 8.07 19.14 8 19.33 8C19.53 8 19.68 8.07 19.79 8.21C19.93 8.32 20 8.47 20 8.67C20 8.86 19.93 9.01 19.79 9.13L14.96 14L19.79 18.88Z"/></svg>'
  };

  // ---------- Палитры (STV, Figma 11931:124382 / 124403 / 124361; готовые тени 30654:47696). null — «нет цвета» ----------
  const PALETTES = {
    background: [null, '#ffffff', '#ebf4ff', '#eeebff', '#ffeceb', '#fff8eb', '#ebffee', '#fff1eb', '#f8f8f8', '#ebfdff'],
    border: [null, '#a39c97', '#000000', '#999999', '#8991a9', '#2562aa', '#5a49ab', '#c2140a', '#e6a119', '#298e3c'],
    shadow: ['#000000', '#999999', '#8991a9', '#2562aa', '#5a49ab', '#cc3d00', '#c2140a', '#e6a119', '#298e3c'],
    text: ['#000000', '#999999', '#8991a9', '#2562aa', '#313e78', '#5a49ab', '#cc3d00', '#c2140a', '#e6a119', '#298e3c']
  };
  const SHADOW_PRESETS = [
    { color: '#000000', opacity: 14 }, { color: '#999999', opacity: 20 }, { color: '#265fa1', opacity: 14 },
    { color: '#8991a9', opacity: 14 }, { color: '#6757b7', opacity: 14 }
  ];
  const SHADOW_RANGES = { x: [-50, 50], y: [-50, 50], blur: [0, 100], spread: [-50, 50] };
  const SHADOW_ROWS = [['x', 'X'], ['y', 'Y'], ['blur', 'Блюр'], ['spread', 'Размах']];
  const SIDES = ['top', 'right', 'bottom', 'left'];
  const CORNERS = ['tl', 'tr', 'br', 'bl'];
  const SIDE_LABELS = { top: 'сверху', right: 'справа', bottom: 'снизу', left: 'слева', tl: 'сверху слева', tr: 'сверху справа', br: 'снизу справа', bl: 'снизу слева' };

  const DEFAULTS = {
    radius: { tl: 8, tr: 8, br: 8, bl: 8, split: false },
    border: { color: '#a39c97', opacity: 100, style: 'solid', top: 1, right: 1, bottom: 1, left: 1, split: false },
    padding: { top: 12, right: 12, bottom: 12, left: 12, split: false },
    shadow: { color: '#000000', opacity: 6, x: 0, y: 0, blur: 8, spread: 0 },
    background: { color: '#ffffff', opacity: 100 },
    size: { w: { mode: 'fill', px: 557, pct: 100 }, h: { mode: 'fill', px: 240, pct: 100 }, minW: null, maxW: null, minH: null, maxH: null }
  };

  // ---------- Утилиты ----------
  const clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  const clamp = function (n, min, max) { return Math.min(max, Math.max(min, n)); };
  const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  const toInt = function (raw) { const t = String(raw).trim(); const n = Math.round(Number(t)); return t === '' || !Number.isFinite(n) ? null : n; };
  function normHex(raw) {
    let v = String(raw || '').trim().replace(/^#?/, '#').toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(v)) v = '#' + v.slice(1).split('').map(function (c) { return c + c; }).join('');
    return /^#[0-9a-f]{6}$/.test(v) ? v : null;
  }
  function rgba(hex, opacity) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', ' + (opacity == null ? 100 : opacity) / 100 + ')';
  }
  // Заливка фона, как в макете: белый — сплошной, остальные — градиент в белый
  function backgroundFill(hex, opacity) {
    if (!hex) return 'transparent';
    if (hex.toLowerCase() === '#ffffff') return rgba(hex, opacity);
    return 'linear-gradient(-69.6deg, ' + rgba(hex, opacity) + ' 0%, ' + rgba('#ffffff', opacity) + ' 100%)';
  }
  const shadowText = function (s) { return s.color.toUpperCase() + ', ' + +(s.opacity / 100).toFixed(2); };
  function halfSwatch(color, opacity, cls) {
    return '<span class="pge__half ' + (cls || '') + '" style="--pge-color: ' + color + '; --pge-tint: ' + rgba(color, Math.max(opacity, 14)) + '"></span>';
  }
  // Подложка бабла тени (PropertyGrid 23716:135002): радиальный градиент цвета тени, непрозрачность 0.15
  function bubbleBg(color) {
    return '--pge-bubble: url(&quot;data:image/svg+xml;utf8,<svg viewBox=\'0 0 104 24\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'>' +
      '<rect width=\'100%\' height=\'100%\' fill=\'url(%23g)\' opacity=\'0.15\'/><defs><radialGradient id=\'g\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' ' +
      'gradientTransform=\'matrix(8.9589 5.8879 13.344 -3.9987 26 -3.6264)\'><stop stop-color=\'' + rgba(color, 0) + '\' offset=\'0\'/>' +
      '<stop stop-color=\'' + rgba(color) + '\' offset=\'1\'/></radialGradient></defs></svg>&quot;)';
  }
  const ico = function (g, s) { return '<span class="pge__ico' + (s ? ' pge__ico--s' : '') + '" aria-hidden="true">' + g + '</span>'; };
  const sameShadow = function (a, b) { return ['color', 'opacity', 'x', 'y', 'blur', 'spread'].every(function (k) { return a[k] === b[k]; }); };

  // ---------- Окна: общий стек, Esc и клик мимо ----------
  const pops = [];
  let listening = false;

  function place(layer, anchor, dx, dy, el) {
    const a = anchor.getBoundingClientRect();
    if (layer === document.body) {
      el.style.left = Math.round(a.left + window.scrollX + dx) + 'px';
      el.style.top = Math.round(a.top + window.scrollY + dy) + 'px';
      return;
    }
    if (getComputedStyle(layer).position === 'static') layer.style.position = 'relative';
    const r = layer.getBoundingClientRect();
    const scale = r.width / layer.offsetWidth || 1; // рамка демо масштабирует сцену
    el.style.left = Math.round((a.left - r.left) / scale + layer.scrollLeft + dx) + 'px';
    el.style.top = Math.round((a.top - r.top) / scale + layer.scrollTop + dy) + 'px';
  }

  // cfg: { layer, anchor, dx, dy, at: {left, top}, cls, label, owner, key, render(el), click(e), input(e), change(e), onCancel, onOutside }
  function openPop(cfg) {
    if (!listening) {
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onDocKey, true);
      listening = true;
    }
    const el = document.createElement('div');
    el.className = 'pge-pop ' + cfg.cls;
    el.setAttribute('role', cfg.role || 'dialog');
    if (cfg.label) el.setAttribute('aria-label', cfg.label);
    cfg.layer.appendChild(el);
    if (cfg.at) { el.style.left = cfg.at.left + 'px'; el.style.top = cfg.at.top + 'px'; } else place(cfg.layer, cfg.anchor, cfg.dx, cfg.dy, el);
    const pop = Object.assign({ el: el }, cfg);
    ['click', 'input', 'change'].forEach(function (type) { if (cfg[type]) el.addEventListener(type, cfg[type]); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.target.blur(); });
    pops.push(pop);
    if (cfg.render) cfg.render(el);
    return pop;
  }
  function closeTop(how) {
    const pop = pops.pop();
    if (!pop) return;
    pop.el.remove();
    const fn = how === 'cancel' ? pop.onCancel : how === 'outside' ? pop.onOutside : null;
    if (fn) fn();
  }
  function closePop(pop) { while (pops.length && pops.indexOf(pop) >= 0) closeTop(); }
  // Кнопка, открывшая окно, после перерисовки редактора — уже другой элемент: узнаём её по владельцу и ключу
  function isAnchor(pop, target) {
    if (!pop.owner || !pop.key) return pop.anchor && pop.anchor.contains(target);
    const btn = target.closest && target.closest('[data-do], [data-pop]');
    return !!btn && pop.owner.contains(btn) && (btn.dataset.do || btn.dataset.pop) === pop.key;
  }
  function onDocClick(e) {
    while (pops.length) {
      const top = pops[pops.length - 1];
      if (top.el.contains(e.target) || isAnchor(top, e.target)) return;
      closeTop('outside');
    }
  }
  function onDocKey(e) {
    if (e.key !== 'Escape' || !pops.length) return;
    e.preventDefault();
    e.stopPropagation();
    closeTop('cancel');
  }
  // Повторный клик по кнопке, открывшей окно, закрывает его
  function toggleOf(owner, key) {
    const top = pops[pops.length - 1];
    if (top && top.owner === owner && top.key === key) { closeTop('outside'); return true; }
    return false;
  }
  function layerOf(host, options) { return options.layer || host.closest('[data-pge-layer]') || document.body; }

  // Скрытый системный выбор цвета для «Другой цвет»
  let native = null;
  let nativeCb = null;
  function pickNative(value, cb) {
    if (!native) {
      native = document.createElement('input');
      native.type = 'color';
      native.className = 'pge-native';
      native.tabIndex = -1;
      native.setAttribute('aria-hidden', 'true');
      native.addEventListener('input', function () { if (nativeCb) nativeCb(native.value); });
      document.body.appendChild(native);
    }
    nativeCb = cb;
    native.value = value || '#000000';
    if (native.showPicker) native.showPicker(); else native.click();
  }

  // ---------- Окно цвета ----------
  // cfg: { anchor, layer, title, color, opacity, palette, default: {color, opacity}, background, owner, key, dx, dy, onApply(color, opacity) }
  // color: null — «нет цвета». Клик по цвету и ✓ применяют, ✕, Esc и клик мимо отменяют.
  function colorPicker(anchor, cfg) {
    const draft = { color: cfg.color == null ? null : cfg.color, opacity: cfg.opacity == null ? 100 : cfg.opacity };
    const def = cfg.default || { color: draft.color, opacity: draft.opacity };
    const palette = cfg.palette || PALETTES.text;
    const isBg = !!cfg.background;
    let pop;
    function apply() { closePop(pop); if (cfg.onApply) cfg.onApply(draft.color, draft.color ? draft.opacity : 0); }
    function render(el) {
      const on = !!draft.color;
      const atDefault = on && draft.color === def.color && draft.opacity === def.opacity;
      const current = on ? (isBg ? backgroundFill(draft.color, draft.opacity) : rgba(draft.color, draft.opacity)) : null;
      el.innerHTML = '<div class="pge-picker">' +
        '<header class="pge-picker__head"><span class="pge-picker__caption">' + esc(cfg.title || 'Цвет') + '</span>' +
        '<span class="pge-picker__mid">' + (isBg ? '<span class="pge-tumbler"><button type="button" class="pge-tumbler__item is-active" aria-pressed="true">Цвет</button>' +
          '<button type="button" class="pge-tumbler__item" aria-pressed="false" disabled>Картинка</button></span>' : '') + '</span>' +
        '<span class="pge-picker__cmds"><span class="pge-picker__tools">' +
        '<button type="button" class="pge-picker__tool" disabled aria-label="Пипетка">' + SVG.pipette + '</button>' +
        '<button type="button" class="pge-picker__tool' + (atDefault ? ' is-idle' : '') + '" data-pop="reset" aria-label="Сбросить цвет">' + ico(G.reset) + '</button></span>' +
        '<button type="button" class="pge__apply" data-pop="apply" aria-label="Применить">' + ico(G.check, true) + '</button></span>' +
        '<button type="button" class="pge-picker__close" data-pop="cancel" aria-label="Закрыть">' + SVG.close + '</button></header>' +
        '<div class="pge-picker__body"><div class="pge-picker__cloud pge-picker__code' + (on ? '' : ' is-none') + '">' +
        '<span class="pge-picker__current' + (on ? '' : ' is-none') + '"' + (on ? ' style="--pge-current: ' + current + '"' : '') + '></span>' +
        '<span class="pge-picker__fields"><span class="pge-ufield pge-ufield--format">HEX' + ico(G.format, true) + '</span>' +
        '<span class="pge-picker__alpha"><label class="pge-ufield pge-ufield--hex"><input data-pop="hex" value="' + (on ? draft.color.toUpperCase() : '') + '" placeholder=" " maxlength="7" spellcheck="false" aria-label="Код цвета">' +
        '<span class="pge-ufield__ph" aria-hidden="true">#<span>FFFFFF</span></span></label>' +
        '<label class="pge-ufield pge-ufield--alpha"><input class="pge-picker__alpha-in" data-pop="alpha" value="' + (on ? draft.opacity : 0) + '" inputmode="numeric" maxlength="3" aria-label="Непрозрачность, %"></label>' +
        '<span class="pge-picker__pct">%</span></span></span></div>' +
        '<div class="pge-picker__cloud pge-picker__cloud--colors"><div class="pge-palette">' +
        palette.map(function (c) {
          return c ? '<button type="button" class="pge-palette__item" style="--pge-color: ' + (isBg ? backgroundFill(c) : c) + '" data-color="' + c + '" aria-label="' + c + '"></button>'
            : '<button type="button" class="pge-palette__item is-none" data-color="" aria-label="Нет цвета">' + SVG.none + '</button>';
        }).join('') + '</div>' +
        '<div class="pge-picker__links"><div><button type="button" class="pge-picker__link" data-pop="native">Другой цвет</button>' +
        (isBg ? '<button type="button" class="pge-picker__link" disabled>Градиент</button><button type="button" class="pge-picker__link" disabled>Текстура</button>' : '') +
        '</div></div></div></div></div>';
    }
    pop = openPop({
      layer: cfg.layer || document.body, anchor: anchor, dx: cfg.dx == null ? -16 : cfg.dx, dy: cfg.dy == null ? -68 : cfg.dy,
      cls: 'pge-pop--color', label: cfg.title || 'Цвет', owner: cfg.owner, key: cfg.key, render: render,
      click: function (e) {
        const sw = e.target.closest('[data-color]');
        if (sw) { draft.color = sw.dataset.color || null; if (draft.color && !draft.opacity) draft.opacity = 100; apply(); return; }
        const act = e.target.closest('[data-pop]');
        if (!act) return;
        const k = act.dataset.pop;
        if (k === 'apply') apply();
        if (k === 'cancel') closePop(pop);
        if (k === 'reset') { draft.color = def.color; draft.opacity = def.opacity; render(pop.el); }
        if (k === 'native') pickNative(draft.color, function (v) { draft.color = v; if (!draft.opacity) draft.opacity = 100; render(pop.el); });
      },
      change: function (e) {
        const k = e.target.dataset.pop;
        if (k === 'hex') { const v = normHex(e.target.value); if (v) { draft.color = v; if (!draft.opacity) draft.opacity = 100; } }
        if (k === 'alpha') { const n = toInt(e.target.value); if (n !== null && draft.color) draft.opacity = clamp(n, 0, 100); }
        render(pop.el);
      }
    });
    return { close: function () { closePop(pop); } };
  }

  // ---------- Каркас редактора ----------
  function makeEditor(kind, host, options, spec) {
    options = options || {};
    const layer = layerOf(host, options);
    const start = clone(Object.assign({}, DEFAULTS[kind], options.value || {}));
    let value = clone(start);
    const ed = { kind: kind, host: host, layer: layer, options: options, start: start };
    let timer = 0;

    function render() { host.innerHTML = spec.render(value, ed); }
    function emit() { if (options.onChange) options.onChange(clone(value)); }
    // Перерисовка после ввода: откладываем, чтобы фокус успел перейти в следующее поле, и возвращаем его туда
    function later() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        const a = document.activeElement;
        const f = a && host.contains(a) ? a.dataset.f : null;
        render();
        const next = f && host.querySelector('[data-f="' + f + '"]');
        if (next) { next.focus(); next.select(); }
      });
    }
    ed.value = function () { return value; };
    ed.update = function (fn) { fn(value); emit(); render(); };
    ed.render = render;

    function onClick(e) {
      const btn = e.target.closest('[data-do]');
      if (!btn || !host.contains(btn)) return;
      const act = btn.dataset.do;
      if (act === 'clear') { if (options.onClear) options.onClear(); return; }
      if (act === 'split') {
        value.split = !value.split;
        if (!value.split) {
          if (kind === 'radius') value.tr = value.br = value.bl = value.tl;
          else if (kind === 'border') value.right = value.bottom = value.left = value.top;
          else { value.right = value.left; value.bottom = value.top; }
        }
        emit(); render(); return;
      }
      if (spec.actions && spec.actions[act]) spec.actions[act](btn, ed);
    }
    function onChange(e) {
      const f = e.target.dataset.f;
      if (!f) return;
      const n = toInt(e.target.value);
      if (n !== null) { spec.commit(value, f, clamp(n, spec.limits[0], spec.limits[1]), ed); emit(); }
      later();
    }
    function onKey(e) { if (e.key === 'Enter' && e.target.dataset.f) e.target.blur(); }

    host.classList.add('pge', 'pge--' + kind);
    host.addEventListener('click', onClick);
    host.addEventListener('change', onChange);
    host.addEventListener('keydown', onKey);
    render();

    return {
      get: function () { return clone(value); },
      set: function (v) { value = clone(Object.assign({}, DEFAULTS[kind], v || {})); render(); },
      destroy: function () {
        clearTimeout(timer);
        pops.slice().reverse().forEach(function (p) { if (p.owner === host) closePop(p); });
        host.removeEventListener('click', onClick);
        host.removeEventListener('change', onChange);
        host.removeEventListener('keydown', onKey);
        host.classList.remove('pge', 'pge--' + kind);
        host.innerHTML = '';
      }
    };
  }

  // ---------- Части разметки ----------
  const input = function (f, v, cls, label) {
    return '<input class="pge__in ' + (cls || '') + '" data-f="' + f + '" value="' + v + '" inputmode="numeric" maxlength="4" aria-label="' + esc(label) + '">';
  };
  const numField = function (f, v, label, icon, small) {
    return '<label class="pge__num' + (small ? ' pge__num--s' : '') + '">' + (icon || '') + input(f, v, '', label) + '</label>';
  };
  function sideBox(v, label) {
    return '<span class="pge__box">' + SIDES.map(function (k) {
      return input(k, v[k], 'pge__in--' + k, label + ': ' + SIDE_LABELS[k]) + '<i class="pge__bar pge__bar--' + k + '"></i>';
    }).join('') + '</span>';
  }
  function cornerBox(v, label) {
    return '<span class="pge__box pge__box--corners">' + CORNERS.map(function (k) {
      return input(k, v[k], 'pge__in--' + k, label + ' ' + SIDE_LABELS[k]) + SVG.corner(k);
    }).join('') + '</span>';
  }
  const switchBtn = function (on, glyph, label) {
    return '<button type="button" class="pge__switch' + (on ? ' is-active' : '') + '" data-do="split" aria-pressed="' + on + '" aria-label="' + esc(label) + '">' + ico(glyph, true) + '</button>';
  };
  const clearBtn = function (ed, label) {
    return ed.options.onClear ? '<button type="button" class="pge__x" data-do="clear" aria-label="' + esc(label) + ': убрать">' + ico(G.close, true) + '</button>' : '';
  };
  const swatch = function (color, opacity, label, bg) {
    return color
      ? '<button type="button" class="pge__swatch" data-do="color" style="--pge-color: ' + (bg ? backgroundFill(color, opacity) : rgba(color, opacity)) + '" aria-label="' + esc(label) + ': изменить цвет"></button>'
      : '<button type="button" class="pge__swatch is-none" data-do="color" aria-label="' + esc(label) + ': выбрать цвет"></button>';
  };
  function setSides(v, keys, f, n) {
    const map = { all: keys, h: ['left', 'right'], v: ['top', 'bottom'] };
    (map[f] || [f]).forEach(function (k) { v[k] = n; });
  }

  // ---------- Скругления: одно значение или по углам ----------
  function radius(host, options) {
    options = options || {};
    return makeEditor('radius', host, options, {
      limits: [0, options.max == null ? 100 : options.max],
      render: function (v, ed) {
        const label = ed.options.label || 'Скругления';
        return (v.split ? cornerBox(v, 'Скругление') : numField('all', v.tl, label, SVG.radius)) +
          '<span class="pge__end">' + switchBtn(v.split, G.corners, label + ' по углам') + clearBtn(ed, label) + '</span>';
      },
      commit: function (v, f, n) { setSides(v, CORNERS, f, n); }
    });
  }

  // ---------- Отступы: по горизонтали и вертикали или по сторонам ----------
  function padding(host, options) {
    options = options || {};
    return makeEditor('padding', host, options, {
      limits: [0, options.max == null ? 100 : options.max],
      render: function (v, ed) {
        const label = ed.options.label || 'Отступы';
        return (v.split ? sideBox(v, label) : '<span class="pge__pads">' +
          numField('h', v.left, label + ' по горизонтали', SVG.padH) + numField('v', v.top, label + ' по вертикали', SVG.padV) + '</span>') +
          '<span class="pge__end">' + switchBtn(v.split, G.sides, label + ' по сторонам') + clearBtn(ed, label) + '</span>';
      },
      commit: function (v, f, n) { setSides(v, SIDES, f, n); }
    });
  }

  // ---------- Границы: цвет, тип линии, толщина общая или по сторонам ----------
  function border(host, options) {
    options = options || {};
    return makeEditor('border', host, options, {
      limits: [0, options.max == null ? 20 : options.max],
      render: function (v, ed) {
        const label = ed.options.label || 'Границы';
        return swatch(v.color, v.opacity, label) +
          '<button type="button" class="pge__line-btn" data-do="line" aria-haspopup="menu" aria-label="Тип линии"><span class="pge__line' + (v.style === 'dashed' ? ' pge__line--dashed' : '') + '"></span></button>' +
          '<span class="pge__group">' + (v.split ? sideBox(v, 'Граница') : numField('all', v.top, 'Толщина границы', '', true)) + clearBtn(ed, label) + '</span>' +
          '<span class="pge__end">' + switchBtn(v.split, G.sides, label + ' по сторонам') + '</span>';
      },
      commit: function (v, f, n) { setSides(v, SIDES, f, n); },
      actions: {
        color: function (btn, ed) {
          if (toggleOf(host, 'color')) return;
          const v = ed.value();
          colorPicker(btn, {
            layer: ed.layer, owner: host, key: 'color', title: ed.options.label || 'Границы',
            color: v.color, opacity: v.opacity, palette: ed.options.palette || PALETTES.border,
            default: { color: ed.start.color, opacity: ed.start.opacity },
            onApply: function (c, o) { ed.update(function (m) { m.color = c; m.opacity = o; }); }
          });
        },
        line: function (btn, ed) {
          if (toggleOf(host, 'line')) return;
          const v = ed.value();
          const item = function (style, label) {
            return '<button type="button" role="menuitemradio" aria-checked="' + (v.style === style) + '" data-style="' + style + '" aria-label="' + label + '"><span class="pge__line' + (style === 'dashed' ? ' pge__line--dashed' : '') + '"></span></button>';
          };
          const pop = openPop({
            layer: ed.layer, anchor: btn, dx: -12, dy: 28, cls: 'pge-pop--line', role: 'menu', label: 'Тип линии', owner: host, key: 'line',
            render: function (el) { el.innerHTML = item('solid', 'Сплошная') + item('dashed', 'Пунктир'); },
            click: function (e) {
              const b = e.target.closest('[data-style]');
              if (!b) return;
              closePop(pop);
              ed.update(function (m) { m.style = b.dataset.style; });
            }
          });
        }
      }
    });
  }

  // ---------- Фон: кружок и окно цвета ----------
  function background(host, options) {
    options = options || {};
    return makeEditor('background', host, options, {
      limits: [0, 0],
      render: function (v, ed) { return swatch(v.color, v.opacity, ed.options.label || 'Фон', true) + clearBtn(ed, ed.options.label || 'Фон'); },
      commit: function () {},
      actions: {
        color: function (btn, ed) {
          if (toggleOf(host, 'color')) return;
          const v = ed.value();
          colorPicker(btn, {
            layer: ed.layer, owner: host, key: 'color', title: ed.options.label || 'Фон', background: true, dx: -19,
            color: v.color, opacity: v.opacity, palette: ed.options.palette || PALETTES.background,
            default: ed.options.default || { color: ed.start.color, opacity: ed.start.opacity },
            onApply: function (c, o) { ed.update(function (m) { m.color = c; m.opacity = o; }); }
          });
        }
      }
    });
  }

  // ---------- Тень: бабл → окно цвета тени → окно «Тень» ----------
  // Правки видны сразу; ✓ и клик мимо сохраняют, ✕ и Esc возвращают прежнее.
  function shadow(host, options) {
    options = options || {};
    let api;
    function def(ed) { return Object.assign({}, DEFAULTS.shadow, ed.options.default || ed.start); }
    function revert(ed, before) { ed.update(function (m) { Object.assign(m, before); }); }

    function openPalette(btn, ed, before, at) {
      const pop = openPop({
        layer: ed.layer, anchor: btn, dx: -16, dy: -68, at: at, cls: 'pge-pop--color', label: 'Тень', owner: host, key: 'palette',
        render: paint,
        onCancel: function () { revert(ed, before); },
        click: function (e) {
          const preset = e.target.closest('[data-preset]');
          if (preset) {
            const p = SHADOW_PRESETS[+preset.dataset.preset];
            closePop(pop);
            ed.update(function (m) { m.color = p.color; m.opacity = p.opacity; });
            return;
          }
          const act = e.target.closest('[data-pop]');
          if (!act) return;
          const k = act.dataset.pop;
          if (k === 'apply') closePop(pop);
          if (k === 'cancel') closeTop('cancel');
          if (k === 'reset') { ed.update(function (m) { Object.assign(m, def(ed)); }); paint(pop.el); }
          if (k === 'native') pickNative(ed.value().color, function (c) { ed.update(function (m) { m.color = c; }); paint(pop.el); });
          if (k === 'editor') {
            const at2 = { left: parseInt(pop.el.style.left, 10) + 30, top: parseInt(pop.el.style.top, 10) + 6 };
            closePop(pop);
            openWindow(ed, before, at2);
          }
        },
        change: function (e) {
          const k = e.target.dataset.pop;
          if (k === 'hex') { const c = normHex(e.target.value); if (c) ed.update(function (m) { m.color = c; }); }
          if (k === 'alpha') { const n = toInt(e.target.value); if (n !== null) ed.update(function (m) { m.opacity = clamp(n, 0, 100); }); }
          paint(pop.el);
        }
      });
      function paint(el) {
        const s = ed.value();
        el.innerHTML = '<div class="pge-picker"><header class="pge-picker__head"><span class="pge-picker__caption">Тень</span><span class="pge-picker__mid"></span>' +
          '<span class="pge-picker__cmds"><span class="pge-picker__tools">' +
          '<button type="button" class="pge-picker__tool" disabled aria-label="Пипетка">' + SVG.pipette + '</button>' +
          '<button type="button" class="pge-picker__tool' + (sameShadow(s, def(ed)) ? ' is-idle' : '') + '" data-pop="reset" aria-label="Сбросить тень">' + ico(G.reset) + '</button></span>' +
          '<button type="button" class="pge__apply" data-pop="apply" aria-label="Применить">' + ico(G.check, true) + '</button></span>' +
          '<button type="button" class="pge-picker__close" data-pop="cancel" aria-label="Закрыть">' + SVG.close + '</button></header>' +
          '<div class="pge-picker__body"><div class="pge-picker__cloud pge-picker__code">' +
          '<span class="pge-picker__current" style="--pge-current: ' + rgba(s.color, s.opacity) + '"></span>' +
          '<span class="pge-picker__fields"><span class="pge-ufield pge-ufield--format">HEX' + ico(G.format, true) + '</span>' +
          '<span class="pge-picker__alpha"><label class="pge-ufield pge-ufield--hex"><input data-pop="hex" value="' + s.color.toUpperCase() + '" maxlength="7" spellcheck="false" aria-label="Цвет тени"></label>' +
          '<label class="pge-ufield pge-ufield--alpha"><input data-pop="alpha" value="' + s.opacity + '" inputmode="numeric" maxlength="3" aria-label="Непрозрачность тени, %"></label>' +
          '<span class="pge-picker__pct">%</span></span></span></div>' +
          '<div class="pge-picker__cloud pge-picker__cloud--colors"><div class="pge-palette">' +
          SHADOW_PRESETS.map(function (p, i) {
            return '<button type="button" class="pge-palette__shadow" data-preset="' + i + '" aria-label="' + p.color + ', ' + p.opacity / 100 + '">' + halfSwatch(p.color, p.opacity, 'pge__half--l') + '</button>';
          }).join('') +
          '<button type="button" class="pge-palette__add" data-pop="editor" aria-label="Параметры тени">' + ico(G.plus, true) + '</button></div>' +
          '<div class="pge-picker__links"><div><button type="button" class="pge-picker__link" data-pop="native">Другой цвет</button>' +
          '<button type="button" class="pge-picker__link" data-pop="editor">Параметры тени</button></div></div></div></div></div>';
      }
    }

    function openWindow(ed, before, at) {
      const pop = openPop({
        layer: ed.layer, at: at, cls: 'pge-pop--shadow', label: 'Тень', owner: host, key: 'palette',
        render: paint,
        onCancel: function () { revert(ed, before); },
        click: function (e) {
          const act = e.target.closest('[data-pop]');
          if (!act) return;
          const k = act.dataset.pop;
          if (k === 'apply') closePop(pop);
          if (k === 'cancel') closeTop('cancel');
          if (k === 'reset') { ed.update(function (m) { Object.assign(m, def(ed)); }); paint(pop.el); }
          if (k === 'color') {
            if (toggleOf(pop.el, 'color')) return;
            const s = ed.value();
            colorPicker(act, {
              layer: ed.layer, owner: pop.el, key: 'color', title: 'Цвет', color: s.color, opacity: s.opacity, palette: PALETTES.shadow,
              default: { color: def(ed).color, opacity: def(ed).opacity },
              onApply: function (c, o) { if (!c) return; ed.update(function (m) { m.color = c; m.opacity = o; }); paint(pop.el); }
            });
          }
        },
        // Ползунок: тень меняется во время перетаскивания, окно не перерисовывается
        input: function (e) {
          const k = e.target.dataset.range;
          if (!k) return;
          ed.update(function (m) { m[k] = +e.target.value; });
          sync(k);
        },
        change: function (e) {
          const k = e.target.dataset.field;
          if (k) {
            const n = toInt(e.target.value);
            if (n !== null) ed.update(function (m) { m[k] = clamp(n, SHADOW_RANGES[k][0], SHADOW_RANGES[k][1]); });
            sync(k);
          }
        }
      });
      function sync(k) {
        const s = ed.value();
        const r = SHADOW_RANGES[k];
        const range = pop.el.querySelector('[data-range="' + k + '"]');
        range.value = s[k];
        range.style.setProperty('--p', ((s[k] - r[0]) / (r[1] - r[0])) * 100 + '%');
        pop.el.querySelector('[data-field="' + k + '"]').value = s[k];
        pop.el.querySelector('[data-pop="reset"]').classList.toggle('is-idle', sameShadow(s, def(ed)));
      }
      function paint(el) {
        const s = ed.value();
        el.innerHTML = '<div class="pge-shadow"><header class="pge-shadow__head"><span class="pge-shadow__title">Тень</span><span class="pge-shadow__cmds">' +
          '<button type="button" class="pge-shadow__cmd' + (sameShadow(s, def(ed)) ? ' is-idle' : '') + '" data-pop="reset" aria-label="Сбросить тень">' + ico(G.reset) + '</button>' +
          '<button type="button" class="pge__apply" data-pop="apply" aria-label="Применить">' + ico(G.check, true) + '</button>' +
          '<button type="button" class="pge-shadow__cmd" data-pop="cancel" aria-label="Закрыть">' + ico(G.close) + '</button></span></header>' +
          '<div class="pge-shadow__body"><div class="pge-shadow__cloud">' +
          '<div class="pge-shadow__row"><span class="pge-label">Цвет</span><button type="button" class="pge__bubble" style="' + bubbleBg(s.color) + '" data-pop="color" aria-label="Цвет тени">' +
          halfSwatch(s.color, s.opacity) + shadowText(s) + '</button></div>' +
          SHADOW_ROWS.map(function (row) {
            const k = row[0];
            const r = SHADOW_RANGES[k];
            return '<div class="pge-shadow__row"><span class="pge-label">' + row[1] + '</span><span class="pge-shadow__slider">' +
              '<input type="range" data-range="' + k + '" min="' + r[0] + '" max="' + r[1] + '" value="' + s[k] + '" style="--p: ' + ((s[k] - r[0]) / (r[1] - r[0])) * 100 + '%" aria-label="' + row[1] + '">' +
              '<label class="pge__num pge__num--s"><input data-field="' + k + '" value="' + s[k] + '" inputmode="numeric" maxlength="4" aria-label="' + row[1] + '"></label></span></div>';
          }).join('') + '</div></div></div>';
      }
    }

    api = makeEditor('shadow', host, options, {
      limits: [0, 0],
      render: function (v, ed) {
        return '<button type="button" class="pge__bubble" style="' + bubbleBg(v.color) + '" data-do="palette" aria-label="Тень: выбрать">' + halfSwatch(v.color, v.opacity) + shadowText(v) + '</button>' +
          clearBtn(ed, ed.options.label || 'Тень');
      },
      commit: function () {},
      actions: {
        palette: function (btn, ed) {
          if (toggleOf(host, 'palette')) return;
          openPalette(btn, ed, clone(ed.value()));
        }
      }
    });
    return api;
  }

  // ---------- Размер: ширина и высота с меню величин, Min/Max своей оси (PropertyGrid 23509:285817) ----------
  const SIZE_MODES = { px: 'фиксированная (px)', pct: 'относительная (%)', auto: 'по контенту (auto)', fill: 'заполнить' };
  const SIZE_UNITS = { px: 'px', pct: '%', auto: 'по контенту', fill: 'заполнить' };
  const EDGES = [['minW', 'Min ширина', 'Min ширину'], ['maxW', 'Max ширина', 'Max ширину'], ['minH', 'Min высота', 'Min высоту'], ['maxH', 'Max высота', 'Max высоту']];
  const SIZE_LIMIT = [40, 2000];
  function bullet(on) {
    return on ? '<svg class="pge-menu__bullet" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="3" fill="currentColor"/></svg>'
      : '<svg class="pge-menu__bullet is-off" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="3.5" fill="var(--background-background-color)" stroke="currentColor"/></svg>';
  }
  const MENU_CLOSE = '<button type="button" class="pge-menu__close" data-pop="close" aria-label="Закрыть">' + SVG.close.replace('viewBox="0 0 28 28"', 'viewBox="8 8 12 12"') + '</button>';

  function size(host, options) {
    options = options || {};
    function actual(ed, axis) {
      const f = ed.options.actual;
      const n = f ? Math.round(Number(f(axis))) : NaN;
      return Number.isFinite(n) ? n : null;
    }
    function openUnit(btn, ed, axis) {
      if (toggleOf(host, 'unit-' + axis)) return;
      const v = ed.value();
      const cur = v[axis].mode;
      // только своя ось: у ширины — Min/Max ширину, у высоты — Min/Max высоту
      const free = EDGES.filter(function (e) { return e[0].slice(-1) === axis.toUpperCase() && v[e[0]] == null; });
      const pop = openPop({
        layer: ed.layer, anchor: btn, dx: -30, dy: -16, cls: 'pge-pop--menu', role: 'menu', label: 'Величина', owner: host, key: 'unit-' + axis,
        render: function (el) {
          el.innerHTML = Object.keys(SIZE_MODES).map(function (m) {
            return '<button type="button" class="pge-menu__item" role="menuitemradio" aria-checked="' + (cur === m) + '" data-mode="' + m + '">' + bullet(cur === m) + SIZE_MODES[m] + '</button>';
          }).join('') +
            (free.length ? '<div class="pge-menu__group">Добавить</div>' + free.map(function (e) {
              return '<button type="button" class="pge-menu__item pge-menu__item--edge" data-edge="' + e[0] + '">' + e[2] + '</button>';
            }).join('') : '') + MENU_CLOSE;
        },
        click: function (e) {
          const b = e.target.closest('[data-mode], [data-edge], [data-pop]');
          if (!b) return;
          closePop(pop);
          if (b.dataset.mode) {
            ed.update(function (m) {
              // в фиксированный режим — с текущим фактическим размером
              if (b.dataset.mode === 'px' && m[axis].mode !== 'px') {
                const a = actual(ed, axis);
                if (a !== null) m[axis].px = clamp(a, SIZE_LIMIT[0], SIZE_LIMIT[1]);
              }
              m[axis].mode = b.dataset.mode;
            });
          }
          if (b.dataset.edge) {
            ed.update(function (m) {
              const a = actual(ed, axis);
              m[b.dataset.edge] = clamp(a === null ? m[axis].px : a, SIZE_LIMIT[0], SIZE_LIMIT[1]);
            });
          }
        }
      });
    }
    const actions = {
      'unit-w': function (btn, ed) { openUnit(btn, ed, 'w'); },
      'unit-h': function (btn, ed) { openUnit(btn, ed, 'h'); }
    };
    EDGES.forEach(function (e) { actions['edge-' + e[0]] = function (btn, ed) { ed.update(function (m) { m[e[0]] = null; }); }; });

    return makeEditor('size', host, options, {
      limits: [-1e6, 1e6],
      render: function (v, ed) {
        function field(k, label) {
          const a = v[k];
          const fixed = a.mode === 'px' || a.mode === 'pct';
          const val = a.mode === 'px' ? a.px : a.mode === 'pct' ? a.pct : '';
          const ph = fixed ? null : actual(ed, k); // в «по контенту» и «заполнить» — серая подсказка с фактическим размером
          return '<span class="pge-label">' + label + '</span><label class="pge__dim">' +
            '<input data-f="' + k + '" value="' + val + '" placeholder="' + (ph === null ? '' : ph) + '" inputmode="numeric" maxlength="4" aria-label="' + label + '">' +
            '<button type="button" class="pge__unit" data-do="unit-' + k + '" aria-haspopup="menu">' + SIZE_UNITS[a.mode] + '</button></label>';
        }
        const edges = EDGES.filter(function (e) { return v[e[0]] != null; }).map(function (e) {
          return '<span class="pge-label">' + e[1] + '</span><span class="pge__edge"><label class="pge__dim">' +
            '<input data-f="' + e[0] + '" value="' + v[e[0]] + '" inputmode="numeric" maxlength="4" aria-label="' + e[1] + ', px"><span class="pge__unit">px</span></label>' +
            '<button type="button" class="pge__x" data-do="edge-' + e[0] + '" aria-label="' + e[1] + ': убрать">' + ico(G.close, true) + '</button></span>';
        }).join('');
        return '<div class="pge-size">' + field('w', 'Ширина') + field('h', 'Высота') + edges + '</div>';
      },
      // w, h — значение в текущей единице: в «по контенту» и «заполнить» ввод числа делает ось фиксированной; Min/Max — в px
      commit: function (v, f, n) {
        if (f === 'w' || f === 'h') {
          const a = v[f];
          if (a.mode === 'pct') a.pct = clamp(n, 1, 100);
          else { a.mode = 'px'; a.px = clamp(n, SIZE_LIMIT[0], SIZE_LIMIT[1]); }
          return;
        }
        v[f] = clamp(n, SIZE_LIMIT[0], SIZE_LIMIT[1]);
      },
      actions: actions
    });
  }

  // CSS-значения для применения к макету
  const axisCss = function (a) { return a.mode === 'px' ? a.px + 'px' : a.mode === 'pct' ? a.pct + '%' : a.mode === 'fill' ? '100%' : 'fit-content'; };
  const css = {
    size: function (v) {
      const px = function (n) { return n == null ? '' : n + 'px'; };
      return { width: axisCss(v.w), height: axisCss(v.h), minWidth: px(v.minW), maxWidth: px(v.maxW), minHeight: px(v.minH), maxHeight: px(v.maxH) };
    },
    radius: function (v) { return v.tl + 'px ' + v.tr + 'px ' + v.br + 'px ' + v.bl + 'px'; },
    padding: function (v) { return v.top + 'px ' + v.right + 'px ' + v.bottom + 'px ' + v.left + 'px'; },
    border: function (v) { return v.color ? { borderStyle: v.style, borderColor: rgba(v.color, v.opacity), borderWidth: v.top + 'px ' + v.right + 'px ' + v.bottom + 'px ' + v.left + 'px' } : { borderStyle: 'none' }; },
    shadow: function (v) { return v.x + 'px ' + v.y + 'px ' + v.blur + 'px ' + v.spread + 'px ' + rgba(v.color, v.opacity); },
    background: function (v) { return backgroundFill(v.color, v.opacity); },
    rgba: rgba
  };

  window.PGEditors = {
    size: size, radius: radius, padding: padding, border: border, background: background, shadow: shadow,
    color: function (anchor, cfg) { return colorPicker(anchor, Object.assign({ layer: (cfg && cfg.layer) || anchor.closest('[data-pge-layer]') || document.body }, cfg)); },
    css: css, palettes: PALETTES, defaults: DEFAULTS
  };
})();
