export function airdropDetector() {
  return {
    data: {
      tokenName: "FreeUSDT",
      sender: "0xUnknown",
      unlimitedApproval: true,
      verified: false
    },
    risk: 40,
    evidence: ["Suspicious unsolicited airdrop detected"]
  }
}
