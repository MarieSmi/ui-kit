/*!
 * builder-header — поведение шапки окна конструктора: строит разметку по параметрам, переключает чтение
 * и редактирование, выбирает размер экрана, меняет масштаб и сообщает о командах прототипу.
 * Без зависимостей в JS. Разметка — из компонентов кита button, tumbler и close-button: их CSS подключается отдельно. Сохранение, закрытие, отмену и предпросмотр
 * реализует прототип в обработчиках.
 * https://github.com/MarieSmi/ui-kit/tree/main/components/builder-header
 *
 * Разметка: пустой <header class="bhd">, всё внутри строит mount. См. README.
 */
(function () {
  'use strict';

  const DEVICES = [
    { id: 'desktop', label: 'Компьютер', glyph: 'E730' },
    { id: 'tablet', label: 'Планшет', glyph: 'E637' },
    { id: 'more', label: 'Другие размеры', glyph: 'EAB4' },
  ];
  const HISTORY = [
    { id: 'undo', label: 'Отменить', glyph: 'E6CF' },
    { id: 'redo', label: 'Повторить', glyph: 'E6CA' },
    { id: 'reset', label: 'Сбросить', glyph: 'E629' },
    { id: 'preview', label: 'Предпросмотр', glyph: 'EAB9' },
  ];
  const HANDLERS = { undo: 'onUndo', redo: 'onRedo', reset: 'onReset', preview: 'onPreview', edit: 'onEdit', save: 'onSave', close: 'onClose', 'zoom-reset': 'onZoomReset' };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function glyph(code, cls) { return '<span class="' + cls + '" aria-hidden="true">&#x' + code + ';</span>'; }
  // Кнопка-иконка кита: view — 'ghost' (история) или 'link' (масштаб), size — 'xl' или 'm'
  function iconBtn(cmd, label, code, view, size, extra) {
    return '<button type="button" class="btn btn--' + view + ' btn--style-secondary btn--size-' + size + ' btn--icon" data-bhd-cmd="' + cmd + '" aria-label="' + esc(label) + '" title="' + esc(label) + '"' + (extra || '') + '>' + glyph(code, 'btn__icon') + '</button>';
  }

  function mount(root, options) {
    const o = Object.assign({
      title: '', icon: 'EB5F', mode: 'read', editable: true,
      devices: true, device: 'desktop',
      history: { undo: true, redo: true, reset: false, preview: true },
      zoom: 100, zoomStep: 10, zoomMin: 10, zoomMax: 400,
      revision: null, close: true,
    }, options || {});
    let mode = o.mode === 'edit' ? 'edit' : 'read';
    let device = o.device;
    let zoom = o.zoom;
    let history = Object.assign({}, o.history);

    function emit(name) {
      const fn = o[name];
      if (typeof fn === 'function') return fn.apply(null, Array.prototype.slice.call(arguments, 1));
    }

    function render() {
      const editing = mode === 'edit';
      root.classList.add('bhd');
      root.classList.toggle('bhd--editing', editing);
      const devices = o.devices === true ? DEVICES : (o.devices || []);
      let html = '<div class="bhd__title">' + (o.icon ? glyph(o.icon, 'bhd__title-icon') : '') + '<span class="bhd__name">' + esc(o.title) + '</span></div>';
      html += '<div class="bhd__center">';
      if (devices.length) {
        html += '<div class="tumbler tumbler--size-m" role="radiogroup" aria-label="Размер экрана">' + devices.map(function (d) {
          return '<button type="button" class="tumbler__item" role="radio" data-bhd-cmd="device" data-bhd-device="' + d.id + '" aria-checked="' + (d.id === device) + '" aria-label="' + esc(d.label) + '" title="' + esc(d.label) + '">' + glyph(d.glyph, 'tumbler__icon') + '</button>';
        }).join('') + '</div>';
      }
      html += '</div><div class="bhd__actions">';
      if (editing && history) {
        const items = HISTORY.filter(function (h) { return history[h.id] !== undefined && history[h.id] !== null; });
        if (items.length) {
          html += '<div class="bhd__history">' + items.map(function (h) {
            return iconBtn(h.id, h.label, h.glyph, 'ghost', 'xl', history[h.id] ? '' : ' disabled');
          }).join('') + '</div>';
        }
      }
      if (o.zoom !== null && o.zoom !== false) {
        html += '<div class="bhd__zoom">' + iconBtn('zoom-out', 'Уменьшить масштаб', 'E6EA', 'link', 'm') +
          '<button type="button" class="btn btn--link btn--style-secondary btn--size-m bhd__zoom-value" data-bhd-cmd="zoom-reset" aria-label="Масштаб ' + zoom + '%">' + zoom + '%</button>' +
          iconBtn('zoom-in', 'Увеличить масштаб', 'E6E9', 'link', 'm') + '</div>';
      }
      if (o.revision && (!editing || o.revision.editing)) {
        const r = o.revision;
        html += '<div class="bhd__revision">' + (r.image ? '<img class="bhd__revision-image" src="' + esc(r.image) + '" alt="">' : '<span class="bhd__revision-image" aria-hidden="true"></span>') +
          '<span>' + esc(r.date || '') + '</span></div>';
      }
      if (editing) {
        html += '<button type="button" class="btn btn--same-outlined btn--style-success btn--size-m bhd__pill bhd__pill--save" data-bhd-cmd="save">Сохранить' + glyph('E75E', 'bhd__save-check') + '</button>';
      } else if (o.editable) {
        html += '<button type="button" class="btn btn--same-outlined btn--style-secondary btn--size-m bhd__pill bhd__pill--edit" data-bhd-cmd="edit">Изменить' + glyph('E660', 'btn__icon') + '</button>';
      }
      if (o.close) html += '<button type="button" class="close-button close-button--functional-button close-button--size-l" data-bhd-cmd="close" aria-label="Закрыть"></button>';
      html += '</div>';
      root.innerHTML = html;
    }

    function setMode(m) {
      const next = m === 'edit' ? 'edit' : 'read';
      if (next === mode) return;
      mode = next;
      render();
      emit('onMode', mode);
    }
    function setDevice(id) {
      if (id === device) return;
      device = id;
      root.querySelectorAll('[data-bhd-device]').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.bhdDevice === id)); });
      emit('onDevice', id);
    }
    function setZoom(v) {
      const next = Math.max(o.zoomMin, Math.min(o.zoomMax, Math.round(v)));
      if (next === zoom) return;
      zoom = next;
      const val = root.querySelector('.bhd__zoom-value');
      if (val) { val.textContent = zoom + '%'; val.setAttribute('aria-label', 'Масштаб ' + zoom + '%'); }
      emit('onZoom', zoom);
    }

    function onClick(e) {
      const b = e.target.closest('[data-bhd-cmd]');
      if (!b || !root.contains(b) || b.disabled) return;
      const cmd = b.dataset.bhdCmd;
      if (cmd === 'device') return setDevice(b.dataset.bhdDevice);
      if (cmd === 'zoom-in') return setZoom(zoom + o.zoomStep);
      if (cmd === 'zoom-out') return setZoom(zoom - o.zoomStep);
      const result = emit(HANDLERS[cmd]);
      // «Изменить» и «Сохранить» переключают режим, если обработчик не вернул false
      if (result === false) return;
      if (cmd === 'edit') setMode('edit');
      else if (cmd === 'save') setMode('read');
      else if (cmd === 'zoom-reset' && typeof o.onZoomReset !== 'function') setZoom(100); // без обработчика — сброс к 100%
    }

    root.addEventListener('click', onClick);
    render();

    return {
      get mode() { return mode; },
      get device() { return device; },
      get zoom() { return zoom; },
      setMode: setMode,
      setDevice: setDevice,
      setZoom: setZoom,
      setTitle: function (t) { o.title = t; const n = root.querySelector('.bhd__name'); if (n) n.textContent = t; },
      setHistory: function (h) { history = Object.assign(history, h); render(); },
      setRevision: function (r) { o.revision = r; render(); },
      update: function (patch) {
        Object.assign(o, patch);
        if ('mode' in patch) mode = patch.mode === 'edit' ? 'edit' : 'read';
        if ('device' in patch) device = patch.device;
        if ('zoom' in patch && typeof patch.zoom === 'number') zoom = patch.zoom;
        if ('history' in patch) history = Object.assign({}, patch.history);
        render();
      },
      destroy: function () { root.removeEventListener('click', onClick); root.innerHTML = ''; root.classList.remove('bhd--editing'); },
    };
  }

  window.BuilderHeader = { mount: mount };
})();
