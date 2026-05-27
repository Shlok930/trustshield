import { motion } from "framer-motion"

export default function WalletOverview({ wallet }: any) {
  const riskColor =
    wallet.riskScore >= 75
      ? "text-rose-400"
      : wallet.riskScore >= 50
      ? "text-amber-300"
      : wallet.riskScore >= 30
      ? "text-red-300"
      : "text-emerald-400"

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel rounded-[32px] p-6"
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">
              Wallet overview
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
              {wallet.chain}
            </span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Address</p>
            <p className="mt-2 break-all text-2xl font-semibold text-white">{wallet.address}</p>
            {wallet.ensName && (
              <p className="mt-2 text-sm text-red-300">ENS: {wallet.ensName}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Wallet age</p>
              <p className="mt-3 text-xl font-semibold text-white">{wallet.walletAge || "Unknown"}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Net worth</p>
              <p className="mt-3 text-xl font-semibold text-white">${wallet.netWorthEstimation?.toLocaleString()}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Security status</p>
              <p className={`mt-3 text-xl font-semibold ${riskColor}`}>{wallet.securityStatus}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-red-500/15 bg-slate-900/90 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)]">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">AI risk score</p>
          <div className="mt-4 flex items-end gap-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-950/70 border border-white/10">
              <p className={`text-4xl font-bold ${riskColor}`}>{wallet.riskScore}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Trust score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{wallet.aiRiskEngine?.trustScore}%</p>
              <p className="mt-3 text-sm text-slate-400">{wallet.aiRiskEngine?.threatLevel} threat</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Balance</p>
          <p className="mt-3 text-2xl font-semibold text-white">{wallet.walletBalance} ETH</p>
          <p className="mt-2 text-sm text-slate-400">≈ ${wallet.portfolioValueUSD?.toLocaleString()}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Transactions</p>
          <p className="mt-3 text-2xl font-semibold text-white">{wallet.transactionCount}</p>
          <p className="mt-2 text-sm text-slate-400">Total on-chain interactions</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Top holders</p>
          <p className="mt-3 text-2xl font-semibold text-white">{wallet.topHolderShare || "N/A"}</p>
          <p className="mt-2 text-sm text-slate-400">Potential centralization signal</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Summary</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">{wallet.summary}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Token holdings</p>
          <div className="mt-4 space-y-3">
            {wallet.tokenHoldings?.length ? (
              wallet.tokenHoldings.map((token: any) => (
                <div key={token.contractAddress} className="rounded-3xl bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{token.symbol}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{token.balance}</p>
                    </div>
                    <p className="text-sm text-red-300">${token.valueUSD?.toLocaleString()}</p>
                  </div>
                  <p className="mt-3 text-xs text-slate-500 break-all">{token.contractAddress}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No tracked token balances were found for this wallet.</p>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
