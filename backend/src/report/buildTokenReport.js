export function buildTokenReport({
  tokenInfo,
  honeypotAnalysis,
  liquidityAnalysis,
  ownershipAnalysis,
  holderAnalysis,
  scamPatternAnalysis,
  airdropAnalysis
}) {
  let riskScore = 0
  let reasons = []

  const addRisk = (value, reason) => {
    riskScore += value
    if (reason) reasons.push(reason)
  }

  /* ---------------- TOKEN INFO ---------------- */
  const tokenSection = {
    name: tokenInfo?.name || "Unknown",
    symbol: tokenInfo?.symbol || "Unknown",
    contract: tokenInfo?.address,
    chain: tokenInfo?.chain || "Ethereum",
    tokenAge: tokenInfo?.age || "Unknown",
    isVerified: tokenInfo?.verified || false
  }

  /* ---------------- HONEYPOT ---------------- */
  if (!honeypotAnalysis.canSell) {
    addRisk(40, "Selling is blocked — token behaves like a honeypot")
  }

  if (honeypotAnalysis.sellTax > 40) {
    addRisk(30, "Extremely high sell tax detected")
  }

  const honeypotSection = {
    canBuy: honeypotAnalysis.canBuy,
    canSell: honeypotAnalysis.canSell,
    buyTax: honeypotAnalysis.buyTax,
    sellTax: honeypotAnalysis.sellTax,
    transferTax: honeypotAnalysis.transferTax,
    slippageRequired: honeypotAnalysis.slippage,
    warning:
      !honeypotAnalysis.canSell
        ? "Selling blocked — token behaves like a honeypot"
        : honeypotAnalysis.sellTax > 40
        ? "High sell tax detected"
        : null
  }

  /* ---------------- LIQUIDITY ---------------- */
  if (!liquidityAnalysis.isLocked) {
    addRisk(25, "Liquidity is unlocked and can be removed anytime")
  }

  if (liquidityAnalysis.ownerLiquidityPercent > 50) {
    addRisk(20, "Owner controls majority of liquidity")
  }

  const liquiditySection = {
    liquidityUSD: liquidityAnalysis.usd,
    isLocked: liquidityAnalysis.isLocked,
    lockDuration: liquidityAnalysis.lockDuration,
    lpHolder: liquidityAnalysis.lpHolder,
    ownerLiquidityPercent: liquidityAnalysis.ownerLiquidityPercent,
    warning:
      !liquidityAnalysis.isLocked
        ? "Liquidity is not locked"
        : liquidityAnalysis.ownerLiquidityPercent > 50
        ? "Owner controls majority of liquidity"
        : null
  }

  /* ---------------- OWNERSHIP ---------------- */
  if (!ownershipAnalysis.renounced) {
    addRisk(15, "Ownership not renounced")
  }

  if (ownershipAnalysis.canChangeTax) {
    addRisk(20, "Owner can change taxes after launch")
  }

  if (ownershipAnalysis.canBlacklist) {
    addRisk(20, "Owner can blacklist wallets")
  }

  const ownershipSection = {
    ownerAddress: ownershipAnalysis.owner,
    ownershipRenounced: ownershipAnalysis.renounced,
    canChangeTax: ownershipAnalysis.canChangeTax,
    canBlockSell: ownershipAnalysis.canBlockSell,
    canBlacklist: ownershipAnalysis.canBlacklist,
    canMint: ownershipAnalysis.canMint,
    warning:
      ownershipAnalysis.canChangeTax || ownershipAnalysis.canBlacklist
        ? "Owner has dangerous control over token"
        : null
  }

  /* ---------------- HOLDERS ---------------- */
  if (holderAnalysis.top1 > 30) {
    addRisk(20, "Top holder owns more than 30% of supply")
  }

  const holderSection = {
    totalHolders: holderAnalysis.total,
    top1Percent: holderAnalysis.top1,
    top5Percent: holderAnalysis.top5,
    top10Percent: holderAnalysis.top10,
    ownerInTopHolders: holderAnalysis.ownerInTop,
    warning:
      holderAnalysis.top1 > 30
        ? "High holder concentration detected"
        : null
  }

  /* ---------------- SCAM PATTERNS ---------------- */
  if (scamPatternAnalysis.matched) {
    addRisk(35, "Matches known honeypot or scam contract patterns")
  }

  const scamPatternSection = {
    matchedKnownPatterns: scamPatternAnalysis.matched,
    similarContracts: scamPatternAnalysis.similarCount,
    knownScammerInvolved: scamPatternAnalysis.scammerLinked
  }

  /* ---------------- AIRDROP ---------------- */
  if (airdropAnalysis.unlimitedApproval) {
    addRisk(40, "Unlimited approval request detected — wallet drain risk")
  }

  const airdropSection = {
    tokenName: airdropAnalysis.tokenName,
    sender: airdropAnalysis.sender,
    firstSeen: airdropAnalysis.firstSeen,
    isVerifiedProject: airdropAnalysis.verified,
    requiresApproval: airdropAnalysis.requiresApproval,
    approvalType: airdropAnalysis.unlimitedApproval ? "UNLIMITED" : "LIMITED",
    targetAsset: airdropAnalysis.targetAsset,
    warning:
      airdropAnalysis.unlimitedApproval
        ? "Unlimited approval requested — wallet drain risk"
        : null
  }

  /* ---------------- FINAL VERDICT ---------------- */
  if (riskScore > 100) riskScore = 100

  let riskLevel = "SAFE"
  if (riskScore > 30) riskLevel = "MEDIUM"
  if (riskScore > 60) riskLevel = "HIGH"

  const finalVerdict = {
    riskScore,
    riskLevel,
    summary: reasons.slice(0, 3).join(", "),
    recommendedAction:
      riskLevel === "HIGH"
        ? "AVOID_TOKEN"
        : riskLevel === "MEDIUM"
        ? "PROCEED_WITH_CAUTION"
        : "NO_KNOWN_RISK"
  }

  return {
    tokenInfo: tokenSection,
    honeypot: honeypotSection,
    liquidity: liquiditySection,
    ownership: ownershipSection,
    holders: holderSection,
    scamPatterns: scamPatternSection,
    airdrop: airdropSection,
    finalVerdict
  }
}
