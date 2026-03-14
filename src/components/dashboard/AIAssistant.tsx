'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Investigation Assistant. Ask me about crime patterns, traffic analysis, infrastructure status, or any provincial safety metrics. I can analyze real-time data and provide actionable insights.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Analyzing crime network patterns on the R81 corridor. I\'ve detected a 23% increase in theft incidents near Polokwane. Recommend increased SAPS presence 18:00-22:00 daily.',
        'Traffic analysis shows congestion peaks at 07:15 and 17:45 on the N1 northbound. Suggest implementing extended green wave timing on alternate routes.',
        'Infrastructure report: 3 potholes reported on R521 near Tzaneen (citizen app). Estimated repair time: 2 weeks. Water system pressure nominal.',
        'Disease outbreak risk low across province. Hospital capacity at 73%. Recommended EMS unit deployment: +2 ambulances to Polokwane CBD during peak hours.',
      ];

      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-600/50 bg-slate-900/50">
        <h3 className="text-lg font-semibold text-white">AI Investigation Assistant</h3>
        <p className="text-xs text-slate-400 mt-1">Natural language analysis of provincial safety data</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500/30 border border-blue-500/50 text-blue-100'
                  : 'bg-slate-700/50 border border-slate-600/50 text-slate-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-300/60' : 'text-slate-400'}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700/50 border border-slate-600/50 text-slate-200 px-4 py-3 rounded-lg flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-600/50 bg-slate-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about crime patterns, traffic, infrastructure..."
            className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-500/30 hover:bg-blue-500/50 border border-blue-500/50 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
