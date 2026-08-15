import { chromium } from "playwright";
import { mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const assetDirectory = "/home/ubuntu/webdev-static-assets";
const outputPath = path.join(assetDirectory, "aegis-protected-workflow-validation.webm");
const sourcePath = path.join(assetDirectory, "aegis-protected-probe-evidence.html");

await mkdir(assetDirectory, { recursive: true });
await rm(outputPath, { force: true });
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: assetDirectory, size: { width: 1280, height: 720 } } });
const page = await context.newPage();
try {
  await page.goto(`file://${sourcePath}`, { waitUntil: "load" });
  await page.waitForTimeout(10_000);
} finally {
  await page.close();
  await context.close();
  await browser.close();
}
const videos = await (await import("node:fs/promises")).readdir(assetDirectory);
const captured = videos.filter(name => name.endsWith(".webm") && name !== path.basename(outputPath)).map(name => path.join(assetDirectory, name)).sort((a, b) => b.localeCompare(a))[0];
if (!captured) throw new Error("Playwright did not produce a probe evidence video.");
await rename(captured, outputPath);
console.log(outputPath);
