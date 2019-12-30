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
      error: "Тексты в блоке warning должны быть одного размера"
    };

    this.button = {
      code: "WARNING.INVALID_BUTTON_SIZE",
      error: "Размер кнопки блока warning должен быть на 1 шаг больше текста",
      mods: { size: obj.size || "none" }
    };

    this.placeholder = {
      code: "WARNING.INVALID_PLACEHOLDER_SIZE",
      error: "Недопустимые размеры для блока placeholder",
      mods: { size: ["s", "m", "l"] }
    };

    this.shape = {
      code: "WARNING.INVALID_BUTTON_POSITION",
      error: "Блок button не может находиться перед блоком placeholder",
      shape: ["placeholder", "button"]
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
    console.log("\nхуита\n");
    rule.warning = new Warning({ path });
  }

  // console.log(`---- > \n Елемент ${el}\n Path ${newPath}\n Правила`, rule);

  if (obj.hasOwnProperty("content")) {
    const newPath = `${path}/content`;
    reqcursion(obj.content, newPath, rule);
    return;
  }

  if (rule.hasOwnProperty("warning")) {
    if (obj.block === "text" && obj.hasOwnProperty("mods")) {
      if (rule.warning.text.mods.size === "none") {
        rule.warning.text.mods.size = obj.mods.size;
        return; // переписать
      }

      if (rule.warning.text.mods.size !== obj.mods.size) {
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
