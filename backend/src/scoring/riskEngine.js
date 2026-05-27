

export function buildFinalRisk(results) {
  let score = 0
  let reasons = []

  results.forEach(r => {
    score += r.risk
    reasons.push(...(r.evidence || []))
  })

  if (score > 100) score = 100

  let status = "SAFE"
  if (score >= 40) status = "RISKY"
  if (score >= 70) status = "DANGEROUS"

  return {
    score,
    status,
    reasons
  }
}
