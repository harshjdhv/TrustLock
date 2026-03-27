import { SignJWT, jwtVerify } from "jose"

export const AUTH_COOKIE_NAME = "trustlock_session"
const NONCE_TTL_MS = 5 * 60 * 1000
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

type NonceRecord = {
  walletAddress: string
  issuedAt: string
  expiresAt: number
  used: boolean
}

type NonceStore = Map<string, NonceRecord>

declare global {
  var __trustlockNonceStore: NonceStore | undefined
}

const nonceStore: NonceStore = globalThis.__trustlockNonceStore ?? new Map()

if (!globalThis.__trustlockNonceStore) {
  globalThis.__trustlockNonceStore = nonceStore
}

const getJwtSecret = () => {
  const secret =
    process.env.AUTH_JWT_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "trustlock-dev-insecure-secret"
  return new TextEncoder().encode(secret)
}

const pruneExpiredNonces = () => {
  const now = Date.now()
  for (const [nonce, record] of nonceStore.entries()) {
    if (record.expiresAt < now || record.used) {
      nonceStore.delete(nonce)
    }
  }
}

export const buildSignInMessage = ({
  domain,
  walletAddress,
  nonce,
  issuedAt,
}: {
  domain: string
  walletAddress: string
  nonce: string
  issuedAt: string
}) => {
  return [
    `${domain} wants you to sign in with your Solana account:`,
    walletAddress,
    "",
    "Sign this message to authenticate with TrustLock.",
    "",
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n")
}

export const createNonce = (walletAddress: string) => {
  pruneExpiredNonces()
  const nonce = crypto.randomUUID()
  const issuedAt = new Date().toISOString()

  nonceStore.set(nonce, {
    walletAddress,
    issuedAt,
    expiresAt: Date.now() + NONCE_TTL_MS,
    used: false,
  })

  return { nonce, issuedAt, expiresInMs: NONCE_TTL_MS }
}

export const consumeNonce = ({
  walletAddress,
  nonce,
}: {
  walletAddress: string
  nonce: string
}) => {
  pruneExpiredNonces()
  const record = nonceStore.get(nonce)

  if (!record) {
    return { ok: false as const, reason: "missing_nonce" }
  }

  if (record.used) {
    return { ok: false as const, reason: "nonce_already_used" }
  }

  if (record.walletAddress !== walletAddress) {
    return { ok: false as const, reason: "wallet_mismatch" }
  }

  if (record.expiresAt < Date.now()) {
    nonceStore.delete(nonce)
    return { ok: false as const, reason: "nonce_expired" }
  }

  record.used = true
  nonceStore.set(nonce, record)

  return { ok: true as const, issuedAt: record.issuedAt }
}

export const issueSessionToken = async (walletAddress: string) => {
  return await new SignJWT({ walletAddress })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(walletAddress)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getJwtSecret())
}

export const verifySessionToken = async (token: string | undefined) => {
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    const walletAddress =
      typeof payload.walletAddress === "string" ? payload.walletAddress : null

    if (!walletAddress) {
      return null
    }

    return { walletAddress }
  } catch {
    return null
  }
}

export const sessionMaxAgeSeconds = SESSION_TTL_SECONDS
