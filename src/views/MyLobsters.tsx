import React from 'react';
import { motion } from 'motion/react';
import { Heart, Battery, Star, Plus, LogIn, ShoppingBag, Waves } from 'lucide-react';
import SkillIcon from '../components/SkillIcon';
import Pond from '../components/Pond';
import { Lobster, User } from '../types';

interface MyLobstersProps {
  lobsters: Lobster[];
  user: User | null;
  onSelect: (lobster: Lobster) => void;
  onShowLogin: () => void;
  onGoToMarket: () => void;
  onStartBreeding: () => void;
}

export default function MyLobsters({ lobsters, user, onSelect, onShowLogin, onGoToMarket, onStartBreeding }: MyLobstersProps) {
  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">我的龙虾池</h1>
          <p className="text-white/50">管理并培育你的数字龙虾</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onStartBreeding}
            className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm"
          >
            <Heart className="w-5 h-5 text-red-500" />
            龙虾繁殖
          </button>
          <button 
            onClick={() => {
              if (!user) onShowLogin();
              else onGoToMarket();
            }}
            className="bg-brand-secondary text-brand-dark p-4 rounded-2xl hover:scale-105 transition-transform neon-glow-cyan"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {lobsters?.length > 0 ? (
        <div className="space-y-12">
          {/* Visual Pond Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
              <Waves className="w-4 h-4 text-brand-secondary" /> 实时生态池
            </div>
            <Pond lobsters={lobsters} onSelect={onSelect} />
          </section>

          {/* Grid Management Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">详细列表</h2>
              <div className="text-xs text-white/40">{lobsters.length} 只龙虾</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lobsters.map((lobster, i) => (
                <motion.div
                  key={lobster.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => onSelect(lobster)}
                  className="glass-card group cursor-pointer hover:border-brand-primary/50 transition-colors overflow-hidden"
                >
                  <div className="relative h-56">
                    <img 
                      src={lobster.imageUrl} 
                      alt={lobster.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-brand-secondary font-bold uppercase tracking-wider mb-1">
                            {lobster.stage} 龙虾
                          </div>
                          <h3 className="text-2xl font-bold">{lobster.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/50 mb-1">编号</div>
                          <div className="font-mono font-bold">{lobster.serialNumber}</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                        lobster.rarity === 'legendary' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                        lobster.rarity === 'rare' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                        'bg-brand-secondary/20 border-brand-secondary/50 text-brand-secondary'
                      }`}>
                        {lobster.rarity === 'legendary' ? '传说' :
                         lobster.rarity === 'rare' ? '稀有' : '普通'}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-bold">
                          <Heart className="w-3 h-3 text-red-500" /> 健康
                        </div>
                        <div className="h-1 bg-white/10 rounded-full">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${lobster.health}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-bold">
                          <Battery className="w-3 h-3 text-green-500" /> 能量
                        </div>
                        <div className="h-1 bg-white/10 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${lobster.energy}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-bold">
                          <Star className="w-3 h-3 text-yellow-500" /> 成长
                        </div>
                        <div className="h-1 bg-white/10 rounded-full">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(lobster.growthValue / 1000) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="flex gap-2">
                      {lobster.skills?.length > 0 ? (
                        lobster.skills.map(skill => (
                          <div key={skill.id} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-brand-secondary">
                            <SkillIcon icon={skill.icon} className="w-4 h-4" />
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-white/30 italic">尚无技能</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 glass-card border-dashed border-white/10 space-y-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center">
              <Plus className="w-12 h-12 text-white/10" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center"
            >
              <Star className="w-5 h-5 text-brand-primary" />
            </motion.div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">你的虾池空空如也</h3>
            <p className="text-white/40 max-w-xs mx-auto">
              {user ? '快去领养你的第一只龙虾，开启进化之旅吧！' : '登录后即可领养专属龙虾，并获得新人大礼包！'}
            </p>
          </div>

          <div className="flex gap-4">
            {!user ? (
              <button 
                onClick={onShowLogin}
                className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                立即登录
              </button>
            ) : (
              <button 
                onClick={onGoToMarket}
                className="px-8 py-3 bg-brand-secondary text-brand-dark rounded-xl font-bold flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                前往领养
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
