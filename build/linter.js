// const blocks = {
//   warning: {

//   }
// }

// console.log(blocks);
/**
 * @param {string} str
 */

function lint(str) {
  let arr = str.trim().split("\n");

  console.log(arr); // удалить, помогает дебажить
  arr = arr.map(e => e.trim());

  return arr.length;
}

module.exports = lint;
