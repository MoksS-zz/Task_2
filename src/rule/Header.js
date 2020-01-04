const error = require("../handlers/error");

class Header {
  constructor() {
    this.h1 = {
      code: "TEXT.SEVERAL_H1",
      error: "Заголовок h1 на странице должен быть единственным",
      available: false
    };

    this.h2 = {
      code: "TEXT.INVALID_H2_POSITION",
      error: "Заголовок h2  не может находиться перед заголовком h1",
      path: []
    };

    this.h3 = {
      code: "TEXT.INVALID_H3_POSITION",
      error: "Заголовок h3 не может находиться перед заголовком h2",
      path: []
    };
  }

  static check(obj, rule, path) {
    if (obj.block !== "text") return;
    switch (obj.mods.type) {
      case "h1":
        if (rule.h1.available) {
          error(this, rule.h1, path);
        }
        rule.h1.available = true;

        if (rule.h2.path.length > 0) {
          rule.h2.path.forEach(e => {
            error(this, rule.h2, e);
          });
          rule.h2.path.length = 0;
        }
        break;

      case "h2":
        rule.h2.path.push(path);

        if (rule.h3.path.length > 0) {
          rule.h3.path.forEach(e => {
            error(this, rule.h3, e);
          });
          rule.h3.path.length = 0;
        }
        break;

      case "h3":
        rule.h3.path.push(path);
        break;
    }
  }
}

module.exports = Header;
