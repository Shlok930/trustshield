export default function ConnectionMap({ graph }: any) {
  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_60px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Wallet connection map</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Network interaction topology</h3>
        </div>
        <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">Interactive graph</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-black/30 p-5">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {graph.nodes.map((node: any) => (
              <div key={node.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{node.type}</p>
                <p className="mt-2 text-lg font-semibold text-white">{node.label}</p>
                <p className="mt-2 text-xs text-slate-500">Risk {node.risk}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/70 p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Key connections</p>
          <div className="mt-4 space-y-3">
            {graph.edges.map((edge: any, index: number) => (
              <div key={index} className="rounded-3xl bg-black/40 p-4">
                <p className="text-sm text-white">{edge.from} → {edge.to}</p>
                <p className="mt-2 text-xs text-slate-500">{edge.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
