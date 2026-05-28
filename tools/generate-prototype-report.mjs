import fs from "node:fs/promises"
import path from "node:path"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import WebSocket from "../backend/node_modules/ws/wrapper.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const outputDir = path.join(rootDir, "prototype-report")
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const appUrl = "http://localhost:5173"
const sampleWallet = "0x00000000219ab540356cBB839Cbe05303d7705Fa"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const chromeArgs = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--remote-debugging-port=9223",
  "--window-size=1440,1400",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank"
]

const chrome = spawn(chromePath, chromeArgs, {
  stdio: "ignore",
  detached: true
})

const fetchJson = async (url, retries = 30) => {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return response.json()
    } catch {
      await delay(300)
    }
  }
  throw new Error(`Unable to fetch ${url}`)
}

const createCdpClient = async () => {
  let target

  try {
    const response = await fetch("http://127.0.0.1:9223/json/new?about:blank", { method: "PUT" })
    if (response.ok) target = await response.json()
  } catch {
    target = null
  }

  if (!target?.webSocketDebuggerUrl) {
    const targets = await fetchJson("http://127.0.0.1:9223/json/list")
    target = targets.find((item) => item.type === "page")
  }

  if (!target?.webSocketDebuggerUrl) {
    throw new Error("Unable to find a Chrome page target")
  }

  const socket = new WebSocket(target.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()

  socket.on("message", (message) => {
    const payload = JSON.parse(message.toString())
    if (payload.id && pending.has(payload.id)) {
      const { resolve, reject } = pending.get(payload.id)
      pending.delete(payload.id)
      if (payload.error) reject(new Error(payload.error.message))
      else resolve(payload.result)
    }
  })

  await new Promise((resolve) => socket.once("open", resolve))

  return {
    send(method, params = {}) {
      id += 1
      socket.send(JSON.stringify({ id, method, params }))
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
      })
    },
    close() {
      socket.close()
    }
  }
}

const writeScreenshot = async (client, filename) => {
  const metrics = await client.send("Page.getLayoutMetrics")
  const { width, height } = metrics.cssContentSize
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height: Math.min(height, 3600), scale: 1 }
  })
  const filePath = path.join(outputDir, filename)
  await fs.writeFile(filePath, Buffer.from(screenshot.data, "base64"))
  return filePath
}

const imageDataUri = async (filename) => {
  const data = await fs.readFile(path.join(outputDir, filename))
  return `data:image/png;base64,${data.toString("base64")}`
}

try {
  await fs.mkdir(outputDir, { recursive: true })
  const client = await createCdpClient()
  await client.send("Page.enable")
  await client.send("Runtime.enable")
  await client.send("Page.navigate", { url: appUrl })
  await delay(2500)

  await writeScreenshot(client, "prototype-home.png")

  await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const input = document.querySelector('input[placeholder="0x1234...abcd"]');
        const button = Array.from(document.querySelectorAll('button')).find((el) => el.textContent.includes('Start RiskChain'));
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '${sampleWallet}');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        button.click();
      })()
    `
  })

  await delay(15000)
  await writeScreenshot(client, "prototype-scan-results.png")

  const homeImage = await imageDataUri("prototype-home.png")
  const resultsImage = await imageDataUri("prototype-scan-results.png")
  const generatedAt = new Date().toLocaleString("en-US")

  const reportHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RiskChain AI Prototype Report</title>
  <style>
    @page { margin: 28px; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f8fafc; color: #111827; }
    .page { page-break-after: always; }
    .cover { min-height: 920px; padding: 52px; background: #120409; color: white; }
    .eyebrow { color: #fca5a5; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; }
    h1 { margin: 18px 0 12px; font-size: 52px; line-height: 1.02; }
    h2 { margin: 0 0 18px; font-size: 28px; }
    h3 { margin: 0 0 8px; font-size: 17px; }
    p { line-height: 1.55; }
    .subtitle { max-width: 760px; color: #fecdd3; font-size: 18px; }
    .meta { margin-top: 40px; color: #e5e7eb; font-size: 14px; }
    .section { padding: 38px 42px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; }
    .feature { margin: 0; padding-left: 20px; }
    .feature li { margin: 8px 0; line-height: 1.45; }
    .shot { width: 100%; border: 1px solid #d1d5db; border-radius: 14px; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14); }
    .note { color: #4b5563; font-size: 13px; }
    .pill { display: inline-block; margin: 4px 6px 4px 0; padding: 7px 10px; border-radius: 999px; background: #fee2e2; color: #991b1b; font-size: 12px; }
  </style>
</head>
<body>
  <section class="page cover">
    <div class="eyebrow">Prototype report</div>
    <h1>RiskChain AI Wallet Threat Intelligence</h1>
    <p class="subtitle">A fullstack crypto wallet analysis prototype with Vite + React frontend, Express backend, and Etherscan-powered wallet records.</p>
    <div class="meta">
      <p><strong>Generated:</strong> ${generatedAt}</p>
      <p><strong>Sample wallet used for screenshots:</strong> ${sampleWallet}</p>
      <p><strong>Local prototype URL:</strong> ${appUrl}</p>
    </div>
  </section>

  <section class="page section">
    <h2>Prototype Screenshots</h2>
    <p class="note">Landing and wallet input experience.</p>
    <img class="shot" src="${homeImage}" />
  </section>

  <section class="page section">
    <h2>Scan Results Screenshot</h2>
    <p class="note">Generated after submitting the sample Ethereum wallet address.</p>
    <img class="shot" src="${resultsImage}" />
  </section>

  <section class="page section">
    <h2>Feature Inventory</h2>
    <div class="grid">
      <div class="card">
        <h3>Wallet Lookup</h3>
        <ul class="feature">
          <li>Ethereum wallet address input and validation.</li>
          <li>Backend API route for wallet scanning.</li>
          <li>Vite proxy support for local development.</li>
          <li>Production backend URL support for Vercel + Render deployment.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Etherscan Data</h3>
        <ul class="feature">
          <li>Live balance lookup from Etherscan.</li>
          <li>Latest normal transaction records.</li>
          <li>Latest token transfer records.</li>
          <li>Transaction hashes, from/to addresses, values, dates, and token metadata.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Risk Dashboard</h3>
        <ul class="feature">
          <li>Wallet overview with balance, activity, age, and status.</li>
          <li>Heuristic risk score and trust score.</li>
          <li>AI-style reputation, anomaly, sybil, whale, fraud, and MEV labels.</li>
          <li>Behavioral analysis and suggested security actions.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Analytics Panels</h3>
        <ul class="feature">
          <li>Transaction analytics with incoming/outgoing ratios.</li>
          <li>Gas spend and largest transaction metrics.</li>
          <li>Recent transaction timeline.</li>
          <li>Token holdings and contract interaction summaries.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Security Modules</h3>
        <ul class="feature">
          <li>Approval risk panel.</li>
          <li>Scam and phishing risk indicators.</li>
          <li>Contract interaction footprint.</li>
          <li>Recommended actions and high-risk warnings.</li>
        </ul>
      </div>
      <div class="card">
        <h3>System Notes</h3>
        <ul class="feature">
          <li>Raw Etherscan records are actual API data.</li>
          <li>AI/risk sections are app-generated estimates, not verified Etherscan facts.</li>
          <li>Backend rate-limits Etherscan calls to avoid the 3/sec error.</li>
          <li>Browser console logs the full wallet API response for inspection.</li>
        </ul>
      </div>
    </div>
    <p style="margin-top:24px;">
      <span class="pill">React</span>
      <span class="pill">Vite</span>
      <span class="pill">Express</span>
      <span class="pill">Etherscan API</span>
      <span class="pill">Render Backend</span>
      <span class="pill">Vercel Frontend</span>
    </p>
  </section>
</body>
</html>`

  const htmlPath = path.join(outputDir, "prototype-report.html")
  const pdfPath = path.join(outputDir, "RiskChain-AI-Prototype-Report.pdf")
  await fs.writeFile(htmlPath, reportHtml)

  await client.send("Page.navigate", { url: `file:///${htmlPath.replaceAll("\\", "/")}` })
  await delay(1000)
  const pdf = await client.send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true
  })
  await fs.writeFile(pdfPath, Buffer.from(pdf.data, "base64"))

  client.close()
  chrome.kill()
  console.log(pdfPath)
} catch (error) {
  chrome.kill()
  console.error(error)
  process.exit(1)
}
