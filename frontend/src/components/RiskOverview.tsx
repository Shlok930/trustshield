import { motion } from "framer-motion"

export default function RiskOverview({ score, status }: any) {
  const color =
    status === "DANGEROUS"
      ? "text-red-500"
      : status === "RISKY"
      ? "text-yellow-400"
      : "text-green-400"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10 w-full max-w-md rounded-2xl bg-white/5 p-6 text-center"
    >
      <h3 className="text-white/60">Overall Risk Verdict</h3>

      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`mt-3 text-5xl font-bold ${color}`}
      >
        {status}
      </motion.h1>

      <p className="mt-3 text-white/60">
        Combined Risk Score: {score} / 100
      </p>
    </motion.div>
  )
}
