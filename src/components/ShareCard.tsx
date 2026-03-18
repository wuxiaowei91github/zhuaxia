import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, Copy, Ghost, Sparkles, QrCode } from 'lucide-react';

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  lobster: {
    name: string;
    rarity: string;
    serialNumber: string;
    image: string;
    type: string;
  };
}

export default function ShareCard({ isOpen, onClose, lobster }: ShareCardProps) {
  if (!isOpen) return null;

  const rarityConfig = {
    legendary: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', label: '传说' },
    rare: { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', label: '稀有' },
    common: { color: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20', label: '普通' },
  }[lobster.rarity as 'legendary' | 'rare' | 'common'] || { color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', label: '未知' };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm flex flex-col items-center"
      >
        {/* The Card Container */}
        <div className="w-full bg-brand-dark rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative">
          {/* Decorative Background */}
          <div className={`absolute inset-0 opacity-20 blur-3xl ${rarityConfig.bg}`} />
          
          <div className="p-8 relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <Ghost className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-display font-bold tracking-tighter text-white">抓虾 · 进化</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${rarityConfig.border} ${rarityConfig.color}`}>
                {rarityConfig.label}
              </div>
            </div>

            {/* Main Image */}
            <div className="relative mb-8 aspect-square rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
              <img src={lobster.image} alt={lobster.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-white/60 uppercase font-bold mb-1">资产编号</div>
                  <div className="text-sm font-mono font-bold text-white">{lobster.serialNumber}</div>
                </div>
                <Sparkles className={`w-6 h-6 ${rarityConfig.color}`} />
              </div>
            </div>

            {/* Info */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-display font-black italic text-white mb-2 tracking-tighter">
                {lobster.name}
              </h3>
              <p className="text-white/40 text-xs">在进化海洋中发现的独特生命</p>
            </div>

            {/* Footer / QR */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-brand-dark" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-white">扫码领养</div>
                  <div className="text-[8px] text-white/40">加入全球龙虾进化计划</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-brand-primary">#抓虾进化</div>
                <div className="text-[8px] text-white/40">2026.03.17</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 w-full">
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
            <Download className="w-5 h-5" />
            保存图片
          </button>
          <button className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-primary/20">
            <Copy className="w-5 h-5" />
            复制链接
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 p-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
      </motion.div>
    </div>
  );
}
