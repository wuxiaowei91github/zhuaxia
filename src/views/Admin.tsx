import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Ghost, 
  TrendingUp, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { User, Lobster, Post } from '../types';

export default function Admin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLobsters: 0,
    totalTransactions: 0,
    activeUsers: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentLobsters, setRecentLobsters] = useState<Lobster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const lobstersSnap = await getDocs(collection(db, 'lobsters'));
        
        setStats({
          totalUsers: usersSnap.size,
          totalLobsters: lobstersSnap.size,
          totalTransactions: 1240, // Mocked
          activeUsers: Math.floor(usersSnap.size * 0.7) // Mocked
        });

        const usersList: User[] = [];
        usersSnap.forEach(doc => usersList.push({ id: doc.id, ...doc.data() } as User));
        setRecentUsers(usersList.slice(0, 5));

        const lobstersList: Lobster[] = [];
        lobstersSnap.forEach(doc => lobstersList.push({ id: doc.id, ...doc.data() } as Lobster));
        setRecentLobsters(lobstersList.slice(0, 5));

      } catch (error) {
        console.error('Admin data fetch error:', error);
        handleFirestoreError(error, OperationType.LIST, 'admin_collections');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="w-10 h-10 text-brand-primary" />
            管理控制台
          </h1>
          <p className="text-white/50">监控平台运行状态与资产流动</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm font-bold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            实时监控
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '总用户数', value: stats.totalUsers, icon: Users, color: 'text-blue-400', trend: '+12%' },
          { label: '总龙虾数', value: stats.totalLobsters, icon: Ghost, color: 'text-brand-secondary', trend: '+5%' },
          { label: '累计交易额', value: `¥${stats.totalTransactions}`, icon: TrendingUp, color: 'text-green-400', trend: '+24%' },
          { label: '活跃用户', value: stats.activeUsers, icon: Activity, color: 'text-purple-400', trend: '+8%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <section className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">最近注册用户</h2>
            <button className="text-xs font-bold text-brand-primary hover:underline">查看全部</button>
          </div>
          <div className="divide-y divide-white/5">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-bold">{user.username}</div>
                    <div className="text-[10px] text-white/40 font-mono">{user.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-secondary">{user.balance} 虾币</div>
                  <div className="text-[10px] text-white/40">余额</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Lobsters */}
        <section className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">最新领养龙虾</h2>
            <button className="text-xs font-bold text-brand-primary hover:underline">查看全部</button>
          </div>
          <div className="divide-y divide-white/5">
            {recentLobsters.map((lobster) => (
              <div key={lobster.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5">
                    <img src={lobster.imageUrl} alt={lobster.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">{lobster.name}</div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-tighter">
                      {lobster.rarity} · {lobster.stage}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white/80">{lobster.serialNumber}</div>
                  <div className="text-[10px] text-white/40">序列号</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Platform Health */}
      <section className="glass-card p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">系统运行健康度</h2>
          <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            所有服务运行正常
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'API 响应时间', value: '45ms', status: 'optimal' },
            { label: '数据库负载', value: '12%', status: 'optimal' },
            { label: '存储空间使用', value: '64%', status: 'warning' },
          ].map((item) => (
            <div key={item.label} className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-white/40">{item.label}</span>
                <span className={item.status === 'optimal' ? 'text-green-400' : 'text-yellow-400'}>{item.value}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.status === 'optimal' ? 'bg-green-500' : 'bg-yellow-500'}`} 
                  style={{ width: item.value }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
