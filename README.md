# NEON COMPRESS V2 — GitHub-ready

This project combines the user-supplied **NEON-V2-PROCESSING-SPARKS.html** interface with the **MAX QUALITY** FFmpeg processing path from the uploaded original working Replit backup.

## What is preserved
- UI layout, fireworks, lanterns, welcome modal, and progress-ring effects.
- Replit FFmpeg core version `0.12.10`
- Original Replit `App.tsx` and `neonMp4Prototype.ts` are archived unchanged in `reference-original/`. The prototype was **not** called by the original App.tsx, so this build uses the actual FFmpeg MAX QUALITY processing path instead.

## GitHub setup
1. Extract this ZIP and upload **all files and the `src` folder** to the root of your GitHub repository (not the ZIP itself).
2. Netlify: import that repository. Build command `npm run build`, publish directory `dist`.
3. For local development: `npm install` then `npm run dev`.

## Important limitations
- MAX QUALITY mode supports MP4 only. MOV and WEBM can be previewed, but not processed in this mode.
- Stream copy preserves encoded video/audio; it does not guarantee TikTok upload clarity. TikTok may recompress.
- Real progress is reported by FFmpeg, but may jump for short files.
- Browser memory and device limits may cause large videos to fail. Processing is client-side.
- This is assembled from source and is **not yet browser-tested or TikTok-tested**. Test on the actual phone before publishing as production.
- The visual daily-limit counter was replaced by a local-processing label; there is no server-side usage quota.
