// eslint-disable-next-line max-classes-per-file
const jsonMap = require("./json-source-map.js");
const Warning = require("./rule/Warning");
const Header = require("./rule/Header");
const Grid = require("./rule/Grid");

function reqcursion(obj, path = "", rule = {}) {
  rule = { ...rule };
  if (Array.isArray(obj)) {
    obj.forEach((e, i) => {
      reqcursion(e, `${path}/${i}`, rule);
    });
    return;
  }

  if (obj.block === "warning" && !obj.elem) {
    rule.warning = new Warning({ path });
  } else if (obj.block === "page" && !obj.elem) {
    rule.header = new Header();
  } else if (obj.block === "grid" && obj.mods) {
    rule.grid = new Grid({ path, total: +obj.mods["m-columns"] });
  } else if (obj.block === "grid" && obj.elemMods) {
    rule.grid.count = +obj.elemMods["m-col"];
  }

  if (obj.content && Array.isArray(obj.content)) {
    const newPath = `${path}/content`;
    reqcursion(obj.content, newPath, rule);
    return;
  }

  if (typeof obj.content === "object" && obj.content !== null) {
    const newPath = `${path}/content`;
    reqcursion(obj.content, newPath, rule);
    return;
  }

  if (rule.hasOwnProperty("warning")) {
    Warning.check.call(this, obj, rule.warning, path);
  } else if (rule.hasOwnProperty("header")) {
    Header.check.call(this, obj, rule.header, path);
  } else if (rule.hasOwnProperty("grid")) {
    Grid.check.call(this, obj, rule.grid, path);
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
