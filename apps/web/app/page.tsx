import { Button } from "@workspace/ui/components/button"
import { Shield, Check, Lock, LayoutGrid, CircleDashed } from "lucide-react"
import Link from "next/link"
import { ConnectWalletCta } from "@/components/connect-wallet-cta"

type LandingPageProps = {
  searchParams: Promise<{ auth?: string }>
}

export default async function Page({ searchParams }: LandingPageProps) {
  const params = await searchParams
  const authRequired = params.auth === "required"

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Refined Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-zinc-200/50">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-zinc-950 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">TrustLock</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              className="h-8 px-4 text-[13px] font-medium rounded-full bg-[#E3E3E3]/80 text-zinc-950 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(253,253,253,1)] hover:bg-[#E3E3E3] transition-all"
            >
              <Link href="/dashboard">Launch App</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-14">
        {/* Minimal Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
            style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          ></div>
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/50 text-zinc-600 text-[11px] font-semibold uppercase tracking-widest mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></span>
                </span>
                Solana Testnet
              </div>
              
              <h1 className="text-[3.5rem] leading-[1.05] md:text-[5rem] font-medium tracking-[-0.03em] text-zinc-950 mb-8">
                Trustless escrow. <br />
                <span className="text-zinc-400">Guaranteed pay.</span>
              </h1>
              
              <p className="text-[17px] md:text-[19px] leading-relaxed text-zinc-500 max-w-[600px] font-light mb-12">
                A decentralized sanctuary for freelancers and clients. Escrow your stablecoins directly on-chain, release them instantly upon delivery, and eliminate invoice anxiety entirely.
              </p>
              {authRequired ? (
                <p className="mb-6 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium tracking-wide text-amber-700 uppercase">
                  Sign in with your wallet to access dashboard
                </p>
              ) : null}
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <ConnectWalletCta className="h-12 px-8 text-[15px] font-medium rounded-full bg-zinc-950 text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:bg-zinc-800 hover:-translate-y-0.5 transition-all w-full sm:w-auto relative group" />
                <Button
                  asChild
                  className="h-12 px-8 text-[15px] font-medium rounded-full bg-[#E3E3E3]/80 text-zinc-950 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(253,253,253,1)] hover:bg-[#E3E3E3] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  <Link href="#how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Abstract Component Preview / App UI */}
        <section id="how-it-works" className="relative z-20 -mt-20">
          <div className="max-w-[1000px] mx-auto px-6">
            <div className="bg-white rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden backdrop-blur-3xl transform hover:-translate-y-1 transition-transform duration-500">
              <div className="h-12 border-b border-zinc-100 flex items-center px-6 gap-2 bg-zinc-50/50">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
              </div>
              
              <div className="p-8 md:p-12 lg:p-16 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left side: Premium Text */}
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-6">
                    <Shield className="w-5 h-5 text-zinc-950" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-3">Immutable Security</h3>
                  <p className="text-zinc-500 text-[15px] leading-relaxed mb-8">
                    Smart contracts hold funds in an undisputable ledger state. Only cryptographic proof or mutually agreed dispute resolution can unlock the vault.
                  </p>
                  
                  <ul className="space-y-4">
                    {[
                      "Zero custodian risk, fully decentralized.",
                      "Instant, cross-border USDC settlement.",
                      "Native integration with Phantom & Backpack."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-zinc-950" />
                        </div>
                        <span className="text-[14px] font-medium text-zinc-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Right side: Abstract UI Timeline Component */}
                <div className="relative">
                  {/* Decorative background blur */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-2xl -z-10 blur-2xl opacity-50"></div>
                  
                  <div className="border border-zinc-100/80 bg-white shadow-xl shadow-zinc-200/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8 pb-6 border-b border-zinc-100">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">Escrow Profile</div>
                        <div className="font-semibold text-zinc-950">Landing Page V1</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] font-medium tracking-tight">500.00 <span className="text-zinc-400 text-[14px]">USDC</span></div>
                      </div>
                    </div>
                    
                    {/* Sleek Timeline */}
                    <div className="relative space-y-7 before:absolute before:inset-0 before:ml-[11px] before:w-[1px] before:bg-zinc-100">
                      
                      {/* Step 1 */}
                      <div className="relative flex items-start gap-5 group cursor-default">
                        <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-sm relative z-10 shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="flex-1 -mt-0.5">
                          <h4 className="text-[14px] font-medium text-zinc-950">Vault Funded</h4>
                          <p className="text-[13px] text-zinc-500 mt-1">Client locked 500 USDC.</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative flex items-start gap-5 group cursor-default">
                        <div className="w-6 h-6 rounded-full bg-white border-[1.5px] border-zinc-950 flex items-center justify-center relative z-10 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse"></div>
                        </div>
                        <div className="flex-1 -mt-0.5">
                          <h4 className="text-[14px] font-medium text-zinc-950">Awaiting Submission</h4>
                          <p className="text-[13px] text-zinc-500 mt-1">Freelancer is working off-chain.</p>
                          
                          <div className="mt-4 border border-zinc-200/60 rounded-lg p-3 bg-zinc-50/50 flex gap-3">
                            <Lock className="w-4 h-4 text-zinc-400 mt-0.5" />
                            <div>
                              <div className="text-[12px] font-medium text-zinc-700">Funds are universally locked</div>
                              <div className="text-[11px] text-zinc-500 mt-0.5">Secured by program: TrsT...eWp</div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minimalist Bento Features */}
        <section id="features" className="py-40 bg-[#FAFAFA]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="mb-20">
              <h2 className="text-[2rem] leading-tight font-medium tracking-tight text-zinc-950 max-w-[500px]">
                Everything you need to orchestrate remote work agreements.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="col-span-1 md:col-span-2 bg-white rounded-[20px] p-8 border border-zinc-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-[400px] h-[400px] bg-zinc-50 rounded-full blur-3xl -z-10 group-hover:bg-zinc-100 transition-colors duration-700"></div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-16">
                  <LayoutGrid className="w-5 h-5 text-zinc-950" />
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-950 mb-2">Agnostic workflow</h3>
                  <p className="text-zinc-500 font-light leading-relaxed max-w-sm">We don&apos;t force you into our tools. Work via GitHub, Figma, or Discord. We just handle the financial consensus layer.</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="col-span-1 border border-zinc-200/60 rounded-[20px] p-8 flex flex-col justify-between bg-transparent">
                <div className="w-20 h-20 mb-16">
                  <CircleDashed className="w-full h-full text-zinc-300 stroke-[1px]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-zinc-950 mb-2">Dispute Resolution</h3>
                  <p className="text-zinc-500 font-light leading-relaxed">Cryptographic arbitration parameters protect both client scope and freelancer effort.</p>
                </div>
              </div>

               {/* Feature 3 */}
               <div className="col-span-1 md:col-span-3 bg-zinc-950 text-white rounded-[20px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-xl mb-8 md:mb-0">
                  <h3 className="text-2xl font-medium tracking-tight mb-4 text-zinc-100">Performance on Solana</h3>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    By leveraging Solana&apos;s parallel processing architecture, TrustLock executes state changes and transfers USDC in fractions of a second with sub-cent fees.
                  </p>
                </div>
                <Button className="relative z-10 h-12 px-8 font-medium rounded-full bg-zinc-950 text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:bg-zinc-800 transition-all w-full md:w-auto">
                  Explore Architecture
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Stark Minimum Footer */}
      <footer className="border-t border-zinc-200/60 bg-white pt-20 pb-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 bg-zinc-950 rounded-sm"></div>
                <span className="text-[15px] font-semibold tracking-tight">TrustLock</span>
              </div>
              <p className="text-zinc-500 text-[14px] max-w-xs font-light leading-relaxed">
                The protocol for decentralized, trustless freelance economic interactions. Built for the modern web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-950 text-[13px] tracking-wide uppercase mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#how-it-works" className="text-zinc-500 hover:text-zinc-950 text-[14px] transition-colors">How It Works</Link></li>
                <li><Link href="#features" className="text-zinc-500 hover:text-zinc-950 text-[14px] transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-950 text-[13px] tracking-wide uppercase mb-4">Connect</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-zinc-500 hover:text-zinc-950 text-[14px] transition-colors">Twitter (X)</Link></li>
                <li><Link href="#" className="text-zinc-500 hover:text-zinc-950 text-[14px] transition-colors">Discord</Link></li>
                <li><Link href="#" className="text-zinc-500 hover:text-zinc-950 text-[14px] transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-100">
            <p className="text-zinc-400 text-[13px]">© {new Date().getFullYear()} TrustLock. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[12px] text-zinc-500 font-medium tracking-wide uppercase">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
