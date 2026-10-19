# NEON COMPRESS V2 — V1 MAX QUALITY engine

V2 interface with the original V1 MAX QUALITY FFmpeg command and FFmpeg core v0.12.10.

This project **requires Vite compilation**. Upload the project files to the root of the **NEON-COMPRESS-V2** GitHub repository (including the hidden `.github/workflows/deploy.yml` file). Do not simply replace `index.html` on a GitHub Pages static site: the JavaScript imports must be bundled.

GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**. After a successful Actions run, visit your existing GitHub Pages URL.

Only MP4 inputs. Preserves original video/audio encoding via `-c copy`; faststart reorders MP4 metadata. This does **not** upscale 720p to 1080p or improve encoded image detail. FFmpeg wasm still requires network access for core assets and adequate browser RAM. Tested structurally; browser processing has not been verified.

V1 source backup is untouched. UI remains based on supplied V2 version.
