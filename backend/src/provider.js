import { ethers } from "ethers"

export const NETWORK_RPC_URLS = {
  ethereum: "https://1rpc.io/eth",
  eth: "https://1rpc.io/eth",
  bsc: "https://bsc-dataseed.binance.org",
  binance: "https://bsc-dataseed.binance.org",
  polygon: "https://polygon-rpc.com",
  matic: "https://polygon-rpc.com",
  arbitrum: "https://arb1.arbitrum.io/rpc",
  avalanche: "https://api.avax.network/ext/bc/C/rpc",
  avax: "https://api.avax.network/ext/bc/C/rpc"
}

export const DEFAULT_NETWORK = "ethereum"

export const getProvider = (networkName = DEFAULT_NETWORK) => {
  const key = String(networkName || DEFAULT_NETWORK).toLowerCase().trim()
  const rpcUrl = NETWORK_RPC_URLS[key] || NETWORK_RPC_URLS[DEFAULT_NETWORK]
  return new ethers.JsonRpcProvider(rpcUrl)
}

export const provider = getProvider(DEFAULT_NETWORK)

export const erc20ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)"
]
