export async function sellRestrictions(address, provider) {
  const code = (await provider.getCode(address)).toLowerCase()

  const blocked =
    code.includes("blacklist") ||
    code.includes("onlyowner") ||
    code.includes("pausetrading")

  return {
    data: {
      canSell: !blocked
    },
    risk: blocked ? 40 : 0,
    evidence: blocked ? ["Sell restriction logic detected"] : []
  }
}
