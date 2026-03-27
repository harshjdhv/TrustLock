import { Geist, Geist_Mono } from "next/font/google"
import "@solana/wallet-adapter-react-ui/styles.css"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SolanaProvider } from "@/components/solana-provider"
import { cn } from "@workspace/ui/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", fontSans.variable)}
    >
      <body>
        <ThemeProvider>
          <SolanaProvider>{children}</SolanaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
