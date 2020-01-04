exports.warning = `{
  "block": "warning",
  "content": [
      {
          "block": "placeholder",
          "mods": { "size": "xl" }
      },
      {
          "elem": "content",
          "content": [
              {
                  "block": "text",
                  "mods": { "size": "m" }
              },
              {
                  "block": "text",
                  "mods": { "size": "s" }
              },
              { "block": "placeholder", "mods": { "size": "l" } },
              { "block": "button", "mods": { "size": "l" } }
          ]
      },
      {
        "block": "placeholder",
        "mods": { "size": "m" }
      },
      { "block": "button", "mods": { "size": "s" } }
  ]
}`;

exports.warningError = [
  {
    code: "WARNING.INVALID_PLACEHOLDER_SIZE",
    error: "Недопустимые размеры для блока placeholder",
    location: { start: { column: 7, line: 4 }, end: { column: 8, line: 7 } }
  },
  {
    code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
    error: "Тексты в блоке warning должны быть одного размера",
    location: { start: { column: 1, line: 1 }, end: { column: 2, line: 29 } }
  },
  {
    code: "WARNING.INVALID_BUTTON_POSITION",
    error: "Блок button не может находиться перед блоком placeholder",
    location: { start: { column: 15, line: 20 }, end: { column: 61, line: 20 } }
  },
  {
    code: "WARNING.INVALID_BUTTON_SIZE",
    error: "Размер кнопки блока warning должен быть на 1 шаг больше текста",
    location: { start: { column: 7, line: 27 }, end: { column: 53, line: 27 } }
  }
];
