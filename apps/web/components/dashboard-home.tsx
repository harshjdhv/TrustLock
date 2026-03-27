"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight, LogOut, ShieldCheck, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const shortenAddress = (value: string) =>
  `${value.slice(0, 4)}...${value.slice(-4)}`

type DashboardHomeProps = {
  walletAddress: string
}

export function DashboardHome({ walletAddress }: DashboardHomeProps) {
  const router = useRouter()
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      try {
        await disconnect()
      } catch {
        // Wallet adapters can reject disconnect if wallet app is not available.
      }

      router.push("/")
      router.refresh()
      setIsLoggingOut(false)
    }
  }

  if (!connected || !publicKey) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] px-6 py-12 text-zinc-950">
        <div className="mx-auto max-w-[720px] rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <h1 className="text-2xl font-semibold tracking-tight">
            Connect your wallet to continue
          </h1>
          <p className="mt-3 text-zinc-600">
            Dashboard data is tied to your wallet. Connect Phantom, Solflare, or
            Backpack to load your escrow workspace.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800"
              onClick={() => setVisible(true)}
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
            <Button
              asChild
              className="h-11 rounded-full border border-zinc-300 bg-white px-6 text-zinc-950 hover:bg-zinc-100"
            >
              <Link href="/">Back to Landing</Link>
            </Button>
            <Button
              className="h-11 rounded-full border border-zinc-300 bg-white px-6 text-zinc-950 hover:bg-zinc-100"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-12 text-zinc-950">
      <div className="mx-auto max-w-[1100px] space-y-8">
        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
              Dashboard
            </p>
            <Button
              className="h-10 rounded-full border border-zinc-300 bg-white px-5 text-zinc-950 hover:bg-zinc-100"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome, {shortenAddress(walletAddress)}
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Wallet connected successfully. Next stage is to let clients create
            escrows and fund USDC directly from this dashboard.
          </p>
          {publicKey.toBase58() !== walletAddress ? (
            <p className="mt-2 text-sm text-amber-700">
              Connected wallet differs from authenticated session. Logout and sign
              in again to switch identity.
            </p>
          ) : null}
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight">Active Escrows</h2>
            <p className="mt-2 text-sm text-zinc-600">
              No escrows yet. Create your first escrow in the next implementation
              step.
            </p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight">Next Action</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Build the Create Escrow form and wire it to your Solana program.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-900">
              <ShieldCheck className="h-4 w-4" />
              Wallet auth layer is now ready
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold tracking-tight">Roadmap</h2>
          <ol className="mt-4 grid gap-3 text-sm text-zinc-700 md:grid-cols-2">
            <li>1. Create escrow form</li>
            <li>2. Fund escrow with USDC</li>
            <li>3. Submit proof link</li>
            <li>4. Approve/reject and release</li>
          </ol>
          <Button
            asChild
            className="mt-6 h-11 rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800"
          >
            <Link href="/">
              Return to Landing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  )
}
