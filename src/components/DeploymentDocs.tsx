import React, { useState } from 'react';
import { BookOpen, Copy, Check, ExternalLink, Terminal, ShieldCheck, Zap, Cloud, Code } from 'lucide-react';

export const DeploymentDocs: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const vercelJsonCode = `{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}`;

  return (
    <div className="py-12 bg-[#FAF8F5] text-left min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#E7E2D9] pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Developer & Production Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
            Vercel & PayMongo Deployment Guide
          </h1>
          <p className="text-xs text-stone-600">
            Step-by-step instructions for configuring Github, Supabase, PayMongo webhooks, and Vercel serverless functions.
          </p>
        </div>

        {/* Section 1: Vercel Deployment */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              ▲
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-xl text-stone-900">
                1. Deploying to Vercel
              </h2>
              <p className="text-xs text-stone-500">Fast CI/CD from your GitHub repository</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Push to GitHub:</strong> Commit all code files including <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">vercel.json</code>, <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">supabase-schema.sql</code>, and <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">server.ts</code>.
              </li>
              <li>
                <strong>Import into Vercel:</strong> Head to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-[#92400E] font-bold underline">vercel.com/new</a> and select your imported GitHub repository.
              </li>
              <li>
                <strong>Framework Preset:</strong> Choose <strong>Vite</strong>. The root directory is <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">./</code>.
              </li>
              <li>
                <strong>Configure Environment Variables in Vercel Dashboard:</strong>
                <div className="mt-2 p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] space-y-1">
                  <div>GEMINI_API_KEY = your_gemini_api_key</div>
                  <div>PAYMONGO_SECRET_KEY = sk_live_... / sk_test_...</div>
                  <div>PAYMONGO_PUBLIC_KEY = pk_live_... / pk_test_...</div>
                  <div>PAYMONGO_WEBHOOK_SECRET = whsec_...</div>
                  <div>VITE_SUPABASE_URL = https://your-project.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY = your_supabase_anon_key</div>
                </div>
              </li>
              <li>
                <strong>Click Deploy:</strong> Vercel will bundle the Vite React client into <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">/dist</code> and run the Express API endpoints automatically under <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">/api/*</code>.
              </li>
            </ol>
          </div>

          {/* Vercel JSON Viewer */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
              <span>vercel.json configuration:</span>
              <button
                onClick={() => copyToClipboard(vercelJsonCode, 'vercel')}
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                {copiedKey === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'vercel' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
              {vercelJsonCode}
            </pre>
          </div>
        </div>

        {/* Section 2: PayMongo Gateway & Webhooks */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-xl text-stone-900">
                2. PayMongo Gateway & Webhook Setup
              </h2>
              <p className="text-xs text-stone-500">Real-time payment authorization for GCash, Maya & Cards</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Register on PayMongo:</strong> Sign up at <a href="https://dashboard.paymongo.com" target="_blank" rel="noreferrer" className="text-[#92400E] font-bold underline">dashboard.paymongo.com</a> to get your API keys.
              </li>
              <li>
                <strong>Retrieve API Keys:</strong> Under <em>Developers &rarr; API Keys</em>, copy your <strong>Secret Key</strong> (<code className="bg-stone-100 px-1 py-0.5 rounded font-mono">sk_test_...</code> or <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">sk_live_...</code>) and <strong>Public Key</strong> (<code className="bg-stone-100 px-1 py-0.5 rounded font-mono">pk_test_...</code>).
              </li>
              <li>
                <strong>Register Webhook Endpoint:</strong>
                <p className="mt-1">In the PayMongo Dashboard, go to <em>Webhooks &rarr; Register Webhook</em> and set:</p>
                <div className="mt-1 p-2.5 bg-stone-100 rounded-lg font-mono text-[11px] text-stone-800">
                  <strong>Endpoint URL:</strong> https://your-vercel-domain.vercel.app/api/paymongo/webhook
                </div>
              </li>
              <li>
                <strong>Select Webhook Events:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><code className="font-mono text-[#92400E]">checkout_session.payment.paid</code> — Triggers order confirmation and automated seller GCash payout record.</li>
                  <li><code className="font-mono text-[#92400E]">payment.paid</code> — Triggers general payment receipt.</li>
                  <li><code className="font-mono text-[#92400E]">payment.failed</code> — Notifies buyer to retry with alternate method.</li>
                </ul>
              </li>
              <li>
                <strong>Simulated Testing Mode:</strong> If no live API keys are provided in <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">.env</code>, Artisan Haven will gracefully operate in sandbox simulation mode so you can test all buyer and seller flows immediately.
              </li>
            </ol>
          </div>
        </div>

        {/* Section 3: Supabase SQL Setup */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-emerald-400 flex items-center justify-center font-bold font-mono">
              SQL
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-xl text-stone-900">
                3. Supabase Database Execution
              </h2>
              <p className="text-xs text-stone-500">PostgreSQL with Row Level Security and automated rating triggers</p>
            </div>
          </div>

          <p className="text-stone-700 leading-relaxed">
            Open the <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">supabase-schema.sql</code> file included in this repository. Navigate to your <strong>Supabase Project &rarr; SQL Editor</strong>, paste the full script, and click <strong>Run</strong>. This will create all tables, indexes, RLS policies, and the automatic star review recalculation trigger!
          </p>
        </div>

      </div>
    </div>
  );
};
