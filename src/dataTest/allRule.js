exports.all = `{
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
        { "block": "button", "mods": { "size": "l" } },
        {
          "block": "page",
          "content": [
            {
              "block": "text",
              "mods": {
                "type": "h3"
              },
              "content": "header"
            },
            {
              "block": "page",
              "elem": "section",
              "content": [
                {
                  "block": "page",
                  "elem": "content",
                  "content": [
                    {
                      "block": "text",
                      "mods": {
                        "type": "h2"
                      },
                      "content": "header"
                    },
                    {
                      "block": "container",
                      "content": {
                        "block": "text",
                        "mods": {
                          "type": "h1"
                        },
                        "content": "header"
                      }
                    },
                    {
                      "block": "container",
                      "content": {
                        "block": "text",
                        "mods": {
                          "type": "h1"
                        },
                        "content": "header"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "block": "placeholder",
      "mods": { "size": "m" }
    },
    { "block": "button", "mods": { "size": "s" } },
    {
      "block": "grid",
      "mods": {
        "m-columns": "10"
      },
      "content": [
        {
          "block": "grid",
          "elem": "fraction",
          "elemMods": {
            "m-col": "2"
          },
          "content": [
            {
              "block": "payment"
            }
          ]
        },
        {
          "block": "grid",
          "elem": "fraction",
          "elemMods": {
            "m-col": "8"
          },
          "content": [
            {
              "block": "offer"
            }
          ]
        }
      ]
    }
  ]
}`;

exports.allErrors = [
  {
    code: "WARNING.INVALID_PLACEHOLDER_SIZE",
    error: "Недопустимые размеры для блока placeholder",
    location: { start: { column: 5, line: 4 }, end: { column: 6, line: 7 } }
  },
  {
    code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
    error: "Тексты в блоке warning должны быть одного размера",
    location: { start: { column: 1, line: 1 }, end: { column: 2, line: 112 } }
  },
  {
    code: "TEXT.INVALID_H3_POSITION",
    error: "Заголовок h3 не может находиться перед заголовком h2",
    location: { start: { column: 13, line: 24 }, end: { column: 14, line: 30 } }
  },
  {
    code: "TEXT.INVALID_H2_POSITION",
    error: "Заголовок h2  не может находиться перед заголовком h1",
    location: { start: { column: 21, line: 39 }, end: { column: 22, line: 45 } }
  },
  {
    code: "TEXT.SEVERAL_H1",
    error: "Заголовок h1 на странице должен быть единственным",
    location: { start: { column: 34, line: 58 }, end: { column: 24, line: 64 } }
  },
  {
    code: "WARNING.INVALID_BUTTON_POSITION",
    error: "Блок button не может находиться перед блоком placeholder",
    location: { start: { column: 9, line: 20 }, end: { column: 55, line: 20 } }
  },
  {
    code: "WARNING.INVALID_BUTTON_SIZE",
    error: "Размер кнопки блока warning должен быть на 1 шаг больше текста",
    location: { start: { column: 5, line: 78 }, end: { column: 51, line: 78 } }
  },
  {
    code: "GRID.TOO_MUCH_MARKETING_BLOCKS",
    error: "маркетинговые блоки занимают больше половины блока grid",
    location: { start: { column: 5, line: 79 }, end: { column: 6, line: 110 } }
  }
];
