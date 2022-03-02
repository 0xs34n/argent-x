import { Provider } from "starknet"

import { BackupWallet } from "./backup.model"

export interface Network {
  id: string
  name: string
  baseUrl?: string
  explorerUrl?: string
  accountImplementation?: string
}

export const networks: Network[] = [
  {
    id: "mainnet-alpha",
    name: "Ethereum Mainnet",
    explorerUrl: "https://voyager.online",
  },
  {
    id: "goerli-alpha",
    name: "Goerli Testnet",
    explorerUrl: "https://goerli.voyager.online",
    accountImplementation: "0x0243638d94e74836f3e73a10e6c90aedf48ae8daa0c586dca6698618471cf639"
  },
  {
    id: "localhost",
    name: "Localhost",
  },
]

export const defaultNetwork = networks[1] // goerli-alpha

export const getNetwork = (networkId: string): Network => {
  networkId = localNetworkId(networkId)
  return networks.find(({ id }) => id === networkId) || defaultNetwork
}

export const networkWallets = (wallets: BackupWallet[], networkId: string) =>
  wallets.filter(
    ({ network }) => localNetworkId(network) === localNetworkId(networkId),
  )

export const localNetworkId = (network: string) =>
  network.startsWith("http://localhost") ? "localhost" : network

export const localNetworkUrl = (networkId: string, port: number) => {
  if (networkId.startsWith("http://localhost")) {
    return networkId
  }
  return networkId === "localhost" ? `http://localhost:${port}` : networkId
}

export const getProvider = (network: string) =>
  new Provider(
    network.startsWith("http")
      ? { baseUrl: network }
      : { network: network as any },
  )
