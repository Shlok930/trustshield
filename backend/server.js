import express from "express"
import cors from "cors"
import scanRoutes from "./src/routes/scan.routes.js"
import walletRoutes from "./src/routes/wallet.routes.js"

const app = express()

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))
app.use(express.json())
app.use("/api", scanRoutes)
app.use("/api", walletRoutes)

app.get("/health", (_, res) => res.json({ status: "ok" }))
app.listen(5000, () => console.log("Backend running on 5000"))
