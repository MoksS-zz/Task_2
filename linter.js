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
      mods: { size: obj.size || "none" }
    };

    this.button = {
      mods: { size: obj.size || "none" }
    };

    this.placeholder = {
      mods: { size: ["s", "m", "l"] }
    };

    this.path = obj.path;
  }
}

function reqcursion(obj, path = "") {
  if (Array.isArray(obj)) {
    obj.forEach((e, i) => {
      reqcursion(e, `${path}/${i}`);
    });
    return;
  }

  for (const el in obj) {
    const newPath = `${path}/${el}`;

    if (el === "block" && obj[el] === "warning") {
      console.log("хуита");
    }

    console.log(`---- > \n Елемент ${el}\n Path ${newPath} `);

    if (el === "content") {
      reqcursion(obj[el], newPath);
      return;
    }
  }
}

/**
 * @param {string} str
 */

function lint(str) {
  const errors = [];
  const obj = jsonMap.parse(str);
  const req = reqcursion.bind(this);
  req(obj.data);
  return errors;
}

module.exports = lint;
