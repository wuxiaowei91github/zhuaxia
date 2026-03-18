import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Filter, Search, Sparkles, Copy, Zap, User as UserIcon, Heart, Star } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';
import { Lobster, User } from '../types';

const MARKET_ITEMS = [
  { id: 'm1', name: '初级龙虾蛋', price: 200, type: 'egg', image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=400&q=80' },
  { id: 'm2', name: '克隆卷轴', price: 500, type: 'item', image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=400&q=80' },
  { id: 'm3', name: '超级成长水', price: 150, type: 'food', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=400&q=80' },
  { id: 'm4', name: '技能：雷霆一击', price: 800, type: 'skill', image: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&w=400&q=80' },
];

interface MarketplaceProps {
  onStartAdoption: () => void;
  lobsters: Lobster[];
  user: User | null;
  onBuyLobster: (lobster: Lobster) => void;
}

export default function Marketplace({ onStartAdoption, lobsters, user, onBuyLobster }: MarketplaceProps) {
  const { showNotification } = useNotification();
  const [activeCategory, setActiveCategory] = useState('全部');

  const saleLobsters = lobsters.filter(l => l.isForSale && l.ownerId !== user?.id);

  const handleBuyItem = (item: typeof MARKET_ITEMS[0]) => {
    if (item.type === 'egg') {
      onStartAdoption();
    } else {
      showNotification(`成功购买 ${item.name}！已存入你的背包。`, 'success');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">龙虾集市</h1>
          <p className="text-white/50">领养、装备与扩展能力</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-brand-secondary">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">{user?.balance.toLocaleString() || 0} 虾币</span>
          </div>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input 
            type="text" 
            placeholder="搜索龙虾、技能或道具..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
          <Filter className="w-6 h-6" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {['全部', '龙虾领养', '玩家寄售', '克隆中心', '技能商店', '成长道具'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold border transition-all ${
              activeCategory === cat ? 'bg-white text-brand-dark border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Official Items */}
        {(activeCategory === '全部' || activeCategory === '成长道具' || activeCategory === '技能商店' || activeCategory === '龙虾领养') && 
          MARKET_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group overflow-hidden"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-brand-primary/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                  官方
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-brand-secondary font-bold text-sm">
                    {item.price} 虾币
                  </div>
                  <button 
                    onClick={() => handleBuyItem(item)}
                    className="p-2 bg-brand-primary rounded-lg text-white hover:scale-110 transition-transform"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        }

        {/* Player Listings */}
        {(activeCategory === '全部' || activeCategory === '玩家寄售') && 
          saleLobsters.map((lobster, i) => (
            <motion.div
              key={lobster.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group overflow-hidden border-brand-secondary/20"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={lobster.imageUrl} 
                  alt={lobster.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${
                  lobster.rarity === 'legendary' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                  lobster.rarity === 'rare' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                  'bg-brand-secondary/20 border-brand-secondary/50 text-brand-secondary'
                }`}>
                  {lobster.rarity === 'legendary' ? '传说' : lobster.rarity === 'rare' ? '稀有' : '普通'}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm line-clamp-1">{lobster.name}</h3>
                  <span className="text-[10px] text-white/40 font-mono">{lobster.serialNumber}</span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-white/60">
                  <UserIcon className="w-3 h-3" />
                  <span className="truncate">卖家: {lobster.ownerId.slice(0, 8)}...</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <div className="text-brand-secondary font-bold text-sm">
                    {lobster.price} 虾币
                  </div>
                  <button 
                    onClick={() => onBuyLobster(lobster)}
                    className="px-4 py-2 bg-brand-secondary text-brand-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    购买
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>

      {/* Special Section: Clone Center */}
      <section className="bg-gradient-to-r from-brand-primary/20 to-purple-600/20 rounded-[40px] p-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-brand-secondary">
              <Copy className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">克隆中心</span>
            </div>
            <h2 className="text-3xl font-bold">快速复制顶级龙虾能力</h2>
            <p className="text-white/60">
              新手不知道怎么养？直接克隆大佬的龙虾！继承技能与成长路径，快速获得极致体感。
            </p>
            <button className="bg-white text-brand-dark px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              浏览可克隆龙虾
            </button>
          </div>
          <div className="w-full md:w-64 aspect-square bg-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-primary/10 animate-pulse" />
            <Zap className="w-20 h-20 text-brand-primary animate-bounce" />
          </div>
        </div>
      </section>
    </div>
  );
}
