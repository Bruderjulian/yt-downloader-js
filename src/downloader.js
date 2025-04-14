const { existsSync } = require("fs");

const exec = require("child_process").exec;
const join = require("path").join;

const ytdlp_path = escapePath(join(__dirname, "../", "/yt-dlp.exe"));
const ffmpeg_path = escapePath(
  join(__dirname, "../", `/ffmpeg${process.platform === "win32" ? ".exe" : ""}`)
);

async function download(url, output) {
  if (!url) throw new SyntaxError("No Url specified");
  if (!existsSync(ytdlp_path) || !existsSync(ffmpeg_path)) {
    return console.error(
      "Could not find required binaries! To likely resolve the issue run 'yt-downloader init'!"
    );
  }

  console.log("Downloading Video. May take a while!");
  const args = `${ytdlp_path} --ffmpeg-location ${ffmpeg_path} ${url}${
    output ? "--output " + output : ""
  }`;

  var child = exec(args);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on("error", function (err) {
    if (err) throw err;
    process.exit(1);
  });
  child.on("exit", function (code) {
    if (code != 0)
      throw new Error(`Failed to download video (code=${code}): ${url}`);
    process.exit(0);
  });
  child.on("close", function (code) {
    if (code != 0)
      throw new Error(`Failed to download video (code=${code}): ${url}`);
    process.exit(0);
  });
}

function escapePath(path) {
  return path.includes(" ") ? `"${path}"` : path;
}

module.exports = download;
