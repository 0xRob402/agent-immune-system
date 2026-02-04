// PressBase client for Agent Immune System

const API_BASE = process.env.PRESSBASE_API_BASE || 'https://backend.benbond.dev/wp-json/app/v1';
const SERVICE_KEY = process.env.PRESSBASE_SERVICE_KEY || '';

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

async function db<T>(method: string, path: string, body?: object): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(API_BASE + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error('DB error:', error);
    return { ok: false, error: { code: 'fetch_error', message: String(error) } };
  }
}

// Helper to extract array from paginated response
function extractArray<T>(result: ApiResponse<PaginatedResponse<T> | T[]>): T[] {
  if (!result.ok || !result.data) return [];
  // Handle both { data: [...] } and direct array
  if ('data' in result.data && Array.isArray((result.data as PaginatedResponse<T>).data)) {
    return (result.data as PaginatedResponse<T>).data;
  }
  if (Array.isArray(result.data)) {
    return result.data as T[];
  }
  return [];
}

// === AGENTS ===
export interface Agent {
  id?: number;
  agent_name: string;
  api_key: string;
  wallet_address?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  credits_usdc: number;
  requests_today: number;
  requests_total: number;
  threats_blocked: number;
  status: 'active' | 'suspended' | 'quarantined';
  // Claim fields (human operator verification)
  claim_code?: string;
  claim_status?: 'unclaimed' | 'pending' | 'claimed';
  claimed_by_twitter?: string;
  claim_tweet_url?: string;
  claimed_at?: string;
  // Pricing fields (grandfathering)
  price_per_request?: number; // in USDC (0.001 = launch, 0.002 = standard)
  price_locked_at?: string; // ISO date when price was locked
  created_at?: string;
}

export async function createAgent(agent: Partial<Agent>) {
  return db<Agent>('POST', '/db/ais_agents', agent);
}

export async function getAgentByApiKey(apiKey: string) {
  const result = await db<PaginatedResponse<Agent>>('GET', `/db/ais_agents?where=api_key:eq:${apiKey}&limit=1`);
  const agents = extractArray(result);
  return agents.length > 0 ? { ok: true, data: agents[0] } : { ok: false };
}

export async function getAgentById(id: number) {
  return db<Agent>('GET', `/db/ais_agents/${id}`);
}

export async function updateAgent(id: number, updates: Partial<Agent>) {
  return db<Agent>('PATCH', `/db/ais_agents/${id}`, updates);
}

export async function getAllAgents() {
  const result = await db<PaginatedResponse<Agent>>('GET', '/db/ais_agents?order=created_at:desc&limit=1000');
  return { ok: result.ok, data: extractArray(result) };
}

export async function getAgentByName(name: string) {
  const result = await db<PaginatedResponse<Agent>>('GET', `/db/ais_agents?where=agent_name:eq:${encodeURIComponent(name)}&limit=1`);
  const agents = extractArray(result);
  return agents.length > 0 ? { ok: true, data: agents[0] } : { ok: false };
}

export async function getAgentByClaimCode(code: string) {
  const result = await db<PaginatedResponse<Agent>>('GET', `/db/ais_agents?where=claim_code:eq:${encodeURIComponent(code)}&limit=1`);
  const agents = extractArray(result);
  return agents.length > 0 ? { ok: true, data: agents[0] } : { ok: false };
}

export async function getAgentsByTwitter(twitterHandle: string) {
  const result = await db<PaginatedResponse<Agent>>('GET', `/db/ais_agents?where=claimed_by_twitter:eq:${encodeURIComponent(twitterHandle)}&order=created_at:desc&limit=100`);
  return { ok: result.ok, data: extractArray(result) };
}

// === POLICIES ===
export interface Policy {
  id?: number;
  agent_id: number;
  policy_type: 'tool_allowlist' | 'domain_block' | 'budget_limit' | 'rate_limit' | 'key_protection';
  target: string;
  permission: 'allow' | 'deny' | 'review';
  budget_limit?: number;
  rate_limit?: number;
  enabled: boolean;
  created_at?: string;
}

export async function createPolicy(policy: Partial<Policy>) {
  return db<Policy>('POST', '/db/ais_policies', policy);
}

export async function getPoliciesForAgent(agentId: number) {
  const result = await db<PaginatedResponse<Policy>>('GET', `/db/ais_policies?where=agent_id:eq:${agentId}&where=enabled:eq:1`);
  return { ok: result.ok, data: extractArray(result) };
}

export async function updatePolicy(id: number, updates: Partial<Policy>) {
  return db<Policy>('PATCH', `/db/ais_policies/${id}`, updates);
}

// === EVENTS ===
export interface Event {
  id?: number;
  agent_id: number;
  event_type: 'tool_call' | 'threat_blocked' | 'key_redacted' | 'rate_limited' | 'budget_exceeded';
  tool_name: string;
  request_data?: string;
  decision: 'allow' | 'block' | 'redact';
  threat_detected: boolean;
  threat_type?: string;
  latency_ms?: number;
  created_at?: string;
}

export async function logEvent(event: Partial<Event>) {
  return db<Event>('POST', '/db/ais_events', event);
}

export async function getEventsForAgent(agentId: number, limit = 100) {
  const result = await db<PaginatedResponse<Event>>('GET', `/db/ais_events?where=agent_id:eq:${agentId}&order=created_at:desc&limit=${limit}`);
  return { ok: result.ok, data: extractArray(result) };
}

export async function getRecentThreats(limit = 50) {
  const result = await db<PaginatedResponse<Event>>('GET', `/db/ais_events?where=threat_detected:eq:1&order=created_at:desc&limit=${limit}`);
  return { ok: result.ok, data: extractArray(result) };
}

// === THREAT SIGNATURES ===
export interface ThreatSignature {
  id?: number;
  signature_hash: string;
  threat_type: string;
  pattern: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  times_blocked: number;
  source_agent_id?: number;
  created_at?: string;
}

export async function addThreatSignature(threat: Partial<ThreatSignature>) {
  return db<ThreatSignature>('POST', '/db/ais_threats', threat);
}

export async function getThreatFeed(limit = 100) {
  const result = await db<PaginatedResponse<ThreatSignature>>('GET', `/db/ais_threats?order=created_at:desc&limit=${limit}`);
  return { ok: result.ok, data: extractArray(result) };
}

export async function incrementThreatCount(id: number, currentCount: number) {
  return db<ThreatSignature>('PATCH', `/db/ais_threats/${id}`, { times_blocked: currentCount + 1 });
}

// === STATS ===
export async function getGlobalStats() {
  try {
    const [agentsResult, eventsResult, threatsResult] = await Promise.all([
      getAllAgents(),
      db<PaginatedResponse<Event>>('GET', '/db/ais_events?limit=10000'),
      getThreatFeed(1000),
    ]);

    const agentList = agentsResult.data || [];
    const eventList = extractArray(eventsResult);
    const threatList = threatsResult.data || [];

    return {
      totalAgents: agentList.length,
      activeAgents: agentList.filter(a => a.status === 'active').length,
      totalRequests: agentList.reduce((sum, a) => sum + (Number(a.requests_total) || 0), 0),
      threatsBlocked: agentList.reduce((sum, a) => sum + (Number(a.threats_blocked) || 0), 0),
      threatSignatures: threatList.length,
      recentEvents: eventList.slice(0, 20),
      recentThreats: threatList.slice(0, 10),
    };
  } catch (error) {
    console.error('getGlobalStats error:', error);
    return {
      totalAgents: 0,
      activeAgents: 0,
      totalRequests: 0,
      threatsBlocked: 0,
      threatSignatures: 0,
      recentEvents: [],
      recentThreats: [],
    };
  }
}
