/* Собирает список иконок для страницы «Иконки» каталога.

   Имена в шрифтах кита не записаны (глифы названы uniE600…), поэтому имя берётся из таблицы «имя → код»
   шрифта cbuc-icons в проекте Saby (_glyphs.less), а наличие кода проверяется по файлам fonts/*.ttf.
   Результат вписывается в catalog/index.html, в строку ICON_DATA: «Имя код шрифты», где шрифты —
   1 (cbuc-icons), 2 (cbuc-icons24) или 3 (оба).

   Запуск из корня: node tools/icons/build.js <путь к _glyphs.less>
   Python для этого скрипта не нужен: на машине, где собирался список, его не было. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

// Коды символов, для которых в шрифте есть глиф (таблица cmap, форматы 4 и 12)
function codes(file) {
  const b = fs.readFileSync(path.join(ROOT, file)), set = new Set();
  let cmap = 0;
  for (let i = 0, n = b.readUInt16BE(4); i < n; i++) { const o = 12 + i * 16; if (b.toString('latin1', o, o + 4) === 'cmap') cmap = b.readUInt32BE(o + 8); }
  for (let i = 0, n = b.readUInt16BE(cmap + 2); i < n; i++) {
    const so = cmap + b.readUInt32BE(cmap + 4 + i * 8 + 4), fmt = b.readUInt16BE(so);
    if (fmt === 4) {
      const seg = b.readUInt16BE(so + 6), end = so + 14, start = end + seg + 2, delta = start + seg, range = delta + seg;
      for (let s = 0; s < seg; s += 2) {
        const e = b.readUInt16BE(end + s), st = b.readUInt16BE(start + s), d = b.readInt16BE(delta + s), ro = b.readUInt16BE(range + s);
        for (let c = st; c <= e && c !== 0xffff; c++) {
          let g = ro === 0 ? (c + d) & 0xffff : b.readUInt16BE(range + s + ro + (c - st) * 2);
          if (ro !== 0 && g) g = (g + d) & 0xffff;
          if (g) set.add(c);
        }
      }
    } else if (fmt === 12) {
      for (let k = 0, n2 = b.readUInt32BE(so + 12); k < n2; k++) { const o = so + 16 + k * 12; for (let c = b.readUInt32BE(o); c <= b.readUInt32BE(o + 4); c++) set.add(c); }
    }
  }
  return set;
}

const src = process.argv[2];
if (!src) { console.error('Укажите путь к _glyphs.less'); process.exit(1); }
const less = fs.readFileSync(src, 'utf8');
const f16 = codes('fonts/cbuc-icons.ttf'), f24 = codes('fonts/cbuc-icons24.ttf');
const seen = new Set(), items = [];
for (const m of less.matchAll(/\.icon-([\w-]+)::before\s*\{\s*content:\s*'\\([0-9a-fA-F]+)'/g)) {
  const name = m[1], code = parseInt(m[2], 16), fonts = (f16.has(code) ? 1 : 0) + (f24.has(code) ? 2 : 0);
  if (seen.has(name) || !fonts) continue; // имя без глифа в шрифтах кита пропускаем
  seen.add(name); items.push([name, code.toString(16), fonts]);
}
items.sort((a, b) => a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1);

const file = path.join(ROOT, 'catalog/index.html');
const page = fs.readFileSync(file, 'utf8');
const re = /(var ICON_DATA = ')[^']*(';)/;
if (!re.test(page)) { console.error('В каталоге нет строки ICON_DATA'); process.exit(1); }
fs.writeFileSync(file, page.replace(re, (all, a, z) => a + items.map((i) => i.join(' ')).join(',') + z));
const named = new Set(items.map((i) => parseInt(i[1], 16)));
const pua = (set) => [...set].filter((c) => c >= 0xe000 && c <= 0xf8ff);
console.log('иконок: ' + items.length + '; в cbuc-icons: ' + items.filter((i) => i[2] & 1).length + ', в cbuc-icons24: ' + items.filter((i) => i[2] & 2).length);
console.log('глифов без имени: cbuc-icons ' + pua(f16).filter((c) => !named.has(c)).length + ' из ' + pua(f16).length + ', cbuc-icons24 ' + pua(f24).filter((c) => !named.has(c)).length + ' из ' + pua(f24).length);
