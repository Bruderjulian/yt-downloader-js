# yt-downloader-js

A youtube downloader cli for nodejs

It's quite easy to use and is decently fast by levering the `yt-dlp` and `ffmpeg` binaries.

The official repositories of these:

- yt-dlp:
- ffmpeg:

## Features:

- small (only 9.5kb), simple and fast
- auto install of the latest binaries (can also be done manually)
- no dependencies
- logging

## Install

```bash
npm i yt-downloader
```

The `postinstall` script should automatically download all binaries! However the script can be manually triggered - See [Init](#init)!

## Usage

The cli is accessible under `yt-downloader`. It only has two commands:

- `download`: downloads a youtube video from a given url
- `init`:

### download

downloads a youtube video from a given url and outputs it to a path (if specified)

Pattern:

```bash
yt-downloader download <url> [output_path]
```

### init

installs all required binaries. Should be triggered automatically on `postinstall`!
If the binaries are already present, it'll skip the step. The `-r` flag will disable this and replace them with fresh ones!
Optionally a Github Token can be specified with `-t` followed by the token. **Only necessary when for example evading rate-limiting!!**

Pattern:

```bash
yt-downloader init [-r] [-t gh_token]
```
