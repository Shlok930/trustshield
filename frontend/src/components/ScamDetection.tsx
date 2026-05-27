export default function ScamDetection({ detection }: any) {
  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Honeypot & scam detection</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Threat intelligence</h3>
        </div>
        <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">
          Scam {detection.scamProbability}%
        </span>
      </div>

      <div className="mt-6 rounded-3xl bg-black/40 p-5 text-sm text-slate-300">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Honeypot risk</p>
            <p className="mt-3 text-lg font-semibold text-white">{detection.honeypotProbability}%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Rug pull score</p>
            <p className="mt-3 text-lg font-semibold text-white">{detection.rugPullRisk}%</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900/70 p-5 text-sm text-slate-300">
        <p className="font-semibold text-white">Threat intelligence report</p>
        <p className="mt-3">{detection.threatReport}</p>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-slate-300">
        <div className="rounded-3xl bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Phishing risk</p>
          <p className="mt-2 text-white">{detection.phishingRisk}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Blacklist indicators</p>
          <p className="mt-2 text-white">{detection.blacklistingIndicators}</p>
        </div>
      </div>
    </section>
  )
}
