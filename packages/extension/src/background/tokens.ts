import { validateAndParseAddress } from "starknet"

import { Token, parsedDefaultTokens } from "../shared/token"
import { Storage } from "./storage"

const customTokenStore = new Storage<{
  tokens: Token[]
}>({ tokens: [] }, "tokens")

const validateToken = (token: Partial<Token>): token is Token => {
  try {
    if (
      !token.address ||
      !token.networkId ||
      !token.name ||
      !token.symbol ||
      !token.decimals
    ) {
      throw Error("token is missing required field")
    }
    validateAndParseAddress(token.address)
    return true
  } catch {
    return false
  }
}

export const getTokens = async (): Promise<Token[]> => {
  return parsedDefaultTokens.concat(await customTokenStore.getItem("tokens"))
}

export const hasToken = async (address: Token["address"]): Promise<boolean> => {
  const tokens = await getTokens()
  return tokens.some((token) => token.address === address)
}

type TokenMutationResult =
  | { success: true; tokens: Token[] }
  | { success: false; tokens?: never }

export const addToken = async (token: Token): Promise<TokenMutationResult> => {
  if (!validateToken(token)) {
    throw new Error("Invalid token")
  }
  const allTokens = await getTokens()
  if (allTokens.find(({ address }) => address === token.address)) {
    return { success: false }
  }
  const customTokens = await customTokenStore.getItem("tokens")
  customTokens.push(token)
  allTokens.push(token)
  await customTokenStore.setItem("tokens", customTokens)
  return { success: true, tokens: allTokens }
}

export const removeToken = async (
  tokenAddress: Token["address"],
): Promise<TokenMutationResult> => {
  const customTokens = await customTokenStore.getItem("tokens")
  const index = customTokens.findIndex(
    ({ address }) => address === tokenAddress,
  )
  if (index === -1) {
    return { success: false }
  }
  customTokens.splice(index, 1)
  await customTokenStore.setItem("tokens", customTokens)
  return { success: true, tokens: customTokens }
}
