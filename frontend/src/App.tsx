import { useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

import Header from "./components/Header"
import ScanProgress from "./components/ScanProgress"
import WalletOverview from "./components/WalletOverview"
import AiRiskEngine from "./components/AiRiskEngine"
import ConnectionMap from "./components/ConnectionMap"
import TransactionAnalytics from "./components/TransactionAnalytics"
import BehavioralAnalysis from "./components/BehavioralAnalysis"
import ApprovalAnalysis from "./components/ApprovalAnalysis"
import ContractInteractions from "./components/ContractInteractions"
import ScamDetection from "./components/ScamDetection"
import SecurityInsights from "./components/SecurityInsights"
import Footer from "./components/Footer"

export default function App() {
  const [walletAddress, setWalletAddress] = useState("")
  const [walletResult, setWalletResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [scanMessage, setScanMessage] = useState("Enter a wallet address to start your security scan.")

  const scanWallet = async () => {
    if (!walletAddress) return

    setLoading(true)
    setWalletResult(null)
    setScanMessage("Initializing advanced surveillance scan...")

    try {
      const res = await axios.get("/api/wallet", {
        params: { address: walletAddress },
        headers: { "Cache-Control": "no-cache" }
      })
      setWalletResult(res.data)
      setScanMessage("Wallet intelligence report generated successfully.")
    } catch (err) {
      setWalletResult({ error: true, message: "Unable to resolve wallet data. Check the address and backend connection." })
      setScanMessage("Scan failed. Please verify the wallet address and try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#050207] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.12),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(244,63,94,0.08),_transparent_22%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Header />

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel mt-8 overflow-hidden rounded-[40px] border border-red-500/10 shadow-[0_30px_80px_rgba(239,68,68,0.12)]"
        >
          <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] p-6 xl:p-8">
            <div className="space-y-8">
              <div className="rounded-[32px] border border-white/10 bg-[#09090f]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">RISKCHAIN AI PRO</p>
                <h2 className="mt-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
                  Market-grade wallet threat intelligence with RiskChain precision.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  A premium dashboard built for institutional crypto security, audit-grade wallet monitoring, and next-level on-chain risk discovery.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Institutional-grade wallet scanning",
                    "Approval & permission heatmaps",
                    "Scam and honeypot probability",
                    "AI reputation & trust ranking"
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-[#010204]/80 p-6 text-slate-300 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Live status</p>
                    <p className="mt-2 text-xl font-semibold text-white">Operational readiness: ONLINE</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-100">
                    <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.55)]" />
                    Threat pipeline active
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Wallet signals", "Realtime"],
                    ["Contract analysis", "Deep scan"],
                    ["Approval watch", "RiskChain"],
                    ["Trust rank", "Enterprise"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
                      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#0b0b11]/95 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Enter wallet</p>
              <h3 className="mt-4 text-3xl font-semibold text-white">Inspect any Ethereum wallet with one scan.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Paste an address, then let RiskChain AI evaluate wallet reputation, approval risk, interaction velocity, and more.
              </p>
              <div className="mt-6 space-y-4">
                <input
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x1234...abcd"
                  className="w-full rounded-3xl border border-white/10 bg-[#06070d] px-5 py-4 text-base text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                />
                <button
                  onClick={scanWallet}
                  disabled={loading || !walletAddress}
                  className="w-full rounded-3xl bg-red-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(239,68,68,0.24)] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Running scan…" : "Start RiskChain AI Scan"}
                </button>
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-4 text-sm text-slate-300">
                  {scanMessage}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ScanProgress />
            </motion.div>
          )}
        </AnimatePresence>

        {walletResult && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 space-y-8"
          >
            {walletResult.error ? (
              <div className="rounded-[32px] border border-red-500/15 bg-red-500/10 p-8 text-white">
                <h3 className="text-xl font-semibold">Scan Error</h3>
                <p className="mt-3 text-sm text-red-100">{walletResult.message}</p>
              </div>
            ) : (
              <>
                <WalletOverview wallet={walletResult} />
                <AiRiskEngine
                  engine={walletResult.aiRiskEngine}
                  identity={walletResult.identityProfile}
                  chainSupport={walletResult.multiChainSupport}
                  labels={walletResult.walletLabels}
                  trustRank={walletResult.walletTrustRank}
                />
                <ConnectionMap graph={walletResult.connectionGraph} />

                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
                  <div className="space-y-6">
                    <TransactionAnalytics analytics={walletResult.transactionAnalytics} />
                    <BehavioralAnalysis analysis={walletResult.behavioralAnalysis} />
                    <ApprovalAnalysis approval={walletResult.approvalAnalysis} />
                  </div>

                  <div className="space-y-6">
                    <ContractInteractions interactions={walletResult.contractInteractions} />
                    <ScamDetection detection={walletResult.scamDetection} />
                    <SecurityInsights insights={walletResult.securityInsights} />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        <Footer />
      </div>
    </div>
  )
}
