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

const warning = {
  text: null,
  button() {
    const sText = size.indexOf(this.text);
    return sText + 1 >= size.length ? "error" : size[sText + 1];
  }
};

/**
 * @param {string} str
 */

function reqcursion(obj) {
  console.log(obj);
//   const location = obj.loc;
//   console.log("location \n", location, "\n");
//   console.log(obj.children[0]);
//   for (let i = 0; i < obj.children.length; i++) {
//     if (obj.children[i].key.value === "content") {
//       console.log("Content ", true);
//       reqcursion(obj.children[i].value);
//     }
//   }
}

function lint(str) {
  const errors = [];
  const obj = jsonMap.parse(str);
  // const req = reqcursion.bind(this);

  reqcursion(obj);

  return errors;
}

module.exports = lint;
