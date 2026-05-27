export default function SecurityInsights({ insights }: any) {
  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Security insights</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Recommended actions</h3>
        </div>
        <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">
          Enterprise grade
        </span>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-slate-300">
        {insights.recommendedActions?.map((action: string, index: number) => (
          <div key={index} className="rounded-3xl bg-black/40 p-4">
            {action}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900/70 p-5 text-sm text-slate-300">
        <p className="font-semibold text-white">High-risk warnings</p>
        <ul className="mt-3 list-disc space-y-2 pl-4">
          {insights.highRiskWarnings?.map((warning: string, index: number) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
