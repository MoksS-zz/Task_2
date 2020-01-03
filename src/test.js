const chalk = require("chalk");
const { performance } = require("perf_hooks");
const lint = require("./linter");

require("util").inspect.defaultOptions.depth = null;

const { json, jsonError , jsonValid } = require("./dataTest/json");
const { head, headValid } = require("./dataTest/header");
const { grid, gridValid } = require("./dataTest/grid");

const time = performance.now();

// console.log(lint(head));
// console.log(lint(json));
console.log(lint(grid));

const timeEnd = performance.now();
console.log(`${(timeEnd - time).toFixed(1)}ms \n`);

// console.log("VALID JSON ---->\n", lint(jsonValid));
console.log("VALID JSON ---->\n", lint(gridValid));
// console.log("VALID JSON ---->\n", lint(headValid));

// console.log(chalk.yellow("Hello world!"));
// console.log(JSON.stringify(jsonError, null, 4));

// console.log(
//   JSON.stringify(jsonError, null, 4) ===
//     JSON.stringify(
//       [
//         {
//           code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
//           error: "Тексты в блоке warning должны быть одного размера",
//           location: {
//             start: { column: 1, line: 1 },
//             end: { column: 2, line: 22 }
//           }
//         }
//       ],
//       null,
//       4
//     )
// );