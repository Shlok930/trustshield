export async function liquiditySafety() {
  return {
    data: {
      usd: 120000,
      isLocked: false,
      ownerLiquidityPercent: 90
    },
    risk: 30,
    evidence: ["Liquidity is not locked"]
  }
}
