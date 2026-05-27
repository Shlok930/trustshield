export default function TransactionAnalytics({ analytics }: any) {
  const buildBar = (label: string, value: number, max = 100) => {
    const width = Math.min(100, Math.max(12, Math.round((value / max) * 100)))
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-red-400" style={{ width: `${width}%` }} />
        </div>
      </div>
    )
  }

  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Transaction analytics</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Behavioral flow and gas metrics</h3>
        </div>
        <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">Real-time</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total transactions</p>
          <p className="mt-3 text-3xl font-semibold text-white">{analytics.totalTransactions}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Avg tx amount</p>
          <p className="mt-3 text-3xl font-semibold text-white">{analytics.averageTxAmount} ETH</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Gas spend</p>
          <p className="mt-3 text-3xl font-semibold text-white">{analytics.gasSpending} ETH</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-900/70 p-5">
          {buildBar("Incoming ratio", analytics.incomingRatio * 100, 100)}
          {buildBar("Outgoing ratio", analytics.outgoingRatio * 100, 100)}
          {buildBar("Failed tx rate", analytics.failedTransactions * 10, 100)}
        </div>
        <div className="rounded-3xl bg-slate-900/70 p-5">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Transaction heatmap</p>
          <div className="mt-4 grid gap-2">
            {analytics.heatmap?.map((row: any, rowIndex: number) => (
              <div key={rowIndex} className="flex gap-2">
                {row.map((cell: number, cellIndex: number) => (
                  <div key={cellIndex} className={`h-6 w-full rounded-xl ${cell > 7 ? "bg-red-400" : cell > 4 ? "bg-red-500/70" : cell > 1 ? "bg-red-400/40" : "bg-white/5"}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-black/40 p-5 text-sm leading-7 text-slate-300">
        <p className="font-semibold text-white">Recent transaction timeline</p>
        <div className="mt-4 space-y-3">
          {analytics.recentTimeline?.map((event: any, index: number) => (
            <div key={index} className="rounded-2xl bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
                <p>{event.time}</p>
                <p className="font-semibold text-white">{event.severity}</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
