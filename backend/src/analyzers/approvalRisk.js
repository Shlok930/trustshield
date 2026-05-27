export async function approvalRisk() {
  return {
    data: {
      requiresApproval: true,
      unlimitedApproval: true,
      targetAsset: "USDT"
    },
    risk: 40,
    evidence: ["Unlimited approval request detected"]
  }
}
