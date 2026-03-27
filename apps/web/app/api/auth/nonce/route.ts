import { NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"

import { buildSignInMessage, createNonce } from "@/lib/auth"

type NonceRequestBody = {
  walletAddress?: string
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as NonceRequestBody | null
  const walletAddress = body?.walletAddress?.trim()

  if (!walletAddress) {
    return NextResponse.json(
      { error: "walletAddress is required" },
      { status: 400 }
    )
  }

  try {
    new PublicKey(walletAddress)
  } catch {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 })
  }

  const domain = request.headers.get("host") ?? "localhost"
  const { nonce, issuedAt, expiresInMs } = createNonce(walletAddress)
  const message = buildSignInMessage({
    domain,
    walletAddress,
    nonce,
    issuedAt,
  })

  return NextResponse.json({ nonce, message, expiresInMs })
}
