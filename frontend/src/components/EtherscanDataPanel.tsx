const shortAddress = (value?: string) => {
  if (!value) return "N/A"
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

const formatNumber = (value: number) =>
  Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0"

export default function EtherscanDataPanel({ etherscan }: any) {
  const transactions = etherscan?.latestTransactions || []
  const tokenTransfers = etherscan?.latestTokenTransfers || []

  return (
    <section className="rounded-[32px] border border-red-500/10 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Etherscan data</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Latest records fetched from Etherscan</h3>
        </div>
        {etherscan?.explorerUrl && (
          <a
            href={etherscan.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-red-100"
          >
            Open Etherscan
          </a>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Balance Wei</p>
          <p className="mt-3 break-all text-sm text-white">{etherscan?.balanceWei || "0"}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Transactions</p>
          <p className="mt-3 text-3xl font-semibold text-white">{transactions.length}</p>
        </div>
        <div className="rounded-3xl bg-black/40 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Token transfers</p>
          <p className="mt-3 text-3xl font-semibold text-white">{tokenTransfers.length}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-slate-900/70 p-5">
          <p className="text-sm font-semibold text-white">Latest transactions</p>
          <div className="mt-4 space-y-3">
            {transactions.length ? (
              transactions.slice(0, 8).map((tx: any) => (
                <div key={tx.hash} className="rounded-2xl bg-slate-950/70 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3 text-slate-400">
                    <p>{tx.date}</p>
                    <p className={tx.direction === "outgoing" ? "text-amber-300" : "text-emerald-300"}>
                      {tx.direction}
                    </p>
                  </div>
                  <p className="mt-2 text-white">{formatNumber(tx.valueEth)} ETH</p>
                  <p className="mt-2 break-all text-xs text-slate-500">{tx.hash}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {shortAddress(tx.from)} {"->"} {shortAddress(tx.to)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No normal transactions returned by Etherscan.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/70 p-5">
          <p className="text-sm font-semibold text-white">Latest token transfers</p>
          <div className="mt-4 space-y-3">
            {tokenTransfers.length ? (
              tokenTransfers.slice(0, 8).map((transfer: any, index: number) => (
                <div key={`${transfer.hash}-${transfer.contractAddress}-${transfer.rawValue}-${index}`} className="rounded-2xl bg-slate-950/70 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3 text-slate-400">
                    <p>{transfer.date}</p>
                    <p className={transfer.direction === "outgoing" ? "text-amber-300" : "text-emerald-300"}>
                      {transfer.direction}
                    </p>
                  </div>
                  <p className="mt-2 text-white">
                    {formatNumber(transfer.value)} {transfer.tokenSymbol || "TOKEN"}
                  </p>
                  <p className="mt-2 break-all text-xs text-slate-500">{transfer.hash}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {shortAddress(transfer.from)} {"->"} {shortAddress(transfer.to)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No token transfers returned by Etherscan.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
