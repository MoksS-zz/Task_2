exports.head = `{
  "block": "lexa",
  "content": [
      {
      "block": "text",
      "mods": { "type": "h3" }
      },
      {
        "block": "text",
        "mods": { "type": "h3" }
      },
      {
      "block": "text",
      "mods": { "type": "h2" }
      },
      {
        "block": "text",
        "mods": { "type": "h2" }
      },
      {
        "block": "text",
        "mods": { "type": "h1" }
      },
      {
          "elem": "content",
          "content": [
              {
                  "block": "text",
                  "mods": { "type": "h1" }
              },
              {
                  "block": "text",
                  "mods": { "type": "h1" }
              },
              {
                "block": "text",
                "mods": { "size": "s" }
              }
          ]
      },
      {
          "block": "text",
          "mods": { "type": "h2" }
      }
  ]
}`;

exports.headValid = `{
  "block": "text",
  "mods": { "type": "h1" },
  "content": [
      {
          "block": "text",
          "mods": { "type": "h2" }
      },
      {
          "elem": "content",
          "content": [
              {
                  "block": "text",
                  "mods": { "type": "h2" }
              },
              {
                  "block": "text",
                  "mods": { "type": "h3" }
              },
              {
                "block": "text",
                "mods": { "type": "h3" }
              }
          ]
      },
      {
        "block": "text",
        "mods": { "type": "h3" }
      }
  ]
}`;
