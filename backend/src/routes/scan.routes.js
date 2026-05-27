import express from "express"

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
import { validateTokenAddress } from "../validators/tokenValidator.js"

const router = express.Router()

router.post("/validate-token", async (req, res) => {
  try {
    const { tokenAddress } = req.body
    const validation = await validateTokenAddress(tokenAddress)

    if (!validation.valid) {
      return res.status(400).json(validation)
    }

    return res.json(validation)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Token validation failed" })
  }
})

router.post("/scan", async (req, res) => {
  try {
    const { tokenAddress } = req.body
    const validation = await validateTokenAddress(tokenAddress)

    if (!validation.valid) {
      return res.status(400).json(validation)
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
        address: validation.address,
        name: validation.name,
        symbol: validation.symbol,
        chain: validation.chain,
        verified: true
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
