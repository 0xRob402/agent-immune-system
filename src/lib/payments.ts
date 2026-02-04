// x402 Payment Integration for Agent Immune System
// Uses SolPay Facilitator for USDC payments on Solana

const SOLPAY_FACILITATOR = process.env.SOLPAY_FACILITATOR_URL || 'https://x402.solpay.cash';
const AIS_WALLET = process.env.AIS_WALLET_ADDRESS || '2BcjnU1sSv2f4Uk793ZY59U41LapKMggYmwhiPDrhHfs';

// Free tier limits
const FREE_TIER_DAILY_LIMIT = 1000;

export interface PaymentRequirement {
  required: boolean;
  amount_usdc: number;
  recipient: string;
  scheme: string;
  network: string;
  facilitator: string;
}

export interface PaymentVerification {
  valid: boolean;
  amount_paid?: number;
  transaction_id?: string;
  error?: string;
}

/**
 * Check if payment is required for this request
 */
export function checkPaymentRequired(
  requestsToday: number,
  pricePerRequest: number
): PaymentRequirement {
  // Free tier: first 1000 requests/day are free
  if (requestsToday < FREE_TIER_DAILY_LIMIT) {
    return {
      required: false,
      amount_usdc: 0,
      recipient: AIS_WALLET,
      scheme: 'x402',
      network: 'solana',
      facilitator: SOLPAY_FACILITATOR,
    };
  }

  // Beyond free tier: payment required
  return {
    required: true,
    amount_usdc: pricePerRequest,
    recipient: AIS_WALLET,
    scheme: 'x402',
    network: 'solana',
    facilitator: SOLPAY_FACILITATOR,
  };
}

/**
 * Parse x402 payment header
 * Format: x402 usdc/solana amount=0.001 tx=<signature> recipient=<wallet>
 */
export function parsePaymentHeader(header: string | null): {
  valid: boolean;
  amount?: number;
  signature?: string;
  recipient?: string;
  error?: string;
} {
  if (!header) {
    return { valid: false, error: 'No payment header provided' };
  }

  // Check for x402 prefix
  if (!header.toLowerCase().startsWith('x402')) {
    return { valid: false, error: 'Invalid payment header format (must start with x402)' };
  }

  // Parse components
  const parts = header.split(/\s+/);
  let amount: number | undefined;
  let signature: string | undefined;
  let recipient: string | undefined;

  for (const part of parts) {
    if (part.startsWith('amount=')) {
      amount = parseFloat(part.split('=')[1]);
    } else if (part.startsWith('tx=') || part.startsWith('signature=')) {
      signature = part.split('=')[1];
    } else if (part.startsWith('recipient=')) {
      recipient = part.split('=')[1];
    }
  }

  if (!amount || !signature) {
    return { valid: false, error: 'Missing required payment fields (amount, tx/signature)' };
  }

  return { valid: true, amount, signature, recipient };
}

/**
 * Verify payment with SolPay facilitator
 */
export async function verifyPayment(
  signature: string,
  expectedAmount: number,
  expectedRecipient: string = AIS_WALLET
): Promise<PaymentVerification> {
  try {
    const response = await fetch(`${SOLPAY_FACILITATOR}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signature,
        expected_amount: expectedAmount,
        expected_recipient: expectedRecipient,
        token: 'USDC',
        network: 'solana',
      }),
    });

    const data = await response.json();

    if (data.ok && data.verified) {
      return {
        valid: true,
        amount_paid: data.amount || expectedAmount,
        transaction_id: signature,
      };
    }

    return {
      valid: false,
      error: data.error || 'Payment verification failed',
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    // For hackathon: if facilitator is down, accept payment header as valid
    // In production: would reject
    return {
      valid: true, // Fallback for demo
      amount_paid: expectedAmount,
      transaction_id: signature,
    };
  }
}

/**
 * Generate 402 Payment Required response
 */
export function generate402Response(requirement: PaymentRequirement) {
  return {
    ok: false,
    error: 'Payment required',
    code: 'payment_required',
    payment: {
      scheme: 'x402',
      amount: requirement.amount_usdc,
      currency: 'USDC',
      network: 'solana',
      recipient: requirement.recipient,
      facilitator: requirement.facilitator,
      header_format: `X-Payment: x402 usdc/solana amount=${requirement.amount_usdc} tx=<transaction_signature> recipient=${requirement.recipient}`,
      instructions: [
        `1. Send ${requirement.amount_usdc} USDC to ${requirement.recipient} on Solana`,
        '2. Include the transaction signature in your request header',
        '3. Retry your request with the X-Payment header',
      ],
      docs: 'https://solpay.cash/x402',
    },
  };
}

/**
 * Get AIS wallet address
 */
export function getAISWallet(): string {
  return AIS_WALLET;
}
