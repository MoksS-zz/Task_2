exports.grid = `{
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
}`;

exports.gridError = [
  {
    code: "GRID.TOO_MUCH_MARKETING_BLOCKS",
    error: "маркетинговые блоки занимают больше половины блока grid",
    location: { start: { column: 1, line: 1 }, end: { column: 2, line: 32 } }
  }
];
