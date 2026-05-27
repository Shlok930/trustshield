export async function taxManipulation(address, provider) {
  const code = (await provider.getCode(address)).toLowerCase()

  const dynamicTax = code.includes("settax") || code.includes("fee")

  return {
    data: {
      buyTax: dynamicTax ? 5 : 0,
      sellTax: dynamicTax ? 60 : 0
    },
    risk: dynamicTax ? 30 : 0,
    evidence: dynamicTax ? ["Dynamic tax logic detected"] : []
  }
}
