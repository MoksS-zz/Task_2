/* eslint-disable no-unused-expressions */
const chalk = require("chalk");
const { performance } = require("perf_hooks");
const lint = require("./linter");

require("util").inspect.defaultOptions.depth = null;

const { warning, warningError } = require("./dataTest/warning");
const { head, headError } = require("./dataTest/header");
const { grid, gridError } = require("./dataTest/grid");
const { all, allErrors } = require("./dataTest/allRule");

const time = performance.now();

const headResult = lint(head);
const warningResult = lint(warning);
const gridResult = lint(grid);
const allRusult = lint(all);

JSON.stringify(headResult, null, 2) === JSON.stringify(headError, null, 2)
  ? console.log("Header rule", chalk.green("SUCCESS"))
  : console.log("Header rule", chalk.red("FAIL"));

JSON.stringify(warningResult, null, 2) === JSON.stringify(warningError, null, 2)
  ? console.log("Warning rule", chalk.green("SUCCESS"))
  : console.log("Warning rule", chalk.red("FAIL"));

JSON.stringify(gridResult, null, 2) === JSON.stringify(gridError, null, 2)
  ? console.log("Grid rule", chalk.green("SUCCESS"))
  : console.log("Grid rule", chalk.red("FAIL"));

JSON.stringify(allRusult, null, 2) === JSON.stringify(allErrors, null, 2)
  ? console.log("allRusult", chalk.green("SUCCESS"))
  : console.log("allRusult", chalk.red("FAIL"));

const timeEnd = performance.now();
console.log(`${(timeEnd - time).toFixed(1)}ms \n`);
