import { NextResponse } from "next/server"
import nacl from "tweetnacl"
import { PublicKey } from "@solana/web3.js"

import {
  AUTH_COOKIE_NAME,
  buildSignInMessage,
  consumeNonce,
  issueSessionToken,
  sessionMaxAgeSeconds,
} from "@/lib/auth"

type VerifyRequestBody = {
  walletAddress?: string
  nonce?: string
  message?: string
  signature?: string
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as VerifyRequestBody | null
  const walletAddress = body?.walletAddress?.trim()
  const nonce = body?.nonce?.trim()
  const message = body?.message
  const signatureBase64 = body?.signature

  if (!walletAddress || !nonce || !message || !signatureBase64) {
    return NextResponse.json(
      { error: "walletAddress, nonce, message and signature are required" },
      { status: 400 }
    )
  }

  let walletPublicKey: PublicKey
  try {
    walletPublicKey = new PublicKey(walletAddress)
  } catch {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 })
  }

  const nonceCheck = consumeNonce({ walletAddress, nonce })
  if (!nonceCheck.ok) {
    return NextResponse.json(
      { error: "Nonce validation failed", reason: nonceCheck.reason },
      { status: 401 }
    )
  }

  const domain = request.headers.get("host") ?? "localhost"
  const expectedMessage = buildSignInMessage({
    domain,
    walletAddress,
    nonce,
    issuedAt: nonceCheck.issuedAt,
  })

  if (message !== expectedMessage) {
    return NextResponse.json(
      { error: "Message does not match expected payload" },
      { status: 401 }
    )
  }

  let signatureBytes: Uint8Array
  try {
    signatureBytes = new Uint8Array(Buffer.from(signatureBase64, "base64"))
  } catch {
    return NextResponse.json({ error: "Invalid signature encoding" }, { status: 400 })
  }

  const messageBytes = new TextEncoder().encode(message)
  const publicKeyBytes = walletPublicKey.toBytes()
  const verified = nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes
  )

  if (!verified) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 })
  }

  const token = await issueSessionToken(walletAddress)
  const response = NextResponse.json({
    authenticated: true,
    walletAddress,
    walletAddressShort: `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`,
  })

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  })

  return response
}
