const error = require("../handlers/error");

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
      pathText: [],
      pathPlacholder: []
    };

    this.placeholder = {
      code: "WARNING.INVALID_PLACEHOLDER_SIZE",
      error: "Недопустимые размеры для блока placeholder",
      mods: { size: ["s", "m", "l"] }
    };

    this.sequence = {
      code: "WARNING.INVALID_BUTTON_POSITION",
      error: "Блок button не может находиться перед блоком placeholder"
    };

    this.path = obj.path;
  }

  static check(obj, rule, path) {
    if (obj.block === "text") {
      if (!obj.mods || !obj.mods.size) return;
      if (rule.text.mods.size === "none") {
        const sizeButton = size[size.indexOf(obj.mods.size) + 1];
        rule.text.mods.size = obj.mods.size;

        if (rule.button.mods.size === "none") {
          rule.button.pathText.forEach(e => {
            if (e.size === sizeButton) return;
            error(this, rule.button, e.path);
          });

          rule.button.pathText.length = 0;
        }

        rule.button.mods.size = sizeButton;
        return;
      }

      if (rule.text.mods.size !== obj.mods.size && rule.text.pass) {
        error(this, rule.text, rule.path);

        rule.text.pass = false;
      }
      return;
    }

    if (obj.block === "button") {
      rule.button.pathPlacholder.push(path);

      if (!obj.mods) return;

      if (rule.button.mods.size === "none") {
        rule.button.pathText.push({ size: obj.mods.size, path });
        return;
      }
      if (rule.button.mods.size !== obj.mods.size) {
        error(this, rule.button, path);
      }
      return;
    }

    if (obj.block === "placeholder") {
      if (rule.button.pathPlacholder.length > 0) {
        rule.button.pathPlacholder.forEach(e => {
          error(this, rule.sequence, e);
        });
        rule.button.pathPlacholder.length = 0;
      }

      if (!obj.mods) return;

      if (!rule.placeholder.mods.size.includes(obj.mods.size)) {
        error(this, rule.placeholder, path);
      }
    }
  }
}

module.exports = Warning;
