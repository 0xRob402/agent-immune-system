import { NextRequest, NextResponse } from 'next/server';
import { getAgentByApiKey } from '@/lib/db';
import { checkPaymentRequired, getAISWallet } from '@/lib/payments';

export const dynamic = 'force-dynamic';

// GET /api/payment - Get payment information
export async function GET(request: NextRequest) {
  const apiKey = request.nextUrl.searchParams.get('apiKey');

  if (!apiKey) {
    // Return general payment info
    return NextResponse.json({
      ok: true,
      message: 'Agent Immune System - Payment Information',
      wallet: getAISWallet(),
      pricing: {
        free_tier: '1,000 requests/day',
        launch_price: '$0.001/request (for agents registered before March 1, 2026)',
        standard_price: '$0.002/request (for agents registered after March 1, 2026)',
      },
      payment_method: {
        scheme: 'x402',
        currency: 'USDC',
        network: 'Solana',
        facilitator: 'https://x402.solpay.cash',
      },
      header_format: 'X-Payment: x402 usdc/solana amount=<amount> tx=<transaction_signature> recipient=<wallet>',
      docs: 'https://solpay.cash/x402',
    });
  }

  // Get agent-specific payment info
  const agentResult = await getAgentByApiKey(apiKey);
  if (!agentResult.ok || !agentResult.data) {
    return NextResponse.json(
      { ok: false, error: 'Invalid API key' },
      { status: 401 }
    );
  }

  const agent = agentResult.data;
  const pricePerRequest = agent.price_per_request || 0.001;
  const requirement = checkPaymentRequired(agent.requests_today || 0, pricePerRequest);

  return NextResponse.json({
    ok: true,
    agent: {
      name: agent.agent_name,
      tier: agent.subscription_tier,
      requests_today: agent.requests_today || 0,
      free_remaining: Math.max(0, 1000 - (agent.requests_today || 0)),
    },
    pricing: {
      price_per_request: pricePerRequest,
      price_locked_at: agent.price_locked_at,
      is_launch_pricing: pricePerRequest === 0.001,
    },
    payment: {
      required: requirement.required,
      amount_if_required: requirement.amount_usdc,
      wallet: getAISWallet(),
      scheme: 'x402',
      network: 'solana',
      currency: 'USDC',
    },
    credits: {
      balance_usdc: agent.credits_usdc || 0,
    },
  });
}
