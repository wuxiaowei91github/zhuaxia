import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, AlertCircle, ArrowRight, Ghost, Zap } from 'lucide-react';
import { Lobster, User } from '../types';

interface BreedingModalProps {
  user: User;
  lobsters: Lobster[];
  onClose: () => void;
  onBreed: (parent1Id: string, parent2Id: string) => Promise<void>;
}

export default function BreedingModal({ user, lobsters, onClose, onBreed }: BreedingModalProps) {
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const breedableLobsters = lobsters.filter(l => l.stage === 'super' || l.stage === 'large');

  const toggleSelect = (id: string) => {
    if (selectedParents.includes(id)) {
      setSelectedParents(selectedParents.filter(p => p !== id));
    } else if (selectedParents.length < 2) {
      setSelectedParents([...selectedParents, id]);
    }
  };

  const handleBreed = async () => {
    if (selectedParents.length !== 2) return;
    if (user.balance < 500) {
      setError('余额不足，繁殖需要 500 虾币');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onBreed(selectedParents[0], selectedParents[1]);
      onClose();
    } catch (err: any) {
      setError(err.message || '繁殖失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/90 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              龙虾实验室：基因融合
            </h2>
            <p className="text-white/50 text-sm">选择两只成年龙虾进行繁殖，创造全新的生命</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Selection Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-4">
              <div className="aspect-square rounded-[32px] border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden bg-white/5">
                {selectedParents[0] ? (
                  <img 
                    src={lobsters.find(l => l.id === selectedParents[0])?.imageUrl} 
                    className="w-full h-full object-cover" 
                    alt="Parent 1"
                  />
                ) : (
                  <Ghost className="w-12 h-12 text-white/10" />
                )}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">父本 A</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-brand-primary animate-pulse" />
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-brand-primary">500 虾币</div>
                <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">繁殖费用</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-square rounded-[32px] border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden bg-white/5">
                {selectedParents[1] ? (
                  <img 
                    src={lobsters.find(l => l.id === selectedParents[1])?.imageUrl} 
                    className="w-full h-full object-cover" 
                    alt="Parent 2"
                  />
                ) : (
                  <Ghost className="w-12 h-12 text-white/10" />
                )}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">母本 B</span>
                </div>
              </div>
            </div>
          </div>

          {/* List of Breedable Lobsters */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">选择你的龙虾 ({breedableLobsters.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {breedableLobsters.map((lobster) => (
                <button
                  key={lobster.id}
                  onClick={() => toggleSelect(lobster.id)}
                  disabled={selectedParents.length >= 2 && !selectedParents.includes(lobster.id)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
                    selectedParents.includes(lobster.id) 
                      ? 'border-brand-primary ring-4 ring-brand-primary/20' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img src={lobster.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={lobster.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] font-bold text-white truncate">{lobster.name}</span>
                  </div>
                  {selectedParents.includes(lobster.id) && (
                    <div className="absolute top-2 right-2 bg-brand-primary text-white p-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/10 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-bold">成功率：100%</div>
              <div className="text-[10px] text-white/40 font-medium">基因融合过程不可逆，请谨慎选择</div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <button
              onClick={handleBreed}
              disabled={selectedParents.length !== 2 || loading}
              className="flex-1 md:flex-none px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-lg shadow-xl hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? '基因融合中...' : '开始繁殖'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
