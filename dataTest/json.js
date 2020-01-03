exports.json = `{
  "block": "warning",
  "content": [
      {
          "block": "placeholder",
          "mods": { "size": "m" }
      },
      {
          "elem": "content",
          "content": [
              { "block": "button", "mods": { "size": "s" } },
              {
                  "block": "text",
                  "mods": { "size": "m" }
              },
              {
                  "block": "text",
                  "mods": { "size": "l" }
              },
              {
                "block": "text",
                "mods": { "type": "h1" }
              },
              {
                "block": "text",
                "mods": { "type": "h1" }
              },
              { "block": "warning",
                "content": [
                  { "block": "button", "mods": { "size": "l" } },
                  {
                      "block": "placeholder",
                      "mods": { "size": "m" }
                  },
                  { "block": "button", "mods": { "size": "l" } },
                  {
                    "block": "text",
                    "mods": { "size": "m" }
                  }
                ]
              }
          ]
      },
      { "block": "button", "mods": { "size": "l" } },
      { "block": "placeholder", "mods": { "size": "xl" } },
      {
        "block": "text",
        "mods": { "size": "s" }
      },
      { "block": "button", "mods": { "size": "xxl" } }
  ]
}`;

exports.jsonValid = `{
  "block": "warning",
  "content": [
      {
          "block": "placeholder",
          "mods": { "size": "m" }
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
                  "mods": { "size": "m" }
              },
              { "block": "placeholder", "mods": { "size": "l" } },
              { "block": "button", "mods": { "size": "l" } }
          ]
      },
      {
        "block": "placeholder",
        "mods": { "size": "m" }
      },
      { "block": "button", "mods": { "size": "l" } }
  ]
}`;

exports.jsonError = [
  {
    code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
    error: "Тексты в блоке warning должны быть одного размера",
    location: {
      start: { column: 1, line: 1 },
      end: { column: 2, line: 22 }
    }
  }
];
