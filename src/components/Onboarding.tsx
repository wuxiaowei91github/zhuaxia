import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, ShoppingBag, Users, ChevronRight, X, Heart, Award } from 'lucide-react';

const STEPS = [
  {
    title: "欢迎来到抓虾！",
    description: "这是全球首个数字龙虾进化社区。准备好开启你的养虾之旅了吗？",
    icon: Sparkles,
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
  },
  {
    title: "领养你的第一只龙虾",
    description: "在首页点击“立即领养”，选择你心仪的品种。每只龙虾都有独特的初始属性和潜力。",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    title: "喂养与进化",
    description: "定期喂食可以让你的龙虾成长。随着成长值提升，龙虾会经历多个进化阶段，解锁更酷炫的外观。",
    icon: Zap,
    color: "text-brand-secondary",
    bg: "bg-brand-secondary/10",
  },
  {
    title: "技能与集市",
    description: "在集市购买技能书，为你的龙虾装备强力技能。稀有技能能大幅提升龙虾在社区中的价值。",
    icon: ShoppingBag,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    title: "加入社区互动",
    description: "在公共虾塘与其他玩家的龙虾互动，在喊话区交流心得。这里有最热情的虾友！",
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  }
];

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-card max-w-md w-full p-8 relative overflow-hidden border-white/10"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              className="h-full bg-brand-primary"
            />
          </div>

          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-6 pt-4">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              className={`w-20 h-20 ${step.bg} ${step.color} rounded-[24px] flex items-center justify-center shadow-2xl`}
            >
              <step.icon className="w-10 h-10" />
            </motion.div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black tracking-tight">{step.title}</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentStep ? 'w-6 bg-brand-primary' : 'w-1.5 bg-white/10'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-primary/20 group"
            >
              {currentStep === STEPS.length - 1 ? '开启旅程' : '下一步'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {currentStep === 0 && (
              <button 
                onClick={handleClose}
                className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors"
              >
                跳过引导
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
