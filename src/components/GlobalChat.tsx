import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Smile } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, user: '虾友小王', text: '我的烈焰螯终于进化啦！🔥', time: '2分钟前' },
  { id: 2, user: '龙虾领主', text: '有人出极客螯吗？高价收！💰', time: '5分钟前' },
  { id: 3, user: '抓虾小能手', text: '今天幸运抓取居然抓到了稀有皮肤，运气爆棚！✨', time: '10分钟前' },
];

export default function GlobalChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: '我',
      text: input,
      time: '刚刚',
    };

    setMessages([newMessage, ...messages.slice(0, 4)]);
    setInput('');
  };

  return (
    <div className="glass-card flex flex-col h-[400px] overflow-hidden border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <h3 className="text-sm font-black flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-primary" /> 全球喊话
        </h3>
        <span className="text-[10px] text-brand-primary font-bold animate-pulse">● 1,204 在线</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-secondary">{msg.user}</span>
                <span className="text-[9px] text-white/20">{msg.time}</span>
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-xs text-white/80 border border-white/5 inline-block max-w-[90%]">
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="说点什么..."
          className="flex-1 bg-brand-dark/50 border border-white/10 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-brand-primary transition-colors"
        />
        <button
          type="submit"
          className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
