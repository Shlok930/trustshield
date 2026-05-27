export default function Header() {
  return (
    <header className="relative mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 lg:px-8">
      <div className="glass-panel flex items-center justify-between gap-4 rounded-[36px] border border-red-500/10 px-5 py-4 shadow-[0_30px_80px_rgba(239,68,68,0.12)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-[0.35em] text-red-100">
            RISKCHAIN AI
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Wallet intelligence cockpit</p>
            <p className="text-sm font-semibold text-white/90">RiskChain AI wallet threat monitoring</p>
          </div>
        </div>

        <button className="rounded-2xl border border-red-500/20 bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(239,68,68,0.2)] transition hover:bg-red-500">
          MENU
        </button>
      </div>
    </header>
  )
}

