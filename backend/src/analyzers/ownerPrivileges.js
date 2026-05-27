export async function ownerPrivileges(address, provider) {
  const code = (await provider.getCode(address)).toLowerCase()

  const dangerous =
    code.includes("onlyowner") ||
    code.includes("blacklist")

  return {
    data: {
      canChangeTax: dangerous,
      canBlacklist: dangerous,
      ownershipRenounced: !dangerous
    },
    risk: dangerous ? 30 : 0,
    evidence: dangerous ? ["Owner has dangerous privileges"] : []
  }
}
