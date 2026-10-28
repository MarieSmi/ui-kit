"""Собирает tokens.css из выгрузки переменных Figma «🌍 Global Variables».

Выгрузка — TSV-файлы рядом со скриптом: строка «## коллекция<TAB>режимы...», дальше
«имя<TAB>тип<TAB>значение по режимам». Значения: #hex, число, строка, @алиас,
~@алиас~прозрачность. Первый режим коллекции — режим по умолчанию.

Запуск: python3 tools/tokens/build.py  (из корня репозитория)
"""
import pathlib, re

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent.parent
FILES = ['global-color-1.tsv', 'global-color-2.tsv', 'global-size-shadow.tsv']
MODES = {'Default Dark': 'default-dark', 'Large Light': 'large-light', 'Dark v3': 'dark-v3',
         'Large Dark': 'large-dark', 'Pink': 'pink', 'Dark v2': 'dark-v2', 'BlackBlue': 'blackblue',
         'Серая': 'gray', 'mobile': 'mobile', 'large': 'large', 'large mobile': 'large-mobile'}

def slug(name):
    name = re.sub(r'^Вспомогательные переменные/', 'helper/', name)
    return re.sub(r'-+', '-', re.sub(r'[/\s]+', '-', name.lower()))

def fmt(name, kind, x):
    if x.startswith('~@'):
        ref, op = x[2:].rsplit('~', 1)
        return f'color-mix(in srgb, var(--{slug(ref)}) {op}%, transparent)'
    if x.startswith('@'):
        return f'var(--{slug(x[1:])})'
    if kind == 'F':
        return x if 'font-weight' in name or x == '0' else x + 'px'
    if kind == 'S':
        return f'"{x}"'
    return x

collections = []  # [(name, modes, [(var, kind, values)])]
for f in FILES:
    for line in (HERE / f).read_text(encoding='utf-8').splitlines():
        if line.startswith('## '):
            name, *modes = line[3:].split('\t')
            if collections and collections[-1][0] == name:
                continue
            collections.append((name, modes, []))
        elif line.strip():
            var, kind, *vals = line.split('\t')
            collections[-1][2].append((var, kind, vals))

order = {'globalColor': 0, 'globalSize': 1, 'globalShadow': 2}
collections.sort(key=lambda c: order[c[0]])
blocks = {}
for name, modes, items in collections:
    attr = 'data-size' if name == 'globalSize' else 'data-theme'
    for var, kind, vals in items:
        default = fmt(var, kind, vals[0])
        blocks.setdefault(':root', []).append(f'  --{slug(var)}: {default};')
        for mode, x in zip(modes[1:], vals[1:]):
            val = fmt(var, kind, x)
            if val != default:
                blocks.setdefault(f':root[{attr}="{MODES[mode]}"]', []).append(f'  --{slug(var)}: {val};')

HEAD = '''/*!
 * ui-kit — токены. Сгенерировано из Figma «🌍 Global Variables» (mcpY3I5yWjkPfnk1IdEiqw)
 * скриптом tools/tokens/build.py. Руками не править: файл пересобирается целиком.
 *
 * Имя: имя переменной Figma в нижнем регистре, «/» и пробелы → «-»,
 * группа «Вспомогательные переменные» → «helper». Border/border-color → --border-border-color.
 *
 * Режимы ставятся атрибутами на <html>, на других элементах не работают:
 *   data-theme: default-dark, large-light, dark-v3, large-dark, pink, dark-v2, blackblue, gray
 *               (без атрибута — Default Light; управляет цветами и тенями)
 *   data-size:  mobile, large, large-mobile (без атрибута — default)
 * В блоках режимов только значения, которые отличаются от режима по умолчанию.
 */
'''
body = ''.join(f'\n{s} {{\n' + '\n'.join(l) + '\n}\n' for s, l in blocks.items())
(ROOT / 'tokens.css').write_text(HEAD + body, encoding='utf-8')
print(len(body), {s: len(l) for s, l in blocks.items()})
