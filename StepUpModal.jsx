import { useState } from 'react';

export default function StepUpModal({ onConfirm, onCancel }) {
  const [code, setCode] = useState('');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">🔐 Step‑Up Authentication Required</h2>
        <p className="mb-2 text-red-600 font-semibold">This action is irreversible (Tier 3 – Commit).</p>
        <p className="mb-2">Enter your MFA code (demo: <code className="bg-gray-100 px-1">123456</code>):</p>
        <input
          type="text"
          className="border p-2 w-full mb-4 rounded"
          placeholder="123456"
          value={code}
          onChange={e => setCode(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
          <button onClick={() => onConfirm(code)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirm Send</button>
        </div>
      </div>
    </div>
  );
}