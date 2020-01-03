// eslint-disable-next-line max-classes-per-file
const jsonMap = require("./json-source-map.js");

const size = [
  "xxxs",
  "xxs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "xxxl",
  "xxxxl",
  "xxxxxl"
];

class Warning {
  constructor(obj) {
    this.text = {
      code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
      mods: { size: obj.size || "none" },
      error: "Тексты в блоке warning должны быть одного размера",
      pass: true
    };

    this.button = {
      code: "WARNING.INVALID_BUTTON_SIZE",
      error: "Размер кнопки блока warning должен быть на 1 шаг больше текста",
      mods: { size: obj.size || "none" },
      path: []
    };

    this.placeholder = {
      code: "WARNING.INVALID_PLACEHOLDER_SIZE",
      error: "Недопустимые размеры для блока placeholder",
      mods: { size: ["s", "m", "l"] }
    };

    this.sequence = {
      code: "WARNING.INVALID_BUTTON_POSITION",
      error: "Блок button не может находиться перед блоком placeholder",
      button: []
    };

    this.path = obj.path;
  }

  static check(obj, rule, path) {
    if (obj.block === "text") {
      if (rule.text.mods.size === "none") {
        const sizeButton = size[size.indexOf(obj.mods.size) + 1];
        rule.text.mods.size = obj.mods.size;

        if (rule.button.mods.size === "none") {
          rule.button.path.forEach(e => {
            if (e.size === sizeButton) return;
            this.errors.push({
              code: rule.button.code,
              error: rule.button.error,
              location: {
                start: {
                  column: this.pointers[e.path].value.column,
                  line: this.pointers[e.path].value.line
                },
                end: {
                  column: this.pointers[e.path].valueEnd.column,
                  line: this.pointers[e.path].valueEnd.line
                }
              }
            });
          });

          rule.button.path.length = 0;
        }

        rule.button.mods.size = sizeButton;
        return;
      }

      if (rule.text.mods.size !== obj.mods.size && rule.text.pass) {
        this.errors.push({
          code: rule.text.code,
          error: rule.text.error,
          location: {
            start: {
              column: this.pointers[rule.path].value.column,
              line: this.pointers[rule.path].value.line
            },
            end: {
              column: this.pointers[rule.path].valueEnd.column,
              line: this.pointers[rule.path].valueEnd.line
            }
          }
        });

        rule.text.pass = false;
      }
      return;
    }

    if (obj.block === "button") {
      rule.sequence.button.push(path);

      if (rule.button.mods.size === "none") {
        rule.button.path.push({ size: obj.mods.size, path });
        return;
      }

      if (rule.button.mods.size !== obj.mods.size) {
        this.errors.push({
          code: rule.button.code,
          error: rule.button.error,
          location: {
            start: {
              column: this.pointers[path].value.column,
              line: this.pointers[path].value.line
            },
            end: {
              column: this.pointers[path].valueEnd.column,
              line: this.pointers[path].valueEnd.line
            }
          }
        });
      }
      return;
    }

    if (obj.block === "placeholder") {
      if (rule.sequence.button.length > 0) {
        rule.sequence.button.forEach(e => {
          this.errors.push({
            code: rule.sequence.code,
            error: rule.sequence.error,
            location: {
              start: {
                column: this.pointers[e].value.column,
                line: this.pointers[e].value.line
              },
              end: {
                column: this.pointers[e].valueEnd.column,
                line: this.pointers[e].valueEnd.line
              }
            }
          });
        });
        rule.sequence.button.length = 0;
      }
      if (!rule.placeholder.mods.size.includes(obj.mods.size)) {
        this.errors.push({
          code: rule.placeholder.code,
          error: rule.placeholder.error,
          location: {
            start: {
              column: this.pointers[path].value.column,
              line: this.pointers[path].value.line
            },
            end: {
              column: this.pointers[path].valueEnd.column,
              line: this.pointers[path].valueEnd.line
            }
          }
        });
      }
    }
  }
}

class Header {
  constructor() {
    this.h1 = {
      code: "TEXT.SEVERAL_H1",
      error: "Заголовок h1 на странице должен быть единственным",
      available: false,
      pass: true
    };

    this.h2 = {
      code: "TEXT.INVALID_H2_POSITION",
      error: "Заголовок h2  не может находиться перед заголовком h1",
      available: false,
      path: []
    };

    this.h3 = {
      code: "TEXT.INVALID_H3_POSITION",
      error: "Заголовок h3 не может находиться перед заголовком h2",
      available: false,
      path: []
    };
  }

  static check(obj, rule, path) {
    if (obj.block !== "text") return;

    if (obj.mods.type === "h1") {
      if (rule.h2.available && rule.h2.path.length !== 0) {
        rule.h2.path.forEach(e => {
          this.errors.push({
            code: rule.h2.code,
            error: rule.h2.error,
            location: {
              start: {
                column: this.pointers[e].value.column,
                line: this.pointers[e].value.line
              },
              end: {
                column: this.pointers[e].valueEnd.column,
                line: this.pointers[e].valueEnd.line
              }
            }
          });
        });
        rule.h2.path.length = 0;
      }

      if (!rule.h1.available) {
        rule.h1.available = true;
        return;
      }

      if (rule.h1.pass) {
        this.errors.push({
          code: rule.h1.code,
          error: rule.h1.error,
          location: {
            start: {
              column: this.pointers[path].value.column,
              line: this.pointers[path].value.line
            },
            end: {
              column: this.pointers[path].valueEnd.column,
              line: this.pointers[path].valueEnd.line
            }
          }
        });

        rule.h1.pass = false;
      }

      return;
    }

    if (obj.mods.type === "h2") {
      rule.h2.available = true;
      rule.h2.path.push(path);

      if (rule.h3.available && rule.h3.path.length !== 0) {
        rule.h3.path.forEach(e => {
          this.errors.push({
            code: rule.h3.code,
            error: rule.h3.error,
            location: {
              start: {
                column: this.pointers[e].value.column,
                line: this.pointers[e].value.line
              },
              end: {
                column: this.pointers[e].valueEnd.column,
                line: this.pointers[e].valueEnd.line
              }
            }
          });
        });
        rule.h3.path.length = 0;
      }

      return;
    }

    if (obj.mods.type === "h3") {
      rule.h3.available = true;
      rule.h3.path.push(path);
    }
  }
}

function reqcursion(obj, path = "", rule = {}) {
  rule = { ...rule };

  if (Array.isArray(obj)) {
    obj.forEach((e, i) => {
      reqcursion(e, `${path}/${i}`, rule);
    });
    return;
  }

  if (obj.block === "warning") {
    rule.warning = new Warning({ path });
  }

  if (obj.hasOwnProperty("content")) {
    const newPath = `${path}/content`;
    reqcursion(obj.content, newPath, rule);
    return;
  }

  if (rule.hasOwnProperty("warning")) {
    Warning.check.call(this, obj, rule.warning, path);
  }

  if (rule.hasOwnProperty("header")) {
    Header.check.call(this, obj, rule.header, path);
  }
}

/**
 * @param {string} str
 */

function lint(str) {
  const obj = jsonMap.parse(str);

  this.errors = [];
  this.pointers = obj.pointers;
  const req = reqcursion.bind(this);
  const path = "";
  req(obj.data, path, { header: new Header() });

  return this.errors;
}

module.exports = lint;
