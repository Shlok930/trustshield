import { ethers } from "ethers"

export const RPC_URL = "https://1rpc.io/eth"

export const provider = new ethers.JsonRpcProvider(RPC_URL)

export const erc20ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)"
]
