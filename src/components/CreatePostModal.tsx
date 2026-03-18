import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image, Send, Sparkles } from 'lucide-react';
import { User, Lobster } from '../types';

interface CreatePostModalProps {
  user: User;
  lobsters: Lobster[];
  onClose: () => void;
  onSubmit: (content: string, image?: string) => void;
}

export default function CreatePostModal({ user, lobsters, onClose, onSubmit }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedLobsterId, setSelectedLobsterId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const selectedLobster = lobsters.find(l => l.id === selectedLobsterId);
    onSubmit(content, selectedLobster?.imageUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg glass-card p-8 space-y-6 overflow-hidden"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/20 rounded-xl text-brand-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">发布新动态</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">分享你的心得</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今天你的龙虾有什么新发现？"
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-all resize-none text-sm"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Image className="w-3 h-3" /> 展示你的龙虾 (可选)
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {lobsters.map(lobster => (
                <button
                  key={lobster.id}
                  type="button"
                  onClick={() => setSelectedLobsterId(selectedLobsterId === lobster.id ? null : lobster.id)}
                  className={`flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedLobsterId === lobster.id ? 'border-brand-primary scale-110 shadow-lg shadow-brand-primary/20' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={lobster.imageUrl} alt={lobster.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {selectedLobsterId === lobster.id && (
                    <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
              {lobsters.length === 0 && (
                <div className="text-[10px] text-white/20 italic py-2">你还没有龙虾，快去领养吧</div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 text-white/60 rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
              立即发布
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
