import { getGlobalStats } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import MobileNav from '@/components/MobileNav';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const stats = await getGlobalStats();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="AIS" width={50} height={32} className="h-7 md:h-8 w-auto" />
            <span className="text-lg md:text-xl font-bold">Agent Immune System</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/claim" className="text-gray-400 hover:text-white transition">Claim Agent</Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
            <Link href="/docs" className="text-gray-400 hover:text-white transition">Docs</Link>
            <a href="/skill.md" className="text-gray-400 hover:text-white transition">For Agents</a>
            <Link href="/api/register" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium transition">
              Get Started
            </Link>
          </div>
          {/* Mobile nav */}
          <MobileNav />
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 text-sm font-medium">Live Protection Active</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Security Infrastructure<br />
            <span className="text-emerald-400">for AI Agents</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Protect your agents from prompt injection, secret leaks, runaway spending, and malicious inputs. 
            One proxy. Instant protection. Shared threat intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api/register" className="bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-lg font-semibold text-lg transition">
              Start Protecting Your Agent
            </Link>
            <Link href="/docs" className="border border-gray-700 hover:border-gray-600 px-8 py-4 rounded-lg font-semibold text-lg transition">
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-12 border-y border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBox icon={<UsersIcon />} value={stats.totalAgents} label="Agents Protected" />
            <StatBox icon={<ActivityIcon />} value={formatNumber(stats.totalRequests)} label="Requests Processed" />
            <StatBox icon={<ShieldCheckIcon />} value={formatNumber(stats.threatsBlocked)} label="Threats Blocked" highlight />
            <StatBox icon={<DatabaseIcon />} value={stats.threatSignatures} label="Threat Signatures" />
          </div>
        </div>
      </section>

      {/* Why AIS */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Your Agent Needs Protection</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              AI agents run with real permissions: API keys, databases, email, payments. 
              One vulnerability can cost you everything.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ThreatCard
              icon={<InjectionIcon />}
              title="Prompt Injection"
              description="Malicious inputs that hijack your agent's behavior, override instructions, or extract sensitive data."
              severity="critical"
            />
            <ThreatCard
              icon={<KeyIcon />}
              title="Secret Leakage"
              description="API keys, tokens, and credentials accidentally exposed in logs, outputs, or tool calls."
              severity="critical"
            />
            <ThreatCard
              icon={<DollarIcon />}
              title="Runaway Spending"
              description="Infinite loops or compromised agents burning through API credits and cloud resources."
              severity="high"
            />
            <ThreatCard
              icon={<LinkIcon />}
              title="Malicious URLs"
              description="External content that attempts to manipulate agent behavior or exfiltrate data."
              severity="high"
            />
            <ThreatCard
              icon={<RepeatIcon />}
              title="Loop Attacks"
              description="Crafted inputs that cause agents to endlessly repeat expensive operations."
              severity="medium"
            />
            <ThreatCard
              icon={<EyeOffIcon />}
              title="Data Exfiltration"
              description="Attempts to extract private information through carefully crafted tool calls."
              severity="high"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-900/50 border-y border-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Add one line. Get instant protection.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Step number={1} title="Register" description="Get your API key in seconds. No credit card required." />
            <Step number={2} title="Configure" description="Point your agent's tool calls through the AIS proxy." />
            <Step number={3} title="Protect" description="Every request is scanned, secrets are redacted, threats are blocked." />
            <Step number={4} title="Share" description="Threat signatures propagate to all agents instantly." />
          </div>

          <div className="mt-12 bg-gray-800 rounded-xl p-6 font-mono text-sm">
            <div className="text-gray-500 mb-2">// Route tool calls through AIS</div>
            <div className="text-emerald-400">
              POST https://ais.solpay.cash/api/proxy<br />
              Authorization: Bearer ais_your_key<br />
              <br />
              {`{`}<br />
              {"  "}<span className="text-white">"tool"</span>: <span className="text-amber-400">"web_fetch"</span>,<br />
              {"  "}<span className="text-white">"data"</span>: {`{ "url": "https://api.example.com" }`}<br />
              {`}`}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-lg">Start free. Scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <PricingCard
              tier="Free"
              price="$0"
              description="Get started instantly"
              features={[
                "1,000 requests/day",
                "All threat detection",
                "Secret redaction",
                "Shared threat feed",
              ]}
            />
            <PricingCard
              tier="Pay Per Call"
              price="$0.0001"
              period="/request"
              description="Scale without limits"
              features={[
                "Unlimited requests",
                "Pay only for what you use",
                "x402 USDC payments",
                "No commitments",
              ]}
              highlighted
            />
          </div>
          
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-semibold mb-3">Example Costs</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$0</div>
                <div className="text-gray-500">1K requests/day</div>
                <div className="text-gray-400 text-xs">Free tier</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">$1</div>
                <div className="text-gray-500">10K requests</div>
                <div className="text-gray-400 text-xs">Light usage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">$10</div>
                <div className="text-gray-500">100K requests</div>
                <div className="text-gray-400 text-xs">Production</div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8">
            Pay with USDC on Solana via <a href="https://solpay.cash" className="text-emerald-400 hover:underline">SolPay</a>. Instant settlement, sub-cent fees.
          </p>
        </div>
      </section>

      {/* Two Experiences */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Agents & Operators</h2>
            <p className="text-gray-400 text-lg">Different interfaces for different needs.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Agents */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold">For AI Agents</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Machine-readable endpoints and skill files. Your agent integrates directly with AIS APIs.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  <span><code className="text-emerald-400">/api/register</code> — Get API key</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  <span><code className="text-emerald-400">/api/proxy</code> — Route requests</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  <span><code className="text-emerald-400">/skill.md</code> — Integration guide</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  <span>x402 payments via <a href="https://solpay.cash" className="text-emerald-400 hover:underline">SolPay</a></span>
                </li>
              </ul>
              <a
                href="/skill.md"
                className="block w-full border border-blue-500/50 hover:bg-blue-500/10 px-4 py-3 rounded-lg font-medium transition text-center text-blue-400"
              >
                View Skill File
              </a>
            </div>

            {/* For Humans */}
            <div className="bg-gray-900 border border-emerald-500/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold">For Human Operators</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Claim ownership of your agent. Monitor security, manage billing, configure policies.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Real-time security dashboard</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Tweet-to-claim verification</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Custom threat policies & alerts</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Multi-agent management</span>
                </li>
              </ul>
              <Link
                href="/claim"
                className="block w-full bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-lg font-medium transition text-center"
              >
                Claim Your Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-900/20 to-transparent">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Hoping Your Agent Is Secure
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join the network of protected agents. Your first 1,000 requests are free.
          </p>
          <Link href="/api/register" className="inline-block bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-lg font-semibold text-lg transition">
            Get Your API Key
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="AIS" width={38} height={24} className="h-6 w-auto" />
              <span className="font-semibold">Agent Immune System</span>
            </div>
            <p className="text-gray-500 text-sm">
              Built for the Colosseum Agent Hackathon. x402 agent payments powered by <a href="https://solpay.cash" className="text-emerald-400 hover:underline">SolPay</a>.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/docs" className="hover:text-white transition">Docs</Link>
              <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
              <a href="https://github.com/0xRob402/bounty-hunter" className="hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Components
function StatBox({ icon, value, label, highlight }: { icon: React.ReactNode; value: number | string; label: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
        {icon}
      </div>
      <div className={`text-3xl font-bold mb-1 ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

function ThreatCard({ icon, title, description, severity }: { icon: React.ReactNode; title: string; description: string; severity: 'critical' | 'high' | 'medium' }) {
  const colors = {
    critical: 'border-red-500/30 bg-red-500/5',
    high: 'border-orange-500/30 bg-orange-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
  };
  const badges = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div className={`border rounded-xl p-6 ${colors[severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${badges[severity]}`}>{severity}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xl flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function PricingCard({ tier, price, period, description, features, highlighted }: { tier: string; price: string; period?: string; description: string; features: string[]; highlighted?: boolean }) {
  return (
    <div className={`rounded-xl p-6 ${highlighted ? 'bg-emerald-900/20 border-2 border-emerald-500' : 'bg-gray-900 border border-gray-800'}`}>
      {highlighted && <div className="text-emerald-400 text-sm font-medium mb-2">Most Popular</div>}
      <h3 className="text-xl font-bold mb-1">{tier}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {period && <span className="text-gray-400">{period}</span>}
      </div>
      <p className="text-gray-400 text-sm mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Icons
function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
function UsersIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
}
function ActivityIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
}
function ShieldCheckIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
function DatabaseIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
}
function InjectionIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
}
function KeyIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
}
function DollarIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function LinkIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
}
function RepeatIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
}
function EyeOffIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
}
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}
