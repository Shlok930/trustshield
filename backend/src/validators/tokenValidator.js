import { ethers } from "ethers"

import { erc20ABI, provider } from "../provider.js"

export async function validateTokenAddress(tokenAddress) {
  if (!tokenAddress || typeof tokenAddress !== "string") {
    return {
      valid: false,
      error: "Token address is required"
    }
  }

  if (!ethers.isAddress(tokenAddress)) {
    return {
      valid: false,
      error: "Invalid token address format"
    }
  }

  const checksumAddress = ethers.getAddress(tokenAddress)
  const contract = new ethers.Contract(checksumAddress, erc20ABI, provider)

  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ])

    return {
      valid: true,
      address: checksumAddress,
      name,
      symbol,
      decimals: Number(decimals),
      chain: "Ethereum"
    }
  } catch (error) {
    return {
      valid: false,
      error: "Token contract is not a valid ERC-20 token",
      details: error?.shortMessage || error?.message || "Unknown validation error"
    }
  }
}
