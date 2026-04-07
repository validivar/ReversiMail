'use client';
import { useState } from 'react';
import StepUpModal from './StepUpModal';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showMFA, setShowMFA] = useState(null);
  const [pendingDraft, setPendingDraft] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    const classifyRes = await fetch('/api/classify', {
      method: 'POST',
      body: JSON.stringify({ userMessage: input }),
      headers: { 'Content-Type': 'application/json' }
    });
    const { tier, action } = await classifyRes.json();

    if (tier === 1) {
      const readRes = await fetch('/api/gmail/read', { method: 'POST' });
      const { emails } = await readRes.json();
      setMessages(prev => [...prev, { role: 'assistant', content: `📬 Found ${emails?.length || 0} emails.` }]);
    } 
    else if (tier === 2) {
      // Simulate draft creation
      setPendingDraft({ to: 'demo@example.com', subject: 'Re: Your message', body: input });
      setMessages(prev => [...prev, { role: 'assistant', content: `✏️ Draft ready. Click "Confirm Draft" below to create it.` }]);
    } 
    else if (tier === 3) {
      setShowMFA({ to: 'demo@example.com', subject: 'Important', body: input });
    }
    setInput('');
  };

  const confirmDraft = async () => {
    const draftRes = await fetch('/api/gmail/draft', {
      method: 'POST',
      body: JSON.stringify(pendingDraft),
    });
    const data = await draftRes.json();
    setMessages(prev => [...prev, { role: 'assistant', content: `✅ Draft created (ID: ${data.draftId}). To send, say "send it".` }]);
    setPendingDraft(null);
  };

  const handleMFAConfirm = async (code) => {
    const sendRes = await fetch('/api/gmail/send', {
      method: 'POST',
      body: JSON.stringify({ ...showMFA, mfaCode: code }),
    });
    if (sendRes.ok) {
      setMessages(prev => [...prev, { role: 'assistant', content: '✅ Email sent irreversibly. Step‑up MFA worked.' }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ MFA failed – action blocked.' }]);
    }
    setShowMFA(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded-lg p-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded max-w-[80%] ${msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-white border'}`}>
            {msg.content}
          </div>
        ))}
        {pendingDraft && (
          <div className="bg-yellow-50 p-3 rounded border flex justify-between items-center">
            <span>Draft pending confirmation</span>
            <button onClick={confirmDraft} className="bg-yellow-500 text-white px-3 py-1 rounded">Confirm Draft</button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g., Show my emails, Draft a reply, Send it..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-black text-white px-4 rounded-lg hover:bg-gray-800">Send</button>
      </div>
      {showMFA && <StepUpModal onConfirm={handleMFAConfirm} onCancel={() => setShowMFA(null)} />}
    </div>
  );
}