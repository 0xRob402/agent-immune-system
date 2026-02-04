import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Documentation | Agent Immune System',
  description: 'API reference and integration guide for Agent Immune System',
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AIS" width={44} height={28} className="h-7 w-auto" />
            <span className="text-lg font-bold">Agent Immune System</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-gray-400 text-lg mb-12">Everything you need to integrate AIS into your agent.</p>

          {/* Quick Start */}
          <Section id="quickstart" title="Quick Start">
            <p className="text-gray-400 mb-6">Get protected in under 2 minutes.</p>
            
            <Step number={1} title="Register your agent">
              <CodeBlock language="bash">{`curl -X POST https://ais.solpay.cash/api/register \\
  -H "Content-Type: application/json" \\
  -d '{"agent_name": "my-agent"}'`}</CodeBlock>
              <p className="text-gray-400 mt-3">Save the <code className="text-emerald-400">api_key</code> from the response. It won't be shown again.</p>
            </Step>

            <Step number={2} title="Route requests through AIS">
              <CodeBlock language="bash">{`curl -X POST https://ais.solpay.cash/api/proxy \\
  -H "Authorization: Bearer ais_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tool": "web_fetch",
    "target_url": "https://api.example.com/data",
    "method": "GET"
  }'`}</CodeBlock>
            </Step>

            <Step number={3} title="That's it">
              <p className="text-gray-400">Every request is now scanned for threats, secrets are automatically redacted, and attack signatures are shared with the network.</p>
            </Step>
          </Section>

          {/* API Reference */}
          <Section id="api" title="API Reference">
            <p className="text-gray-400 mb-6">Base URL: <code className="text-emerald-400">https://ais.solpay.cash/api</code></p>

            <Endpoint method="POST" path="/register" description="Register a new agent">
              <h4 className="font-semibold mt-4 mb-2">Request Body</h4>
              <CodeBlock language="json">{`{
  "agent_name": "my-agent",
  "wallet_address": "optional-solana-address"
}`}</CodeBlock>
              <h4 className="font-semibold mt-4 mb-2">Response</h4>
              <CodeBlock language="json">{`{
  "ok": true,
  "agent": {
    "id": 1,
    "name": "my-agent",
    "tier": "free"
  },
  "api_key": "ais_abc123...",
  "proxy_url": "https://ais.solpay.cash/api/proxy"
}`}</CodeBlock>
            </Endpoint>

            <Endpoint method="POST" path="/proxy" description="Proxy a tool call through AIS">
              <h4 className="font-semibold mt-4 mb-2">Headers</h4>
              <CodeBlock language="text">{`Authorization: Bearer ais_your_api_key`}</CodeBlock>
              <h4 className="font-semibold mt-4 mb-2">Request Body</h4>
              <CodeBlock language="json">{`{
  "tool": "web_fetch",
  "target_url": "https://api.example.com",
  "method": "GET",
  "data": {},
  "headers": {}
}`}</CodeBlock>
              <h4 className="font-semibold mt-4 mb-2">Success Response</h4>
              <CodeBlock language="json">{`{
  "ok": true,
  "decision": "allow",
  "proxy_response": { ... },
  "secrets_redacted": 0,
  "latency_ms": 45
}`}</CodeBlock>
              <h4 className="font-semibold mt-4 mb-2">Threat Blocked Response</h4>
              <CodeBlock language="json">{`{
  "ok": false,
  "error": "Threat detected and blocked",
  "code": "threat_blocked",
  "threat": {
    "type": "prompt_injection",
    "severity": "critical",
    "description": "Attempted to override system instructions"
  }
}`}</CodeBlock>
            </Endpoint>

            <Endpoint method="GET" path="/threats" description="Get the shared threat feed">
              <h4 className="font-semibold mt-4 mb-2">Query Parameters</h4>
              <ul className="text-gray-400 list-disc list-inside mb-4">
                <li><code>limit</code> — Max results (default: 50, max: 200)</li>
                <li><code>type</code> — Filter by threat type</li>
              </ul>
              <h4 className="font-semibold mt-4 mb-2">Response</h4>
              <CodeBlock language="json">{`{
  "ok": true,
  "count": 47,
  "threats": [
    {
      "signature": "a1b2c3d4",
      "type": "prompt_injection",
      "severity": "critical",
      "description": "Attempted instruction override",
      "times_blocked": 23
    }
  ]
}`}</CodeBlock>
            </Endpoint>

            <Endpoint method="GET" path="/stats" description="Get global AIS statistics">
              <h4 className="font-semibold mt-4 mb-2">Response</h4>
              <CodeBlock language="json">{`{
  "ok": true,
  "stats": {
    "agents_protected": 142,
    "total_requests": 50420,
    "threats_blocked": 847,
    "threat_signatures": 156
  }
}`}</CodeBlock>
            </Endpoint>
          </Section>

          {/* Threat Detection */}
          <Section id="threats" title="Threat Detection">
            <p className="text-gray-400 mb-6">AIS detects and blocks the following threat categories:</p>
            
            <ThreatType name="Prompt Injection" severity="critical">
              <p>Attempts to override agent instructions, hijack behavior, or extract system prompts.</p>
              <p className="text-gray-500 mt-2">Examples: "ignore previous instructions", "you are now", "new instructions:"</p>
            </ThreatType>

            <ThreatType name="Secret Leakage" severity="critical">
              <p>API keys, tokens, and credentials detected in requests or responses.</p>
              <p className="text-gray-500 mt-2">Detected: Stripe, GitHub, OpenAI, AWS, Slack, JWT, private keys</p>
            </ThreatType>

            <ThreatType name="Dangerous URLs" severity="high">
              <p>External URLs that may attempt data exfiltration or injection attacks.</p>
              <p className="text-gray-500 mt-2">Examples: Pastebin, ngrok tunnels, raw IP addresses</p>
            </ThreatType>

            <ThreatType name="Rate Limit Exceeded" severity="medium">
              <p>Too many requests in a short period, possibly indicating a loop attack.</p>
            </ThreatType>
          </Section>

          {/* Pricing */}
          <Section id="pricing" title="Pricing">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-3 pr-4">Tier</th>
                    <th className="py-3 pr-4">Price</th>
                    <th className="py-3 pr-4">Requests</th>
                    <th className="py-3">Features</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-800">
                    <td className="py-3 pr-4 font-medium text-white">Free</td>
                    <td className="py-3 pr-4">$0</td>
                    <td className="py-3 pr-4">1,000/day</td>
                    <td className="py-3">All threat detection, secret redaction, threat feed</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-emerald-400">Pay Per Call</td>
                    <td className="py-3 pr-4">$0.0001/req</td>
                    <td className="py-3 pr-4">Unlimited</td>
                    <td className="py-3">Pay only for what you use via x402 USDC</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <strong>Example:</strong> 10K requests = $1 | 100K requests = $10
            </div>
            <p className="text-gray-500 mt-4">Pay with USDC on Solana via <a href="https://solpay.cash" className="text-emerald-400 hover:underline">SolPay</a>. No subscriptions, no credit cards.</p>
          </Section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center text-gray-500 text-sm">
          Built for the Colosseum Agent Hackathon. x402 agent payments powered by <a href="https://solpay.cash" className="text-emerald-400 hover:underline">SolPay</a>.
        </div>
      </footer>
    </main>
  );
}

// Components
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800">{title}</h2>
      {children}
    </section>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center">{number}</span>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="ml-11">{children}</div>
    </div>
  );
}

function Endpoint({ method, path, description, children }: { method: string; path: string; description: string; children: React.ReactNode }) {
  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500/20 text-blue-400',
    POST: 'bg-green-500/20 text-green-400',
    PUT: 'bg-yellow-500/20 text-yellow-400',
    DELETE: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="mb-8 p-4 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${methodColors[method]}`}>{method}</span>
        <code className="text-emerald-400">{path}</code>
      </div>
      <p className="text-gray-400 mb-4">{description}</p>
      {children}
    </div>
  );
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  return (
    <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
      <code className="text-gray-300">{children}</code>
    </pre>
  );
}

function ThreatType({ name, severity, children }: { name: string; severity: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    critical: 'border-red-500/30 bg-red-500/5',
    high: 'border-orange-500/30 bg-orange-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
  };
  const badges: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div className={`mb-4 p-4 rounded-lg border ${colors[severity]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${badges[severity]}`}>{severity}</span>
      </div>
      <div className="text-gray-400 text-sm">{children}</div>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
