const path = require("path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "linter"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "linter.js",
    chunkFilename: "[name].js"
  },
  resolve: {
    extensions: [".json", ".js", ".jsx"]
  },
  devtool: "source-map"
};
