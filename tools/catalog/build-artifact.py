"""Собирает каталог в один самодостаточный HTML для артефакта Claude.

Вшивает tokens.css, иконочные шрифты, CSS компонентов, картинку виджета и пример demo-frame (iframe → srcdoc), снимает <!doctype>/<html>/<head>/<body>:
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
page = page.replace('<link rel="stylesheet" href="../components/chips/chips.css" data-kit="chips">', '<style data-kit="chips">' + read('components/chips/chips.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/close-button/close-button.css" data-kit="close-button">', '<style data-kit="close-button">' + read('components/close-button/close-button.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/arrow-button/arrow-button.css" data-kit="arrow-button">', '<style data-kit="arrow-button">' + read('components/arrow-button/arrow-button.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/back/back.css" data-kit="back">', '<style data-kit="back">' + read('components/back/back.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/breadcrumbs/breadcrumbs.css" data-kit="breadcrumbs">', '<style data-kit="breadcrumbs">' + read('components/breadcrumbs/breadcrumbs.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/combobox/combobox.css" data-kit="combobox">', '<style data-kit="combobox">' + read('components/combobox/combobox.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/switch/switch.css" data-kit="switch">', '<style data-kit="switch">' + read('components/switch/switch.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/tumbler/tumbler.css" data-kit="tumbler">', '<style data-kit="tumbler">' + read('components/tumbler/tumbler.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/tabs/tabs.css" data-kit="tabs">', '<style data-kit="tabs">' + read('components/tabs/tabs.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/accordion/accordion.css" data-kit="accordion">', '<style data-kit="accordion">' + read('components/accordion/accordion.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/input/input.css" data-kit="input">', '<style data-kit="input">' + read('components/input/input.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/toolbar/toolbar.css" data-kit="toolbar">', '<style data-kit="toolbar">' + read('components/toolbar/toolbar.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/widget/widget.css" data-kit="widget">', '<style data-kit="widget">' + read('components/widget/widget.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/builder-header/builder-header.css" data-kit="builder-header">', '<style data-kit="builder-header">' + read('components/builder-header/builder-header.css') + '</style>')
page = page.replace('<script src="../components/builder-header/builder-header.js" data-kit="builder-header"></script>', '<script data-kit="builder-header">' + read('components/builder-header/builder-header.js') + '</script>')
page = page.replace('<link rel="stylesheet" href="../components/left-sidebar/left-sidebar.css" data-kit="left-sidebar">', '<style data-kit="left-sidebar">' + read('components/left-sidebar/left-sidebar.css') + '</style>')
page = page.replace('<script src="../components/left-sidebar/left-sidebar.js" data-kit="left-sidebar"></script>', '<script data-kit="left-sidebar">' + read('components/left-sidebar/left-sidebar.js') + '</script>')
page = page.replace('<link rel="stylesheet" href="../components/right-sidebar/right-sidebar.css" data-kit="right-sidebar">', '<style data-kit="right-sidebar">' + read('components/right-sidebar/right-sidebar.css') + '</style>')
page = page.replace('<script src="../components/right-sidebar/right-sidebar.js" data-kit="right-sidebar"></script>', '<script data-kit="right-sidebar">' + read('components/right-sidebar/right-sidebar.js') + '</script>')
page = page.replace('<link rel="stylesheet" href="../components/scroll-shadow/scroll-shadow.css" data-kit="scroll-shadow">', '<style data-kit="scroll-shadow">' + read('components/scroll-shadow/scroll-shadow.css') + '</style>')
page = page.replace('<script src="../components/scroll-shadow/scroll-shadow.js" data-kit="scroll-shadow"></script>', '<script data-kit="scroll-shadow">' + read('components/scroll-shadow/scroll-shadow.js') + '</script>')
page = page.replace('<link rel="stylesheet" href="../components/shop/shop.css" data-kit="shop">', '<style data-kit="shop">' + read('components/shop/shop.css') + '</style>')
page = page.replace('<script src="../components/shop/shop.js" data-kit="shop"></script>', '<script data-kit="shop">' + read('components/shop/shop.js') + '</script>')
page = page.replace('<link rel="stylesheet" href="../components/property-editor/property-editor.css" data-kit="property-editor">', '<style data-kit="property-editor">' + read('components/property-editor/property-editor.css') + '</style>')
page = page.replace('<script src="../components/property-editor/property-editor.js" data-kit="property-editor"></script>', '<script data-kit="property-editor">' + read('components/property-editor/property-editor.js') + '</script>')
page = page.replace('<link rel="stylesheet" href="../components/master-list/master-list.css" data-kit="master-list">', '<style data-kit="master-list">' + read('components/master-list/master-list.css') + '</style>')
page = page.replace('<link rel="stylesheet" href="../components/pg-editors/pg-editors.css" data-kit="pg-editors">', '<style data-kit="pg-editors">' + read('components/pg-editors/pg-editors.css') + '</style>')
page = page.replace('<script src="../components/pg-editors/pg-editors.js" data-kit="pg-editors"></script>', '<script data-kit="pg-editors">' + read('components/pg-editors/pg-editors.js') + '</script>')
page = page.replace('<link rel="stylesheet" href="../components/text-editor/text-editor.css" data-kit="text-editor">', '<style data-kit="text-editor">' + read('components/text-editor/text-editor.css') + '</style>')
page = page.replace('<script src="../components/text-editor/text-editor.js" data-kit="text-editor"></script>', '<script data-kit="text-editor">' + read('components/text-editor/text-editor.js') + '</script>')
page = page.replace("'../components/widget/example/content.png'", "'data:image/png;base64," + base64.b64encode((ROOT / 'components/widget/example/content.png').read_bytes()).decode('ascii') + "'")
page = re.sub(r'src="\.\./components/demo-frame/example/index\.html"', lambda m: 'srcdoc="' + html.escape(ex, quote=True) + '"', page)
page = re.sub(r'<!doctype html>\s*|</?html[^>]*>\s*|</?head>\s*|</?body>\s*|<meta charset="utf-8">\s*|<meta name="viewport"[^>]*>\s*', '', page, flags=re.I)
assert 'href="../' not in page and 'src="../' not in page, 'остались локальные ссылки'
pathlib.Path(sys.argv[1]).write_text(page, encoding='utf-8')
print(len(page))
