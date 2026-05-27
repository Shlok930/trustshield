import { ethers } from "ethers"

export async function contractIntegrity(address, provider) {
  const code = await provider.getCode(address)

  if (code === "0x") {
    return {
      data: { isContract: false },
      risk: 80,
      evidence: ["Address is not a smart contract"]
    }
  }

  return {
    data: { isContract: true },
    risk: 0,
    evidence: []
  }
}
