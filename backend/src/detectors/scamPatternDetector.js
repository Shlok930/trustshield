export function scamPatternDetector() {
  return {
    data: {
      matched: true,
      similarCount: 3,
      scammerLinked: true
    },
    risk: 35,
    evidence: ["Matches known scam contract patterns"]
  }
}
