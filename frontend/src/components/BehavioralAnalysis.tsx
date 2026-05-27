export default function BehavioralAnalysis({ analysis }: any) {
  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Behavioral analysis</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">AI behavioral verdict</h3>
        </div>
        <div className="rounded-full bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
          Confidence {analysis.confidence}%
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Consistency</p>
          <p className="mt-3 text-lg font-semibold text-white">{analysis.activityConsistency}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Bot-like activity</p>
          <p className="mt-3 text-lg font-semibold text-white">{analysis.botLikeBehavior}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900/70 p-5 text-sm leading-7 text-slate-300">
        <p className="font-semibold text-white">Explanation</p>
        <p className="mt-3">{analysis.explanation}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: "Wash trading patterns", value: analysis.washTrading },
          { label: "Abnormal spikes", value: analysis.abnormalSpikes },
          { label: "Interaction velocity", value: analysis.interactionVelocity },
          { label: "Cluster risk", value: analysis.clusteringBehavior }
        ].map((item, index) => (
          <div key={index} className="rounded-3xl bg-black/40 p-4 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{item.label}</p>
            <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
