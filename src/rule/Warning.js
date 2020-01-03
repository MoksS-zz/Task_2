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
      available: false,
      path: []
    };

    this.placeholder = {
      code: "WARNING.INVALID_PLACEHOLDER_SIZE",
      error: "Недопустимые размеры для блока placeholder",
      mods: { size: ["s", "m", "l"] },
      available: false
    };

    this.sequence = {
      code: "WARNING.INVALID_BUTTON_POSITION",
      error: "Блок button не может находиться перед блоком placeholder"
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
      if (rule.button.available && rule.placeholder.available) {
        rule.button.available = false;
        rule.placeholder.available = false;
      }
      if (!rule.placeholder.available) {
        this.errors.push({
          code: rule.sequence.code,
          error: rule.sequence.error,
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
      } else {
        rule.button.available = true;
      }

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
      if (rule.button.available && rule.placeholder.available) {
        rule.button.available = false;
        rule.placeholder.available = false;
      }
      rule.placeholder.available = true;

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

module.exports = Warning;
