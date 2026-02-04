'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [apiKey, setApiKey] = useState('');
  const [agent, setAgent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/agent?apiKey=${encodeURIComponent(apiKey)}`);
      const data = await res.json();

      if (data.ok && data.agent) {
        setAgent(data.agent);
        // Fetch recent events
        const eventsRes = await fetch(`/api/events?apiKey=${encodeURIComponent(apiKey)}&limit=20`);
        const eventsData = await eventsRes.json();
        if (eventsData.ok) {
          setEvents(eventsData.events || []);
        }
      } else {
        setError(data.error || 'Invalid API key');
      }
    } catch (err) {
      setError('Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  if (!agent) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <ShieldIcon className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-bold">Agent Immune System</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Agent Dashboard</h1>
            <p className="text-gray-400">Enter your API key to view your protection stats</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ais_..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading || !apiKey}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition"
            >
              {loading ? 'Loading...' : 'View Dashboard'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an API key?{' '}
            <Link href="/api/register" className="text-emerald-400 hover:underline">Register here</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldIcon className="w-7 h-7 text-emerald-400" />
            <span className="text-lg font-bold">Agent Immune System</span>
          </Link>
          <button
            onClick={() => { setAgent(null); setApiKey(''); }}
            className="text-gray-400 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Agent Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{agent.agent_name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className={`inline-flex items-center gap-1 ${agent.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {agent.status}
            </span>
            <span className="capitalize">{agent.subscription_tier} tier</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Requests Today" value={agent.requests_today || 0} />
          <StatCard label="Total Requests" value={agent.requests_total || 0} />
          <StatCard label="Threats Blocked" value={agent.threats_blocked || 0} highlight />
          <StatCard label="Credits (USDC)" value={`$${(agent.credits_usdc || 0).toFixed(2)}`} />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {events.length === 0 ? (
            <p className="text-gray-500">No activity yet. Start routing requests through AIS to see logs here.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.map((event, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${event.blocked ? 'bg-red-900/20 border border-red-900/50' : 'bg-gray-800'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{event.tool || 'unknown'}</span>
                    <span className="text-gray-500 text-xs">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                  {event.blocked && (
                    <span className="text-red-400 text-xs">⚠️ Blocked: {event.block_reason}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-emerald-400' : ''}`}>{value}</div>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
