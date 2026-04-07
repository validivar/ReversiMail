'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AgentPassport() {
  const { user, isLoading } = useUser();
  const [tokens, setTokens] = useState([]);
  const [revoking, setRevoking] = useState(null);

  useEffect(() => {
    if (user) {
      // Fetch token metadata from your API
      fetch('/api/token/list')
        .then(res => res.json())
        .then(data => setTokens(data.tokens || []))
        .catch(() => {
          // Demo mock data
          setTokens([
            {
              id: '1',
              provider: 'Gmail',
              scopes: ['gmail.readonly', 'gmail.compose', 'gmail.send'],
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              tier: 3,
            },
          ]);
        });
    }
  }, [user]);

  const getTierFromScopes = (scopes) => {
    if (scopes.includes('gmail.send')) return 3;
    if (scopes.includes('gmail.compose')) return 2;
    return 1;
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case 3: return { name: 'Commit', color: 'red', description: 'Irreversible actions' };
      case 2: return { name: 'Draft', color: 'yellow', description: 'Reversible until finalised' };
      default: return { name: 'Observe', color: 'green', description: 'Fully reversible' };
    }
  };

  const handleRevoke = async (provider, tokenId) => {
    setRevoking(provider);
    await fetch('/api/token/revoke', {
      method: 'POST',
      body: JSON.stringify({ provider, tokenId }),
      headers: { 'Content-Type': 'application/json' },
    });
    setTokens(tokens.filter(t => t.id !== tokenId));
    setRevoking(null);
  };

  if (isLoading) return <div className="p-8 text-center">Loading passport...</div>;
  if (!user) return <div className="p-8 text-center">Please log in to view Agent Passport</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Agent Passport ✨
        </h1>
        <p className="text-gray-600 mt-2">
          Your AI agent's permissions – transparent, auditable, revocable.
        </p>
      </div>

      {/* Reversibility Spectrum visual */}
      <div className="mb-8 bg-gray-50 rounded-xl p-4 border">
        <h2 className="font-semibold mb-2">The Reversibility Spectrum</h2>
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div className="bg-green-500 flex-1 flex items-center justify-center text-white text-xs font-bold">OBSERVE</div>
          <div className="bg-yellow-500 flex-1 flex items-center justify-center text-white text-xs font-bold">DRAFT</div>
          <div className="bg-red-500 flex-1 flex items-center justify-center text-white text-xs font-bold">COMMIT</div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Fully reversible – automatic</span>
          <span>One‑click confirm</span>
          <span>Step‑up MFA required</span>
        </div>
      </div>

      {/* Token table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scopes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tokens.map((token) => {
              const tier = token.tier || getTierFromScopes(token.scopes);
              const tierInfo = getTierLabel(tier);
              return (
                <tr key={token.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{token.provider}</span>
                      {tier === 3 && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">High Risk</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs flex flex-wrap gap-1">
                      {token.scopes.map((scope, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded">{scope}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(token.expiresAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
                      ${tier === 3 ? 'bg-red-100 text-red-800' : tier === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      <span>Tier {tier}</span>
                      <span>– {tierInfo.name}</span>
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{tierInfo.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRevoke(token.provider, token.id)}
                      disabled={revoking === token.provider}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {revoking === token.provider ? 'Revoking...' : 'Revoke'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trust explanation */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-800">🔐 How trust tiers work</h3>
        <p className="text-sm text-blue-700 mt-1">
          Your agent automatically uses <strong>Tier 1 (Observe)</strong> for reading. 
          <strong> Tier 2 (Draft)</strong> requires one click. 
          <strong> Tier 3 (Commit)</strong> triggers step‑up MFA because the action is irreversible.
          The Token Vault stores separate tokens for each tier – minimal scope, maximum security.
        </p>
      </div>
    </div>
  );
}