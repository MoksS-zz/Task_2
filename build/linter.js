const escapedChars = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  '"': '"',
  "/": "/",
  "\\": "\\"
};

const A_CODE = "a".charCodeAt();

const parse = (source, _, options) => {
  const pointers = {};
  let line = 0;
  let column = 0;
  let pos = 0;
  const bigint = options && options.bigint && typeof BigInt !== "undefined";
  return {
    data: _parse("", true),
    pointers
  };

  function _parse(ptr, topLevel) {
    whitespace();
    let data;
    map(ptr, "value");
    const char = getChar();
    switch (char) {
      case "t":
        read("rue");
        data = true;
        break;
      case "f":
        read("alse");
        data = false;
        break;
      case "n":
        read("ull");
        data = null;
        break;
      case '"':
        data = parseString();
        break;
      case "[":
        data = parseArray(ptr);
        break;
      case "{":
        data = parseObject(ptr);
        break;
      default:
        backChar();
        if ("-0123456789".indexOf(char) >= 0) data = parseNumber();
        else unexpectedToken();
    }
    map(ptr, "valueEnd");
    whitespace();
    if (topLevel && pos < source.length) unexpectedToken();
    return data;
  }

  function whitespace() {
    // eslint-disable-next-line no-labels
    loop: while (pos < source.length) {
      switch (source[pos]) {
        case " ":
          column++;
          break;
        case "\t":
          column += 4;
          break;
        case "\r":
          column = 0;
          break;
        case "\n":
          column = 0;
          line++;
          break;
        default:
          // eslint-disable-next-line no-labels
          break loop;
      }
      pos++;
    }
  }

  function parseString() {
    let str = "";
    let char;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      char = getChar();
      if (char === '"') {
        break;
      } else if (char === "\\") {
        char = getChar();
        if (char in escapedChars) str += escapedChars[char];
        else if (char === "u") str += getCharCode();
        else wasUnexpectedToken();
      } else {
        str += char;
      }
    }
    return str;
  }

  function parseNumber() {
    let numStr = "";
    let integer = true;
    if (source[pos] === "-") numStr += getChar();

    numStr += source[pos] === "0" ? getChar() : getDigits();

    if (source[pos] === ".") {
      numStr += getChar() + getDigits();
      integer = false;
    }

    if (source[pos] === "e" || source[pos] === "E") {
      numStr += getChar();
      if (source[pos] === "+" || source[pos] === "-") numStr += getChar();
      numStr += getDigits();
      integer = false;
    }

    const result = +numStr;
    return bigint &&
      integer &&
      (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER)
      ? BigInt(numStr)
      : result;
  }

  function parseArray(ptr) {
    whitespace();
    const arr = [];
    let i = 0;
    if (getChar() === "]") return arr;
    backChar();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const itemPtr = `${ptr}/${i}`;
      arr.push(_parse(itemPtr));
      whitespace();
      const char = getChar();
      if (char === "]") break;
      if (char !== ",") wasUnexpectedToken();
      whitespace();
      i++;
    }
    return arr;
  }

  function parseObject(ptr) {
    whitespace();
    const obj = {};
    if (getChar() === "}") return obj;
    backChar();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const loc = getLoc();
      if (getChar() !== '"') wasUnexpectedToken();
      const key = parseString();
      const propPtr = `${ptr}/${escapeJsonPointer(key)}`;
      mapLoc(propPtr, "key", loc);
      map(propPtr, "keyEnd");
      whitespace();
      if (getChar() !== ":") wasUnexpectedToken();
      whitespace();
      obj[key] = _parse(propPtr);
      whitespace();
      const char = getChar();
      if (char === "}") break;
      if (char !== ",") wasUnexpectedToken();
      whitespace();
    }
    return obj;
  }

  function read(str) {
    for (let i = 0; i < str.length; i++)
      if (getChar() !== str[i]) wasUnexpectedToken();
  }

  function getChar() {
    checkUnexpectedEnd();
    const char = source[pos];
    pos++;
    column++; // new line?
    return char;
  }

  function backChar() {
    pos--;
    column--;
  }

  function getCharCode() {
    let count = 4;
    let code = 0;
    while (count--) {
      code <<= 4;
      const char = getChar().toLowerCase();
      if (char >= "a" && char <= "f") code += char.charCodeAt() - A_CODE + 10;
      else if (char >= "0" && char <= "9") code += +char;
      else wasUnexpectedToken();
    }
    return String.fromCharCode(code);
  }

  function getDigits() {
    let digits = "";
    while (source[pos] >= "0" && source[pos] <= "9") digits += getChar();

    if (digits.length) return digits;
    checkUnexpectedEnd();
    unexpectedToken();
  }

  function map(ptr, prop) {
    mapLoc(ptr, prop, getLoc());
  }

  function mapLoc(ptr, prop, loc) {
    pointers[ptr] = pointers[ptr] || {};
    pointers[ptr][prop] = loc;
  }

  function getLoc() {
    return {
      line: line + 1,
      column: column + 1
    };
  }

  function unexpectedToken() {
    throw new SyntaxError(
      `Unexpected token ${source[pos]} in JSON at position ${pos}`
    );
  }

  function wasUnexpectedToken() {
    backChar();
    unexpectedToken();
  }

  function checkUnexpectedEnd() {
    if (pos >= source.length)
      throw new SyntaxError("Unexpected end of JSON input");
  }
};

const stringify = (data, _, options) => {
  if (!validType(data)) return;
  let wsLine = 0;
  let wsColumn;
  let whitespace = typeof options === "object" ? options.space : options;
  switch (typeof whitespace) {
    case "number":
      const len =
        // eslint-disable-next-line no-nested-ternary
        whitespace > 10 ? 10 : whitespace < 0 ? 0 : Math.floor(whitespace);
      whitespace = len && repeat(len, " ");
      wsColumn = len;
      break;
    case "string":
      whitespace = whitespace.slice(0, 10);
      wsColumn = 0;
      for (let j = 0; j < whitespace.length; j++) {
        const char = whitespace[j];
        switch (char) {
          case " ":
            wsColumn++;
            break;
          case "\t":
            wsColumn += 4;
            break;
          case "\r":
            wsColumn = 0;
            break;
          case "\n":
            wsColumn = 0;
            wsLine++;
            break;
          default:
            throw new Error("whitespace characters not allowed in JSON");
        }
        wsPos++;
      }
      break;
    default:
      whitespace = undefined;
  }

  let json = "";
  const pointers = {};
  let line = 0;
  let column = 0;
  const es6 = options && options.es6 && typeof Map === "function";
  _stringify(data, 0, "");
  return {
    json,
    pointers
  };

  function _stringify(_data, lvl, ptr) {
    map(ptr, "value");
    switch (typeof _data) {
      case "number":
      case "bigint":
      case "boolean":
        out(`${_data}`);
        break;
      case "string":
        out(quoted(_data));
        break;
      case "object":
        if (_data === null) {
          out("null");
        } else if (typeof _data.toJSON === "function") {
          out(quoted(_data.toJSON()));
        } else if (Array.isArray(_data)) {
          stringifyArray();
        } else if (es6) {
          if (_data.constructor.BYTES_PER_ELEMENT) stringifyArray();
          else if (_data instanceof Map) stringifyMapSet();
          else if (_data instanceof Set) stringifyMapSet(true);
          else stringifyObject();
        } else {
          stringifyObject();
        }
    }
    map(ptr, "valueEnd");

    function stringifyArray() {
      if (_data.length) {
        out("[");
        const itemLvl = lvl + 1;
        for (let i = 0; i < _data.length; i++) {
          if (i) out(",");
          indent(itemLvl);
          const item = validType(_data[i]) ? _data[i] : null;
          const itemPtr = `${ptr}/${i}`;
          _stringify(item, itemLvl, itemPtr);
        }
        indent(lvl);
        out("]");
      } else {
        out("[]");
      }
    }

    function stringifyObject() {
      const keys = Object.keys(_data);
      if (keys.length) {
        out("{");
        const propLvl = lvl + 1;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = _data[key];
          if (validType(value)) {
            if (i) out(",");
            const propPtr = `${ptr}/${escapeJsonPointer(key)}`;
            indent(propLvl);
            map(propPtr, "key");
            out(quoted(key));
            map(propPtr, "keyEnd");
            out(":");
            if (whitespace) out(" ");
            _stringify(value, propLvl, propPtr);
          }
        }
        indent(lvl);
        out("}");
      } else {
        out("{}");
      }
    }

    function stringifyMapSet(isSet) {
      if (_data.size) {
        out("{");
        const propLvl = lvl + 1;
        let first = true;
        const entries = _data.entries();
        let entry = entries.next();
        while (!entry.done) {
          const item = entry.value;
          const key = item[0];
          const value = isSet ? true : item[1];
          if (validType(value)) {
            if (!first) out(",");
            first = false;
            const propPtr = `${ptr}/${escapeJsonPointer(key)}`;
            indent(propLvl);
            map(propPtr, "key");
            out(quoted(key));
            map(propPtr, "keyEnd");
            out(":");
            if (whitespace) out(" ");
            _stringify(value, propLvl, propPtr);
          }
          entry = entries.next();
        }
        indent(lvl);
        out("}");
      } else {
        out("{}");
      }
    }
  }

  function out(str) {
    column += str.length;
    json += str;
  }

  function indent(lvl) {
    if (whitespace) {
      json += `\n${repeat(lvl, whitespace)}`;
      line++;
      column = 0;
      while (lvl--) {
        if (wsLine) {
          line += wsLine;
          column = wsColumn;
        } else {
          column += wsColumn;
        }
      }
    }
  }

  function map(ptr, prop) {
    pointers[ptr] = pointers[ptr] || {};
    pointers[ptr][prop] = {
      line: line + 1,
      column: column + 1
    };
  }

  function repeat(n, str) {
    return Array(n + 1).join(str);
  }
};

const VALID_TYPES = ["number", "bigint", "boolean", "string", "object"];

function validType(data) {
  return VALID_TYPES.indexOf(typeof data) >= 0;
}

const ESC_QUOTE = /"|\\/g;
const ESC_B = /[\b]/g;
const ESC_F = /\f/g;
const ESC_N = /\n/g;
const ESC_R = /\r/g;
const ESC_T = /\t/g;

function quoted(str) {
  str = str
    .replace(ESC_QUOTE, "\\$&")
    .replace(ESC_F, "\\f")
    .replace(ESC_B, "\\b")
    .replace(ESC_N, "\\n")
    .replace(ESC_R, "\\r")
    .replace(ESC_T, "\\t");
  return `"${str}"`;
}

const ESC_0 = /~/g;
const ESC_1 = /\//g;

function escapeJsonPointer(str) {
  return str.replace(ESC_0, "~0").replace(ESC_1, "~1");
}

//   __/\\\\\\_________________________________________
//    _\////\\\_________________________________________
//     ____\/\\\______/\\\_____________________/\\\______
//      ____\/\\\_____\///____/\\/\\\\\\_____/\\\\\\\\\\\_
//       ____\/\\\______/\\\__\/\\\////\\\___\////\\\////__
//        ____\/\\\_____\/\\\__\/\\\__\//\\\_____\/\\\______
//         ____\/\\\_____\/\\\__\/\\\___\/\\\_____\/\\\_/\\__
//          __/\\\\\\\\\__\/\\\__\/\\\___\/\\\_____\//\\\\\___
//           _\/////////___\///___\///____\///_______\/////____

const jsonMap = {
  parse,
  stringify
};

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

// eslint-disable-next-line no-unused-vars
function lint(str) {
  const obj = jsonMap.parse(str);

  this.errors = [];
  this.pointers = obj.pointers;

  const req = reqcursion.bind(this);
  req(obj.data);

  return this.errors;
}
