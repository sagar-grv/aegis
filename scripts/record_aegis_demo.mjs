import { chromium } from "playwright";
import { mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const outputDirectory = "/home/ubuntu/webdev-static-assets";
const outputPath = path.join(outputDirectory, "aegis-live-hard-mode-walkthrough.webm");
const productionUrl = "https://aegis-ecru.vercel.app";

await mkdir(outputDirectory, { recursive: true });
await rm(outputPath, { force: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: outputDirectory, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();

try {
  await page.goto(productionUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.getByText("Proceed with monitoring.", { exact: true }).waitFor({ timeout: 30_000 });
  await page.waitForTimeout(4_000);

  const weatherFaultControl = page.getByRole("button", { name: "Wind & weather", exact: true });
  await weatherFaultControl.scrollIntoViewIfNeeded();
  await weatherFaultControl.hover();
  await page.waitForTimeout(500);
  await weatherFaultControl.click();
  await page.getByText("Aegis refuses to decide.", { exact: true }).waitFor({ timeout: 20_000 });
  await page.getByText("SMALLEST FACT THAT UNBLOCKS A DECISION", { exact: true }).waitFor({ timeout: 10_000 });
  await page.waitForTimeout(7_000);

  await weatherFaultControl.click();
  await page.getByText("Proceed with monitoring.", { exact: true }).waitFor({ timeout: 20_000 });
  await page.waitForTimeout(3_000);

  const newDelhi = page.getByText("New Delhi", { exact: true });
  await newDelhi.scrollIntoViewIfNeeded();
  await newDelhi.hover();
  await page.waitForTimeout(500);
  await newDelhi.click();
  await page.getByText("EVIDENCE LEDGER / NEW DELHI — INDIA GATE", { exact: true }).waitFor({ timeout: 20_000 });
  await page.waitForTimeout(5_000);

  const operatorSignIn = page.getByRole("button", { name: /Operator sign in/ });
  await operatorSignIn.hover();
  await page.waitForTimeout(4_000);
} finally {
  await page.close();
  await context.close();
  await browser.close();
}

const videos = await (await import("node:fs/promises")).readdir(outputDirectory);
const captured = videos
  .filter(name => name.endsWith(".webm") && name !== path.basename(outputPath))
  .map(name => path.join(outputDirectory, name))
  .sort((a, b) => b.localeCompare(a))[0];

if (!captured) throw new Error("Playwright did not produce a video file.");
await rename(captured, outputPath);
console.log(outputPath);
