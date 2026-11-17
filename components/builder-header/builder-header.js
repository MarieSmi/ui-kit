/*!
 * builder-header — поведение шапки окна конструктора: строит разметку по параметрам, переключает чтение
 * и редактирование, выбирает размер экрана, меняет масштаб и сообщает о командах прототипу.
 * Без зависимостей, CSS компонента подключается отдельно. Сохранение, закрытие, отмену и предпросмотр
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
  function icon(glyph, size) {
    return '<span class="bhd__icon' + (size ? ' bhd__icon--' + size : '') + '" aria-hidden="true">&#x' + glyph + ';</span>';
  }
  function btn(cmd, label, inner, cls, extra) {
    return '<button type="button" class="bhd__btn' + (cls ? ' ' + cls : '') + '" data-bhd-cmd="' + cmd + '" aria-label="' + esc(label) + '" title="' + esc(label) + '"' + (extra || '') + '>' + inner + '</button>';
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
      let html = '<div class="bhd__title">' + (o.icon ? icon(o.icon, 24) : '') + '<span class="bhd__name">' + esc(o.title) + '</span></div>';
      html += '<div class="bhd__center">';
      if (devices.length) {
        html += '<div class="bhd__devices" role="group" aria-label="Размер экрана">' + devices.map(function (d) {
          return btn('device', d.label, icon(d.glyph, 14), 'bhd__device', ' data-bhd-device="' + d.id + '" aria-pressed="' + (d.id === device) + '"');
        }).join('') + '</div>';
      }
      html += '</div><div class="bhd__actions">';
      if (editing && history) {
        const items = HISTORY.filter(function (h) { return history[h.id] !== undefined && history[h.id] !== null; });
        if (items.length) {
          html += '<div class="bhd__history">' + items.map(function (h) {
            return btn(h.id, h.label, icon(h.glyph, 20), '', history[h.id] ? '' : ' disabled');
          }).join('') + '</div>';
        }
      }
      if (o.zoom !== null && o.zoom !== false) {
        html += '<div class="bhd__zoom">' + btn('zoom-out', 'Уменьшить масштаб', icon('E6EA', 24)) +
          '<button type="button" class="bhd__zoom-value" data-bhd-cmd="zoom-reset" aria-label="Масштаб ' + zoom + '%">' + zoom + '%</button>' +
          btn('zoom-in', 'Увеличить масштаб', icon('E6E9', 24)) + '</div>';
      }
      if (o.revision && (!editing || o.revision.editing)) {
        const r = o.revision;
        html += '<div class="bhd__revision">' + (r.image ? '<img class="bhd__revision-image" src="' + esc(r.image) + '" alt="">' : '<span class="bhd__revision-image" aria-hidden="true"></span>') +
          '<span>' + esc(r.date || '') + '</span></div>';
      }
      if (editing) {
        html += '<button type="button" class="bhd__pill bhd__pill--save" data-bhd-cmd="save">Сохранить <span class="bhd__pill-check">' + icon('E75E') + '</span></button>';
      } else if (o.editable) {
        html += '<button type="button" class="bhd__pill bhd__pill--edit" data-bhd-cmd="edit">Изменить ' + icon('E660') + '</button>';
      }
      if (o.close) html += '<button type="button" class="bhd__close" data-bhd-cmd="close" aria-label="Закрыть"></button>';
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
      root.querySelectorAll('[data-bhd-device]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.bhdDevice === id)); });
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
