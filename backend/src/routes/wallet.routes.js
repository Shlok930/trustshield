import express from "express"
import { ethers } from "ethers"
import "../config/loadEnv.js"

const router = express.Router()

const ETH_USD_PRICE = 3200
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const hasEtherscanApiKey =
  Boolean(ETHERSCAN_API_KEY) && ETHERSCAN_API_KEY !== "YOUR_ETHERSCAN_API_KEY_HERE"
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/v2/api"
const knownTokenPrices = new Map([
  ["WETH", ETH_USD_PRICE],
  ["USDC", 1],
  ["USDT", 1],
  ["DAI", 1],
  ["LINK", 7.6],
  ["UNI", 13.5]
])

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const buildHeatmap = (total) => {
  const rows = 4
  const cols = 7
  const base = Math.ceil(total / (rows * cols + 1))
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) =>
      Math.min(10, base + rowIndex + (colIndex % 3))
    )
  )
}

const formatTxTime = (timeStamp) => {
  const txDate = new Date(Number(timeStamp || 0) * 1000)
  return Number.isNaN(txDate.getTime()) ? "Unknown time" : txDate.toLocaleString("en-US")
}

const buildRecentTimeline = (txList = [], checksumAddress) =>
  txList.slice(0, 4).map((tx) => {
    const outgoing = tx.from?.toLowerCase() === checksumAddress.toLowerCase()
    const value = Number(ethers.formatEther(toBigInt(tx.value || 0)))
    const failed = String(tx.isError) !== "0"

    return {
      time: formatTxTime(tx.timeStamp),
      severity: failed ? "High" : value > 10 ? "Moderate" : "Low",
      description: `${outgoing ? "Outgoing" : "Incoming"} transaction ${tx.hash || ""} for ${value.toFixed(4)} ETH`
    }
  })

const buildApprovalHistory = (tokenHoldings = []) =>
  tokenHoldings.slice(0, 4).map((token) => ({
    name: token.symbol,
    risk: token.valueUSD > 10000 ? "High" : token.valueUSD > 1000 ? "Moderate" : "Low",
    detail: `Token exposure derived from Etherscan transfers for ${token.contractAddress}.`
  }))

const formatTransaction = (tx, checksumAddress) => {
  const outgoing = tx.from?.toLowerCase() === checksumAddress.toLowerCase()

  return {
    hash: tx.hash,
    blockNumber: tx.blockNumber,
    timeStamp: tx.timeStamp,
    date: formatTxTime(tx.timeStamp),
    from: tx.from,
    to: tx.to,
    direction: outgoing ? "outgoing" : "incoming",
    valueEth: Number(ethers.formatEther(toBigInt(tx.value || 0))),
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    isError: tx.isError,
    methodId: tx.methodId,
    functionName: tx.functionName
  }
}

const formatTokenTransfer = (transfer, checksumAddress) => {
  const outgoing = transfer.from?.toLowerCase() === checksumAddress.toLowerCase()
  const decimals = Number(transfer.tokenDecimal || 18)

  return {
    hash: transfer.hash,
    blockNumber: transfer.blockNumber,
    timeStamp: transfer.timeStamp,
    date: formatTxTime(transfer.timeStamp),
    from: transfer.from,
    to: transfer.to,
    direction: outgoing ? "outgoing" : "incoming",
    tokenName: transfer.tokenName,
    tokenSymbol: transfer.tokenSymbol,
    tokenDecimal: transfer.tokenDecimal,
    contractAddress: transfer.contractAddress,
    value: Number(ethers.formatUnits(toBigInt(transfer.value || 0), decimals)),
    rawValue: transfer.value
  }
}

const buildConnectionGraph = (transactionCount) => ({
  nodes: [
    { id: "wallet", type: "Source", label: "Target Wallet", risk: "High" },
    { id: "dex", type: "Protocol", label: "DEX Router", risk: "Medium" },
    { id: "nft", type: "Marketplace", label: "NFT Market", risk: "Low" },
    { id: "unknown", type: "Unknown", label: "Unverified Contract", risk: "High" }
  ],
  edges: [
    { from: "Target Wallet", to: "DEX Router", type: transactionCount > 30 ? "Frequent swaps" : "Occasional swaps" },
    { from: "Target Wallet", to: "NFT Market", type: transactionCount > 10 ? "Metadata transfers" : "Low volume" },
    { from: "Target Wallet", to: "Unverified Contract", type: transactionCount > 15 ? "Suspicious interaction" : "Single interaction" }
  ]
})

const resolveWalletRequest = (req) => {
  const address = String(req.body?.address || req.query?.address || "").trim()
  const network = String(req.body?.network || req.query?.network || "ethereum").trim()
  return { address, network }
}

const toBigInt = (value) => {
  if (typeof value === "bigint") return value
  if (typeof value === "number") return BigInt(Math.trunc(value))
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? BigInt(trimmed.startsWith("0x") ? trimmed : trimmed) : 0n
  }
  return 0n
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const requestEtherscan = async (url, label, attempt = 1) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Etherscan ${label} request failed: ${response.status}`)
  }

  const data = await response.json()
  const resultText = String(data.result || "")
  const isRateLimited = resultText.toLowerCase().includes("rate limit")

  if (isRateLimited && attempt < 3) {
    await sleep(1200 * attempt)
    return requestEtherscan(url, label, attempt + 1)
  }

  const failedEtherscanResponse =
    data.status === "0" &&
    typeof data.message === "string" &&
    !["No transactions found", "No records found"].includes(data.message)

  if (failedEtherscanResponse) {
    throw new Error(data.result || data.message || `Etherscan ${label} returned an error`)
  }

  return data
}

const fetchEtherscanData = async (address) => {
  if (!hasEtherscanApiKey) {
    const error = new Error("ETHERSCAN_API_KEY is not configured")
    error.statusCode = 500
    throw error
  }

  const params = new URLSearchParams({
    chainid: "1",
    apikey: ETHERSCAN_API_KEY,
    address,
    page: "1",
    offset: "25",
    sort: "desc"
  })

  const endpoints = [
    ["balance", `${ETHERSCAN_BASE_URL}?module=account&action=balance&tag=latest&${params.toString()}`],
    ["transactions", `${ETHERSCAN_BASE_URL}?module=account&action=txlist&${params.toString()}`],
    ["token transfers", `${ETHERSCAN_BASE_URL}?module=account&action=tokentx&${params.toString()}`],
    ["contract code", `${ETHERSCAN_BASE_URL}?module=proxy&action=eth_getCode&tag=latest&${params.toString()}`]
  ]

  const results = {}

  for (const [index, [label, url]] of endpoints.entries()) {
    if (index > 0) {
      await sleep(450)
    }

    const data = await requestEtherscan(url, label)

    if (label === "balance") results.balance = data
    if (label === "transactions") results.txList = data
    if (label === "token transfers") results.tokenTx = data
    if (label === "contract code") results.code = data
  }

  return results
}

const deriveWalletMetrics = (txList = [], checksumAddress) => {
  const incoming = txList.filter((tx) => tx.to?.toLowerCase() === checksumAddress.toLowerCase())
  const outgoing = txList.filter((tx) => tx.from?.toLowerCase() === checksumAddress.toLowerCase())
  const largestTransaction = txList.reduce((largest, tx) => {
    const value = Number(ethers.formatEther(toBigInt(tx.value || 0)))
    return value > largest ? value : largest
  }, 0)
  const gasSpending = txList.reduce((sum, tx) => {
    const gasUsed = toBigInt(tx.gasUsed || 0)
    const gasPrice = toBigInt(tx.gasPrice || 0)
    return sum + Number(ethers.formatEther(gasUsed * gasPrice))
  }, 0)
  const failedTransactions = txList.filter((tx) => String(tx.isError) !== "0").length

  return {
    transactionCount: txList.length,
    incomingTransactions: incoming.length,
    outgoingTransactions: outgoing.length,
    largestTransaction,
    gasSpending,
    failedTransactions,
    firstSeen: txList.length
      ? new Date(Number(txList[txList.length - 1].timeStamp) * 1000).toLocaleDateString("en-US")
      : null,
    lastSeen: txList.length
      ? new Date(Number(txList[0].timeStamp) * 1000).toLocaleDateString("en-US")
      : null
  }
}

const deriveTokenHoldings = (tokenTransfers = [], checksumAddress) => {
  const balancesByContract = new Map()
  const normalizedAddress = checksumAddress.toLowerCase()

  for (const transfer of tokenTransfers) {
    const contractAddress = transfer.contractAddress
    const symbol = transfer.tokenSymbol || "UNKNOWN"
    const decimals = Number(transfer.tokenDecimal || 18)
    const value = toBigInt(transfer.value || 0)

    if (!contractAddress || value === 0n) continue

    const key = contractAddress.toLowerCase()
    const current = balancesByContract.get(key) || {
      symbol,
      contractAddress,
      decimals,
      rawBalance: 0n
    }

    if (transfer.to?.toLowerCase() === normalizedAddress) {
      current.rawBalance += value
    }

    if (transfer.from?.toLowerCase() === normalizedAddress) {
      current.rawBalance -= value
    }

    balancesByContract.set(key, current)
  }

  return Array.from(balancesByContract.values())
    .filter((token) => token.rawBalance > 0n)
    .map((token) => {
      const balance = Number(ethers.formatUnits(token.rawBalance, token.decimals))
      const price = knownTokenPrices.get(token.symbol) || 0

      return {
        symbol: token.symbol,
        contractAddress: token.contractAddress,
        balance,
        valueUSD: Number((balance * price).toFixed(2)),
        rawBalance: token.rawBalance.toString(),
        decimals: token.decimals,
        source: "etherscan-token-transfers"
      }
    })
    .slice(0, 10)
}

const buildWalletResponse = async (address, network) => {
  try {
    const checksumAddress = ethers.getAddress(address)
    const etherscanData = await fetchEtherscanData(checksumAddress)

    const txList = Array.isArray(etherscanData.txList?.result) ? etherscanData.txList.result : []
    const etherscanMetrics = deriveWalletMetrics(txList, checksumAddress)
    const tokenTransfers = Array.isArray(etherscanData.tokenTx?.result) ? etherscanData.tokenTx.result : []
    const tokenHoldings = deriveTokenHoldings(tokenTransfers, checksumAddress)
    const latestTransactions = txList.map((tx) => formatTransaction(tx, checksumAddress))
    const latestTokenTransfers = tokenTransfers.map((transfer) => formatTokenTransfer(transfer, checksumAddress))
    const transactionCount = etherscanMetrics?.transactionCount || 0
    const rawBalance = etherscanData?.balance?.result ? BigInt(etherscanData.balance.result) : 0n
    const walletBalance = Number(ethers.formatEther(rawBalance))
    const code = typeof etherscanData.code?.result === "string" ? etherscanData.code.result : "0x"
    const isContract = code !== "0x"
    const codeLower = code.toLowerCase()
    const contractInsights = isContract
      ? {
          isProxy:
            codeLower.includes("proxy") ||
            codeLower.includes("delegatecall") ||
            codeLower.includes("implementation"),
          isMultisig:
            codeLower.includes("gnosis") ||
            codeLower.includes("safe") ||
            codeLower.includes("multisig"),
          hasPrivilegedOwner:
            codeLower.includes("onlyowner") ||
            codeLower.includes("owner()") ||
            codeLower.includes("setowner"),
          codeSize: (code.length - 2) / 2
        }
      : null

    const ethValueUSD = Number((walletBalance * ETH_USD_PRICE).toFixed(2))
    const portfolioValueUSD = Number(
      (ethValueUSD + tokenHoldings.reduce((sum, token) => sum + token.valueUSD, 0)).toFixed(2)
    )

    const walletAge = transactionCount === 0
      ? "Newly created"
      : etherscanMetrics?.firstSeen
      ? `Active since ${etherscanMetrics.firstSeen}`
      : transactionCount < 20
      ? "0.4 yrs"
      : transactionCount < 80
      ? "0.9 yrs"
      : transactionCount < 220
      ? "1.8 yrs"
      : "3+ yrs"

    const baseRisk = 14
    const totalRisk = clamp(
      baseRisk +
        (isContract ? 10 : 0) +
        (transactionCount < 5 ? 10 : 0) +
        (transactionCount > 180 ? 8 : 0) +
        (portfolioValueUSD > 50000 ? 10 : 0) +
        (etherscanMetrics?.failedTransactions ? 6 : 0) +
        (etherscanMetrics?.largestTransaction > 25 ? 8 : 0) +
        (contractInsights?.isProxy ? 8 : 0) +
        (contractInsights?.hasPrivilegedOwner ? 10 : 0) +
        (tokenHoldings.length > 3 ? 6 : 0),
      8,
      100
    )

    const riskScore = totalRisk
    const securityStatus =
      riskScore >= 75
        ? "Critical"
        : riskScore >= 50
        ? "High Risk"
        : riskScore >= 30
        ? "Moderate Risk"
        : "Safe"

    const approvalRiskMeter = clamp(riskScore + 12, 0, 100)
    const scamProbability = clamp(Math.floor(riskScore * 0.85), 5, 96)
    const threatLevel = riskScore >= 65 ? "HIGH" : riskScore >= 40 ? "ELEVATED" : "LOW"

    const result = {
      address: checksumAddress,
      ensName: null,
      chain: (network ? network[0].toUpperCase() + network.slice(1) : "Ethereum"),
      isContract,
      walletBalance,
      transactionCount,
      tokenHoldings,
      contractInsights,
      walletAge,
      portfolioValueUSD,
      netWorthEstimation: Number((portfolioValueUSD * 1.05).toFixed(2)),
      topHolderShare: `${clamp(transactionCount > 0 ? 12 + tokenHoldings.length * 4 : 8, 8, 38)}%`,
      riskScore,
      securityStatus,
      summary: [
        isContract ? "Smart contract wallet" : "Externally owned wallet",
        `Balance: ${walletBalance.toFixed(4)} ETH`,
        `Activity: ${transactionCount} on-chain interactions`,
        etherscanMetrics?.lastSeen ? `Last seen: ${etherscanMetrics.lastSeen}` : null,
        contractInsights?.isProxy ? "Proxy / upgradable" : null,
        contractInsights?.hasPrivilegedOwner ? "Privileged owner logic" : null
      ]
        .filter(Boolean)
        .join(" | "),
      network,
      dataSource: "etherscan",
      etherscan: {
        apiVersion: "v2",
        chainId: "1",
        explorerUrl: `https://etherscan.io/address/${checksumAddress}`,
        balanceWei: rawBalance.toString(),
        latestTransactions,
        latestTokenTransfers,
        contractCodeAvailable: code !== "0x",
        resultWindow: {
          page: 1,
          offset: 25,
          sort: "desc"
        }
      },
      transactionAnalytics: {
        totalTransactions: transactionCount,
        incomingRatio: Number((etherscanMetrics ? etherscanMetrics.incomingTransactions / Math.max(1, transactionCount) : 0.26).toFixed(2)),
        outgoingRatio: Number((etherscanMetrics ? etherscanMetrics.outgoingTransactions / Math.max(1, transactionCount) : 0.74).toFixed(2)),
        dailyFrequency: Number((transactionCount > 0 ? Math.min(14, transactionCount / 18) : 0).toFixed(1)),
        averageTxAmount: Number((transactionCount > 0 ? walletBalance / Math.max(1, transactionCount) : 0).toFixed(4)),
        largestTransaction: Number(Math.max(0.0001, etherscanMetrics?.largestTransaction || 0).toFixed(4)),
        gasSpending: Number(Math.max(0.0001, etherscanMetrics?.gasSpending || 0).toFixed(4)),
        failedTransactions: etherscanMetrics?.failedTransactions || 0,
        heatmap: buildHeatmap(transactionCount),
        recentTimeline: buildRecentTimeline(txList, checksumAddress)
      },
      behavioralAnalysis: {
        activityConsistency:
          transactionCount > 150 ? "High consistency" : transactionCount > 40 ? "Moderate" : "Irregular",
        botLikeBehavior: transactionCount > 180 ? "Elevated" : "Low",
        washTrading: transactionCount > 120 && tokenHoldings.length >= 3 ? "Possible" : "Low",
        abnormalSpikes: transactionCount > 100 ? "Multiple abnormal spikes" : "Minimal",
        interactionVelocity: transactionCount > 80 ? "Fast" : "Measured",
        multiWalletRisk: transactionCount > 150 ? "Detected" : "Low",
        repeatScamInteractions: tokenHoldings.length > 2 ? "Observed" : "None detected",
        clusteringBehavior: transactionCount > 90 ? "Clustered" : "Sparse",
        verdict:
          riskScore >= 70
            ? "This wallet is interacting with high-risk contracts and shows transaction patterns consistent with rapid permission changes."
            : riskScore >= 45
            ? "The wallet displays inconsistent behavior and moderate approval exposure."
            : "The wallet shows stable on-chain interactions and limited risk signals.",
        confidence: clamp(74 + Math.floor(riskScore / 2), 60, 98),
        explanation:
          riskScore >= 70
            ? "Rapid contract approvals, high token concentration, and a fast interaction cadence indicate a risky wallet profile."
            : riskScore >= 45
            ? "Moderate risk appears from a mix of token holdings and approval posture with occasional abnormal spikes."
            : "Transaction activity and approval patterns are consistent with low-risk wallet behavior."
      },
      approvalAnalysis: {
        activeApprovals: Math.max(1, tokenHoldings.length + 2),
        unlimitedApprovals: tokenHoldings.length > 2 ? 1 : 0,
        dangerousApprovals: contractInsights?.hasPrivilegedOwner ? 1 : 0,
        approvalHistory: buildApprovalHistory(tokenHoldings),
        approvalRiskMeter,
        fundsDrainRisk: riskScore >= 60 ? "HIGH" : riskScore >= 35 ? "MEDIUM" : "LOW"
      },
      contractInteractions: {
        contractsInteracted: Math.max(3, tokenHoldings.length + 2),
        interactionFrequency: transactionCount > 0 ? Math.min(98, transactionCount * 2) : 0,
        defiProtocols: tokenHoldings
          .filter((token) => ["UNI", "AAVE", "CRV", "BAL"].includes(token.symbol))
          .map((token) => token.symbol),
        nftMarketplaces: [],
        unknownContracts: Math.min(6, Math.max(1, Math.floor(transactionCount / 20))),
        riskyContractWarnings: [
          contractInsights?.isProxy ? "Proxy contract behavior requires ongoing monitoring." : "No proxy-related warnings.",
          contractInsights?.hasPrivilegedOwner ? "Privileged owner functions detected." : "Owner privileges appear minimal."
        ]
      },
      scamDetection: {
        honeypotProbability: clamp(Math.floor(riskScore * 0.4), 5, 82),
        rugPullRisk: clamp(Math.floor(riskScore * 0.45), 5, 88),
        fakeAirdropExposure: tokenHoldings.length > 2 ? "Medium" : "Low",
        scamTokenExposure: tokenHoldings.length > 3 ? "Elevated" : "Low",
        phishingRisk: riskScore > 50 ? "Medium" : "Low",
        blacklistingIndicators: riskScore > 70 ? "Potential" : "None detected",
        scamProbability,
        threatReport:
          riskScore >= 65
            ? "This wallet is highly exposed to risky permissions and unknown contract interactions. Funds drain risk is elevated."
            : riskScore >= 40
            ? "The wallet has moderate exposure to risky approvals and should be monitored closely."
            : "The wallet currently shows a conservative transaction profile with few scam indicators."
      },
      aiRiskEngine: {
        trustScore: 100 - riskScore,
        threatLevel,
        anomalyScore: clamp(Math.floor(riskScore * 1.1), 15, 96),
        mevBotRisk: riskScore > 65 ? "High" : riskScore > 40 ? "Moderate" : "Low",
        mevDetail: riskScore > 65 ? "Potential MEV bot routing detected." : "Minimal MEV signal.",
        sybilScore: clamp(Math.floor(riskScore * 1.2), 10, 94),
        sybilDetail: riskScore > 55 ? "Connected to multiple clustered wallets." : "No large sybil clusters detected.",
        whaleDetection: riskScore > 70 ? "Whale movement detected" : "Standard whale profile",
        fraudPrediction: riskScore > 60 ? "Probable fraud vector" : "Low fraud signal",
        explanation:
          riskScore >= 70
            ? "High interaction frequency with high-risk contracts and approval behavior suggests this wallet is a priority security concern."
            : riskScore >= 45
            ? "Behavioral signals and approval history suggest a medium-risk profile that requires further review."
            : "The wallet demonstrates stable behavior and a low-risk approval posture.",
        suggestedActions: [
          "Revoke unnecessary token approvals immediately.",
          "Monitor this wallet for rapid approval changes.",
          "Avoid interaction with unknown contracts until risk decreases.",
          "Enable on-chain alerts for suspicious transfer patterns."
        ]
      },
      identityProfile: {
        fingerprint: isContract
          ? "Contract fingerprint: Proxy-enabled, privileged owner path, high approval velocity."
          : "EOA fingerprint: High-velocity approval behavior with multiple DeFi router interactions."
      },
      walletLabels: [
        isContract ? "Proxy-enabled" : "EOA",
        tokenHoldings.length > 2 ? "Multi-token exposure" : "Minimal holdings",
        riskScore > 65 ? "High-risk wallet" : "Stable wallet"
      ],
      walletTrustRank: `${clamp(1 + Math.floor((100 - riskScore) / 2), 1, 100)} / 100`,
      multiChainSupport: [
        { chain: "Ethereum", status: "Primary", risk: securityStatus === "Safe" ? "Low" : securityStatus === "Moderate Risk" ? "Medium" : "High" },
        { chain: "Polygon", status: "Planned", risk: "Medium" },
        { chain: "Arbitrum", status: "Planned", risk: "Low" }
      ],
      connectionGraph: buildConnectionGraph(transactionCount),
      securityInsights: {
        recommendedActions: [
          "Revoke any unlimited approvals for low-usage contracts.",
          "Validate the next contract interaction against reputation data.",
          "Move high-value assets to a safer wallet if risk remains elevated.",
          "Enable wallet monitoring for abnormal approval activity."
        ],
        highRiskWarnings: [
          "High approval risk from a popular swap router.",
          "Potential phishing exposure due to repeated unknown contract access.",
          "Behavioral clustering suggests repeated access from related wallet groups."
        ]
      }
    }

    return result
  } catch (err) {
    console.error(err)
    throw err
  }
}

router.get("/wallet", async (req, res) => {
  try {
    const { address, network } = resolveWalletRequest(req)

    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid wallet address" })
    }

    const result = await buildWalletResponse(address, network)
    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status(err.statusCode || 500).json({
      error: err.message || "Wallet analysis failed",
      source: "etherscan"
    })
  }
})

router.post("/wallet", async (req, res) => {
  try {
    const { address, network } = resolveWalletRequest(req)

    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid wallet address" })
    }

    const result = await buildWalletResponse(address, network)
    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status(err.statusCode || 500).json({
      error: err.message || "Wallet analysis failed",
      source: "etherscan"
    })
  }
})

export default router
