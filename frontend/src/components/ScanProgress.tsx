import { motion } from "framer-motion"

export default function ScanProgress() {
  return (
    <motion.div
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ repeat: Infinity, duration: 1.8 }}
      className="glass-panel mt-10 p-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Scan pipeline</p>
          <p className="mt-2 text-lg font-semibold text-white">Intelligent threat processing active</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_20px_rgba(248,113,113,0.35)]" />
          Live AI analysis
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Behavioral anomaly detection",
          "Approval risk evaluation",
          "Contract interaction mapping",
          "Threat intelligence parsing"
        ].map((item) => (
          <div key={item} className="rounded-3xl bg-slate-900/70 p-4 text-sm text-slate-300 shadow-[0_0_40px_rgba(239,68,68,0.08)]">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          animate={{ x: ["-100%", "100%", "-100%"] }}
          transition={{ ease: "linear", duration: 2.2, repeat: Infinity }}
          className="h-full w-2/5 rounded-full bg-gradient-to-r from-red-500 via-red-400 to-rose-400"
        />
      </div>
    </motion.div>
  )
}
