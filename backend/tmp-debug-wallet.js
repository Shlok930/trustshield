import { ethers } from 'ethers'
import { provider, erc20ABI } from './src/provider.js'

const wallet = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
const trackingTokens = [
  { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
  { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
  { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' }
]

const formatTokenHolding = async (walletAddress, token) => {
  try {
    const contract = new ethers.Contract(token.address, erc20ABI, provider)
    const [symbol, decimals, rawBalance] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(walletAddress)
    ])
    return {
      symbol,
      contractAddress: token.address,
      balance: Number(ethers.formatUnits(rawBalance, decimals)),
      rawBalance: rawBalance.toString(),
      decimals
    }
  } catch (err) {
    console.error('token err', token.symbol, err.message)
    return null
  }
}

const run = async () => {
  try {
    const checksumAddress = ethers.getAddress(wallet)
    const [balance, txCount, code] = await Promise.all([
      provider.getBalance(checksumAddress),
      provider.getTransactionCount(checksumAddress),
      provider.getCode(checksumAddress)
    ])
    console.log('balance', ethers.formatEther(balance), 'tx', txCount, 'code', code.slice(0, 20))

    let ensName = null
    try {
      ensName = await provider.lookupAddress(checksumAddress)
    } catch (lookupError) {
      console.error('ens lookup failed', lookupError.message)
    }
    console.log('ensName', ensName)

    const tokenHoldings = await Promise.all(trackingTokens.map(token => formatTokenHolding(checksumAddress, token)))
    console.log('tokenHoldings', tokenHoldings.filter(Boolean))
  } catch (err) {
    console.error('MAIN ERR', err)
  }
}

run()
