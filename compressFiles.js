
const { existsSync, statSync, createReadStream, createWriteStream } = require("fs");
const { opendir, rm, mkdir } = require("fs/promises");
const { join } = require("path");
const { pipeline } = require("stream");
const { createGzip } = require("zlib");

run(process.argv[2], process.argv[3]);

async function run(path, out) {
  if (!path || path === "" || !existsSync(path)) {
    throw new SyntaxError("Input Path doesn't exists");
  }
  
  if (statSync(path).isFile()) {
    compressFile(path);
  } else if (statSync(path).isDirectory()) {
    if (!out) out = path + "-gz";
    if (existsSync(out)) await rm(out,{maxRetries: 2, recursive: true});
    mkdir(out, {recursive: true});
    const dir = await opendir(path);
    for await (const dirent of dir) {
      compressFile(path, out, dirent.name);
    }
  }
} 


function compressFile(path, out = path, name = "") {
  const inFile = join(path, name);
  const outFile = join(out, name) + ".gz";
  pipeline(createReadStream(inFile), createGzip(), createWriteStream(outFile), function (err) {
    if (err) console.error("Could not compress file correctly");
    else console.log("Finished compressing file");
  })
}