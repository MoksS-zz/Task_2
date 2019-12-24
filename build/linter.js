const json = `{
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
                  "mods": { "size": "l" }
              }
          ]
      }
  ]
}`;

/**
 * @param {string} str
 */

function lint(str) {
  const arr = str.split("\n");
  return arr.length;
}

console.log(lint(json));
