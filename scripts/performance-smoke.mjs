import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launch } from "chrome-launcher";
import { chromium } from "playwright";
import lighthouse from "lighthouse";

const port = Number(process.env.PERFORMANCE_PORT ?? 3212);
const url = `http://127.0.0.1:${port}/`;
const runs = Number(process.env.PERFORMANCE_RUNS ?? 1);
const nextBinary = fileURLToPath(new URL("../node_modules/.bin/next", import.meta.url));

function startServer() {
  return spawn(nextBinary, ["start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, VISUAL_TEST: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function waitForServer(server) {
  const deadline = Date.now() + 120_000;
  let lastError;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Production server exited with code ${server.exitCode}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError ?? "no response"}`);
}

function stopServer(server) {
  return new Promise((resolve) => {
    if (server.exitCode !== null) {
      resolve();
      return;
    }
    const timer = setTimeout(() => {
      server.kill("SIGKILL");
      resolve();
    }, 5_000);
    server.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
    server.kill("SIGTERM");
  });
}

function score(value) {
  return Math.round((value ?? 0) * 100);
}

async function runLighthouse(chromePort) {
  const result = await lighthouse(
    url,
    {
      port: chromePort,
      logLevel: "error",
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      throttlingMethod: "provided",
      formFactor: "desktop",
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
      },
    },
  );
  const { categories, audits } = result.lhr;
  return {
    performance: score(categories.performance.score),
    accessibility: score(categories.accessibility.score),
    bestPractices: score(categories["best-practices"].score),
    seo: score(categories.seo.score),
    lcpMs: Math.round(audits["largest-contentful-paint"].numericValue ?? 0),
    cls: Number((audits["cumulative-layout-shift"].numericValue ?? 0).toFixed(3)),
  };
}

const server = startServer();
let chrome;
try {
  await waitForServer(server);
  chrome = await launch({
    chromePath: chromium.executablePath(),
    port: 0,
    chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  const warmup = await runLighthouse(chrome.port);
  const results = [];
  for (let index = 0; index < runs; index += 1) {
    results.push(await runLighthouse(chrome.port));
  }
  const summary = {
    url,
    runs,
    chromePath: chromium.executablePath(),
    warmup,
    results,
    minimums: {
      performance: 90,
      accessibility: 95,
      bestPractices: 95,
      seo: 95,
      lcpMsBelow: 2500,
      clsBelow: 0.1,
    },
  };
  const serializedSummary = `${JSON.stringify(summary, null, 2)}\n`;
  console.log(serializedSummary);

  const outputPath =
    process.env.PERFORMANCE_OUTPUT ?? "test-results/performance-summary.json";
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serializedSummary);

  const failed = results.some(
    (result) =>
      result.performance < 90 ||
      result.accessibility < 95 ||
      result.bestPractices < 95 ||
      result.seo < 95 ||
      result.lcpMs >= 2500 ||
      result.cls >= 0.1,
  );
  if (failed) process.exitCode = 1;
} finally {
  chrome?.kill();
  await stopServer(server);
}
