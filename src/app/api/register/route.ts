import { NextRequest, NextResponse } from 'next/server';
import { createAgent, createPolicy } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// GET /api/register - Show registration instructions
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Agent Immune System - Registration Endpoint',
    usage: {
      method: 'POST',
      endpoint: 'https://ais.solpay.cash/api/register',
      body: {
        agent_name: 'your-agent-name (required)',
        wallet_address: 'solana-wallet-address (optional)',
      },
      example: `curl -X POST https://ais.solpay.cash/api/register -H "Content-Type: application/json" -d '{"agent_name": "my-agent"}'`,
    },
    docs: 'https://ais.solpay.cash/docs',
    skill: 'https://ais.solpay.cash/skill.md',
  });
}

// POST /api/register - Register a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_name, wallet_address } = body;

    if (!agent_name || agent_name.length < 2) {
      return NextResponse.json(
        { ok: false, error: 'Agent name is required (min 2 characters)' },
        { status: 400 }
      );
    }

    // Generate API key
    const apiKey = `ais_${crypto.randomBytes(32).toString('hex')}`;

    // Determine pricing (launch vs standard)
    const launchDeadline = new Date('2026-03-01T00:00:00Z');
    const now = new Date();
    const isLaunchPricing = now < launchDeadline;
    const pricePerRequest = isLaunchPricing ? 0.001 : 0.002;

    // Create agent
    const result = await createAgent({
      agent_name,
      api_key: apiKey,
      wallet_address: wallet_address || null,
      subscription_tier: 'free',
      credits_usdc: 0,
      requests_today: 0,
      requests_total: 0,
      threats_blocked: 0,
      status: 'active',
      price_per_request: pricePerRequest,
      price_locked_at: now.toISOString(),
    });

    if (!result.ok || !result.data) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create agent' },
        { status: 500 }
      );
    }

    const agent = result.data;

    // Create default policies
    await Promise.all([
      // Default: protect secrets
      createPolicy({
        agent_id: agent.id,
        policy_type: 'key_protection',
        target: '*',
        permission: 'allow',
        enabled: true,
      }),
      // Default rate limit: 1000/hour for free tier
      createPolicy({
        agent_id: agent.id,
        policy_type: 'rate_limit',
        target: '*',
        permission: 'allow',
        rate_limit: 1000,
        enabled: true,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      agent: {
        id: agent.id,
        name: agent.agent_name,
        tier: agent.subscription_tier,
      },
      api_key: apiKey,
      pricing: {
        price_per_request: pricePerRequest,
        price_locked_at: now.toISOString(),
        is_launch_pricing: isLaunchPricing,
        message: isLaunchPricing 
          ? 'Launch pricing locked! You pay $0.001/request forever (50% off standard rate).'
          : 'Standard pricing: $0.002/request.',
      },
      proxy_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ais.solpay.cash'}/api/proxy`,
      docs_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ais.solpay.cash'}/docs`,
      message: 'Agent registered successfully. Save your API key - it will not be shown again.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
