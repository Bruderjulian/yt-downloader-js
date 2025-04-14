"use strict";

const {
  createWriteStream,
  existsSync,
  promises: { chmod, rm },
} = require("fs");
const join = require("path").join;
const createGunzip = require("zlib").createGunzip;
const stream = require("stream");

const pipeline =
  stream && stream.promises && stream.promises.pipeline
    ? stream.promises.pipeline
    : function pipelinePolyfill(...streams) {
        return new Promise(function (resolve, reject) {
          stream.pipeline(...streams, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      };

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
  platform === "win32" ? ".exe.gz" : ".gz"
}`;
const yt_dl_path = join(__dirname, "../", yt_dl_fileName);
const ffmpeg_path = join(
  __dirname,
  "../",
  `ffmpeg${platform === "win32" ? ".exe" : ""}`
);
const yt_dl_host = "https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest";
const ffmpeg_url1 = `https://github.com/Bruderjulian/yt-downloader-js/raw/main/ffmpeg_patched-gz/${ffmpeg_fileName}`;
const ffmpeg_url2 = `https://github.com/Bruderjulian/yt-downloader-js/raw/main/ffmpeg_unpatched-gz/${ffmpeg_fileName}`;

let GITHUB_TOKEN;

const getLatest = ({ assets }, name) => {
  const { browser_download_url: url } = assets.find(
    ({ name: currName }) => currName === name
  );
  return fetch(url);
};

const getBinary = async (url, name, fallback) => {
  let response = await fetchRetry(url, fallback);

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
  console.log("Successfully installed!\n");
}

async function install_FFMPEG() {
  console.log("installing ffmpeg from: " + ffmpeg_url1);
  const [binary] = await Promise.all([
    getBinary(ffmpeg_url1, ffmpeg_fileName, ffmpeg_url2),
    //mkdir(ffmpeg_path, { recursive: true }),
  ]);
  console.log("writing binaries to: " + ffmpeg_path);
  await pipeline(binary, createGunzip(), createWriteStream(ffmpeg_path));
  await chmod(ffmpeg_path, 0o755);
  console.log("Successfully installed!\n");
}

async function init(refresh = false, gh_token) {
  GITHUB_TOKEN = gh_token;
  try {
    var exists = existsSync(yt_dl_path);
    if (exists && refresh) {
      console.log("Removing yt-dl");
      await rm(yt_dl_path, { retryDelay: 2 });
      await install_YTDL();
    } else if (!exists) {
      await install_YTDL();
    } else console.log("Skipping yt-dl. Has already installed yt-dl!\n");
  } catch (err) {
    console.error("Could not install yt-dlp due: " + err);
  }

  try {
    exists = existsSync(ffmpeg_path);
    if (exists && refresh) {
      console.log("Removing ffmpeg");
      await rm(ffmpeg_path, { retryDelay: 2, recursive: true });
      await install_FFMPEG();
    } else if (!exists) {
      await install_FFMPEG();
    } else console.log("Skipping ffmpeg. Has already installed ffmpeg!\n");
  } catch (err) {
    console.error("Could not install ffmpeg due: " + err);
  }

  console.log("\nFinished!");
}

async function fetchRetry(url, fallback_url, tries = 2) {
  const headers = GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};
  function onError(err) {
    if (--tries <= 0) {
      if (!fallback_url || url === fallback_url) {
        throw "Could not fetch from url: " + url;
      } else {
        console.error("Fetch failed! Using fallback! URL: " + url);
        url = fallback_url;
        tries = 2;
      }
    } else {
      console.warn("Fetch failed! Will try again! URL: " + url);
    }
    return wait(200).then(() => fetchRetry(url, fallback_url, tries));
  }
  return fetch(url, headers).catch(onError);
}

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

module.exports = init;
