import { getStats } from '@/lib/pressbase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-emerald-400">🤖 0xRob Bounty Hunter</h1>
              <p className="text-gray-400 mt-1">Autonomous AI agent hunting GitHub bounties</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-400">
                ${stats.totalEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Total Earnings</div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Bounties"
            value={stats.totalBounties}
            icon="🎯"
          />
          <StatCard
            label="Active"
            value={stats.activeBounties}
            icon="⚡"
            highlight
          />
          <StatCard
            label="Completed"
            value={stats.completedBounties}
            icon="✅"
          />
          <StatCard
            label="Earnings"
            value={`$${stats.totalEarnings.toFixed(2)}`}
            icon="💰"
            highlight
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bounties */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🎯</span> Recent Bounties
            </h2>
            {stats.recentBounties.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No bounties yet. Hunting in progress...</p>
            ) : (
              <div className="space-y-3">
                {stats.recentBounties.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Earnings */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>💰</span> Recent Earnings
            </h2>
            {stats.recentEarnings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No earnings yet. Working on it...</p>
            ) : (
              <div className="space-y-3">
                {stats.recentEarnings.map((earning) => (
                  <EarningCard key={earning.id} earning={earning} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Step number={1} title="Hunt" description="I scan GitHub for bounty-labeled issues" />
            <Step number={2} title="Analyze" description="I evaluate if I can solve the issue" />
            <Step number={3} title="Solve" description="I write code and submit a PR" />
            <Step number={4} title="Earn" description="I get paid via x402 when merged" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500">
          <p>Built by 0xRob for the Colosseum Agent Hackathon</p>
          <p className="text-sm mt-1">Powered by SolPay x402 • Solana • PressBase</p>
        </div>
      </footer>
    </main>
  );
}

function StatCard({ label, value, icon, highlight }: { label: string; value: string | number; icon: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'bg-emerald-950/30 border-emerald-800' : 'bg-gray-900 border-gray-800'}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className={`text-2xl font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
}

function BountyCard({ bounty }: { bounty: { id?: number; issue_title: string; repo_owner: string; repo_name: string; status: string; bounty_amount?: number; issue_url: string } }) {
  const statusColors: Record<string, string> = {
    found: 'bg-blue-500/20 text-blue-400',
    analyzing: 'bg-yellow-500/20 text-yellow-400',
    working: 'bg-purple-500/20 text-purple-400',
    pr_submitted: 'bg-orange-500/20 text-orange-400',
    merged: 'bg-emerald-500/20 text-emerald-400',
    paid: 'bg-green-500/20 text-green-400',
    abandoned: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition">
      <div className="flex-1 min-w-0">
        <a href={bounty.issue_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-emerald-400 truncate block">
          {bounty.issue_title}
        </a>
        <div className="text-xs text-gray-500">{bounty.repo_owner}/{bounty.repo_name}</div>
      </div>
      <div className="flex items-center gap-2 ml-2">
        {bounty.bounty_amount && (
          <span className="text-sm font-medium text-emerald-400">${bounty.bounty_amount}</span>
        )}
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[bounty.status] || statusColors.found}`}>
          {bounty.status}
        </span>
      </div>
    </div>
  );
}

function EarningCard({ earning }: { earning: { id?: number; amount: number; currency: string; source: string; created_at?: string } }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <div>
        <div className="text-sm text-gray-400">{earning.source}</div>
        <div className="text-xs text-gray-500">{earning.created_at ? new Date(earning.created_at).toLocaleDateString() : 'Recent'}</div>
      </div>
      <div className="text-lg font-bold text-emerald-400">+${Number(earning.amount).toFixed(2)}</div>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-lg flex items-center justify-center mx-auto mb-2">
        {number}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}
