import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Droplets, Cpu, Sparkles, CheckCircle2, ArrowRight, Settings, Coins, Waves, Box, Wand2, Target, Zap, Shield, Heart, Share2, Users } from 'lucide-react';
import ShareCard from './ShareCard';

interface AdoptionFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onAdopt: (name: string, type: 'fire' | 'water' | 'tech', rarity: string, serialNumber: string, method: string, price: number) => void;
  onShareToCommunity: (lobster: any) => void;
  totalLobsters: number;
  userBalance: number;
}

const ADOPTION_METHODS = [
  {
    id: 'public',
    name: '公共虾塘',
    price: 0,
    description: '轻松领养，适合新手。',
    icon: Waves,
    rarityRates: '普通 90% | 稀有 9% | 传说 1%',
    badge: '轻松 / 免费感',
    color: 'text-blue-400',
    theme: 'bg-blue-500/5 border-blue-500/20'
  },
  {
    id: 'blindbox',
    name: '至尊盲盒',
    price: 49,
    description: '心跳开奖，惊喜连连。',
    icon: Box,
    rarityRates: '普通 60% | 稀有 30% | 传说 10%',
    badge: '刺激 / 惊喜',
    color: 'text-purple-400',
    theme: 'bg-purple-500/5 border-purple-500/20'
  },
  {
    id: 'custom',
    name: '私人定制',
    price: 299,
    description: '尊贵身份，独一无二。',
    icon: Wand2,
    rarityRates: '100% 稀有及以上',
    badge: '尊贵 / 唯一',
    color: 'text-yellow-400',
    theme: 'bg-yellow-500/5 border-yellow-500/20'
  }
];

const STARTER_TYPES = [
  {
    id: 'fire',
    name: '烈焰螯',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'shadow-orange-500/20',
    description: '性格火爆，成长速度极快。',
    image: 'https://picsum.photos/seed/fire-lobster/400/400'
  },
  {
    id: 'water',
    name: '碧波螯',
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/20',
    description: '温和沉稳，生命值回复能力强。',
    image: 'https://picsum.photos/seed/water-lobster/400/400'
  },
  {
    id: 'tech',
    name: '极客螯',
    icon: Cpu,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'shadow-cyan-500/20',
    description: '高智商，擅长学习各种复杂技能。',
    image: 'https://picsum.photos/seed/tech-lobster/400/400'
  }
];

export default function AdoptionFlow({ isOpen, onClose, onAdopt, onShareToCommunity, totalLobsters, userBalance }: AdoptionFlowProps) {
  const [step, setStep] = useState(0); // 0: Method, 1: Interaction, 2: Result
  const [selectedMethod, setSelectedMethod] = useState<typeof ADOPTION_METHODS[0] | null>(null);
  const [selectedType, setSelectedType] = useState<typeof STARTER_TYPES[0] | null>(null);
  const [name, setName] = useState('');
  const [isHatching, setIsHatching] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [revealedData, setRevealedData] = useState<{ rarity: string; serialNumber: string } | null>(null);
  const [rollingRarity, setRollingRarity] = useState('common');
  
  // Customization states
  const [customStats, setCustomStats] = useState({ power: 50, speed: 50, luck: 50 });
  const [customSerial, setCustomSerial] = useState('');
  const [customAppearance, setCustomAppearance] = useState({ color: '#FF6321', size: 'medium', texture: 'smooth' });
  const [pondSearch, setPondSearch] = useState('');
  const [isBoxVibrating, setIsBoxVibrating] = useState(false);
  const [boxTier, setBoxTier] = useState<'common' | 'advanced' | 'legendary'>('common');

  const generateSerialNumber = (methodId: string) => {
    if (methodId === 'custom' && customSerial) {
      return `LX-CUSTOM-${customSerial.toUpperCase()}`;
    }

    const nextSerial = totalLobsters + 1;
    let serialStr = nextSerial.toString().padStart(6, '0');
    
    if (methodId === 'blindbox') {
      const rand = Math.random();
      if (rand > 0.9) {
        const specials = ['888888', '666666', '123456', '000001', '999999'];
        serialStr = specials[Math.floor(Math.random() * specials.length)];
      }
    }
    
    return `ZX-SEA-2026-${serialStr}`;
  };

  const calculatePrice = () => {
    if (!selectedMethod) return 0;
    if (selectedMethod.id === 'blindbox') {
      const tierPrices = { common: 9.9, advanced: 29.9, legendary: 99 };
      return tierPrices[boxTier];
    }
    if (selectedMethod.id === 'custom') {
      let base = 299;
      if (customSerial.length >= 3) base += 199;
      return base;
    }
    return selectedMethod.price;
  };

  const startHatching = (type: typeof STARTER_TYPES[0]) => {
    const finalPrice = calculatePrice();
    if (userBalance < finalPrice) {
      alert('余额不足，请先充值贝壳！');
      return;
    }

    setSelectedType(type);
    
    if (selectedMethod?.id === 'blindbox') {
      setIsBoxVibrating(true);
      setTimeout(() => {
        setIsBoxVibrating(false);
        setIsHatching(true);
        executeHatching(type);
      }, 1000);
    } else {
      setIsHatching(true);
      executeHatching(type);
    }
  };

  const executeHatching = (type: typeof STARTER_TYPES[0]) => {
    const serialNumber = generateSerialNumber(selectedMethod!.id);
    const rand = Math.random();
    let rarity = 'common';
    
    if (selectedMethod?.id === 'public') {
      if (rand > 0.99) rarity = 'legendary';
      else if (rand > 0.90) rarity = 'rare';
    } else if (selectedMethod?.id === 'blindbox') {
      // Probability based on box tier
      const tierMultipliers = { common: 1, advanced: 2, legendary: 5 };
      const m = tierMultipliers[boxTier];
      if (rand > 1 - (0.1 * m)) rarity = 'legendary';
      else if (rand > 1 - (0.4 * m)) rarity = 'rare';
    } else {
      rarity = rand > 0.5 ? 'legendary' : 'rare';
    }

    const rarities = ['common', 'rare', 'legendary'];
    let count = 0;
    const interval = setInterval(() => {
      setRollingRarity(rarities[count % rarities.length]);
      count++;
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setRevealedData({ rarity, serialNumber });
      setIsHatching(false);
      setStep(2);
    }, 3500);
  };

  const handleMethodSelect = (method: typeof ADOPTION_METHODS[0]) => {
    if (userBalance < method.price) {
      alert('余额不足，请先充值贝壳！');
      return;
    }
    setSelectedMethod(method);
    setStep(1);
  };

  const reset = () => {
    setStep(0);
    setSelectedMethod(null);
    setSelectedType(null);
    setName('');
    setIsHatching(false);
    setRevealedData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {isHatching ? (
              <motion.div
                key="hatching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="relative w-64 h-64 mb-12">
                  {selectedMethod?.id === 'public' ? (
                    /* Public Pond Catching Animation */
                    <div className="relative w-full h-full flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
                      />
                      
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="relative z-10"
                      >
                        <div className="relative">
                          <Waves className="w-32 h-32 text-blue-400 animate-pulse" />
                          <motion.div
                            animate={{ 
                              y: [-20, 20, -20],
                              x: [-10, 10, -10]
                            }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          >
                            <Target className="w-16 h-16 text-white/40" />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Water Splashes */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            y: [0, -100],
                            x: [(Math.random() - 0.5) * 100],
                            opacity: [1, 0],
                            scale: [1, 0]
                          }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                          className="absolute bottom-1/4 bg-blue-400/40 w-2 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  ) : (
                    /* Standard Hatching Animation (Blind Box / Custom) */
                    <>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 360],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className={`absolute inset-0 rounded-full blur-3xl ${
                          rollingRarity === 'legendary' ? 'bg-yellow-500/40' :
                          rollingRarity === 'rare' ? 'bg-purple-500/40' :
                          'bg-brand-primary/40'
                        }`}
                      />
                      
                      <motion.div
                        animate={{ 
                          y: [0, -20, 0],
                          rotate: [-5, 5, -5],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 0.4 }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                      >
                        <div className="w-40 h-52 bg-gradient-to-b from-white/20 to-white/5 border-2 border-white/20 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] relative overflow-hidden shadow-2xl backdrop-blur-sm">
                          <motion.div 
                            animate={{ 
                              opacity: [0.2, 0.5, 0.2],
                              y: ['100%', '-100%']
                            }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className={`absolute inset-0 bg-gradient-to-t ${
                              rollingRarity === 'legendary' ? 'from-yellow-500/50' :
                              rollingRarity === 'rare' ? 'from-purple-500/50' :
                              'from-brand-primary/50'
                            } to-transparent`}
                          />
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              key={rollingRarity}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`text-4xl font-black uppercase tracking-tighter ${
                                rollingRarity === 'legendary' ? 'text-yellow-400' :
                                rollingRarity === 'rare' ? 'text-purple-400' :
                                'text-white/40'
                              }`}
                            >
                              {rollingRarity === 'legendary' ? '传说' :
                               rollingRarity === 'rare' ? '稀有' : '普通'}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              x: [0, (Math.random() - 0.5) * 200],
                              y: [0, (Math.random() - 0.5) * 200],
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                            className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
                              rollingRarity === 'legendary' ? 'bg-yellow-400' :
                              rollingRarity === 'rare' ? 'bg-purple-400' :
                              'bg-brand-primary'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-display font-black tracking-tighter italic">
                    {selectedMethod?.id === 'public' ? '正在努力抓取中...' : '正在抽取稀有度...'}
                  </h2>
                  {selectedMethod?.id !== 'public' && (
                    <div className="flex justify-center gap-2">
                      {['普通', '稀有', '传说'].map((r, i) => (
                        <div 
                          key={r}
                          className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                            (rollingRarity === 'common' && i === 0) ||
                            (rollingRarity === 'rare' && i === 1) ||
                            (rollingRarity === 'legendary' && i === 2)
                              ? 'bg-white text-brand-dark border-white scale-110 shadow-lg'
                              : 'bg-white/5 text-white/20 border-white/5'
                          }`}
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : step === 0 ? (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-brand-primary font-bold text-sm uppercase tracking-widest block">领养中心</span>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-bold">{userBalance}</span>
                    </div>
                  </div>
                  <h2 className="text-4xl font-display font-bold">选择领养方式</h2>
                </div>

                <div className="space-y-4 mb-8">
                  {ADOPTION_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method)}
                      className={`w-full relative p-6 rounded-2xl border transition-all text-left group ${
                        selectedMethod?.id === method.id
                          ? 'bg-white/10 border-brand-primary ring-2 ring-brand-primary/50'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                          <method.icon className={`w-8 h-8 ${method.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xl font-bold">{method.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-400 font-mono font-bold">
                              <Coins className="w-4 h-4" />
                              {method.price}
                            </div>
                          </div>
                          <p className="text-xs text-white/40 leading-relaxed mb-3">{method.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10 text-white/60">
                              {method.rarityRates}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                              method.id === 'custom' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                              method.id === 'blindbox' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                              'bg-blue-500/20 border-blue-500/50 text-blue-400'
                            }`}>
                              {method.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                {/* Public Pond Interaction */}
                {selectedMethod?.id === 'public' && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-4xl font-display font-bold text-blue-400">公共虾塘</h2>
                      <p className="text-white/40">像逛池塘捞鱼一样，轻松领养你的伙伴</p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          placeholder="搜索编号 (如 000123)..."
                          value={pondSearch}
                          onChange={(e) => setPondSearch(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
                        刷新水域
                      </button>
                    </div>
                    
                    <div className="relative aspect-video bg-blue-500/10 rounded-3xl border border-blue-500/20 overflow-hidden group cursor-crosshair">
                      {/* Water Ripples */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
                      <motion.div 
                        animate={{ 
                          backgroundPosition: ['0% 0%', '100% 100%'],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/water.png')] bg-repeat"
                      />
                      
                      {/* Floating Silhouettes */}
                      {[...Array(10)].map((_, i) => (
                        <motion.button
                          key={i}
                          onClick={() => startHatching(STARTER_TYPES[Math.floor(Math.random() * 3)])}
                          animate={{ 
                            x: [Math.random() * 500, Math.random() * 500],
                            y: [Math.random() * 250, Math.random() * 250],
                            rotate: [0, 360],
                            scale: [0.8, 1.1, 0.8]
                          }}
                          transition={{ 
                            duration: 15 + Math.random() * 10, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="absolute p-4 text-blue-400/20 hover:text-blue-400 hover:scale-150 transition-all group/lobster"
                        >
                          <div className="relative">
                            <Droplets className="w-10 h-10 blur-[1px] group-hover/lobster:blur-0" />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/lobster:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-mono bg-blue-500 text-white px-2 py-0.5 rounded">
                              LX-{Math.floor(Math.random() * 999999).toString().padStart(6, '0')}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                      
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/10 backdrop-blur-[1px]">
                        <div className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl">
                          <Target className="w-5 h-5" /> 点击水面捕捉
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-white/20 uppercase tracking-widest font-bold">
                      <span>当前水域龙虾: 1,248 只</span>
                      <span className="flex items-center gap-1 text-blue-400/60">
                        <Sparkles className="w-3 h-3" /> 发现 1 只闪光龙虾
                      </span>
                    </div>

                    <button onClick={() => setStep(0)} className="w-full py-4 text-white/40 font-bold hover:text-white transition-colors">
                      返回重选
                    </button>
                  </div>
                )}

                {/* Blind Box Interaction */}
                {selectedMethod?.id === 'blindbox' && (
                  <div className="space-y-10 py-4">
                    <div className="text-center space-y-2">
                      <h2 className="text-4xl font-display font-bold text-purple-400">至尊盲盒</h2>
                      <p className="text-white/40">心跳开奖，不确定性带来的极致惊喜</p>
                    </div>

                    <div className="flex justify-center gap-4">
                      {(['common', 'advanced', 'legendary'] as const).map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setBoxTier(tier)}
                          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                            boxTier === tier 
                              ? 'bg-purple-500 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-purple-500/50'
                          }`}
                        >
                          {tier === 'common' ? '普通' : tier === 'advanced' ? '高级' : '传说'}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <motion.button
                        onClick={() => startHatching(STARTER_TYPES[Math.floor(Math.random() * 3)])}
                        animate={isBoxVibrating ? {
                          x: [-2, 2, -2, 2, 0],
                          rotate: [-1, 1, -1, 1, 0]
                        } : {}}
                        transition={{ repeat: isBoxVibrating ? Infinity : 0, duration: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-64 h-64 group"
                      >
                        <div className={`absolute inset-0 blur-3xl rounded-full transition-colors duration-500 ${
                          boxTier === 'legendary' ? 'bg-yellow-500/30' : 'bg-purple-500/20'
                        }`} />
                        
                        <div className={`relative z-10 w-full h-full bg-gradient-to-br transition-all duration-500 ${
                          boxTier === 'legendary' ? 'from-yellow-500 to-orange-600' :
                          boxTier === 'advanced' ? 'from-purple-500 to-indigo-600' :
                          'from-brand-primary to-brand-dark'
                        } rounded-[48px] flex items-center justify-center shadow-2xl border-4 border-white/20 overflow-hidden`}>
                          <Box className="w-32 h-32 text-white drop-shadow-2xl animate-pulse" />
                          
                          {/* Inner Glow */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest text-white border border-white/20">
                            点击开启
                          </div>
                        </div>
                        
                        {/* Floating Sparkles */}
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              y: [0, -40, 0], 
                              opacity: [0, 1, 0],
                              scale: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                            className="absolute"
                            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                          >
                            <Sparkles className={`w-4 h-4 ${boxTier === 'legendary' ? 'text-yellow-400' : 'text-purple-400'}`} />
                          </motion.div>
                        ))}
                      </motion.button>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold">
                          {boxTier === 'common' ? '9.9' : boxTier === 'advanced' ? '29.9' : '99'} 虾币 / 次
                        </span>
                      </div>
                    </div>

                    <button onClick={() => setStep(0)} className="w-full py-4 text-white/40 font-bold hover:text-white transition-colors">
                      返回重选
                    </button>
                  </div>
                )}

                {/* Custom Interaction */}
                {selectedMethod?.id === 'custom' && (
                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                      <h2 className="text-4xl font-display font-bold text-yellow-500">私人定制</h2>
                      <p className="text-white/40">尊贵身份，打造独一无二的数字资产</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6 bg-black/40 p-8 rounded-[32px] border border-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.05)]">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/60 flex items-center gap-2">
                            <Settings className="w-3 h-3" /> 基因参数定制
                          </label>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-white/60">外观颜色</span>
                              <div className="flex gap-2">
                                {['#FF6321', '#3B82F6', '#10B981', '#F59E0B'].map(c => (
                                  <button 
                                    key={c}
                                    onClick={() => setCustomAppearance({...customAppearance, color: c})}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${customAppearance.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-white/60">体型大小</span>
                              <div className="flex bg-white/5 rounded-lg p-1">
                                {['small', 'medium', 'large'].map(s => (
                                  <button 
                                    key={s}
                                    onClick={() => setCustomAppearance({...customAppearance, size: s})}
                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${customAppearance.size === s ? 'bg-yellow-500 text-black' : 'text-white/40'}`}
                                  >
                                    {s === 'small' ? '精悍' : s === 'medium' ? '标准' : '巨型'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/60 flex items-center gap-2">
                              <Target className="w-3 h-3" /> 自定义编号
                            </label>
                            {customSerial.length >= 3 && (
                              <span className="text-[10px] text-yellow-500 font-bold">🔥 靓号加价 ¥199</span>
                            )}
                          </div>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-mono text-xs">LX-CUSTOM-</div>
                            <input 
                              type="text" 
                              maxLength={6}
                              placeholder="输入 3-6 位数字..."
                              value={customSerial}
                              onChange={(e) => setCustomSerial(e.target.value.replace(/\D/g, ''))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-24 pr-4 py-3 text-sm font-mono text-yellow-500 focus:outline-none focus:border-yellow-500 transition-colors"
                            />
                          </div>
                          <p className="text-[10px] text-white/20">编号一旦生成，将永久上链，不可更改</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
                          <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-500/20">
                              <Wand2 className="w-16 h-16 text-yellow-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">实时预览</h3>
                            <div className="text-[10px] font-mono text-yellow-500/60 mb-4">
                              LX-CUSTOM-{customSerial.padStart(6, 'X')}
                            </div>
                            <div className="grid grid-cols-3 gap-2 w-full">
                              {STARTER_TYPES.map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => startHatching(type)}
                                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500 transition-all flex flex-col items-center gap-2 group/type"
                                >
                                  <type.icon className={`w-5 h-5 ${type.color}`} />
                                  <span className="text-[8px] font-black uppercase tracking-tighter text-white/40 group-hover/type:text-white">{type.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3">
                          <Shield className="w-5 h-5 text-yellow-500" />
                          <div className="text-[10px] text-yellow-500/80 leading-tight">
                            定制龙虾将获得专属“资产证书”，并自动开启“传说级”成长潜力。
                          </div>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setStep(0)} className="w-full py-4 text-white/40 font-bold hover:text-white transition-colors">
                      返回重选
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-4"
              >
                <div className="relative mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute -inset-12 blur-3xl rounded-full opacity-30 ${
                      revealedData?.rarity === 'legendary' ? 'bg-yellow-500' :
                      revealedData?.rarity === 'rare' ? 'bg-purple-500' :
                      'bg-brand-primary'
                    }`} 
                  />
                  <img 
                    src={selectedType?.image} 
                    alt="New Lobster" 
                    className={`w-48 h-48 rounded-[32px] border-4 relative z-10 object-cover shadow-2xl ${
                      revealedData?.rarity === 'legendary' ? 'border-yellow-400' :
                      revealedData?.rarity === 'rare' ? 'border-purple-400' :
                      'border-brand-primary'
                    }`}
                  />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className={`absolute -bottom-4 -right-4 p-3 rounded-2xl shadow-xl z-20 ${
                      revealedData?.rarity === 'legendary' ? 'bg-yellow-400 text-brand-dark' :
                      revealedData?.rarity === 'rare' ? 'bg-purple-400 text-white' :
                      'bg-brand-primary text-white'
                    }`}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                  
                  {/* Share Button Overlay */}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    onClick={() => setIsShareOpen(true)}
                    className="absolute -top-4 -right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 z-20 group transition-all"
                  >
                    <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </motion.button>
                </div>

                <div className="space-y-1 mb-6">
                  <h2 className={`text-4xl font-display font-black italic tracking-tighter ${
                    revealedData?.rarity === 'legendary' ? 'text-yellow-400' :
                    revealedData?.rarity === 'rare' ? 'text-purple-400' :
                    'text-white'
                  }`}>
                    {selectedMethod?.id === 'blindbox' ? '✨ 恭喜爆出！' : 
                     selectedMethod?.id === 'custom' ? '👑 专属资产生成' : '🎉 领养成功'}
                  </h2>
                  {selectedMethod?.id === 'blindbox' && revealedData?.rarity === 'legendary' && (
                    <p className="text-yellow-400 font-bold text-xs animate-pulse">🔥 发现传说级靓号！</p>
                  )}
                </div>
                
                <div className="space-y-4 mb-8 w-full max-w-sm">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20">为它取个响亮的名字</label>
                    <input
                      autoFocus
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="输入昵称..."
                      className="w-full bg-white/5 border-b-2 border-white/10 text-center text-3xl font-black text-white focus:outline-none focus:border-brand-primary placeholder:text-white/10 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                    <div className="text-[10px] text-white/40 uppercase font-bold mb-1">资产编号</div>
                    <div className="text-xs font-mono font-bold text-white">{revealedData?.serialNumber}</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                    <div className="text-[10px] text-white/40 uppercase font-bold mb-1">
                      {selectedMethod?.id === 'blindbox' ? '市场估值' : '稀有度'}
                    </div>
                    <div className={`text-lg font-black ${
                      revealedData?.rarity === 'legendary' ? 'text-yellow-400' :
                      revealedData?.rarity === 'rare' ? 'text-purple-400' :
                      'text-brand-secondary'
                    }`}>
                      {selectedMethod?.id === 'blindbox' ? (
                        `¥${revealedData?.rarity === 'legendary' ? '8,888' : revealedData?.rarity === 'rare' ? '888' : '88'}`
                      ) : (
                        revealedData?.rarity === 'legendary' ? '传说' :
                        revealedData?.rarity === 'rare' ? '稀有' : '普通'
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        onClose();
                        reset();
                      }}
                      className="flex-1 bg-white/5 text-white/60 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                    >
                      稍后再说
                    </button>
                    <button
                      disabled={!name}
                      onClick={() => {
                        const finalPrice = calculatePrice();
                        onAdopt(name, selectedType!.id as any, revealedData!.rarity, revealedData!.serialNumber, selectedMethod!.id, finalPrice);
                        onClose();
                        reset();
                      }}
                      className={`flex-[2] py-4 rounded-xl font-black text-lg shadow-xl transition-all ${
                        selectedMethod?.id === 'custom' ? 'bg-yellow-500 text-black hover:bg-yellow-400' :
                        selectedMethod?.id === 'blindbox' ? 'bg-purple-600 text-white hover:bg-purple-500' :
                        'bg-brand-primary text-white hover:bg-brand-primary/90'
                      }`}
                    >
                      {selectedMethod?.id === 'custom' ? '生成资产证书' : '收入我的虾塘'}
                    </button>
                  </div>
                  
                  {revealedData?.rarity !== 'common' && (
                    <button
                      onClick={() => {
                        const finalPrice = calculatePrice();
                        const lobster = {
                          name: name || '未命名龙虾',
                          rarity: revealedData!.rarity,
                          serialNumber: revealedData!.serialNumber,
                          imageUrl: selectedType!.image,
                        };
                        onAdopt(name, selectedType!.id as any, revealedData!.rarity, revealedData!.serialNumber, selectedMethod!.id, finalPrice);
                        onShareToCommunity(lobster);
                        onClose();
                        reset();
                      }}
                      className="w-full bg-brand-secondary/20 text-brand-secondary py-4 rounded-xl font-black text-lg hover:bg-brand-secondary/30 transition-all border border-brand-secondary/20 flex items-center justify-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      分享到社区
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ShareCard 
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            lobster={{
              name: name || '未命名龙虾',
              rarity: revealedData?.rarity || 'common',
              serialNumber: revealedData?.serialNumber || 'LX-000000',
              image: selectedType?.image || '',
              type: selectedType?.name || '',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
