/*!
 * text-editor — окно редактора из pershmary/table-widget, demo.html.
 * Исходный фрейм Figma 1265:76984 (ключ файла в исходнике не указан); повторно не сверено.
 * Окружение и события команд. Форматирование, сохранение, история и виджеты — на стороне прототипа.
 */
(function (global) {
  'use strict';
  var instances = new WeakMap();
  var template = `<header class="te__head">
<div class="te__head-left">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 8V7L9 0H20C21.1046 0 22 0.895431 22 2V22C22 23.1046 21.1046 24 20 24H8V23H20C20.5523 23 21 22.5523 21 22V2C21 1.44772 20.5523 1 20 1H10V8H2ZM9 1.41421L3.41421 7H9V1.41421Z" fill="var(--icon-label_icon-color)"/>
<path d="M12 12H18V13H12V12Z" fill="var(--icon-label_icon-color)"/>
<path d="M18 15H12V16H18V15Z" fill="var(--icon-label_icon-color)"/>
<path d="M12 18H18V19H12V18Z" fill="var(--icon-label_icon-color)"/>
<path d="M3.35685 22.004C2.73185 23.2339 2.38911 23.8992 2.32863 24L9.16331 14.9577L8.86089 13.8992L10.8871 11.1774L8.31653 11.9637V11.994H8.28629V12.0242C8.28629 12.0444 8.27621 12.0544 8.25605 12.0544V12.1149L8.22581 12.1452C8.20564 12.1653 8.19556 12.1855 8.19556 12.2056L8.16532 12.2661V12.2964L8.13508 12.3266C8.11492 12.3669 8.09476 12.3972 8.0746 12.4173V12.4778L8.01411 12.5383V12.5988H7.98387V12.629C7.96371 12.6492 7.95363 12.6694 7.95363 12.6895L7.92339 12.7198V12.75L7.89314 12.7802V12.8407C7.85282 12.9012 7.82258 12.9617 7.80242 13.0222L7.77218 13.0827C7.75202 13.0827 7.74193 13.0927 7.74193 13.1129L7.71169 13.2036C7.67137 13.244 7.64113 13.2944 7.62097 13.3548L7.59072 13.4153C7.57056 13.4355 7.56048 13.4556 7.56048 13.4758L7.53024 13.5363C7.51008 13.5565 7.5 13.5867 7.5 13.627L7.46976 13.6875C7.4496 13.7077 7.42943 13.7379 7.40927 13.7782L0 9L5.50403 17.6794C4.7379 19.2319 4.02218 20.6734 3.35685 22.004Z" fill="var(--icon-label_icon-color)"/>
</svg>
<span class="te__doc-title">Новый документ</span>
</div>
<div class="te__head-right">
<button data-te-action="undo" type="button" class="te__ghost" title="Отменить" aria-label="Отменить">
<span class="te__i24" aria-hidden="true">&#xe6cf;</span>
</button>
<button data-te-action="redo" type="button" class="te__ghost" title="Повторить" aria-label="Повторить">
<span class="te__i24" aria-hidden="true">&#xe6ca;</span>
</button>
<span class="te__hsep" aria-hidden="true">
</span>
<button data-te-action="zoom-out" type="button" class="te__ghost" title="Уменьшить" aria-label="Уменьшить">
<span class="te__i24" aria-hidden="true">&#xe6ea;</span>
</button>
<button data-te-action="zoom" type="button" class="te__zoom">100%</button>
<button data-te-action="zoom-in" type="button" class="te__ghost" title="Увеличить" aria-label="Увеличить">
<span class="te__i24" aria-hidden="true">&#xe6e9;</span>
</button>
<span class="te__hsep" aria-hidden="true">
</span>
<div class="te__cmds">
<span class="te__rev">
<span class="te__avatar" aria-hidden="true">
</span>
<button data-te-action="revision" type="button" class="te__revtext">Изменения документа</button>
</span>
<button data-te-action="save" type="button" class="te__save">
<span class="te__save-text">Сохранить</span>
<span class="te__save-ico" aria-hidden="true">&#xe75e;</span>
</button>
<button data-te-action="close" type="button" class="te__close" title="Закрыть" aria-label="Закрыть">
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
<path d="M10.9311 10.1598C10.7181 9.94675 10.3728 9.94675 10.1598 10.1598C9.94675 10.3728 9.94675 10.7181 10.1598 10.9311L15.2286 16L10.1598 21.0689C9.94675 21.2819 9.94675 21.6272 10.1598 21.8402C10.3728 22.0533 10.7181 22.0533 10.9311 21.8402L16 16.7714L21.0689 21.8402C21.2819 22.0533 21.6272 22.0533 21.8402 21.8402C22.0533 21.6272 22.0533 21.2819 21.8402 21.0689L16.7714 16L21.8402 10.9311C22.0533 10.7181 22.0533 10.3728 21.8402 10.1598C21.6272 9.94675 21.2819 9.94675 21.0689 10.1598L16 15.2286L10.9311 10.1598Z" fill="currentColor"/>
</svg>
</button>
</div>
</div>
</header>
<aside class="te__left" aria-label="Левая панель">
</aside>
<div class="te__center">
<div class="te__toolbar" role="toolbar" aria-label="Тулбар документа">
<button data-te-action="text-style" type="button" class="te__style">
<span>Основной текст</span>
<span class="te__i16" aria-hidden="true">&#xe9aa;</span>
</button>
<span class="te__tsep" aria-hidden="true">
</span>
<span class="te__tgroup">
<button data-te-action="bold" type="button" class="te__tbtn" title="Жирный" aria-label="Жирный">
<span class="te__i24" aria-hidden="true">&#xe6c3;</span>
</button>
<button data-te-action="italic" type="button" class="te__tbtn" title="Курсив" aria-label="Курсив">
<span class="te__i24" aria-hidden="true">&#xe6c6;</span>
</button>
<button data-te-action="underline" type="button" class="te__tbtn" title="Подчёркнутый" aria-label="Подчёркнутый">
<span class="te__i24" aria-hidden="true">&#xe6ce;</span>
</button>
<button data-te-action="strike" type="button" class="te__tbtn" title="Зачёркнутый" aria-label="Зачёркнутый">
<span class="te__i24" aria-hidden="true">&#xe6cb;</span>
</button>
<button data-te-action="inline-code" type="button" class="te__tbtn" title="Код" aria-label="Код">
<span class="te__i24" aria-hidden="true">&#xea88;</span>
</button>
</span>
<span class="te__tsep" aria-hidden="true">
</span>
<span class="te__tgroup">
<button data-te-action="text-color" type="button" class="te__tbtn" title="Цвет текста" aria-label="Цвет текста">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path d="M12.4356 4.29066C12.3626 4.11473 12.1904 4 11.9993 4C11.8082 4 11.636 4.11473 11.5629 4.29066L8.24319 12.4706H8.22222V12.5222L6.33333 17.1765H7.32705L8.87631 13.5H15.1227L16.6722 17.1765H17.6667L12.4356 4.29066ZM14.7354 12.5H9.26362L11.9993 5.70136L14.7354 12.5Z" fill="currentColor"/>
<rect x="4" y="19" width="16" height="3" fill="var(--text-text-color)"/>
</svg>
</button>
<button data-te-action="highlight-color" type="button" class="te__tbtn" title="Цвет выделения" aria-label="Цвет выделения">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.5898 2L6.99948 11.5903L7.85101 12.4419L4.62421 15.6687L9.11416 17.5929L11.0581 15.649L11.7046 16.2954L21.2949 6.70508L16.5898 2ZM19.8807 6.70508L16.5898 3.41421L10.3556 9.64844L13.6465 12.9393L19.8807 6.70508ZM8.4137 11.5903L9.64848 10.3555L12.9393 13.6464L11.7046 14.8812L8.4137 11.5903ZM10.351 14.9419L8.55811 13.149L6.37573 15.3313L8.88578 16.4071L10.351 14.9419Z" fill="currentColor"/>
<rect x="3.8" y="18.8" width="16.4" height="3.4" fill="white" stroke="var(--border-unaccented_border-color)" stroke-width="0.4"/>
</svg>
</button>
</span>
<span class="te__tsep" aria-hidden="true">
</span>
<button data-te-action="alignment" type="button" class="te__tbtn" title="Выравнивание" aria-label="Выравнивание">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path d="M3.5 6C3.22386 6 3 6.22386 3 6.5C3 6.77614 3.22386 7 3.5 7H20.5C20.7761 7 21 6.77614 21 6.5C21 6.22386 20.7761 6 20.5 6H3.5Z" fill="currentColor"/>
<path d="M3.5 10C3.22386 10 3 10.2239 3 10.5C3 10.7761 3.22386 11 3.5 11H14.5C14.7761 11 15 10.7761 15 10.5C15 10.2239 14.7761 10 14.5 10H3.5Z" fill="currentColor"/>
<path d="M3 14.5C3 14.2239 3.22386 14 3.5 14H20.5C20.7761 14 21 14.2239 21 14.5C21 14.7761 20.7761 15 20.5 15H3.5C3.22386 15 3 14.7761 3 14.5Z" fill="currentColor"/>
<path d="M3.5 18C3.22386 18 3 18.2239 3 18.5C3 18.7761 3.22386 19 3.5 19H14.5C14.7761 19 15 18.7761 15 18.5C15 18.2239 14.7761 18 14.5 18H3.5Z" fill="currentColor"/>
</svg>
</button>
<span class="te__tsep" aria-hidden="true">
</span>
<span class="te__tgroup">
<button data-te-action="bullet-list" type="button" class="te__tbtn" title="Маркированный список" aria-label="Маркированный список">
<span class="te__i24" aria-hidden="true">&#xe6c7;</span>
</button>
<button data-te-action="numbered-list" type="button" class="te__tbtn" title="Нумерованный список" aria-label="Нумерованный список">
<span class="te__i24" aria-hidden="true">&#xe6c8;</span>
</button>
<button data-te-action="check-list" type="button" class="te__tbtn" title="Чек-лист" aria-label="Чек-лист">
<span class="te__i24" aria-hidden="true">&#xe76f;</span>
</button>
<button data-te-action="link" type="button" class="te__tbtn" title="Ссылка" aria-label="Ссылка">
<span class="te__i24" aria-hidden="true">&#xe6a7;</span>
</button>
<button data-te-action="image" type="button" class="te__tbtn" title="Изображение" aria-label="Изображение">
<span class="te__i24" aria-hidden="true">&#xe9a3;</span>
</button>
<span class="te__tsplit">
<button data-te-action="table" type="button" class="te__tbtn" title="Таблица" aria-label="Таблица">
<span class="te__i24" aria-hidden="true">&#xe958;</span>
</button>
<button data-te-action="table-options" type="button" class="te__tarr" title="Варианты таблицы" aria-label="Варианты таблицы">
<span class="te__i14" aria-hidden="true">&#xe9aa;</span>
</button>
</span>
<button data-te-action="columns" type="button" class="te__tbtn" title="Колонки" aria-label="Колонки">
<span class="te__i24" aria-hidden="true">&#xeaee;</span>
</button>
<button data-te-action="emoji" type="button" class="te__tbtn" title="Смайлы" aria-label="Смайлы">
<span class="te__i24" aria-hidden="true">&#xe9a7;</span>
</button>
<button data-te-action="code-block" type="button" class="te__tbtn" title="Блок кода" aria-label="Блок кода">
<span class="te__i24" aria-hidden="true">&#xea88;</span>
</button>
<button data-te-action="info-block" type="button" class="te__tbtn" title="Информация" aria-label="Информация">
<span class="te__i24" aria-hidden="true">&#xe64b;</span>
</button>
<button data-te-action="quote" type="button" class="te__tbtn" title="Цитата" aria-label="Цитата">
<span class="te__i24" aria-hidden="true">&#xea47;</span>
</button>
<button data-te-action="comment" type="button" class="te__tbtn" title="Комментарий" aria-label="Комментарий">
<svg class="te__i24" viewBox="0 0 512 512" aria-hidden="true">
<path transform="translate(0 480) scale(1 -1)" d="M64 341Q64 359 76.5 371.5Q89 384 107 384H405Q423 384 435.5 371.5Q448 359 448 341V149Q448 131 435.5 118.5Q423 106 405 106H235L149 42V106H107Q89 106 76.5 118.5Q64 131 64 149ZM107 362Q98 362 91.5 356.0Q85 350 85 341V149Q85 140 91.5 134.0Q98 128 107 128H405Q414 128 420.5 134.0Q427 140 427 149V341Q427 350 420.5 356.0Q414 362 405 362ZM272 258Q272 275 283.5 286.5Q295 298 312 298Q329 298 340.5 286.5Q352 275 352 258V255Q352 217 326 193L299 165L312 218Q295 218 283.5 229.5Q272 241 272 258ZM200 298Q217 298 228.5 286.5Q240 275 240 258V255Q240 217 214 193L187 165L200 218Q183 218 171.5 229.5Q160 241 160 258Q160 275 171.5 286.5Q183 298 200 298Z" fill="currentColor"/>
</svg>
</button>
<button data-te-action="tile" type="button" class="te__tbtn" title="Плитка" aria-label="Плитка">
<svg class="te__i24" viewBox="0 0 512 512" aria-hidden="true">
<path transform="translate(0 480) scale(1 -1)" d="M64 362Q64 380 76.5 392.5Q89 405 107 405H405Q423 405 435.5 392.5Q448 380 448 362V64Q448 46 435.5 33.5Q423 21 405 21H107Q89 21 76.5 33.5Q64 46 64 64ZM107 384Q98 384 91.5 377.5Q85 371 85 362V213H224Q238 213 247.0 204.0Q256 195 256 181V42H405Q414 42 420.5 48.5Q427 55 427 64V362Q427 371 420.5 377.5Q414 384 405 384ZM85 64Q85 55 91.5 48.5Q98 42 107 42H235V181Q235 192 224 192H85Z" fill="currentColor"/>
</svg>
</button>
<button data-te-action="signature" type="button" class="te__tbtn" title="Подпись" aria-label="Подпись">
<span class="te__i24" aria-hidden="true">&#xe9fe;</span>
</button>
<button data-te-action="document-link" type="button" class="te__tbtn" title="Ссылка на документ" aria-label="Ссылка на документ">
<span class="te__i24" aria-hidden="true">&#xeb7e;</span>
</button>
<button data-te-action="tabs" type="button" class="te__tbtn" title="Вкладки" aria-label="Вкладки">
<svg class="te__i24" viewBox="0 0 512 512" aria-hidden="true">
<path transform="translate(0 480) scale(1 -1)" d="M427 384Q444 384 456.5 371.5Q469 359 469 341V85Q469 67 456.5 54.5Q444 42 427 42H85Q68 42 55.5 54.5Q43 67 43 85V341Q43 359 55.5 371.5Q68 384 85 384ZM341 362V277H448V341Q448 350 441.5 356.0Q435 362 427 362ZM320 362H213V277H320ZM85 362Q77 362 70.5 356.0Q64 350 64 341V85Q64 76 70.5 70.0Q77 64 85 64H427Q435 64 441.5 70.0Q448 76 448 85V256H213Q205 256 198.5 262.0Q192 268 192 277V362Z" fill="currentColor"/>
</svg>
</button>
</span>
<span class="te__tsep" aria-hidden="true">
</span>
<span class="te__tgroup">
<button data-te-action="voice" type="button" class="te__tbtn" title="Голосовой ввод" aria-label="Голосовой ввод">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<rect x="11.5" y="2" width="1" height="20" rx="0.5" fill="currentColor"/>
<rect x="7" y="6" width="1" height="12" rx="0.5" fill="currentColor"/>
<rect x="2" y="9" width="1" height="6" rx="0.5" fill="currentColor"/>
<rect x="16" y="6" width="1" height="12" rx="0.5" fill="currentColor"/>
<rect x="21" y="9" width="1" height="6" rx="0.5" fill="currentColor"/>
</svg>
</button>
<button data-te-action="assistant" type="button" class="te__tbtn" title="Помощник" aria-label="Помощник">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path d="M16.5657 8.54545L16.9697 9.91919L7.87879 21.9192C8.0404 21.6498 8.48485 20.8013 9.21212 19.3737C9.23906 19.2929 9.27946 19.2121 9.33333 19.1313L9.41414 18.9697C9.41414 18.9428 9.42761 18.9158 9.45455 18.8889L9.53535 18.6869C9.53535 18.6599 9.54882 18.633 9.57576 18.6061L9.65657 18.4444C9.95286 17.8788 10.2357 17.2997 10.5051 16.7071L10.6667 16.4242C10.963 15.8316 11.2593 15.2256 11.5556 14.6061L11.6768 14.4444C11.6768 14.4175 11.6902 14.3906 11.7172 14.3636L11.798 14.1616C11.8249 14.1347 11.8384 14.1077 11.8384 14.0808L11.9596 13.8788C11.9865 13.798 12.0269 13.7037 12.0808 13.596L4.72727 2L14.6263 8.38384C14.9764 7.65657 15.3805 6.84848 15.8384 5.9596L19.2727 4.90909L16.5657 8.54545ZM7.87879 21.9596C7.87879 21.9596 7.86532 21.9731 7.83838 22L7.87879 21.9192V21.9596Z" fill="var(--icon-info_icon-color)"/>
</svg>
</button>
<button data-te-action="toolbar-more" type="button" class="te__tbtn" title="Ещё" aria-label="Ещё">
<span class="te__i24" aria-hidden="true">&#xeab4;</span>
</button>
</span>
</div>
<div class="te__viewport" tabindex="0" aria-label="Область документа">
<div class="te__page">
<div class="te__document" role="textbox" aria-multiline="true" aria-label="Текст документа">
</div>
</div>
</div>
</div>
<aside class="te__right" aria-label="Панель">
<div class="te__rcmds">
<button data-te-action="add" type="button" class="te__ritem te__ritem--accent" title="Добавить" aria-label="Добавить">
<span class="te__i24" aria-hidden="true">&#xeadd;</span>
</button>
<button data-te-action="data" type="button" class="te__ritem" title="Данные" aria-label="Данные">
<svg class="te__i24" viewBox="0 0 512 512" aria-hidden="true">
<path transform="translate(0 480) scale(1 -1)" d="M392 239Q363 221 325.5 215.0Q288 209 256 209Q224 209 186.5 215.0Q149 221 120 239V173Q120 168 128 160Q139 151 155.5 145.0Q172 139 190.0 136.0Q208 133 225.5 131.5Q243 130 256 130Q269 130 286.5 131.5Q304 133 322.0 136.0Q340 139 356.5 145.0Q373 151 384 160Q392 168 392 173ZM392 332Q364 318 325.5 313.5Q287 309 256 309Q225 309 186.5 313.5Q148 318 120 332V273Q120 268 128 260Q139 251 155.5 245.0Q172 239 190.0 236.0Q208 233 225.5 231.5Q243 230 256 230Q269 230 286.5 231.5Q304 233 322.0 236.0Q340 239 356.5 245.0Q373 251 384 260Q392 268 392 273ZM392 139Q363 121 325.5 115.0Q288 109 256 109Q224 109 186.5 115.0Q149 121 120 139V80Q120 75 124.0 70.5Q128 66 134.0 62.5Q140 59 146.0 56.5Q152 54 156 52Q175 45 200.5 41.0Q226 37 256 37Q265 37 287.0 39.0Q309 41 332.5 46.0Q356 51 374.0 59.5Q392 68 392 80ZM120 360V359L121 358Q130 349 148.0 343.5Q166 338 186.5 335.0Q207 332 226.0 331.0Q245 330 256 330Q268 330 287.5 331.0Q307 332 327.0 335.0Q347 338 364.5 343.5Q382 349 391 358L392 359V360Q386 369 367.5 375.0Q349 381 327.0 384.0Q305 387 285.0 388.0Q265 389 256 389Q247 389 226.5 388.0Q206 387 183.5 383.5Q161 380 143.0 374.5Q125 369 120 360ZM413 80Q413 63 398 51Q386 41 368.0 34.0Q350 27 330.0 23.0Q310 19 290.5 17.5Q271 16 256 16Q241 16 221.5 17.5Q202 19 182.0 23.0Q162 27 144.0 34.0Q126 41 114 51Q99 63 99 80V360Q99 368 104.0 374.0Q109 380 115 384Q127 392 145.5 397.0Q164 402 184.0 405.0Q204 408 223.0 409.0Q242 410 256 410Q267 410 293.0 408.5Q319 407 345.5 402.0Q372 397 392.5 387.0Q413 377 413 360Z" fill="currentColor"/>
</svg>
</button>
<button data-te-action="settings" type="button" class="te__ritem" title="Настройки" aria-label="Настройки">
<span class="te__i24" aria-hidden="true">&#xeaa9;</span>
</button>
<button data-te-action="sidebar-more" type="button" class="te__rmore" title="Ещё" aria-label="Ещё">
<span class="te__i20" aria-hidden="true">&#xe9d9;</span>
</button>
</div>
<button data-te-action="help" type="button" class="te__help" title="Помощь" aria-label="Помощь">
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
<rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="var(--background-info_hover_background-color)"/>
<rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="var(--border-info_border-color)"/>
<path d="M15.69 20.92C16.1872 20.8766 16.6663 21.1173 16.9283 21.5421C17.1903 21.9669 17.1903 22.5031 16.9283 22.9279C16.6663 23.3527 16.1872 23.5934 15.69 23.55C15.1928 23.5934 14.7137 23.3527 14.4517 22.9279C14.1897 22.5031 14.1897 21.9669 14.4517 21.5421C14.7137 21.1173 15.1928 20.8766 15.69 20.92ZM16.06 8.55C18.76 8.55 20.57 10.15 20.54 12.33C20.5475 13.8079 19.7189 15.1631 18.4 15.83C17.09 16.61 16.71 17.15 16.71 18.2V18.83C16.71 19.26 16.24 19.62 15.65 19.62C15.06 19.62 14.59 19.27 14.59 18.83V18.01C14.5281 16.6341 15.3246 15.3637 16.59 14.82C17.82 14.07 18.26 13.48 18.26 12.43C18.2443 11.849 17.9851 11.3014 17.5457 10.921C17.1063 10.5406 16.5272 10.3624 15.95 10.43C14.5791 10.4104 13.4304 11.4626 13.33 12.83C13.33 13.22 12.9 13.54 12.38 13.54C11.86 13.54 11.43 13.22 11.43 12.83C11.435 11.6345 11.9364 10.4947 12.8143 9.68319C13.6922 8.87165 14.8678 8.46122 16.06 8.55Z" fill="var(--icon-info_icon-color)"/>
</svg>
</button>
</aside>`;

  function mount(root, options) {
    if (!root || root.nodeType !== 1) throw new TypeError('TextEditor.mount: нужен DOM-элемент');
    if (instances.has(root)) return instances.get(root);
    var opts = options || {}, doc = root.ownerDocument, win = doc.defaultView;
    var original = Array.from(root.childNodes), hadClass = root.classList.contains('te');
    var wasScrolled = root.classList.contains('is-scrolled');
    root.replaceChildren();
    root.classList.add('te');
    root.innerHTML = template;
    var elements = { root: root };
    ['head', 'left', 'right', 'toolbar', 'viewport', 'document'].forEach(function (name) {
      elements[name] = root.querySelector('.te__' + name);
    });
    var content = elements.document, viewport = elements.viewport, destroyed = false;
    function setTitle(value) { root.querySelector('.te__doc-title').textContent = String(value); }
    function setContent(value) {
      content.replaceChildren();
      if (value && value.nodeType) content.appendChild(value);
      else if (value != null) content.textContent = String(value);
    }
    function setEditable(value) {
      content.contentEditable = value ? 'true' : 'false';
      if (value) {
        content.setAttribute('role', 'textbox');
        content.setAttribute('aria-multiline', 'true');
        content.removeAttribute('aria-readonly');
      } else {
        content.setAttribute('role', 'region');
        content.removeAttribute('aria-multiline');
      }
    }
    function syncScroll() { root.classList.toggle('is-scrolled', viewport.scrollTop > 0); }
    function actionButton(event) {
      var button = event.target.closest('[data-te-action]');
      return button && button.closest('.te') === root && !button.disabled && !button.classList.contains('is-disabled') ? button : null;
    }
    function keepSelection(event) { if (actionButton(event)) event.preventDefault(); }
    function onClick(event) {
      var button = actionButton(event);
      if (!button) return;
      var detail = { action: button.dataset.teAction, button: button, originalEvent: event, editor: api };
      root.dispatchEvent(new win.CustomEvent('text-editor:action', { bubbles: true, detail: detail }));
      if (opts.onAction) opts.onAction(detail);
    }
    function onInput(event) {
      if (content.contains(event.target) && opts.onInput) opts.onInput({ content: content, originalEvent: event, editor: api });
    }
    var api = {
      elements: elements,
      setTitle: setTitle,
      setContent: setContent,
      setEditable: setEditable,
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        root.removeEventListener('mousedown', keepSelection);
        root.removeEventListener('click', onClick);
        content.removeEventListener('input', onInput);
        viewport.removeEventListener('scroll', syncScroll);
        root.replaceChildren.apply(root, original);
        if (!hadClass) root.classList.remove('te');
        root.classList.toggle('is-scrolled', wasScrolled);
        instances.delete(root);
      }
    };
    setTitle(opts.title == null ? 'Новый документ' : opts.title);
    root.querySelector('.te__revtext').textContent = opts.revision == null ? 'Изменения документа' : String(opts.revision);
    root.querySelector('.te__avatar').textContent = opts.initials == null ? '' : String(opts.initials);
    if (Object.prototype.hasOwnProperty.call(opts, 'content')) setContent(opts.content);
    else original.forEach(function (node) { content.appendChild(node); });
    setEditable(opts.editable !== false);
    root.addEventListener('mousedown', keepSelection);
    root.addEventListener('click', onClick);
    content.addEventListener('input', onInput);
    viewport.addEventListener('scroll', syncScroll, { passive: true });
    syncScroll();
    instances.set(root, api);
    return api;
  }
  global.TextEditor = { mount: mount };
})(window);
