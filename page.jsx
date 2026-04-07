import { auth0 } from '@/lib/auth0';
import { getSession } from '@auth0/nextjs-auth0';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) return <div className="p-8">Please log in</div>;

  // In production: fetch real token scopes from Token Vault
  const tokens = [
    { provider: 'Gmail', scopes: ['gmail.readonly', 'gmail.compose', 'gmail.send'], expires: '2025-12-31T23:59:59Z', tier: 3 },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Agent Passport ✨</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Service</th>
              <th className="px-6 py-3 text-left">Scopes</th>
              <th className="px-6 py-3 text-left">Token Expiry</th>
              <th className="px-6 py-3 text-left">Max Tier</th>
              <th className="px-6 py-3 text-left">Revoke</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t, i) => (
              <tr key={i} className="border-t">
                <td className="px-6 py-4">{t.provider}</td>
                <td className="px-6 py-4 font-mono text-sm">{t.scopes.join(', ')}</td>
                <td className="px-6 py-4">{new Date(t.expires).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    t.tier === 3 ? 'bg-red-100 text-red-800' : 
                    t.tier === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    Tier {t.tier} – {t.tier === 3 ? 'Commit' : t.tier === 2 ? 'Draft' : 'Observe'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-red-600 hover:text-red-800">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        The Reversibility Spectrum: Read → Draft → Send. Only irreversible actions require step‑up MFA.
      </p>
    </div>
  );
}