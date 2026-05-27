export default function ApprovalAnalysis({ approval }: any) {
  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Approval & permissions</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Approval risk analysis</h3>
        </div>
        <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">
          Drain risk {approval.fundsDrainRisk}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Active approvals</p>
          <p className="mt-3 text-3xl font-semibold text-white">{approval.activeApprovals}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Unlimited approvals</p>
          <p className="mt-3 text-3xl font-semibold text-white">{approval.unlimitedApprovals}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900/70 p-5 text-sm text-slate-300">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Approval risk meter</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-red-400" style={{ width: `${approval.approvalRiskMeter}%` }} />
        </div>
        <p className="mt-3 text-sm text-slate-300">{approval.approvalRiskMeter}% risk detected from active smart contract permissions.</p>
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-300">
        {approval.approvalHistory?.map((item: any, index: number) => (
          <div key={index} className="rounded-3xl bg-black/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{item.name}</p>
              <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-red-200">{item.risk}</span>
            </div>
            <p className="mt-2 text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
