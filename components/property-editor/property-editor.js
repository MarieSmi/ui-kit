/*!
 * property-editor — поведение окна редактора свойств. Логика взята из прототипа widget-settings-demo, вид — из макета:
 * чипсы и крестики показывают и убирают строки, название правится на месте, меню величин и Min/Max, меню типа линии,
 * раскрытие скруглений и границ, окно выбора цвета, окно тени, сброс. Без зависимостей, CSS компонента подключается отдельно.
 * https://github.com/MarieSmi/ui-kit/tree/main/components/property-editor
 *
 * Разметка: см. раздел «Поведение» в README. Состояние хранится в объекте, разметка всегда пересчитывается из него.
 */
(function () {
  'use strict';

  const SIZE_MODES = { px: 'фиксированная (px)', pct: 'относительная (%)', auto: 'По контенту (auto)', fill: 'заполнить' };
  const SIZE_UNITS = { px: 'px', pct: '%', auto: 'по контенту', fill: 'заполнить' };
  const EDGE_ITEMS = { minW: 'Min ширину', maxW: 'Max ширину', minH: 'Min высоту', maxH: 'Max высоту' };
  const EDGE_LABELS = { minW: 'Min ширина', maxW: 'Max ширина', minH: 'Min высота', maxH: 'Max высота' };
  const SIDES = { corners: ['tl', 'tr', 'bl', 'br'], sides: ['top', 'right', 'bottom', 'left'] };
  const SIDE_LABELS = { tl: 'сверху слева', tr: 'сверху справа', bl: 'снизу слева', br: 'снизу справа', top: 'сверху', right: 'справа', bottom: 'снизу', left: 'слева' };
  const SHADOW_RANGES = { x: [-50, 50], y: [-50, 50], blur: [0, 100], spread: [-50, 50] };
  const SHADOW_ROWS = [['x', 'X'], ['y', 'Y'], ['blur', 'Блюр'], ['spread', 'Размах']];
  // Палитра окна «Выбор цвета» из макета; градиенты в кит не входят, поэтому их кружки выключены
  const PALETTE = ['#00639c', '#ff1756', null, '#fd9a71', '#5191dc', '#e0564c', '#943253', '#4c3294', '#943288', '#fbbc4b',
    '#e5cb45', '#009918', '#29b5cf', '#326194', '#999999', '#ffe5e3', '#ffe3ec', '#eae3ff', '#ffe3fa', '#fff1e3',
    '#fffbe3', '#e3ffe8', '#e3faff', '#e3f1ff', '#ededed'];
  const GRADIENTS = ['180deg, #00639c 40%, #b9d4e3 60%', '45deg, #00639c 50%, #b9d4e3 50%', '90deg, #b9d4e3 50%, #00639c 50%', '135deg, #b9d4e3 50%, #00639c 50%'];
  const RADIALS = ['#00639c 25%, #b9d4e3 45%', '#00639c, #b9d4e3'];

  const clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  const clamp = function (n, min, max) { return Math.min(max, Math.max(min, n)); };
  const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  const toInt = function (raw) { const t = String(raw).trim(); const n = Math.round(Number(t)); return t === '' || !Number.isFinite(n) ? null : n; };
  const normHex = function (raw) {
    let v = String(raw).trim().replace(/^#?/, '#').toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(v)) v = '#' + v.slice(1).split('').map(function (c) { return c + c; }).join('');
    return /^#[0-9a-f]{6}$/.test(v) ? v : null;
  };

  function mount(root, options) {
    const opts = options || {};
    const q = function (s) { return root.querySelector(s); };
    const qa = function (s) { return Array.from(root.querySelectorAll(s)); };

    const rows = qa('[data-pe-row]');
    const chips = qa('[data-pe-chip]');
    const chipBoxes = qa('.pe__chips');
    const cards = Array.from(new Set(rows.map(function (r) { return r.closest('.pe__card'); }).filter(Boolean)));
    const input = q('.pe__name-input');
    const mark = q('.pe__mark');
    const hintText = q('.pe__hint-text');
    const sizeBox = q('.pe__size');
    const dimEls = qa('[data-pe-dim]');
    const lineBtn = q('.pe__row .pe__line');
    const colorEls = qa('[data-pe-color]');
    const shadowEl = q('[data-pe-shadow]');
    const switches = qa('[data-pe-split]');

    const rowOf = function (key) { return rows.find(function (r) { return r.dataset.peRow === key; }); };
    const defaultName = input ? (input.dataset.peDefault || input.value) : '';
    if (input && !input.placeholder) input.placeholder = defaultName;
    if (hintText) hintText.textContent = defaultName;

    // ---------- Исходное состояние — из разметки ----------
    const start = { name: input ? input.value : '', rows: {}, dims: {}, edges: {}, line: 'solid', split: {}, colors: {}, shadow: null };
    rows.forEach(function (r) { start.rows[r.dataset.peRow] = !r.hidden; });
    dimEls.forEach(function (el) {
      const axis = el.dataset.peDim;
      const val = toInt(el.querySelector('.pe__dim-value').value);
      const mode = el.dataset.peMode || (el.classList.contains('pe__dim--auto') ? 'auto' : 'px');
      start.dims[axis] = { mode: mode, px: val === null ? 100 : val, pct: mode === 'pct' && val !== null ? val : 100 };
    });
    if (lineBtn && lineBtn.classList.contains('pe__line--dashed')) start.line = 'dashed';
    switches.forEach(function (sw) {
      const row = sw.closest('[data-pe-row]');
      const base = toInt(row.querySelector('.pe__num-value').value);
      const values = {};
      SIDES[sw.dataset.peSplit].forEach(function (k) { values[k] = base === null ? 0 : base; });
      start.split[row.dataset.peRow] = { on: false, values: values };
    });
    colorEls.forEach(function (el) {
      start.colors[el.closest('[data-pe-row]').dataset.peRow] = el.dataset.peColor;
    });
    if (shadowEl) {
      const d = shadowEl.dataset;
      start.shadow = { color: d.peShadow, opacity: +(d.peOpacity || 14), x: +(d.peX || 0), y: +(d.peY || 0), blur: +(d.peBlur || 8), spread: +(d.peSpread || 0) };
    }

    let model = clone(start);

    function getState() {
      const state = clone(model);
      if (input) state.name = input.value;
      return state;
    }

    // ---------- Разметка из состояния ----------
    function paintBubble(el, color, text) {
      el.style.setProperty('--pe-color', color);
      const t = el.querySelector('.pe__bubble-text');
      if (t) t.textContent = text;
    }

    function dimAxisLabel(axis) { return axis === 'w' ? 'ширина' : 'высота'; }

    function renderDims() {
      dimEls.forEach(function (el) {
        const a = model.dims[el.dataset.peDim];
        const fixed = a.mode === 'px' || a.mode === 'pct';
        const value = el.querySelector('.pe__dim-value');
        el.classList.toggle('pe__dim--auto', !fixed);
        value.value = fixed ? (a.mode === 'px' ? a.px : a.pct) : '';
        value.placeholder = fixed ? '' : actualOf(el.dataset.peDim);
        const unit = el.querySelector('.pe__dim-unit');
        unit.textContent = SIZE_UNITS[a.mode];
        unit.setAttribute('aria-haspopup', 'menu');
      });
      if (!sizeBox) return;
      Array.from(sizeBox.querySelectorAll('[data-pe-edge-part]')).forEach(function (n) { n.remove(); });
      Object.keys(EDGE_ITEMS).forEach(function (k) {
        if (model.edges[k] == null) return;
        sizeBox.insertAdjacentHTML('beforeend',
          '<span class="pe__label" data-pe-edge-part>' + EDGE_LABELS[k] + '</span>' +
          '<label class="pe__dim" data-pe-edge-part><input class="pe__dim-value" data-pe-edge="' + k + '" value="' + model.edges[k] + '" inputmode="numeric" maxlength="4" aria-label="' + EDGE_LABELS[k] + ', px"><span class="pe__dim-unit">px</span></label>' +
          '<button type="button" class="pe__x" data-pe-edge-part data-pe-edge-clear="' + k + '" aria-label="' + EDGE_LABELS[k] + ': убрать">&#xe66c;</button>');
      });
    }

    function renderSplit(sw) {
      const row = sw.closest('[data-pe-row]');
      const key = row.dataset.peRow;
      const kind = sw.dataset.peSplit;
      const s = model.split[key];
      const single = row.querySelector('.pe__num');
      let box = row.querySelector('.pe__box');
      sw.classList.toggle('is-active', s.on);
      sw.setAttribute('aria-pressed', s.on);
      single.hidden = s.on;
      single.querySelector('.pe__num-value').value = s.values[SIDES[kind][0]];
      if (!box) {
        const label = row.querySelector('.pe__label').textContent;
        box = document.createElement('span');
        box.className = 'pe__box pe__box--' + kind;
        box.innerHTML = SIDES[kind].map(function (k) {
          return '<input class="pe__box-input pe__box-input--' + k + '" data-pe-side="' + k + '" inputmode="numeric" maxlength="3" aria-label="' + esc(label) + ' ' + SIDE_LABELS[k] + '">' +
            '<i class="pe__box-mark pe__box-mark--' + k + '"></i>';
        }).join('');
        single.after(box);
      }
      box.hidden = !s.on;
      SIDES[kind].forEach(function (k) { box.querySelector('[data-pe-side="' + k + '"]').value = s.values[k]; });
    }

    function render() {
      rows.forEach(function (r) { r.hidden = !model.rows[r.dataset.peRow]; });
      chips.forEach(function (c) { const r = rowOf(c.dataset.peChip); if (r) c.hidden = !r.hidden; });
      chipBoxes.forEach(function (b) { b.hidden = !Array.from(b.children).some(function (c) { return !c.hidden; }); });
      cards.forEach(function (card) {
        card.hidden = !Array.from(card.querySelectorAll('[data-pe-row]')).some(function (r) { return !r.hidden; });
      });
      if (mark) mark.hidden = !input || !input.value || input.value === defaultName;
      renderDims();
      if (lineBtn) lineBtn.classList.toggle('pe__line--dashed', model.line === 'dashed');
      switches.forEach(renderSplit);
      colorEls.forEach(function (el) {
        const color = model.colors[el.closest('[data-pe-row]').dataset.peRow];
        paintBubble(el, color, color.toUpperCase());
      });
      if (shadowEl) {
        paintBubble(shadowEl, model.shadow.color, model.shadow.color.toUpperCase());
        shadowEl.style.setProperty('--pe-alpha', Math.max(model.shadow.opacity, 14) + '%');
      }
    }

    function changed() {
      render();
      if (opts.onChange) opts.onChange(getState());
    }

    function actualOf(axis) {
      if (opts.actualSize) return opts.actualSize(axis);
      return model.dims[axis] ? model.dims[axis].px : 100;
    }

    // ---------- Всплывающие окна: стопка, закрытие кликом мимо и Esc ----------
    const pops = [];

    function openPop(html, anchor, dx, dy, handlers) {
      const a = anchor.getBoundingClientRect();
      const r = root.getBoundingClientRect();
      const scale = r.width / root.offsetWidth || 1; // рамка демо масштабирует сцену
      const holder = document.createElement('div');
      holder.innerHTML = html;
      const el = holder.firstElementChild;
      el.style.left = Math.round((a.left - r.left) / scale + dx) + 'px';
      el.style.top = Math.round((a.top - r.top) / scale + dy) + 'px';
      root.appendChild(el);
      const pop = { el: el, anchor: anchor, onCancel: handlers.onCancel, onOutside: handlers.onOutside };
      ['click', 'input', 'change', 'keydown'].forEach(function (type) {
        el.addEventListener(type, function (e) {
          e.stopPropagation();
          if (handlers[type]) handlers[type](e);
        });
      });
      pops.push(pop);
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

    function onDocClick(e) {
      while (pops.length) {
        const top = pops[pops.length - 1];
        if (top.el.contains(e.target) || top.anchor.contains(e.target)) return;
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
    function toggleOf(anchor) {
      const top = pops[pops.length - 1];
      if (top && top.anchor === anchor) { closeTop('outside'); return true; }
      return false;
    }

    // ---------- Меню величин ----------
    function openSizeMenu(unit) {
      if (toggleOf(unit)) return;
      const axis = unit.closest('[data-pe-dim]').dataset.peDim;
      const cur = model.dims[axis].mode;
      const free = Object.keys(EDGE_ITEMS).filter(function (k) { return k.endsWith(axis.toUpperCase()) && model.edges[k] == null; });
      const html = '<div class="pe__menu pe__menu--size" role="menu" aria-label="Величина: ' + dimAxisLabel(axis) + '"><div class="pe__menu-list">' +
        Object.keys(SIZE_MODES).map(function (m) {
          return '<button type="button" class="pe__menu-item' + (m === cur ? ' is-selected' : '') + '" role="menuitemradio" aria-checked="' + (m === cur) + '" data-mode="' + m + '"><span class="pe__menu-bullet"></span>' + SIZE_MODES[m] + '</button>';
        }).join('') + '</div>' +
        (free.length ? '<div class="pe__menu-group">Добавить</div><div class="pe__menu-list">' + free.map(function (k) {
          return '<button type="button" class="pe__menu-item pe__menu-item--edge" role="menuitem" data-edge="' + k + '">' + EDGE_ITEMS[k] + '</button>';
        }).join('') + '</div>' : '') + '</div>';
      const pop = openPop(html, unit, -30, -16, {
        click: function (e) {
          const item = e.target.closest('.pe__menu-item');
          if (!item) return;
          closePop(pop);
          if (item.dataset.mode) {
            const a = model.dims[axis];
            // В фиксированный режим — с текущим фактическим размером
            if (item.dataset.mode === 'px' && a.mode !== 'px') a.px = actualOf(axis);
            a.mode = item.dataset.mode;
          } else {
            model.edges[item.dataset.edge] = actualOf(axis);
          }
          changed();
        }
      });
    }

    // ---------- Меню типа линии ----------
    function openLineMenu() {
      if (toggleOf(lineBtn)) return;
      const item = function (style, label) {
        return '<button type="button" class="pe__line' + (style === 'dashed' ? ' pe__line--dashed' : '') + (model.line === style ? ' is-selected' : '') + '" role="menuitemradio" aria-checked="' + (model.line === style) + '" data-style="' + style + '" aria-label="' + label + '"></button>';
      };
      const pop = openPop('<div class="pe__menu pe__menu--line" role="menu" aria-label="Тип линии">' + item('solid', 'Сплошная') + item('dashed', 'Пунктир') + '</div>', lineBtn, -20, -12, {
        click: function (e) {
          const btn = e.target.closest('[data-style]');
          if (!btn) return;
          closePop(pop);
          model.line = btn.dataset.style;
          changed();
        }
      });
    }

    // ---------- Выбор цвета: правки идут в черновик, ✓ и клик по цвету применяют, ✕ и Esc отменяют ----------
    function openColor(anchor, title, color, fallback, onPick) {
      if (toggleOf(anchor)) return;
      let draft = color;
      const palette = PALETTE.map(function (c) {
        return c ? '<button type="button" class="pe__pal" style="--pe-color: ' + c + '" data-color="' + c + '" aria-label="' + c + '"></button>'
          : '<button type="button" class="pe__pal" disabled style="--pe-color: linear-gradient(#66bacc 40%, #ff00c7)" aria-label="Градиент"></button>';
      }).join('');
      const grads = GRADIENTS.map(function (g) { return '<button type="button" class="pe__pal" disabled style="--pe-color: linear-gradient(' + g + ')" aria-label="Градиент"></button>'; }).join('') +
        RADIALS.map(function (g) { return '<button type="button" class="pe__pal" disabled style="--pe-color: radial-gradient(' + g + ')" aria-label="Градиент"></button>'; }).join('');
      const html = '<div class="pe__pop pe__pop--color" role="dialog" aria-label="' + esc(title) + '">' +
        '<header class="pe__pop-bar"><span class="pe__pop-caption">' + esc(title) + '</span><span class="pe__pop-current"></span>' +
        '<span class="pe__pop-cmds"><button type="button" class="pe__pop-tool pe__pop-eyedrop" disabled aria-label="Пипетка"></button>' +
        '<button type="button" class="pe__pop-tool" data-do="reset" aria-label="Сбросить цвет">&#xe629;</button>' +
        '<button type="button" class="pe__done pe__done--m" data-do="apply" aria-label="Применить">&#xe75e;</button>' +
        '<button type="button" class="pe__pop-tool pe__pop-close" data-do="cancel" aria-label="Закрыть">&#xe66c;</button></span></header>' +
        '<div class="pe__pop-colors"><div class="pe__palette">' + palette +
        '<button type="button" class="pe__pop-tool pe__pop-tool--s" data-do="native" aria-label="Другой цвет">&#xeb25;</button>' +
        '<input class="pe__pop-native" type="color" tabindex="-1" aria-hidden="true"></div>' +
        '<div class="pe__gradients"><span class="pe__gradients-label">Градиенты</span>' + grads +
        '<button type="button" class="pe__pop-tool pe__pop-tool--s" disabled aria-label="Ещё градиенты">&#xeab4;</button></div>' +
        '<div class="pe__pop-line"></div><div class="pe__pop-links"><button type="button" class="pe__pop-link" disabled>Текстура</button><button type="button" class="pe__pop-link" disabled>Картинка</button></div></div></div>';
      const pop = openPop(html, anchor, -13, -13, {
        click: function (e) {
          const swatch = e.target.closest('[data-color]');
          if (swatch) { closePop(pop); onPick(swatch.dataset.color); return; }
          const act = e.target.closest('[data-do]');
          if (!act) return;
          if (act.dataset.do === 'apply') { closePop(pop); onPick(draft); }
          if (act.dataset.do === 'cancel') closePop(pop);
          if (act.dataset.do === 'reset') { draft = fallback; paint(); }
          if (act.dataset.do === 'native') {
            const n = pop.el.querySelector('.pe__pop-native');
            n.value = draft;
            if (n.showPicker) n.showPicker(); else n.click();
          }
        },
        input: function (e) {
          if (!e.target.classList.contains('pe__pop-native')) return;
          draft = normHex(e.target.value) || draft;
          paint();
        }
      });
      function paint() {
        pop.el.querySelector('.pe__pop-current').style.setProperty('--pe-color', draft);
        pop.el.querySelector('[data-do="reset"]').classList.toggle('is-idle', draft === fallback);
      }
      paint();
    }

    // ---------- Окно тени: правки сразу видны в строке, ✓ и клик мимо сохраняют, ✕ и Esc возвращают прежнее ----------
    function openShadow() {
      if (toggleOf(shadowEl)) return;
      const before = clone(model.shadow);
      const s = model.shadow;
      const pct = function (k) { const r = SHADOW_RANGES[k]; return ((s[k] - r[0]) / (r[1] - r[0])) * 100; };
      const html = '<div class="pe__pop pe__pop--shadow" role="dialog" aria-label="Тень">' +
        '<header class="pe__pop-head"><span class="pe__pop-title">Тень</span><span class="pe__pop-actions">' +
        '<button type="button" class="pe__done pe__done--m" data-do="apply" aria-label="Применить">&#xe75e;</button>' +
        '<button type="button" class="pe__close" data-do="cancel" aria-label="Закрыть">&#xe66c;</button></span></header>' +
        '<div class="pe__pop-body"><div class="pe__pop-card"><div class="pe__slider-row"><span class="pe__label pe__label--pop">Цвет</span>' +
        '<button type="button" class="pe__bubble" data-do="color" aria-label="Цвет тени"><span class="pe__swatch pe__swatch--alpha"></span><span class="pe__bubble-text"></span></button></div>' +
        SHADOW_ROWS.map(function (row) {
          const k = row[0];
          const r = SHADOW_RANGES[k];
          return '<div class="pe__slider-row"><span class="pe__label pe__label--pop">' + row[1] + '</span>' +
            '<input class="pe__slider" type="range" data-range="' + k + '" min="' + r[0] + '" max="' + r[1] + '" value="' + s[k] + '" style="--p: ' + pct(k) + '%" aria-label="' + row[1] + '">' +
            '<label class="pe__num pe__num--edge"><input class="pe__num-value" data-field="' + k + '" value="' + s[k] + '" inputmode="numeric" maxlength="4" aria-label="' + row[1] + '"></label></div>';
        }).join('') + '</div></div></div>';
      const pop = openPop(html, shadowEl, -13, -13, {
        onCancel: function () { model.shadow = before; changed(); },
        click: function (e) {
          const act = e.target.closest('[data-do]');
          if (!act) return;
          if (act.dataset.do === 'apply') closePop(pop);
          if (act.dataset.do === 'cancel') closeTop('cancel');
          if (act.dataset.do === 'color') {
            openColor(act, 'Цвет', model.shadow.color, start.shadow.color, function (c) {
              model.shadow.color = c;
              paint();
              changed();
            });
          }
        },
        input: function (e) {
          const k = e.target.dataset.range;
          if (!k) return;
          model.shadow[k] = +e.target.value;
          paint();
          changed();
        },
        change: function (e) {
          const k = e.target.dataset.field;
          if (!k) return;
          const n = toInt(e.target.value);
          if (n !== null) { const r = SHADOW_RANGES[k]; model.shadow[k] = clamp(n, r[0], r[1]); }
          paint();
          changed();
        },
        keydown: function (e) { if (e.key === 'Enter' && e.target.dataset.field) e.target.blur(); }
      });
      function paint() {
        const m = model.shadow;
        const b = pop.el.querySelector('.pe__bubble');
        paintBubble(b, m.color, m.color.toUpperCase());
        b.style.setProperty('--pe-alpha', Math.max(m.opacity, 14) + '%');
        SHADOW_ROWS.forEach(function (row) {
          const k = row[0];
          const r = SHADOW_RANGES[k];
          const range = pop.el.querySelector('[data-range="' + k + '"]');
          range.value = m[k];
          range.style.setProperty('--p', ((m[k] - r[0]) / (r[1] - r[0])) * 100 + '%');
          pop.el.querySelector('[data-field="' + k + '"]').value = m[k];
        });
      }
      paint();
    }

    // ---------- События окна ----------
    function reset() {
      while (pops.length) closeTop();
      model = clone(start);
      if (input) input.value = start.name;
      changed();
    }

    function onClick(e) {
      const t = e.target;
      const chip = t.closest('[data-pe-chip]');
      if (chip) { if (rowOf(chip.dataset.peChip)) { model.rows[chip.dataset.peChip] = true; changed(); } return; }
      const edgeClear = t.closest('[data-pe-edge-clear]');
      if (edgeClear) { delete model.edges[edgeClear.dataset.peEdgeClear]; changed(); return; }
      const clear = t.closest('[data-pe-clear]');
      if (clear) {
        const row = clear.closest('[data-pe-row]');
        if (row) {
          model.rows[row.dataset.peRow] = false;
          if (row.dataset.peAlso && rowOf(row.dataset.peAlso)) model.rows[row.dataset.peAlso] = false;
          changed();
        }
        return;
      }
      if (mark && t.closest('.pe__mark')) { input.value = defaultName; changed(); return; }
      const unit = t.closest('[data-pe-dim] .pe__dim-unit');
      if (unit) { e.preventDefault(); openSizeMenu(unit); return; }
      if (lineBtn && t.closest('.pe__line') === lineBtn) { openLineMenu(); return; }
      const sw = t.closest('[data-pe-split]');
      if (sw) {
        const s = model.split[sw.closest('[data-pe-row]').dataset.peRow];
        const keys = SIDES[sw.dataset.peSplit];
        s.on = !s.on;
        // При сворачивании значения выравниваются по первому
        if (!s.on) keys.forEach(function (k) { s.values[k] = s.values[keys[0]]; });
        changed();
        return;
      }
      const colorEl = t.closest('[data-pe-color]');
      if (colorEl) {
        const key = colorEl.closest('[data-pe-row]').dataset.peRow;
        openColor(colorEl, colorEl.dataset.peTitle || 'Цвет', model.colors[key], start.colors[key], function (c) { model.colors[key] = c; changed(); });
        return;
      }
      if (shadowEl && t.closest('[data-pe-shadow]')) { openShadow(); return; }
      const btn = t.closest('button');
      if (!btn || btn.disabled) return;
      if (btn.classList.contains('pe__reset')) reset();
      else if (btn.classList.contains('pe__done')) { if (opts.onDone) opts.onDone(getState()); }
      else if (btn.classList.contains('pe__close')) { if (opts.onClose) opts.onClose(getState()); }
    }

    function onInput(e) { if (e.target === input) changed(); }

    // Числовые поля применяются по Enter и при уходе с поля; неверное значение возвращает прежнее
    function onChange(e) {
      const t = e.target;
      const n = toInt(t.value);
      if (t.dataset.peEdge) {
        if (n !== null) model.edges[t.dataset.peEdge] = clamp(n, 40, 2000);
        changed();
      } else if (t.closest('[data-pe-dim]') && t.classList.contains('pe__dim-value')) {
        const a = model.dims[t.closest('[data-pe-dim]').dataset.peDim];
        if (n !== null) {
          if (a.mode === 'pct') a.pct = clamp(n, 1, 100);
          else { a.mode = 'px'; a.px = clamp(n, 40, 2000); } // в «по контенту» и «заполнить» ввод числа делает ось фиксированной
        }
        changed();
      } else if (t.dataset.peSide || t.classList.contains('pe__num-value')) {
        const row = t.closest('[data-pe-row]');
        const s = row && model.split[row.dataset.peRow];
        if (!s) return;
        const max = +(row.querySelector('[data-pe-split]').dataset.peMax || 100);
        if (n !== null) {
          if (t.dataset.peSide) s.values[t.dataset.peSide] = clamp(n, 0, max);
          else Object.keys(s.values).forEach(function (k) { s.values[k] = clamp(n, 0, max); });
        }
        changed();
      }
    }

    // Enter завершает правку, Esc возвращает значение на момент входа в поле
    let before = '';
    function onFocus(e) { if (e.target === input) before = input.value; }
    function onKey(e) {
      if (e.target === input) {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') { input.value = before; changed(); input.blur(); }
      } else if (e.key === 'Enter' && e.target.matches('.pe__dim-value, .pe__num-value, .pe__box-input')) {
        e.target.blur();
      }
    }

    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('keydown', onKey);
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onDocKey, true);
    render();

    return {
      getState: getState,
      reset: reset,
      destroy: function () {
        while (pops.length) closeTop();
        root.removeEventListener('click', onClick);
        root.removeEventListener('input', onInput);
        root.removeEventListener('change', onChange);
        root.removeEventListener('focusin', onFocus);
        root.removeEventListener('keydown', onKey);
        document.removeEventListener('click', onDocClick, true);
        document.removeEventListener('keydown', onDocKey, true);
      }
    };
  }

  window.PropertyEditor = { mount: mount };
})();
