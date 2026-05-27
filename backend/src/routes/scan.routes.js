import express from "express"
import { ethers } from "ethers"

import { contractIntegrity } from "../analyzers/contractIntegrity.js"
import { sellRestrictions } from "../analyzers/sellRestrictions.js"
import { taxManipulation } from "../analyzers/taxManipulation.js"
import { ownerPrivileges } from "../analyzers/ownerPrivileges.js"
import { approvalRisk } from "../analyzers/approvalRisk.js"
import { liquiditySafety } from "../analyzers/liquiditySafety.js"
import { provider } from "../provider.js"

import { scamPatternDetector } from "../detectors/scamPatternDetector.js"
import { airdropDetector } from "../detectors/airdropDetector.js"

import { buildTokenReport } from "../report/buildTokenReport.js"

const router = express.Router()

router.post("/scan", async (req, res) => {
  try {
    const { tokenAddress } = req.body

    if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
      return res.status(400).json({ error: "Invalid token address" })
    }

    const integrity = await contractIntegrity(tokenAddress, provider)
    const sell = await sellRestrictions(tokenAddress, provider)
    const tax = await taxManipulation(tokenAddress, provider)
    const owner = await ownerPrivileges(tokenAddress, provider)
    const approval = await approvalRisk()
    const liquidity = await liquiditySafety()
    const scam = scamPatternDetector()
    const airdrop = airdropDetector()

    const report = buildTokenReport({
      tokenInfo: {
        address: tokenAddress,
        chain: "Ethereum"
      },
      honeypotAnalysis: {
        canBuy: true,
        canSell: sell.data.canSell,
        buyTax: tax.data.buyTax,
        sellTax: tax.data.sellTax,
        transferTax: 0,
        slippage: 90
      },
      liquidityAnalysis: liquidity.data,
      ownershipAnalysis: owner.data,
      holderAnalysis: {
        total: 1240,
        top1: 32,
        top5: 67,
        top10: 82,
        ownerInTop: true
      },
      scamPatternAnalysis: scam.data,
      airdropAnalysis: {
        ...airdrop.data,
        requiresApproval: true
      }
    })

    res.json(report)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Scan failed" })
  }
})

export default router
