import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Star, Zap, ShoppingBag } from 'lucide-react';

const QUESTS = [
  { id: 1, title: '每日签到', reward: '10 虾币', icon: Star, completed: true },
  { id: 2, title: '喂食 3 次', reward: '20 虾币', icon: Zap, completed: false },
  { id: 3, title: '在集市逛逛', reward: '5 虾币', icon: ShoppingBag, completed: false },
];

export default function DailyQuests() {
  return (
    <div className="glass-card p-6 space-y-6 border-white/5">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" /> 每日任务
        </h3>
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
          33% 完成
        </span>
      </div>

      <div className="space-y-3">
        {QUESTS.map((quest) => (
          <div
            key={quest.id}
            className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${
              quest.completed 
              ? 'bg-green-500/5 border-green-500/20 opacity-60' 
              : 'bg-white/5 border-white/5 hover:border-white/10'
            }`}
          >
            <div className={`p-2 rounded-xl ${quest.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
              <quest.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className={`text-sm font-bold ${quest.completed ? 'line-through text-white/40' : 'text-white'}`}>
                {quest.title}
              </div>
              <div className="text-[10px] text-brand-secondary font-bold">奖励: {quest.reward}</div>
            </div>
            {quest.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-white/10" />
            )}
          </div>
        ))}
      </div>
      
      <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/5">
        查看全部成就
      </button>
    </div>
  );
}
