const market = new Set(["commercial", "offer"]);

class Grid {
  constructor(obj) {
    this.code = "GRID.TOO_MUCH_MARKETING_BLOCKS";
    this.error = "маркетинговые блоки занимают больше половины блока grid";
    this.count = 0;
    this.total = obj.total;
    this.market = 0;
    this.path = obj.path;
  }

  static check(obj, rule) {
    if (market.has(obj.block)) {
      rule.market += rule.count;

      if (rule.total / 2 < rule.market) {
        this.errors.push({
          code: rule.code,
          error: rule.error,
          location: {
            start: {
              column: this.pointers[rule.path].value.column,
              line: this.pointers[rule.path].value.line
            },
            end: {
              column: this.pointers[rule.path].valueEnd.column,
              line: this.pointers[rule.path].valueEnd.line
            }
          }
        });
      }
    }
  }
}

module.exports = Grid;
