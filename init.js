"use strict";

const { mkdir, chmod, rm } = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");
const { createWriteStream, existsSync } = require("node:fs");
const { join } = require("path");

let platform = process.platform.toLowerCase();
platform =
  platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE)
    ? `win32`
    : platform === "darwin"
    ? "darwin"
    : [
        "aix",
        "android",
        "freebsd",
        "linux",
        "openbsd",
        "sunos",
        "unix",
      ].indexOf(platform) !== -1
    ? "linux"
    : null;

if (platform === null) {
  console.log("Couldn't recognize Platform! Using Linux as default instead!");
  platform = "linux";
}

const yt_dl_fileName =
  platform === "win32"
    ? `yt-dlp.exe`
    : platform === "darwin"
    ? "yt-dlp_macos"
    : "yt-dlp";
const ffmpeg_fileName = `ffmpeg-${platform}-${process.arch}${
  platform === "win32" ? ".exe" : ""
}`;
const yt_dl_path = join(__dirname, yt_dl_fileName);
const ffmpeg_path = join(__dirname, ffmpeg_fileName);
const yt_dl_host = "https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest";
const ffmpeg_host = `https://https://github.com/Bruderjulian/yt-downloader-js/raw/master/platforms/${platform}-${process.arch}`;
let GITHUB_TOKEN;

const getLatest = ({ assets }, name) => {
  const { browser_download_url: url } = assets.find(
    ({ name: currName }) => currName === name
  );
  return fetch(url);
};

const getBinary = async (url, name) => {
  const headers = GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};
  let response = fetch(url, headers);
  response.catch(() => console.log("Could not fetch from: " + url + "\n"));
  response = await response;

  if (response.headers.get("content-type") !== "application/octet-stream") {
    const payload = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(payload, null, 2));
    response = await getLatest(payload, name);
  }

  return response.body;
};

async function install_YTDL() {
  console.log("installing yt-dl from: " + yt_dl_host);
  const binary = await getBinary(yt_dl_host, yt_dl_fileName);
  console.log("writing binary to: " + yt_dl_path);
  await pipeline(binary, createWriteStream(yt_dl_path));
  await chmod(yt_dl_path, 0o755);
  console.log("Successfully installed!");
}

async function install_FFMPEG() {
  console.log("installing ffmpeg from: " + ffmpeg_host);
  const [binary] = await Promise.all([
    getBinary(ffmpeg_host, ffmpeg_fileName),
    //mkdir(ffmpeg_path, { recursive: true }),
  ]);
  console.log("writing binaries to: " + ffmpeg_path);
  await pipeline(binary, createWriteStream(ffmpeg_fileName));
  //await chmod(ffmpeg_path, 0o755);
  console.log("Successfully installed!");
}

async function init(refresh = false, gh_token) {
  GITHUB_TOKEN = gh_token;
  let exists = existsSync(yt_dl_path);
  if (exists && refresh) {
    console.log("Removing yt-dl");
    await rm(yt_dl_path, { retryDelay: 2 });
    await install_YTDL();
  } else if (!exists) {
    await install_YTDL();
  } else console.log("Skipping. Has already installed yt-dl!");

  exists = existsSync(ffmpeg_path);
  if (exists && refresh) {
    console.log("Removing ffmpeg");
    await rm(ffmpeg_path, { retryDelay: 2, recursive: true });
    await install_FFMPEG();
  } else if (!exists) {
    await install_FFMPEG();
  } else console.log("Skipping. Has already installed ffmeg!");

  console.log("Finished!");
}

module.exports = init;
