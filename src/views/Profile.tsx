import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Package, Settings, ChevronRight, Wallet, Award, Clock, Copy, Gift, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-[40px] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative">
          <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-[40px] object-cover border-4 border-brand-dark shadow-2xl" />
          <div className="absolute -bottom-2 -right-2 bg-brand-secondary text-brand-dark p-2 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-4xl font-black tracking-tight">{user.username}</h1>
          <p className="text-white/40 font-medium">{user.role === 'admin' ? '平台管理员' : '高级养虾达人'} · 加入社区 128 天</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Wallet className="w-4 h-4 text-brand-secondary" />
              <span className="font-bold">{user.balance.toLocaleString()} 虾币</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Package className="w-4 h-4 text-brand-primary" />
              <span className="font-bold">{user.inventory?.length || 0} 件道具</span>
            </div>
          </div>
        </div>

        <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inventory Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* Referral Card */}
          <section className="glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-primary/20 transition-colors" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Gift className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-xl font-black">邀请好友，赚取奖励</h3>
                </div>
                <p className="text-sm text-white/50 max-w-md">
                  每成功邀请一位好友注册，你将获得 <span className="text-brand-primary font-bold">500 虾币</span>，
                  你的好友也将获得 <span className="text-brand-secondary font-bold">200 虾币</span> 的额外启动资金。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex flex-col items-center gap-3 min-w-[200px]">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">你的专属邀请码</div>
                <div className="text-2xl font-black tracking-widest text-brand-primary">{user.referralCode || '------'}</div>
                <button 
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      复制邀请码
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-black">我的背包</h2>
            <div className="flex gap-2">
              {['全部', '食物', '道具', '技能'].map((cat, i) => (
                <button key={cat} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${i === 0 ? 'bg-white text-brand-dark border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {user.inventory?.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 group cursor-pointer hover:border-brand-primary/30 transition-all"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white/5">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{item.type}</p>
                  </div>
                  <div className="bg-brand-primary/20 text-brand-primary px-2 py-1 rounded-lg text-[10px] font-black">
                    x{item.quantity}
                  </div>
                </div>
              </motion.div>
            ))}
            <button className="aspect-square border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/10 transition-all group">
              <Package className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">获取更多道具</span>
            </button>
          </div>
        </div>

        {/* Stats & History Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-black">成就统计</h3>
            <div className="space-y-4">
              {[
                { label: '领养总数', value: '12', color: 'text-brand-primary' },
                { label: '进化次数', value: '45', color: 'text-brand-secondary' },
                { label: '集市成交', value: '8', color: 'text-yellow-400' },
                { label: '最高评分', value: 'S+', color: 'text-purple-400' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-sm font-bold text-white/40">{stat.label}</span>
                  <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black">最近活动</h3>
              <Clock className="w-4 h-4 text-white/20" />
            </div>
            <div className="space-y-4">
              {[
                { action: '购买了', target: '超级成长水', time: '10 分钟前' },
                { action: '进化了', target: '闪电侠', time: '2 小时前' },
                { action: '获得了', target: '50 虾币', time: '5 小时前' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  <div className="flex-1">
                    <span className="text-white/40">{log.action} </span>
                    <span className="font-bold">{log.target}</span>
                  </div>
                  <span className="text-[10px] text-white/20">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
