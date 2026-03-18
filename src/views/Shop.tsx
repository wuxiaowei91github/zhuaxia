import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, Heart, Battery, Zap, ArrowRight } from 'lucide-react';
import { ShopItem, User } from '../types';
import { MOCK_SHOP_ITEMS } from '../mockData';

interface ShopProps {
  user: User | null;
  onPurchase: (item: ShopItem) => void;
  onShowLogin: () => void;
}

export default function Shop({ user, onPurchase, onShowLogin }: ShopProps) {
  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">道具商城</h1>
          <p className="text-white/50">购买强力道具，加速龙虾进化</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest">当前余额</div>
          <div className="text-xl font-black text-brand-secondary">{user?.balance || 0} 虾币</div>
        </div>
      </header>

      {/* Featured Item */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer"
      >
        <img 
          src="https://images.unsplash.com/photo-1626131728300-4881744a4741?auto=format&fit=crop&w=1200&q=80" 
          alt="Featured" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/40 to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-md space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-xs font-black uppercase tracking-widest">本周特惠</span>
          </div>
          <h2 className="text-3xl font-bold">进化催化剂 (大)</h2>
          <p className="text-white/60 text-sm">瞬间增加 500 点成长值，让你的龙虾直接跨越成长期。限时 8 折优惠！</p>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black text-brand-secondary">800 虾币</div>
            <button className="px-6 py-2 bg-brand-primary rounded-xl font-bold text-sm hover:scale-105 transition-transform">
              立即抢购
            </button>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SHOP_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex gap-6 group"
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-white/40">
                    {item.type === 'food' ? '食物' : item.type === 'medicine' ? '药物' : item.type === 'evolution' ? '进化' : '加成'}
                  </div>
                </div>
                <p className="text-white/40 text-xs line-clamp-2">{item.description}</p>
                
                <div className="mt-3 flex gap-3">
                  {item.effect.health && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                      <Heart className="w-3 h-3" /> +{item.effect.health} 健康
                    </div>
                  )}
                  {item.effect.energy && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                      <Battery className="w-3 h-3" /> +{item.effect.energy} 能量
                    </div>
                  )}
                  {item.effect.growth && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-400">
                      <Star className="w-3 h-3" /> +{item.effect.growth} 成长
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-lg font-black text-brand-secondary">{item.price} 虾币</div>
                <button 
                  onClick={() => {
                    if (!user) onShowLogin();
                    else onPurchase(item);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-brand-primary rounded-xl text-xs font-bold transition-all flex items-center gap-2 group/btn"
                >
                  购买
                  <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bulk Packs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">超值礼包</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: '新手起航包', price: 299, items: '食物 x5, 药剂 x2', color: 'from-blue-500/20' },
            { name: '进化冲刺包', price: 999, items: '催化剂 x3, 能量水 x5', color: 'from-purple-500/20' },
            { name: '至尊养护包', price: 2499, items: '全套顶级道具 x10', color: 'from-yellow-500/20' },
          ].map((pack, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${pack.color} to-white/5 border border-white/10 space-y-4 cursor-pointer`}
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white/60" />
              </div>
              <div>
                <h3 className="font-bold">{pack.name}</h3>
                <p className="text-[10px] text-white/40 mt-1">{pack.items}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="font-black text-brand-secondary">{pack.price} 虾币</div>
                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
