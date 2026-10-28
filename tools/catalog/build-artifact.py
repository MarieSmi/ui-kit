"""Собирает каталог в один самодостаточный HTML для артефакта Claude.

Вшивает tokens.css и пример demo-frame (iframe → srcdoc), снимает <!doctype>/<html>/<head>/<body>:
их добавляет хост артефакта. Запуск из корня: python3 tools/catalog/build-artifact.py <выходной файл>
"""
import html, pathlib, re, sys

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
page = re.sub(r'src="\.\./components/demo-frame/example/index\.html"', lambda m: 'srcdoc="' + html.escape(ex, quote=True) + '"', page)
page = re.sub(r'<!doctype html>\s*|</?html[^>]*>\s*|</?head>\s*|</?body>\s*|<meta charset="utf-8">\s*|<meta name="viewport"[^>]*>\s*', '', page, flags=re.I)
assert 'href="../' not in page and 'src="../' not in page, 'остались локальные ссылки'
pathlib.Path(sys.argv[1]).write_text(page, encoding='utf-8')
print(len(page))
