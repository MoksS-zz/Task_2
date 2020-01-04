exports.head = `{
  "block": "page",
  "content": [
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
                              "type": "h1"
                          },
                          "content": "header"
                      },
                      {
                          "block": "text",
                          "content": "text"
                      }
                  ]
              }
          ]
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
                          "block": "text",
                          "content": "text"
                      }
                  ]
              }
          ]
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
