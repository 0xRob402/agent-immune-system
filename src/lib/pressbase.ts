// PressBase API client for Bounty Hunter

const API_BASE = process.env.PRESSBASE_API_BASE || 'https://backend.benbond.dev/wp-json/app/v1';
const SERVICE_KEY = process.env.PRESSBASE_SERVICE_KEY || '';

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}

async function api<T>(
  method: string,
  path: string,
  body?: object
): Promise<ApiResponse<T>> {
  const res = await fetch(API_BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// Bounties
export interface Bounty {
  id?: number;
  repo_owner: string;
  repo_name: string;
  issue_number: number;
  issue_title: string;
  issue_url: string;
  bounty_amount?: number;
  bounty_currency?: string;
  status: 'found' | 'analyzing' | 'working' | 'pr_submitted' | 'merged' | 'paid' | 'abandoned';
  pr_url?: string;
  pr_number?: number;
  paid_tx?: string;
  labels?: string[];
  difficulty?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getBounties(filters?: { status?: string; limit?: number }) {
  let query = '/db/bounties?order=created_at:desc';
  if (filters?.status) query += `&where=status:eq:${filters.status}`;
  if (filters?.limit) query += `&limit=${filters.limit}`;
  return api<Bounty[]>('GET', query);
}

export async function getBounty(id: number) {
  return api<Bounty>('GET', `/db/bounties/${id}`);
}

export async function createBounty(bounty: Omit<Bounty, 'id' | 'created_at' | 'updated_at'>) {
  return api<Bounty>('POST', '/db/bounties', bounty);
}

export async function updateBounty(id: number, updates: Partial<Bounty>) {
  return api<Bounty>('PATCH', `/db/bounties/${id}`, updates);
}

// Earnings
export interface Earning {
  id?: number;
  bounty_id: number;
  amount: number;
  currency: string;
  tx_signature: string;
  source: string;
  notes?: string;
  created_at?: string;
}

export async function getEarnings(limit = 50) {
  return api<Earning[]>('GET', `/db/earnings?order=created_at:desc&limit=${limit}`);
}

export async function createEarning(earning: Omit<Earning, 'id' | 'created_at'>) {
  return api<Earning>('POST', '/db/earnings', earning);
}

export async function getTotalEarnings() {
  const result = await getEarnings(1000);
  if (!result.ok || !result.data) return 0;
  return result.data.reduce((sum, e) => sum + Number(e.amount), 0);
}

// Activity Log
export interface Activity {
  id?: number;
  action: string;
  bounty_id?: number;
  details?: Record<string, unknown>;
  success: boolean;
  created_at?: string;
}

export async function getActivities(limit = 100) {
  return api<Activity[]>('GET', `/db/activity_log?order=created_at:desc&limit=${limit}`);
}

export async function logActivity(activity: Omit<Activity, 'id' | 'created_at'>) {
  return api<Activity>('POST', '/db/activity_log', activity);
}

// Stats
export async function getStats() {
  const [bounties, earnings] = await Promise.all([
    getBounties({ limit: 1000 }),
    getEarnings(1000),
  ]);

  const bountyData = bounties.data || [];
  const earningData = earnings.data || [];

  return {
    totalBounties: bountyData.length,
    activeBounties: bountyData.filter(b => ['analyzing', 'working', 'pr_submitted'].includes(b.status)).length,
    completedBounties: bountyData.filter(b => ['merged', 'paid'].includes(b.status)).length,
    totalEarnings: earningData.reduce((sum, e) => sum + Number(e.amount), 0),
    recentBounties: bountyData.slice(0, 10),
    recentEarnings: earningData.slice(0, 10),
  };
}
