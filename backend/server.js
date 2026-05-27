import express from "express"
import cors from "cors"
import scanRoutes from "./src/routes/scan.routes.js"
import walletRoutes from "./src/routes/wallet.routes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api", scanRoutes)
app.use("/api", walletRoutes)

app.get("/health", (_, res) => res.json({ status: "ok" }))
app.listen(5000, () => console.log("Backend running on 5000"))
