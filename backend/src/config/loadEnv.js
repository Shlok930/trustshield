import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, "../../.env")

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8")

  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue

    const separatorIndex = trimmed.indexOf("=")
    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^['"]|['"]$/g, "")

    if (key) {
      process.env[key] = value
    }
  }
}
