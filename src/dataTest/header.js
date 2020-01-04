exports.head = `{
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
}`;

exports.headError = [
  {
    code: "TEXT.INVALID_H3_POSITION",
    error: "Заголовок h3 не может находиться перед заголовком h2",
    location: { start: { column: 7, line: 4 }, end: { column: 8, line: 10 } }
  },
  {
    code: "TEXT.INVALID_H2_POSITION",
    error: "Заголовок h2  не может находиться перед заголовком h1",
    location: { start: { column: 23, line: 19 }, end: { column: 24, line: 25 } }
  },
  {
    code: "TEXT.SEVERAL_H1",
    error: "Заголовок h1 на странице должен быть единственным",
    location: { start: { column: 36, line: 38 }, end: { column: 26, line: 44 } }
  }
];
