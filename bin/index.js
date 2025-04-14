#!/usr/bin/env node

const download = require("../src/downloader.js");
const init = require("../src/init.js");

const help = `        __         __                __             __       
  __ __/ /________/ /__ _    _____  / /__  ___ ____/ /__ ____
 / // / __/___/ _  / _ \\ |/|/ / _ \\/ / _ \\/ _ \`/ _  / -_) __/
 \\_, /\\__/    \\_,_/\\___/__,__/_//_/_/\\___/\\_,_/\\_,_/\\__/_/   
/___/                                                        

downloads youtube videos from a given url!

Usage:
  yt-downloader download <url> [path]
  yt-downloader init [-r] [-t gh_token]

  url   url of the video
  path  the output path
  -r    replaces the binaries with new ones
  -t    specifies the Github Token (not necessary!!)

The downloader must be initialized with 'yt-downloader init', if not already done at installation!

Made by Julizey
Licensed under MIT
`;

const argv = process.argv;
for (let i = 0; i < argv.length; i++) argv[i] = argv[i].replace("--", "-");
const cmd = argv[2];
if (cmd === "download") {
  download(argv[3], argv[4]);
} else if (cmd === "init") {
  const gh_token = argv[argv.indexOf("-t") + 1] || "";
  const refresh = argv.indexOf("-r") !== -1;
  init(refresh, gh_token);
} else if (cmd === "help" || !cmd || argv.indexOf("--help")) {
  console.log("No command specified! See help:");
  console.log(help);
} else if (typeof cmd === "string" && cmd.length > 0) {
  console.log("Invalid Command! Use 'yt-downloader help' for more info!");
}

module.exports = { init, download };
