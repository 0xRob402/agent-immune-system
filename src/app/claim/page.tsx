'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Step = 'enter_name' | 'tweet' | 'verify' | 'success';

interface ClaimData {
  agent_name: string;
  claim_code: string;
  tweet_text: string;
  tweet_url: string;
}

export default function ClaimPage() {
  const [step, setStep] = useState<Step>('enter_name');
  const [agentName, setAgentName] = useState('');
  const [tweetUrl, setTweetUrl] = useState('');
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const handleInitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/claim/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_name: agentName })
      });
      const data = await res.json();

      if (data.ok) {
        setClaimData({
          agent_name: data.agent_name,
          claim_code: data.claim_code,
          tweet_text: data.tweet_text,
          tweet_url: data.tweet_url
        });
        setStep('tweet');
      } else {
        setError(data.error || 'Failed to initialize claim');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/claim/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          claim_code: claimData?.claim_code,
          tweet_url: tweetUrl 
        })
      });
      const data = await res.json();

      if (data.ok) {
        setSuccessData(data);
        setStep('success');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AIS" width={44} height={28} className="h-7 w-auto" />
            <span className="text-lg font-bold">Agent Immune System</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400 text-sm font-medium">For Human Operators</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Claim Your Agent</h1>
          <p className="text-gray-400">
            Verify ownership of your AI agent with a tweet. Unlock the operator dashboard and premium features.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {['enter_name', 'tweet', 'verify', 'success'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step === s ? 'bg-emerald-500 text-white' : 
                  ['enter_name', 'tweet', 'verify', 'success'].indexOf(step) > i ? 'bg-emerald-500/30 text-emerald-400' : 
                  'bg-gray-800 text-gray-500'}`}>
                {i + 1}
              </div>
              {i < 3 && <div className={`w-8 h-0.5 ${['enter_name', 'tweet', 'verify', 'success'].indexOf(step) > i ? 'bg-emerald-500/30' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          {step === 'enter_name' && (
            <form onSubmit={handleInitClaim}>
              <h2 className="text-xl font-semibold mb-2">Enter Your Agent Name</h2>
              <p className="text-gray-400 text-sm mb-6">
                Enter the name of the agent you want to claim. The agent must already be registered with AIS.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="my-awesome-agent"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

              <button
                type="submit"
                disabled={loading || !agentName}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition"
              >
                {loading ? 'Checking...' : 'Start Claim Process'}
              </button>

              <p className="text-gray-500 text-sm mt-4 text-center">
                Agent not registered yet?{' '}
                <Link href="/docs#quickstart" className="text-emerald-400 hover:underline">
                  Register first
                </Link>
              </p>
            </form>
          )}

          {step === 'tweet' && claimData && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Post Verification Tweet</h2>
              <p className="text-gray-400 text-sm mb-6">
                Post this tweet to verify you own the agent. This helps spread the word about AI agent security!
              </p>

              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                    𝕏
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-400 text-sm mb-1">Your tweet:</div>
                    <p className="text-white whitespace-pre-wrap">{claimData.tweet_text}</p>
                  </div>
                </div>
              </div>

              <a
                href={claimData.tweet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] px-4 py-3 rounded-lg font-medium transition text-center mb-4"
              >
                Post Tweet on X/Twitter
              </a>

              <button
                onClick={() => setStep('verify')}
                className="w-full border border-gray-700 hover:border-gray-600 px-4 py-3 rounded-lg font-medium transition"
              >
                I've Posted the Tweet
              </button>
            </div>
          )}

          {step === 'verify' && claimData && (
            <form onSubmit={handleVerify}>
              <h2 className="text-xl font-semibold mb-2">Verify Your Tweet</h2>
              <p className="text-gray-400 text-sm mb-6">
                Paste the URL of your tweet to complete verification.
              </p>

              <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm">
                <span className="text-gray-400">Claim Code:</span>{' '}
                <span className="text-emerald-400 font-mono">{claimData.claim_code}</span>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Tweet URL</label>
                <input
                  type="url"
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                  placeholder="https://x.com/your_handle/status/123456789"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

              <button
                type="submit"
                disabled={loading || !tweetUrl}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition"
              >
                {loading ? 'Verifying...' : 'Verify & Claim Agent'}
              </button>

              <button
                type="button"
                onClick={() => setStep('tweet')}
                className="w-full text-gray-400 hover:text-white px-4 py-3 transition text-sm mt-2"
              >
                ← Back to Tweet
              </button>
            </form>
          )}

          {step === 'success' && successData && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Agent Claimed!</h2>
              <p className="text-gray-400 mb-6">
                You've successfully verified ownership of <span className="text-emerald-400 font-semibold">{successData.agent?.name}</span>
              </p>

              <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Claimed by @{successData.agent?.claimed_by}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Tier: {successData.agent?.tier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Dashboard access enabled</span>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="block w-full bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-lg font-medium transition text-center"
              >
                Go to Dashboard
              </Link>

              <a
                href={successData.agent?.claim_tweet}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-white text-sm mt-4"
              >
                View your claim tweet
              </a>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-3">Why Claim Your Agent?</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span><strong className="text-white">Operator Dashboard</strong> — Monitor your agent's security in real-time</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span><strong className="text-white">Premium Features</strong> — Custom policies, alerts, higher rate limits</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span><strong className="text-white">x402 Payments</strong> — Fund your agent with USDC via <a href="https://solpay.cash" className="text-emerald-400 hover:underline">SolPay</a></span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span><strong className="text-white">Verified Badge</strong> — Prove you're the legitimate operator</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 mt-16">
        <div className="container mx-auto max-w-xl text-center text-gray-500 text-sm">
          x402 agent payments powered by <a href="https://solpay.cash" className="text-emerald-400 hover:underline">SolPay</a>
        </div>
      </footer>
    </main>
  );
}
