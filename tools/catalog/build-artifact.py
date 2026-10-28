"""Собирает каталог в один самодостаточный HTML для артефакта Claude.

Вшивает tokens.css, иконочные шрифты, CSS компонентов и пример demo-frame (iframe → srcdoc), снимает <!doctype>/<html>/<head>/<body>:
их добавляет хост артефакта. Запуск из корня: python3 tools/catalog/build-artifact.py <выходной файл>
"""
import base64, html, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
read = lambda p: (ROOT / p).read_text(encoding='utf-8')
tokens = read('tokens.css')

ex = read('components/demo-frame/example/index.html')
ex = ex.replace('<link rel="stylesheet" href="../../../tokens.css">', '<style>' + tokens + '</style>')
ex = ex.replace('<link rel="stylesheet" href="../demo-frame.css">', '<style>' + read('components/demo-frame/demo-frame.css') + '</style>')
ex = ex.replace('<script src="../demo-frame.js"></script>', '<script>' + read('components/demo-frame/demo-frame.js') + '</script>')
assert '../' not in re.sub(r'https?://\S+', '', ex), 'в примере остались локальные ссылки'

page = read('catalog/index.html')
page = page.replace('<link rel="stylesheet" href="../tokens.css" data-kit="tokens">', '<style data-kit="tokens">' + tokens + '</style>')
# Шрифты: Inter в артефакт приходит из Google Fonts, иконочные шрифты вшиваются в data: URL
icon_fonts = ''.join(
    '@font-face { font-family: "%s"; font-display: block; src: url(data:font/ttf;base64,%s) format("truetype"); }\n'
    % (name, base64.b64encode((ROOT / 'fonts' / (name + '.ttf')).read_bytes()).decode('ascii'))
    for name in ('cbuc-icons', 'cbuc-icons24'))
page = page.replace('<link rel="stylesheet" href="../fonts/fonts.css" data-kit="fonts">', '<style data-kit="fonts">' + icon_fonts + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/button/button.css" data-kit="button">', '<style data-kit="button">' + read('components/button/button.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/checkbox/checkbox.css" data-kit="checkbox">', '<style data-kit="checkbox">' + read('components/checkbox/checkbox.css') + '</style>')
page = re.sub(r'src="\.\./components/demo-frame/example/index\.html"', lambda m: 'srcdoc="' + html.escape(ex, quote=True) + '"', page)
page = re.sub(r'<!doctype html>\s*|</?html[^>]*>\s*|</?head>\s*|</?body>\s*|<meta charset="utf-8">\s*|<meta name="viewport"[^>]*>\s*', '', page, flags=re.I)
assert 'href="../' not in page and 'src="../' not in page, 'остались локальные ссылки'
pathlib.Path(sys.argv[1]).write_text(page, encoding='utf-8')
print(len(page))
