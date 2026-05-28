import express from "express"
import cors from "cors"
import "./src/config/loadEnv.js"
import scanRoutes from "./src/routes/scan.routes.js"
import walletRoutes from "./src/routes/wallet.routes.js"

const app = express()
const port = Number(process.env.PORT || 5000)
const configuredOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      ...configuredOrigins
    ]
    const isLocalVite = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)

    if (allowedOrigins.includes(origin) || isLocalVite) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))
app.use(express.json())
app.use("/api", (req, _res, next) => {
  console.log(`[api] ${req.method} ${req.originalUrl}`)
  next()
})
app.use("/api", scanRoutes)
app.use("/api", walletRoutes)

app.get("/health", (_, res) => res.json({ status: "ok" }))
app.listen(port, () => console.log(`Backend running on ${port}`))
