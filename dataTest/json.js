exports.json = `{
  "block": "warning",
  "content": [
      {
          "block!": "placeholder",
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
                  "mods": { "size": "l" }
              },
              {
                  "block": "warning",
                  "mods": { "size": "l" }
              },
              {
                  "jopa1": "text",
                  "mods1": { "size": "l" }
              }
          ]
      },
      {
          "jopa2": "text",
          "mods2": { "size": "l" }
      }
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
