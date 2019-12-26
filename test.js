const chalk = require("chalk");
const lint = require("./build/linter");

require("util").inspect.defaultOptions.depth = null;

const { json, jsonError } = require("./dataTest/json");

console.log(lint(json));



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
