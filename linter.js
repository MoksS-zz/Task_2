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
      pass: true
    };

    this.placeholder = {
      code: "WARNING.INVALID_PLACEHOLDER_SIZE",
      error: "Недопустимые размеры для блока placeholder",
      mods: { size: ["s", "m", "l"] },
      pass: true
    };

    this.sequence = {
      code: "WARNING.INVALID_BUTTON_POSITION",
      error: "Блок button не может находиться перед блоком placeholder",
      placeholder: false,
      button: false,
      pass: true
    };

    this.path = obj.path;
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

  // console.log(`---- > \n Елемент ${obj}\n Path ${path}\n Правила`, rule);

  if (obj.hasOwnProperty("content")) {
    const newPath = `${path}/content`;
    reqcursion(obj.content, newPath, rule);
    return;
  }

  if (rule.hasOwnProperty("warning")) {
    if (obj.block === "text") {
      if (rule.warning.text.mods.size === "none") {
        const sizeButton = size[size.indexOf(obj.mods.size) + 1];
        rule.warning.text.mods.size = obj.mods.size;

        if (
          rule.warning.button.mods.size !== "none" &&
          rule.warning.button.mods.size !== sizeButton
        ) {
          this.errors.push({
            code: rule.warning.button.code,
            error: rule.warning.button.error,
            location: {
              start: {
                column: this.pointers[rule.warning.path].value.column,
                line: this.pointers[rule.warning.path].value.line
              },
              end: {
                column: this.pointers[rule.warning.path].valueEnd.column,
                line: this.pointers[rule.warning.path].valueEnd.line
              }
            }
          });

          rule.warning.button.pass = false;
        }

        rule.warning.button.mods.size = sizeButton;
      }

      if (
        rule.warning.text.mods.size !== obj.mods.size &&
        rule.warning.text.pass
      ) {
        this.errors.push({
          code: rule.warning.text.code,
          error: rule.warning.text.error,
          location: {
            start: {
              column: this.pointers[rule.warning.path].value.column,
              line: this.pointers[rule.warning.path].value.line
            },
            end: {
              column: this.pointers[rule.warning.path].valueEnd.column,
              line: this.pointers[rule.warning.path].valueEnd.line
            }
          }
        });

        rule.warning.text.pass = false;
      }
    }

    if (obj.block === "button") {
      rule.warning.sequence.button = true;

      if (!rule.warning.sequence.placeholder && rule.warning.sequence.pass) {
        this.errors.push({
          code: rule.warning.sequence.code,
          error: rule.warning.sequence.error,
          location: {
            start: {
              column: this.pointers[rule.warning.path].value.column,
              line: this.pointers[rule.warning.path].value.line
            },
            end: {
              column: this.pointers[rule.warning.path].valueEnd.column,
              line: this.pointers[rule.warning.path].valueEnd.line
            }
          }
        });

        rule.warning.sequence.pass = false;
      }

      if (rule.warning.button.mods.size === "none") {
        rule.warning.button.mods.size = obj.mods.size;
        return;
      }

      if (
        rule.warning.button.mods.size !== obj.mods.size &&
        rule.warning.button.pass
      ) {
        this.errors.push({
          code: rule.warning.button.code,
          error: rule.warning.button.error,
          location: {
            start: {
              column: this.pointers[rule.warning.path].value.column,
              line: this.pointers[rule.warning.path].value.line
            },
            end: {
              column: this.pointers[rule.warning.path].valueEnd.column,
              line: this.pointers[rule.warning.path].valueEnd.line
            }
          }
        });
        rule.warning.button.pass = false;
      }
    }

    if (obj.block === "placeholder") {
      rule.warning.sequence.placeholder = true;

      if (rule.warning.sequence.button && rule.warning.sequence.pass) {
        this.errors.push({
          code: rule.warning.sequence.code,
          error: rule.warning.sequence.error,
          location: {
            start: {
              column: this.pointers[rule.warning.path].value.column,
              line: this.pointers[rule.warning.path].value.line
            },
            end: {
              column: this.pointers[rule.warning.path].valueEnd.column,
              line: this.pointers[rule.warning.path].valueEnd.line
            }
          }
        });

        rule.warning.sequence.pass = false;
      }

      if (
        !rule.warning.placeholder.mods.size.includes(obj.mods.size) &&
        rule.warning.placeholder.pass
      ) {
        this.errors.push({
          code: rule.warning.placeholder.code,
          error: rule.warning.placeholder.error,
          location: {
            start: {
              column: this.pointers[rule.warning.path].value.column,
              line: this.pointers[rule.warning.path].value.line
            },
            end: {
              column: this.pointers[rule.warning.path].valueEnd.column,
              line: this.pointers[rule.warning.path].valueEnd.line
            }
          }
        });

        rule.warning.placeholder.pass = false;
      }
    }
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
  req(obj.data);

  return this.errors;
}

module.exports = lint;
