"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type ConnectWalletCtaProps = {
  className?: string
}

export function ConnectWalletCta({ className }: ConnectWalletCtaProps) {
  const router = useRouter()
  const { connected, connecting } = useWallet()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    if (connected) {
      router.push("/dashboard")
    }
  }, [connected, router])

  return (
    <Button
      className={className}
      onClick={() => setVisible(true)}
      disabled={connecting}
    >
      {connecting ? (
        <span className="relative z-10 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </span>
      ) : (
        <span className="relative z-10 flex items-center gap-2">
          Connect Wallet
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </Button>
  )
}
