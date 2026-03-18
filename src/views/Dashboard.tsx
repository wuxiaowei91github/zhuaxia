import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Users, ShoppingBag, Zap, Sparkles, Trophy, MessageSquare, Heart, ChevronRight, Info, Award, Star, Waves, Gamepad2, Timer, LogIn, Target, Code, Search, PenTool } from 'lucide-react';
import { MOCK_LOBSTERS } from '../mockData';
import GlobalChat from '../components/GlobalChat';
import DailyQuests from '../components/DailyQuests';
import InteractivePond from '../components/InteractivePond';
import { User } from '../types';

interface DashboardProps {
  onStartAdoption: () => void;
  user: User | null;
  onShowLogin: () => void;
  onViewMissions: () => void;
}

const ACTIVITIES = [
  "虾友小王 的 闪电侠 刚刚进化到了 大型阶段！",
  "恭喜 抓虾达人 领养了一只 烈焰螯！",
  "集市刚刚成交了一只 极客螯，成交价 1200 虾币。",
  "虾塘 2 号水位稳定，龙虾们心情大好！",
  "新技能：【雷霆一击】已上架集市，快去看看吧。"
];

const LEADERBOARD = [
  { name: '资深虾农', score: 12500, avatar: 'https://picsum.photos/seed/u1/100/100' },
  { name: '龙虾领主', score: 10200, avatar: 'https://picsum.photos/seed/u2/100/100' },
  { name: '抓虾小能手', score: 9800, avatar: 'https://picsum.photos/seed/u3/100/100' },
];

export default function Dashboard({ onStartAdoption, user, onShowLogin, onViewMissions }: DashboardProps) {
  const [activeActivity, setActiveActivity] = useState(0);
  const [luckyRevealed, setLuckyRevealed] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(179); // 2:59

  useEffect(() => {
    if (!user) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveActivity((prev) => (prev + 1) % ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLuckyCatch = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setLuckyRevealed(true);
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-20 relative overflow-hidden">
      {/* Guest Urgency Banner */}
      {!user && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[40] w-full max-w-xl px-4"
        >
          <div className="bg-brand-primary/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-brand-primary/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white/80">限时领养特惠</div>
                <div className="text-sm font-bold text-white">当前稀有编号 000888 为你保留中</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xl font-black text-white font-mono">{formatTime(timeLeft)}</div>
              <button 
                onClick={onStartAdoption}
                className="px-4 py-2 bg-white text-brand-primary rounded-xl text-xs font-black hover:scale-105 transition-transform"
              >
                立即抢占
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Bubbles Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110%', x: `${Math.random() * 100}%`, opacity: 0, scale: 0.5 + Math.random() }}
            animate={{ 
              y: '-10%', 
              opacity: [0, 0.4, 0],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
            }}
            transition={{ 
              duration: 12 + Math.random() * 12, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-3 h-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-[1px]"
          />
        ))}
      </div>

      {/* Activity Ticker */}
      <div className="bg-brand-primary/10 border-y border-brand-primary/20 -mx-4 px-4 py-1.5 overflow-hidden backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            实时动态
          </div>
          <div className="h-4 w-px bg-brand-primary/20" />
          <AnimatePresence mode="wait">
            <motion.p
              key={activeActivity}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-[11px] text-white/80 font-medium truncate"
            >
              {ACTIVITIES[activeActivity]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[480px] md:h-[580px] rounded-[48px] overflow-hidden group shadow-2xl shadow-brand-primary/10">
        <img 
          src="https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1600&q=80" 
          alt="Hero Lobster"
          className="w-full h-full absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent flex flex-col justify-center p-8 md:px-16 md:py-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 backdrop-blur-2xl px-6 py-2.5 rounded-full border border-white/30 mb-6 shadow-lg shadow-brand-primary/10 group/banner hover:border-brand-primary/50 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 text-brand-secondary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
                {user ? '欢迎回来，伟大的虾农' : '领养你的专属龙虾资产编号 · 限时开启'}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl lg:text-[120px] font-black mb-3 tracking-tighter leading-[0.82] text-white drop-shadow-2xl">
              {user ? '继续你的' : '开启你的'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary italic">龙虾资产</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-6 leading-relaxed">
              {user ? '你的龙虾们正在虾塘里等你，快去看看它们的进化进度吧。' : '抓虾是全球首个数字龙虾进化社区。领养专属编号，开启你的数字资产进化之旅。'}
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={onStartAdoption}
                className="bg-brand-primary text-white px-12 py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all neon-glow flex items-center gap-3 group/btn"
              >
                立即领养 <Zap className="w-6 h-6 fill-current group-hover:animate-bounce" />
              </button>
              <button className="bg-white/5 backdrop-blur-xl text-white border border-white/10 px-12 py-6 rounded-full font-black text-xl hover:bg-white/10 transition-all">
                探索集市
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats, Pond & Featured (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '全网龙虾', value: '12,840', icon: Zap, color: 'text-brand-primary', trend: '+12%' },
              { label: '活跃用户', value: '4,201', icon: Users, color: 'text-brand-secondary', trend: '+5%' },
              { label: '今日成交', value: '¥84.2k', icon: TrendingUp, color: 'text-yellow-400', trend: '+24%' },
              { label: '待领养', value: '156', icon: ShoppingBag, color: 'text-purple-400', trend: '-2%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 group relative overflow-hidden"
              >
                <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} mb-4 w-fit`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</div>
                <div className={`absolute top-4 right-4 text-[9px] font-bold px-1.5 py-0.5 rounded ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {stat.trend}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Pond Section */}
          <InteractivePond />

          {/* Featured Section */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black mb-1">精选龙虾</h2>
                <p className="text-white/40 text-sm">当前社区中最受关注的热门龙虾</p>
              </div>
              <button className="flex items-center gap-2 text-brand-secondary text-sm font-black hover:gap-3 transition-all">
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_LOBSTERS.slice(0, 2).map((lobster, i) => (
                <motion.div
                  key={lobster.id}
                  whileHover={{ y: -8 }}
                  className="glass-card overflow-hidden group cursor-pointer border-white/5 hover:border-brand-primary/30 transition-all duration-500"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={lobster.imageUrl} 
                      alt={lobster.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-white/10">
                      {lobster.serialNumber}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-black group-hover:text-brand-primary transition-colors">{lobster.name}</h3>
                      <div className="flex gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] text-white/40 font-black uppercase tracking-widest">
                        <span>进化进度</span>
                        <span className="text-white">{Math.floor((lobster.growthValue / 1000) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(lobster.growthValue / 1000) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Quests, Chat & Social (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Mission Center Entry */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border-white/20 relative overflow-hidden group cursor-pointer"
            onClick={onViewMissions}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-secondary shadow-xl border border-white/10">
                <Target className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white">深海任务板</h3>
                <p className="text-xs text-white/60 mt-1">派遣龙虾完成 AI 生产力任务</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-brand-dark flex items-center justify-center text-[8px] font-bold">
                    {i === 1 ? <Code className="w-3 h-3" /> : i === 2 ? <Search className="w-3 h-3" /> : <PenTool className="w-3 h-3" />}
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">
                最高奖励 1000+ 虾币
              </div>
            </div>
          </motion.div>

          {/* Daily Quests Widget */}
          <DailyQuests />

          {/* Lucky Catch Widget */}
          <div className="glass-card p-8 text-center relative overflow-hidden border-brand-secondary/30 bg-gradient-to-b from-brand-secondary/5 to-transparent">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-secondary to-transparent" />
            
            <div className="mb-8">
              <div className="w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center mb-6 mx-auto relative">
                <motion.div
                  animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                  transition={isSpinning ? { repeat: Infinity, duration: 0.5, ease: "linear" } : {}}
                >
                  <Trophy className={`w-12 h-12 text-brand-secondary ${isSpinning ? 'opacity-50' : ''}`} />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 bg-brand-secondary/20 rounded-full blur-2xl"
                />
              </div>
              <h3 className="text-2xl font-black mb-3">{user ? '每日幸运抓取' : '新用户试玩抽奖'}</h3>
              <p className="text-sm text-white/50 leading-relaxed px-4">
                {user ? '每天一次机会，随机获得虾币、稀有皮肤或进化道具' : '试玩抽取你的第一只龙虾，登录后即可永久领取'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!luckyRevealed ? (
                <motion.button
                  key="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  disabled={isSpinning}
                  onClick={handleLuckyCatch}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl ${
                    isSpinning 
                    ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                    : 'bg-brand-secondary text-brand-dark hover:scale-105 active:scale-95 shadow-brand-secondary/20'
                  }`}
                >
                  {isSpinning ? '正在抓取...' : user ? '立即开启' : '试玩抽奖'}
                </motion.button>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-full p-6 bg-brand-secondary/10 rounded-2xl border border-brand-secondary/30"
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      {user ? <Award className="w-12 h-12 text-brand-secondary" /> : <Sparkles className="w-12 h-12 text-brand-primary" />}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`absolute inset-0 rounded-full ${user ? 'bg-brand-secondary' : 'bg-brand-primary'}`}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-brand-secondary font-black uppercase tracking-[0.2em] mb-2">
                    {user ? '恭喜获得' : '你抽到了稀有龙虾'}
                  </div>
                  <div className="text-4xl font-black text-white mb-6">
                    {user ? '+50 虾币' : 'LX-RARE-888'}
                  </div>
                  {user ? (
                    <button 
                      onClick={() => setLuckyRevealed(false)}
                      className="text-xs text-white/40 hover:text-white font-bold transition-colors"
                    >
                      明天再来
                    </button>
                  ) : (
                    <button 
                      onClick={onShowLogin}
                      className="w-full py-4 bg-brand-primary text-white rounded-xl font-black text-sm shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 group"
                    >
                      立即登录领取 <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Global Chat Widget */}
          <GlobalChat />

          {/* Leaderboard Snippet */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" /> 虾王榜
              </h3>
              <button className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest">
                查看全部
              </button>
            </div>
            <div className="space-y-4">
              {LEADERBOARD.map((user, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-brand-primary transition-colors" />
                    <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      i === 0 ? 'bg-yellow-400 text-black' : i === 1 ? 'bg-slate-300 text-black' : 'bg-amber-600 text-white'
                    }`}>
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold group-hover:text-brand-primary transition-colors">{user.name}</div>
                    <div className="text-[10px] text-white/40 font-medium">成长总值: {user.score.toLocaleString()}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
