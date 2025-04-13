const download = require("./downloader.js");
const init = require("./init.js");

const argv = process.argv;
if (argv[2] === "download") {
  download(argv[3], argv[4]);
} else if (argv[2] === "init") {
  const gh_token = process.argv[process.argv.indexOf("-t") + 1] || "";
  const refresh = process.argv.indexOf("-r") !== -1
  init(refresh, gh_token);
}
