"use client"

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"

type SolanaProviderProps = {
  children: React.ReactNode
}

const toNetwork = (value: string | undefined): WalletAdapterNetwork => {
  if (value === WalletAdapterNetwork.Mainnet) {
    return WalletAdapterNetwork.Mainnet
  }

  if (value === WalletAdapterNetwork.Testnet) {
    return WalletAdapterNetwork.Testnet
  }

  return WalletAdapterNetwork.Devnet
}

export function SolanaProvider({ children }: SolanaProviderProps) {
  const network = useMemo(
    () => toNetwork(process.env.NEXT_PUBLIC_SOLANA_NETWORK),
    []
  )
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ?? clusterApiUrl(network),
    [network]
  )
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
