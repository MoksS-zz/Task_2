// const parse = require("json-to-ast");
const jsonMap = require("json-source-map");

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

/**
 * @param {string} str
 */

function reqcursion(obj, path = "") {
  if (Array.isArray(obj)) {
    obj.forEach((e, i) =>{
      reqcursion(e, `${path}/${i}`);
    });
    return;
  }

  // const rule = [];

  for (const el in obj) {
    const pat = `${path}/${el}`;
    if (obj[el] === "warning") {
      console.log("work");
    }

    if (el === "content") {
      reqcursion(obj[el], pat);
    }
    console.log(el, pat);
  }
}

function lint(str) {
  const errors = [];
  const obj = jsonMap.parse(str);

  console.log(obj);
  reqcursion(obj.data);

  return errors;
}

module.exports = lint;
