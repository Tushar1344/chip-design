#!/usr/bin/env node
/**
 * Render the HyperFrames-style HTML compositions in public/compositions/<id>/
 * to deterministic MP4 files in public/videos/<id>.mp4.
 *
 * Technique (same as HyperFrames): load the composition in headless Chrome with
 * window.__RENDER__ = true, call window.seek(frame/total) for each frame, capture
 * a screenshot, then encode the frames with FFmpeg.
 *
 * Requires (installed by the render-videos CI workflow, not by the app build):
 *   npm i puppeteer ffmpeg-static
 *
 * Run: node scripts/render-videos.mjs
 */
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, readdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FPS = 30;
const SECONDS = 5;
const WIDTH = 720;
const HEIGHT = 460;
const FRAMES = FPS * SECONDS;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const compRoot = path.join(root, "public", "compositions");
const outDir = path.join(root, "public", "videos");

async function loadDeps() {
  try {
    const puppeteer = (await import("puppeteer")).default;
    const ffmpegPath = (await import("ffmpeg-static")).default;
    return { puppeteer, ffmpegPath };
  } catch {
    console.error(
      "Missing render dependencies. Install them first:\n  npm i puppeteer ffmpeg-static",
    );
    process.exit(1);
  }
}

function encode(ffmpegPath, framesDir, outFile) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-framerate", String(FPS),
      "-i", path.join(framesDir, "f%05d.png"),
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      outFile,
    ];
    const p = spawn(ffmpegPath, args, { stdio: "inherit" });
    p.on("error", reject);
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

async function renderComposition(browser, id) {
  const indexFile = path.join(compRoot, id, "index.html");
  const framesDir = await mkdtemp(path.join(tmpdir(), `frames-${id}-`));
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument(() => {
    window.__RENDER__ = true;
  });
  await page.goto(pathToFileURL(indexFile).href, { waitUntil: "networkidle0" });
  await page.waitForFunction("typeof window.seek === 'function'");

  for (let f = 0; f < FRAMES; f++) {
    const t = f / FRAMES;
    await page.evaluate((tt) => window.seek(tt), t);
    await page.screenshot({
      path: path.join(framesDir, `f${String(f).padStart(5, "0")}.png`),
    });
  }
  await page.close();

  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `${id}.mp4`);
  await encode(ffmpegPath, framesDir, outFile);
  await rm(framesDir, { recursive: true, force: true });
  console.log(`✓ ${id}.mp4`);
}

let ffmpegPath;

async function main() {
  const deps = await loadDeps();
  ffmpegPath = deps.ffmpegPath;

  const entries = await readdir(compRoot);
  const ids = [];
  for (const e of entries) {
    if ((await stat(path.join(compRoot, e))).isDirectory()) ids.push(e);
  }
  if (ids.length === 0) {
    console.log("No compositions found.");
    return;
  }

  const browser = await deps.puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    for (const id of ids) await renderComposition(browser, id);
  } finally {
    await browser.close();
  }
  console.log(`\nRendered ${ids.length} video(s) → public/videos/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
