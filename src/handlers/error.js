/**
 * @param {string} path - The block path
 * @param {object} obj - An object containing a code and a rule error
 * @param self - The this to access arrays pointers and errors
 */

module.exports = (self, obj, path) => {
  self.errors.push({
    code: obj.code,
    error: obj.error,
    location: {
      start: {
        column: self.pointers[path].value.column,
        line: self.pointers[path].value.line
      },
      end: {
        column: self.pointers[path].valueEnd.column,
        line: self.pointers[path].valueEnd.line
      }
    }
  });
};
