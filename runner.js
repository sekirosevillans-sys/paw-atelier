const fs = require("fs");
const path = require("path");

const realCwd = fs.realpathSync(process.cwd());
process.chdir(realCwd);

process.argv = [
  process.argv[0],
  require.resolve("next/dist/bin/next"),
  "dev",
  "--turbo",
  "-p",
  "3000",
];

require("next/dist/bin/next");
