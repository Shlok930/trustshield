export default function AiRiskEngine({ engine, identity, chainSupport, labels, trustRank }: any) {
  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_60px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">AI risk engine</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Enterprise threat scoring</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Deep wallet fingerprinting, fraud prediction, whale detection and sybil analysis powered by a centralized AI security engine.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-black/40 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Trust rank</p>
            <p className="mt-3 text-3xl font-semibold text-white">{trustRank}</p>
          </div>
          <div className="rounded-3xl bg-black/40 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Reputation</p>
            <p className="mt-3 text-3xl font-semibold text-white">{engine.reputationScore}%</p>
          </div>
          <div className="rounded-3xl bg-black/40 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Anomaly</p>
            <p className="mt-3 text-3xl font-semibold text-white">{engine.anomalyScore}%</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Wallet fingerprint</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">{identity.fingerprint}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">MEV bot risk</p>
          <p className="mt-4 text-2xl font-semibold text-white">{engine.mevBotRisk}</p>
          <p className="mt-2 text-sm text-slate-400">{engine.mevDetail}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Sybil risk</p>
          <p className="mt-4 text-2xl font-semibold text-white">{engine.sybilScore}%</p>
          <p className="mt-2 text-sm text-slate-400">{engine.sybilDetail}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-black/40 p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Whale detection</p>
          <p className="mt-3 text-lg font-semibold text-white">{engine.whaleDetection}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Fraud prediction</p>
          <p className="mt-3 text-lg font-semibold text-white">{engine.fraudPrediction}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Trust level</p>
          <p className="mt-3 text-lg font-semibold text-white">{engine.threatLevel}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Wallet label</p>
          <p className="mt-3 text-lg font-semibold text-white">{labels?.join(" / ")}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chainSupport.map((chain: any) => (
          <div key={chain.chain} className="rounded-3xl bg-slate-900/70 p-5 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{chain.chain}</p>
            <p className="mt-3 text-lg font-semibold text-white">{chain.status}</p>
            <p className="mt-2 text-sm text-slate-400">Risk: {chain.risk}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
