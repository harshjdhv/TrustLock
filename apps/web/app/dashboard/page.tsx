import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { DashboardHome } from "@/components/dashboard-home"
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const session = await verifySessionToken(token)

  if (!session) {
    redirect("/")
  }

  return <DashboardHome walletAddress={session.walletAddress} />
}
