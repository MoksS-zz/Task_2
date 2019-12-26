const parse = require("json-to-ast");

/**
 * @param {string} str
 */

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
  },
  
};

function lint(str) {
  return parse(str);
}

module.exports = lint;
