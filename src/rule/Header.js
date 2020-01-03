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

module.exports = Header;
