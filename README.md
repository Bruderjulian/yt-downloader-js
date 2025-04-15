# yt-downloader-js

A youtube downloader cli for nodejs

It's quite easy to use and is decently fast by levering the `yt-dlp` and `ffmpeg` binaries.

The official repositories of these:

- yt-dlp: https://github.com/yt-dlp/yt-dlp
- ffmpeg (patched): https://github.com/yt-dlp/FFmpeg-Builds
- ffmpeg (unpatched): https://github.com/BtbN/FFmpeg-Builds

## Features:

- small (only 10.2kb), simple and fast
- installation of the latest binaries
- no dependencies
- logging

## Install

Install the package with [npm](https://www.npmjs.com/):

```bash
npm i yt-downloader
```

After the installation, the downloader must be initialized with `yt-downloader init` - See [Init](#init)!

## Usage

The cli is accessible under `yt-downloader`. It only has two commands:

- `download`: downloads a youtube video from a given url
- `init`: downloads all required dependencies/binaries and performs checks

### download

downloads a youtube video from a given url and outputs it to a path (if specified)

Pattern:

```bash
yt-downloader download <url> [output_path]
```

### init

installs all required binaries for the downloader and performs some checks! Must be executed when installing the package!
If the binaries are already present, it'll skip the step. The `-r` flag will disable this and replace them with fresh ones!
Optionally a Github Token can be specified with `-t` followed by the token. **Only necessary when for example evading rate-limiting!!**

Required Binaries: `yt-dlp` and `ffmpeg` (patched version; unpatched as fallback)

Pattern:

```bash
yt-downloader init [-r] [-t gh_token]
```

## Getting the binaries yourself

If you want to get them yourself, you can do that pretty easily. Just get the **correct one for your system** from the above mentioned repos!
Sometimes when initializing not the correct ones are getting downloaded, in that case you need to get also yourself and create bug report!

The reason why the binary for ffmpeg is hosted on the repository for this package because the filenames, which are crucial for fetching, are hard to understand and reconstruct for the program!

## Contributing

Feel free to contribute to the project adding features, proposing features, filling bug reports creating pull request, etc!
I'm all ways open for help!

## License

The entire project, except for the binaries them self, is licensed under the [MIT Lisence](./LICENSE).
