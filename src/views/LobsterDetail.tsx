import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Heart, Battery, Star, Zap, Shield, Search, Plus, Settings, Sparkles, Package, ShoppingBag, Tag, AlertCircle, X, Trophy, Bot } from 'lucide-react';
import SkillIcon from '../components/SkillIcon';
import { Lobster, Skill, LobsterStage, InventoryItem, User } from '../types';
import EvolutionOverlay from '../components/EvolutionOverlay';
import ClawInteractionModal from '../components/ClawInteractionModal';
import { useNotification } from '../components/NotificationProvider';
import { MOCK_USER } from '../mockData';

interface LobsterDetailProps {
  lobster: Lobster;
  user: User | null;
  onUpdateUser: (user: User) => void;
  onUpdateLobster: (lobster: Lobster) => void;
  onBack: () => void;
}

const STAGES: LobsterStage[] = ['mini', 'small', 'large', 'super'];
const THRESHOLDS = {
  mini: 250,
  small: 600,
  large: 1000,
  super: 1000,
};

export default function LobsterDetail({ 
  lobster: initialLobster, 
  user,
  onUpdateUser,
  onUpdateLobster,
  onBack 
}: LobsterDetailProps) {
  const [lobster, setLobster] = useState(initialLobster);
  const [activeTab, setActiveTab] = useState<'status' | 'skills' | 'mcp'>('status');
  const [evolutionData, setEvolutionData] = useState<{ old: string; new: string } | null>(null);
  const [isFeeding, setIsFeeding] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [showClawModal, setShowClawModal] = useState(false);
  const [clawPrefill, setClawPrefill] = useState<string | undefined>(undefined);
  const [listingPrice, setListingPrice] = useState(lobster.price || 1000);
  const { showNotification } = useNotification();

  const handleListForSale = () => {
    const updatedLobster = {
      ...lobster,
      isForSale: true,
      price: listingPrice
    };
    setLobster(updatedLobster);
    onUpdateLobster(updatedLobster);
    showNotification('龙虾已成功上架集市！', 'success');
    setIsListing(false);
  };

  const handleCancelListing = () => {
    const updatedLobster = {
      ...lobster,
      isForSale: false
    };
    setLobster(updatedLobster);
    onUpdateLobster(updatedLobster);
    showNotification('龙虾已从集市下架。', 'info');
  };

  const getStagePerks = (stage: LobsterStage) => {
    switch (stage) {
      case 'mini': return ['基础属性', '新手保护'];
      case 'small': return ['解锁第1个技能槽', '成长速度 +10%'];
      case 'large': return ['解锁第2个技能槽', '开启繁殖能力', '体力上限 +20%'];
      case 'super': return ['解锁第3个技能槽', '开启克隆权限', '全属性大幅提升'];
      default: return [];
    }
  };

  const getMaxSkills = (stage: LobsterStage) => {
    switch (stage) {
      case 'mini': return 0;
      case 'small': return 1;
      case 'large': return 2;
      case 'super': return 3;
      default: return 0;
    }
  };

  const handleUseItem = (item: InventoryItem) => {
    if (!user || isFeeding || item.quantity <= 0) return;

    setIsFeeding(true);
    
    // Calculate new stats
    let newHealth = Math.min(lobster.health + (item.effect.health || 0), 100);
    let newEnergy = Math.min(lobster.energy + (item.effect.energy || 0), 100);
    let newGrowth = Math.min(lobster.growthValue + (item.effect.growth || 0), 1000);
    let newStage = lobster.stage;

    // Check for evolution
    const currentStageIndex = STAGES.indexOf(lobster.stage);
    const nextStage = STAGES[currentStageIndex + 1];
    
    if (nextStage && newGrowth >= THRESHOLDS[lobster.stage]) {
      newStage = nextStage;
      setEvolutionData({ old: lobster.stage, new: nextStage });
    }

    const updatedLobster = {
      ...lobster,
      health: newHealth,
      energy: newEnergy,
      growthValue: newGrowth,
      stage: newStage
    };

    // Update inventory
    const inventory = user.inventory || [];
    const newInventory = inventory.map(i => 
      i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
    ).filter(i => i.quantity > 0);

    const updatedUser = { ...user, inventory: newInventory };

    showNotification(`使用了 ${item.name}！`, 'success');
    
    setTimeout(() => {
      setLobster(updatedLobster);
      onUpdateLobster(updatedLobster);
      onUpdateUser(updatedUser);
      setIsFeeding(false);
    }, 600);
  };

  const handleHeal = () => {
    if (!user || isFeeding) return;
    if (lobster.health >= 100) {
      showNotification('龙虾非常健康，无需治疗。', 'info');
      return;
    }

    const medicines = user.inventory?.filter(i => i.type === 'medicine') || [];
    if (medicines.length === 0) {
      showNotification('背包中没有治疗药品，请前往商店购买。', 'error');
      return;
    }

    // Use the first medicine found
    handleUseItem(medicines[0]);
  };

  const handleTrain = () => {
    if (!user || isFeeding) return;
    if (lobster.energy < 20) {
      showNotification('能量不足，无法进行特训。请先喂食。', 'error');
      return;
    }

    setIsFeeding(true);
    const energyCost = 20;
    const growthGain = 30 + Math.floor(Math.random() * 20); // 30-50 growth

    let newEnergy = lobster.energy - energyCost;
    let newGrowth = Math.min(lobster.growthValue + growthGain, 1000);
    let newStage = lobster.stage;

    // Check for evolution
    const currentStageIndex = STAGES.indexOf(lobster.stage);
    const nextStage = STAGES[currentStageIndex + 1];
    
    if (nextStage && newGrowth >= THRESHOLDS[lobster.stage]) {
      newStage = nextStage;
      setEvolutionData({ old: lobster.stage, new: nextStage });
    }

    const updatedLobster = {
      ...lobster,
      energy: newEnergy,
      growthValue: newGrowth,
      stage: newStage
    };

    showNotification(`特训完成！成长值 +${growthGain}`, 'success');

    setTimeout(() => {
      setLobster(updatedLobster);
      onUpdateLobster(updatedLobster);
      setIsFeeding(false);
    }, 800);
  };

  const handleLevelUpSkill = (skillId: string) => {
    if (!user || isFeeding) return;
    
    const skill = lobster.skills.find(s => s.id === skillId);
    if (!skill) return;

    const levelUpCost = skill.level * 100; // Cost increases with level
    if (user.balance < levelUpCost) {
      showNotification(`余额不足，升级需要 ${levelUpCost} 虾币。`, 'error');
      return;
    }

    const updatedSkills = lobster.skills.map(s => 
      s.id === skillId ? { ...s, level: s.level + 1 } : s
    );

    const updatedLobster = {
      ...lobster,
      skills: updatedSkills
    };

    const updatedUser = {
      ...user,
      balance: user.balance - levelUpCost
    };

    setLobster(updatedLobster);
    onUpdateLobster(updatedLobster);
    onUpdateUser(updatedUser);
    showNotification(`${skill.name} 升级成功！当前等级: ${skill.level + 1}`, 'success');
  };

  const handleTestTool = (toolName: string) => {
    setClawPrefill(`我想测试一下我的 ${toolName} 工具，看看它能做什么。`);
    setShowClawModal(true);
  };

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {evolutionData && (
          <EvolutionOverlay
            lobsterName={lobster.name}
            oldStage={evolutionData.old}
            newStage={evolutionData.new}
            onComplete={() => setEvolutionData(null)}
          />
        )}
      </AnimatePresence>

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" /> 返回列表
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visuals & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            layoutId={`lobster-img-${lobster.id}`}
            className="relative aspect-square rounded-[40px] overflow-hidden glass-card p-4"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={lobster.stage}
                initial={{ filter: 'brightness(2) blur(10px)', opacity: 0 }}
                animate={{ filter: 'brightness(1) blur(0px)', opacity: 1 }}
                src={lobster.imageUrl} 
                alt={lobster.name}
                className="w-full h-full object-cover rounded-[32px] animate-float"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute top-8 right-8 flex flex-col items-end gap-3">
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border ${
                lobster.rarity === 'legendary' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                lobster.rarity === 'rare' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                'bg-brand-secondary/20 border-brand-secondary/50 text-brand-secondary'
              }`}>
                {lobster.rarity === 'legendary' ? '传说' :
                 lobster.rarity === 'rare' ? '稀有' : '普通'}
              </div>
              {lobster.isForSale && (
                <div className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">
                  集市出售中 · ¥{lobster.price}
                </div>
              )}
              <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 font-display font-bold text-xs">
                {lobster.serialNumber}
              </div>
            </div>
            
            {isFeeding && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Sparkles className="w-20 h-20 text-brand-primary" />
              </motion.div>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {/* Marketplace Management */}
            {user?.id === lobster.ownerId && (
              <div className="col-span-2 glass-card p-6 space-y-4 border-brand-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-primary" />
                    <h3 className="font-bold">集市管理</h3>
                  </div>
                  {lobster.isForSale && (
                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase tracking-widest">
                      正在出售
                    </span>
                  )}
                </div>

                {!lobster.isForSale ? (
                  isListing ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input 
                          type="number"
                          value={listingPrice}
                          onChange={(e) => setListingPrice(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-all text-sm"
                          placeholder="设置出售价格 (虾币)"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={handleListForSale}
                          className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20"
                        >
                          确认上架
                        </button>
                        <button 
                          onClick={() => setIsListing(false)}
                          className="px-6 py-3 bg-white/5 text-white/40 rounded-xl font-bold text-sm"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsListing(true)}
                      className="w-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/20 transition-all"
                    >
                      <Tag className="w-5 h-5" />
                      上架集市
                    </button>
                  )
                ) : (
                  <button 
                    onClick={handleCancelListing}
                    className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                  >
                    <X className="w-5 h-5" />
                    从集市下架
                  </button>
                )}
              </div>
            )}

            <div className="col-span-2 glass-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                <Package className="w-3 h-3" /> 可用道具
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {user?.inventory && user.inventory.length > 0 ? (
                  user.inventory.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleUseItem(item)}
                      disabled={isFeeding}
                      className="flex-shrink-0 group relative"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-brand-primary/50 transition-all">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-brand-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                        x{item.quantity}
                      </div>
                      {/* Tooltip-like effect info */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.name}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-[10px] text-white/20 italic py-2">背包空空如也</div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setShowClawModal(true)}
              className="col-span-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 group/claw hover:scale-[1.02] transition-all"
            >
              <Bot className="w-7 h-7 group-hover/claw:rotate-12 transition-transform" />
              <span>龙虾之爪 (openClaw)</span>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </button>

            <button 
              onClick={handleHeal}
              disabled={isFeeding}
              className="bg-white/10 text-white py-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <Heart className="w-6 h-6 text-red-500" />
              <span>治疗 (修复)</span>
            </button>
            <button 
              onClick={handleTrain}
              disabled={isFeeding}
              className="bg-white/10 text-white py-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <Star className="w-6 h-6 text-yellow-400" />
              <span>特训 (技能)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Details & Tabs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold mb-2 tracking-tight">{lobster.name}</h1>
              <div className="flex gap-3">
                <motion.span 
                  key={lobster.stage}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-brand-secondary/20 text-brand-secondary rounded-full text-xs font-bold uppercase"
                >
                  {lobster.stage} 阶段
                </motion.span>
                <span className="px-3 py-1 bg-white/5 text-white/50 rounded-full text-xs font-bold">
                  诞生于 {lobster.birthDate}
                </span>
              </div>
            </div>
            <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Custom Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-2xl w-fit">
            {(['status', 'skills', 'mcp'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab ? 'bg-brand-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {tab === 'status' ? '状态' : tab === 'skills' ? '技能' : 'MCP 工具'}
              </button>
            ))}
          </div>

          <div className="glass-card p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'status' && (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" /> 成长进度
                      </h3>
                      <span className="text-white/40 text-sm">{lobster.growthValue} / 1000 XP</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(lobster.growthValue / 1000) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-primary to-orange-400 rounded-full" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">当前健康度</span>
                        <span className="font-bold">{lobster.health}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${lobster.health}%` }}
                          className="h-full bg-red-500" 
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">当前能量值</span>
                        <span className="font-bold">{lobster.energy}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${lobster.energy}%` }}
                          className="h-full bg-green-500" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h4 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-widest flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-brand-secondary" /> 阶段特权
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {getStagePerks(lobster.stage).map((perk, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                          {perk}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h4 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-widest">进化路径</h4>
                    <div className="flex justify-between items-center">
                      {['Mini', 'Small', 'Large', 'Super'].map((s, i) => {
                        const isCurrent = lobster.stage.toLowerCase() === s.toLowerCase();
                        const isPast = STAGES.indexOf(lobster.stage) > STAGES.indexOf(s.toLowerCase() as LobsterStage);
                        return (
                          <React.Fragment key={s}>
                            <div className={`flex flex-col items-center gap-2 ${isCurrent ? 'text-brand-primary' : isPast ? 'text-brand-secondary' : 'text-white/20'}`}>
                              <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isCurrent ? 'bg-brand-primary scale-150 neon-glow' : isPast ? 'bg-brand-secondary' : 'bg-current'}`} />
                              <span className="text-[10px] font-bold uppercase">{s}</span>
                            </div>
                            {i < 3 && <div className={`h-[1px] flex-1 mx-2 transition-colors duration-500 ${isPast ? 'bg-brand-secondary/40' : 'bg-white/10'}`} />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">技能槽位 ({lobster.skills?.length || 0} / {getMaxSkills(lobster.stage)})</h3>
                    {(lobster.skills?.length || 0) >= getMaxSkills(lobster.stage) && (
                      <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded-full">已满</span>
                    )}
                  </div>

                  {lobster.skills?.map((skill) => (
                    <div key={skill.id} className="p-4 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-brand-secondary/30 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <SkillIcon icon={skill.icon} className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold">{skill.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-brand-secondary font-bold">LV.{skill.level}</span>
                            <button 
                              onClick={() => handleLevelUpSkill(skill.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 bg-brand-secondary/20 text-brand-secondary rounded-md hover:bg-brand-secondary/40 transition-all text-[10px] font-bold"
                            >
                              升级 ({skill.level * 100}币)
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-white/40">{skill.description}</p>
                      </div>
                    </div>
                  ))}
                  <button className="p-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:border-white/20 transition-all">
                    <Plus className="w-5 h-5" />
                    <span className="font-bold">学习新技能</span>
                  </button>
                </motion.div>
              )}

              {activeTab === 'mcp' && (
                <motion.div
                  key="mcp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">已安装工具</h3>
                    <span className="text-xs text-white/40">{lobster.mcpTools?.length || 0} / 4 已使用</span>
                  </div>

                  {(lobster.mcpTools?.length || 0) > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {lobster.mcpTools?.map((tool) => (
                        <div key={tool.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                              {tool.type === 'search' && <Search className="w-6 h-6" />}
                              {tool.type === 'code' && <Zap className="w-6 h-6" />}
                              {tool.type === 'data' && <Star className="w-6 h-6" />}
                              {tool.type === 'api' && <Plus className="w-6 h-6" />}
                            </div>
                            <div>
                              <h4 className="font-bold">{tool.name}</h4>
                              <p className="text-xs text-white/40">{tool.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleTestTool(tool.name)}
                              className="px-3 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg text-[10px] font-bold hover:bg-brand-primary/20 transition-all"
                            >
                              测试工具
                            </button>
                            <div className={`w-2 h-2 rounded-full ${tool.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{tool.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white/20" />
                      </div>
                      <div>
                        <h4 className="font-bold">尚未安装 MCP 工具</h4>
                        <p className="text-xs text-white/30 max-w-[200px]">安装工具以扩展龙虾的 AI 处理能力</p>
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-3xl border border-brand-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-primary">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h4 className="font-bold">能力扩展建议</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          根据该龙虾的“快速抓取”技能，建议安装 <span className="text-brand-primary font-bold">Real-time API</span> 插件，可提升 25% 的任务响应速度。
                        </p>
                        <button className="text-xs font-black text-brand-primary uppercase tracking-widest hover:underline">
                          前往商店选购 →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showClawModal && (
          <ClawInteractionModal
            lobster={lobster}
            user={user}
            prefillPrompt={clawPrefill}
            onClose={() => {
              setShowClawModal(false);
              setClawPrefill(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
