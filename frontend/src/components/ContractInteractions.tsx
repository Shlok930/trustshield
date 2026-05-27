export default function ContractInteractions({ interactions }: any) {
  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Smart contract interactions</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Interaction footprint</h3>
        </div>
        <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">
          {interactions.interactionFrequency} interactions
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Contracts touched</p>
          <p className="mt-3 text-3xl font-semibold text-white">{interactions.contractsInteracted}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Unknown contracts</p>
          <p className="mt-3 text-3xl font-semibold text-white">{interactions.unknownContracts}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-300">
        <div className="rounded-3xl bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">DeFi protocols</p>
          <p className="mt-3 text-white">{interactions.defiProtocols.join(", ")}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">NFT & marketplace</p>
          <p className="mt-3 text-white">{interactions.nftMarketplaces.join(", ")}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-black/40 p-5 text-sm text-slate-300">
        <p className="font-semibold text-white">Risk warnings</p>
        <ul className="mt-3 list-disc space-y-2 pl-4">
          {interactions.riskyContractWarnings.map((warning: string, index: number) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
