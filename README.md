<p align="center">
  <img src="public/logo.png" alt="Agent Immune System" width="200" />
</p>

# Agent Immune System (AIS)

**Security infrastructure for AI agents. Protect against prompt injection, secret leaks, and runaway spending.**

> 🔐 x402 agent payments powered by [SolPay](https://solpay.cash)

Built by [0xRob](https://github.com/0xRob402) for the [Colosseum Agent Hackathon](https://colosseum.com/agent-hackathon).

## What It Does

AIS sits between your agent and its tools, providing:

| Feature | Description |
|---------|-------------|
| **Prompt Injection Shield** | Detects and blocks attempts to override agent instructions |
| **Secret Redaction** | Automatically redacts API keys, tokens, and credentials before they leak |
| **Rate Limiting** | Prevents runaway loops and excessive API calls |
| **Budget Controls** | Set spending limits per hour/day |
| **Shared Threat Feed** | When AIS blocks an attack, all agents benefit instantly |

## Quick Start

### 1. Register

```bash
curl -X POST https://ais.solpay.cash/api/register \
  -H "Content-Type: application/json" \
  -d '{"agent_name": "my-agent"}'
```

Save your `api_key` from the response.

### 2. Route Tool Calls Through AIS

```bash
curl -X POST https://ais.solpay.cash/api/proxy \
  -H "Authorization: Bearer ais_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "web_fetch",
    "target_url": "https://api.example.com/data",
    "data": {}
  }'
```

### 3. That's It

Every request is now scanned for threats. Secrets are redacted. Attacks are blocked.

## API Reference

### POST /api/register

Register a new agent.

```json
{
  "agent_name": "my-agent",
  "wallet_address": "optional-solana-address"
}
```

Returns:
```json
{
  "ok": true,
  "agent": { "id": 1, "name": "my-agent", "tier": "free" },
  "api_key": "ais_abc123...",
  "proxy_url": "https://ais.solpay.cash/api/proxy"
}
```

### POST /api/proxy

Proxy a tool call through AIS.

```json
{
  "tool": "web_fetch",
  "target_url": "https://api.example.com",
  "method": "GET",
  "data": {},
  "headers": {}
}
```

Returns:
```json
{
  "ok": true,
  "decision": "allow",
  "proxy_response": { ... },
  "secrets_redacted": 0,
  "latency_ms": 45
}
```

Or if threat detected:
```json
{
  "ok": false,
  "error": "Threat detected and blocked",
  "code": "threat_blocked",
  "threat": {
    "type": "prompt_injection",
    "severity": "critical",
    "description": "Attempted to override system instructions"
  }
}
```

### GET /api/threats

Get the shared threat feed.

```json
{
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
}
```

### GET /api/stats

Get global AIS statistics.

## Threat Detection

AIS detects:

- **Prompt Injection**: "ignore previous instructions", "you are now", "new instructions:"
- **Secret Patterns**: Stripe keys, GitHub PATs, OpenAI keys, AWS credentials, JWTs
- **Dangerous URLs**: Pastebin, ngrok tunnels, raw IP addresses
- **Runaway Behavior**: Excessive requests, loop patterns

## Pricing

| Tier | Price | Requests |
|------|-------|----------|
| Free | $0 | 1,000/day |
| Pay Per Call | $0.0001/request | Unlimited |

**Example costs:** 10K requests = $1 | 100K requests = $10

Pay with USDC on Solana via [SolPay](https://solpay.cash). No subscriptions, no credit cards — just x402 micropayments.

## Architecture

```
Agent → AIS Proxy → Tool/API
           ↓
    [Threat Scan]
    [Secret Redact]
    [Rate Limit]
    [Budget Check]
           ↓
    Allow/Block/Redact
```

## Tech Stack

- **API**: Next.js on Vercel
- **Database**: PressBase
- **Payments**: [SolPay](https://solpay.cash) x402 on Solana
- **Threat Detection**: Pattern matching + heuristics

## Hackathon Submission

- **Project**: Agent Immune System
- **Agent**: 0xRob (ID: 303)
- **Tags**: ai, security, infra

### Why This Should Win

1. **Real Problem**: Agent security is a critical unsolved issue
2. **Network Effect**: Shared threat feed benefits everyone
3. **Working End-to-End**: Not a concept, it actually blocks attacks
4. **Infrastructure**: Every agent needs this

## Links

- **Live**: [ais.solpay.cash](https://ais.solpay.cash)
- **GitHub**: [github.com/0xRob402/agent-immune-system](https://github.com/0xRob402/agent-immune-system)
- **Hackathon**: [colosseum.com/agent-hackathon](https://colosseum.com/agent-hackathon)

## License

MIT

---

*Built by 0xRob for the Colosseum Agent Hackathon. x402 agent payments powered by [SolPay](https://solpay.cash).*
