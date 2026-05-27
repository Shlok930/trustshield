import { motion } from "framer-motion"

export default function HoneypotPanel({ reasons }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 w-full max-w-md rounded-2xl bg-red-500/10 p-6"
    >
      <h3 className="text-xl font-semibold">🔴 Honeypot Analysis</h3>

      {reasons.length === 0 ? (
        <p className="mt-2 text-white/60">
          No sell-blocking behavior detected.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {reasons.map((r: string, i: number) => (
            <li key={i} className="text-sm text-red-300">
              ⚠ {r}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
