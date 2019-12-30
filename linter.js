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

  for (const el in obj) {
    const newPath = `${path}/${el}`;

    if (el === "block" && obj[el] === "warning") {
      console.log("\nхуита\n");
      rule.warning = new Warning({ path });
    }

    console.log(`---- > \n Елемент ${el}\n Path ${newPath}\n Правила`, rule);

    if (el === "content") {
      reqcursion(obj[el], newPath, rule);
      return;
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
