import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Star, ChevronRight, Shield, Code, Search, PenTool, Database, Sparkles } from 'lucide-react';
import { Mission, User, Lobster } from '../types';
import { MOCK_MISSIONS } from '../mockData';

interface MissionCenterProps {
  user: User | null;
  lobsters: Lobster[];
  onStartMission: (mission: Mission, lobster: Lobster) => void;
}

export default function MissionCenter({ user, lobsters, onStartMission }: MissionCenterProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-5 h-5" />;
      case 'research': return <Search className="w-5 h-5" />;
      case 'writing': return <PenTool className="w-5 h-5" />;
      case 'data': return <Database className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-orange-400 bg-orange-400/10';
      case 'expert': return 'text-red-400 bg-red-400/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">深海任务板</h1>
          <p className="text-white/50">派遣你的龙虾完成生产力任务，赚取丰厚奖励</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
          <Shield className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">任务等级: LV.1</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Missions / Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-secondary" /> 任务统计
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">已完成</div>
                <div className="text-2xl font-black">0</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">总收益</div>
                <div className="text-2xl font-black text-brand-secondary">0</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-brand-primary/10 to-transparent border-brand-primary/20">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-primary" /> 养虾心得
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              龙虾的阶段越高，能承接的任务难度越大。
              <br /><br />
              给龙虾装备合适的 <span className="text-brand-primary font-bold">MCP 工具</span>，可以大幅提升高难度任务的成功率。
            </p>
          </div>
        </div>

        {/* Mission List */}
        <div className="lg:col-span-8 space-y-4">
          {MOCK_MISSIONS.map((mission, i) => {
            const myLobsters = lobsters.filter(l => l.ownerId === user?.id);
            const eligibleLobsters = myLobsters.filter(l => {
              const stages = ['mini', 'small', 'large', 'super'];
              return stages.indexOf(l.stage) >= stages.indexOf(mission.requiredStage);
            });

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group hover:border-brand-primary/30 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${getDifficultyColor(mission.difficulty)}`}>
                    {getIcon(mission.type)}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{mission.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(mission.difficulty)}`}>
                            {mission.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                            需要: {mission.requiredStage} 阶段
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-brand-secondary font-black">+{mission.reward.balance} 虾币</div>
                        <div className="text-brand-primary text-[10px] font-bold">+{mission.reward.growth} XP</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/60 leading-relaxed">{mission.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex -space-x-2">
                        {eligibleLobsters.slice(0, 3).map(l => (
                          <img 
                            key={l.id} 
                            src={l.imageUrl} 
                            alt={l.name} 
                            className="w-8 h-8 rounded-full border-2 border-brand-dark object-cover"
                            title={`${l.name} (可用)`}
                          />
                        ))}
                        {eligibleLobsters.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-brand-dark flex items-center justify-center text-[10px] font-bold">
                            +{eligibleLobsters.length - 3}
                          </div>
                        )}
                        {eligibleLobsters.length === 0 && (
                          <span className="text-[10px] text-red-400 font-bold">暂无符合条件的龙虾</span>
                        )}
                      </div>
                      
                      <button 
                        disabled={eligibleLobsters.length === 0}
                        onClick={() => eligibleLobsters[0] && onStartMission(mission, eligibleLobsters[0])}
                        className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                          eligibleLobsters.length > 0 
                          ? 'bg-brand-primary text-white hover:scale-105 shadow-lg shadow-brand-primary/20' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        派遣龙虾 <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
