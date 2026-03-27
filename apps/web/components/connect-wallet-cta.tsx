"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@workspace/ui/components/button"
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type ConnectWalletCtaProps = {
  className?: string
}

type AuthState = "idle" | "connecting" | "signing" | "verifying"

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

export function ConnectWalletCta({ className }: ConnectWalletCtaProps) {
  const router = useRouter()
  const { connected, connecting, publicKey, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const [authState, setAuthState] = useState<AuthState>("idle")
  const [error, setError] = useState<string | null>(null)
  const signingForWallet = useRef<string | null>(null)

  useEffect(() => {
    if (!connected || !publicKey) {
      signingForWallet.current = null
      if (!connecting && authState === "connecting") {
        setAuthState("idle")
      }
      return
    }

    const walletAddress = publicKey.toBase58()
    if (signingForWallet.current === walletAddress) {
      return
    }

    signingForWallet.current = walletAddress
    const authenticate = async () => {
      if (!signMessage) {
        setError("This wallet does not support message signing.")
        signingForWallet.current = null
        return
      }

      try {
        setError(null)
        setAuthState("signing")

        const nonceResponse = await fetch("/api/auth/nonce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress }),
        })

        if (!nonceResponse.ok) {
          throw new Error("Failed to start wallet authentication.")
        }

        const noncePayload = (await nonceResponse.json()) as {
          nonce: string
          message: string
        }

        const messageBytes = new TextEncoder().encode(noncePayload.message)
        const signed = await signMessage(messageBytes)
        const signature = bytesToBase64(signed)

        setAuthState("verifying")
        const verifyResponse = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress,
            nonce: noncePayload.nonce,
            message: noncePayload.message,
            signature,
          }),
        })

        if (!verifyResponse.ok) {
          throw new Error("Wallet signature verification failed.")
        }

        setAuthState("idle")
        router.push("/dashboard")
        router.refresh()
      } catch (authError) {
        const message =
          authError instanceof Error
            ? authError.message
            : "Authentication failed. Please try again."
        setError(message)
        setAuthState("idle")
        signingForWallet.current = null
      }
    }

    void authenticate()
  }, [authState, connected, connecting, publicKey, router, signMessage])

  return (
    <div className="flex w-full flex-col items-center sm:w-auto">
      <Button
        className={className}
        onClick={() => {
          setError(null)
          setAuthState("connecting")
          setVisible(true)
        }}
        disabled={connecting || authState === "signing" || authState === "verifying"}
      >
        {connecting || authState === "connecting" ? (
          <span className="relative z-10 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </span>
        ) : null}
        {authState === "signing" ? (
          <span className="relative z-10 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting for Signature...
          </span>
        ) : null}
        {authState === "verifying" ? (
          <span className="relative z-10 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </span>
        ) : null}
        {authState === "idle" ? (
          <span className="relative z-10 flex items-center gap-2">
            Connect Wallet
            <ArrowRight className="h-4 w-4" />
          </span>
        ) : null}
      </Button>
      {error ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
