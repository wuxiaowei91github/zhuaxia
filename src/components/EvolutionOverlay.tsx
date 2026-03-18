import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Award, Star, ChevronRight, Flame, Shield, Cpu } from 'lucide-react';

interface EvolutionOverlayProps {
  lobsterName: string;
  oldStage: string;
  newStage: string;
  onComplete: () => void;
}

const STAGE_COLORS: Record<string, string> = {
  mini: 'from-blue-400 to-blue-600',
  small: 'from-emerald-400 to-emerald-600',
  large: 'from-purple-400 to-purple-600',
  super: 'from-orange-400 to-orange-600',
};

const STAGE_ICONS: Record<string, any> = {
  mini: Shield,
  small: Cpu,
  large: Zap,
  super: Flame,
};

export default function EvolutionOverlay({ lobsterName, oldStage, newStage, onComplete }: EvolutionOverlayProps) {
  const [phase, setPhase] = useState<'charging' | 'exploding' | 'revealing'>('charging');
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const chargingTimer = setTimeout(() => setPhase('exploding'), 2500);
    const explodingTimer = setTimeout(() => {
      setPhase('revealing');
      setTimeout(() => setShowText(true), 500);
    }, 3000);
    const completeTimer = setTimeout(onComplete, 8000);

    return () => {
      clearTimeout(chargingTimer);
      clearTimeout(explodingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const NewIcon = STAGE_ICONS[newStage] || Award;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-dark/95 backdrop-blur-2xl overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${STAGE_COLORS[newStage]} opacity-5`} />
      
      {/* Dynamic Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: '50%', 
              y: '50%', 
              scale: 0,
              opacity: 0 
            }}
            animate={phase === 'charging' ? {
              x: ['50%', `${50 + (Math.random() - 0.5) * 40}%`],
              y: ['50%', `${50 + (Math.random() - 0.5) * 40}%`],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            } : phase === 'exploding' ? {
              x: [`50%`, `${Math.random() * 100}%`],
              y: [`50%`, `${Math.random() * 100}%`],
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
            } : {
              y: [null, '-100%'],
              opacity: [0, 0.3, 0],
            }}
            transition={{ 
              duration: phase === 'charging' ? 1.5 : 2, 
              repeat: phase === 'charging' ? Infinity : 0,
              ease: "easeOut",
              delay: Math.random() * 0.5
            }}
            className={`absolute w-1 h-1 rounded-full bg-white`}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-lg px-6">
        <AnimatePresence mode="wait">
          {phase === 'charging' && (
            <motion.div
              key="charging"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0, filter: 'blur(40px)' }}
              className="space-y-8"
            >
              <div className="relative w-48 h-48 mx-auto">
                {/* Concentric Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1],
                      borderWidth: [2, 4, 2]
                    }}
                    transition={{ 
                      rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className={`absolute inset-${i * 4} border-2 border-dashed border-brand-primary/40 rounded-full`}
                  />
                ))}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      filter: ['brightness(1)', 'brightness(2)', 'brightness(1)']
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Zap className="w-16 h-16 text-brand-primary" />
                  </motion.div>
                </div>

                {/* Energy Orbs */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-primary rounded-full blur-sm" />
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-black italic tracking-tighter text-white">进化能量激聚</h2>
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-brand-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px]">
                {lobsterName} 正在跨越生命维度
              </p>
            </motion.div>
          )}

          {phase === 'revealing' && (
            <motion.div
              key="revealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="relative">
                {/* Background Glow */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.2 }}
                  className={`absolute inset-0 bg-gradient-to-br ${STAGE_COLORS[newStage]} rounded-full blur-3xl`}
                />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                  className={`w-48 h-48 bg-gradient-to-br ${STAGE_COLORS[newStage]} rounded-[48px] mx-auto flex items-center justify-center shadow-2xl relative z-10 border-4 border-white/20`}
                >
                  <NewIcon className="w-24 h-24 text-white drop-shadow-lg" />
                  
                  {/* Floating Sparkles */}
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.4,
                          ease: "easeInOut"
                        }}
                        className="absolute"
                        style={{ 
                          top: `${Math.random() * 100}%`, 
                          left: `${Math.random() * 100}%` 
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-white/60" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Radial Rays */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 0.2, height: 200 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    style={{ rotate: i * 30 }}
                    className={`absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-t from-white to-transparent -translate-x-1/2 origin-bottom`}
                  />
                ))}
              </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {showText && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/10">
                        <span className="text-brand-secondary font-black uppercase tracking-[0.4em] text-[10px]">生命阶梯跃迁成功</span>
                      </div>
                      
                      <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                        {newStage.toUpperCase()}
                      </h2>

                      <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-white/20 uppercase font-black mb-1">FROM</span>
                          <span className="text-sm font-bold text-white/40">{oldStage.toUpperCase()}</span>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ChevronRight className="w-6 h-6 text-brand-primary" />
                        </motion.div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-brand-primary uppercase font-black mb-1">TO</span>
                          <span className="text-sm font-bold text-white">{newStage.toUpperCase()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex justify-center gap-3"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.1, type: "spring" }}
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-current drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                onClick={onComplete}
                className="group relative bg-white text-brand-dark px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10">见证奇迹！</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Flash & Shockwave Effect */}
      <AnimatePresence>
        {phase === 'exploding' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-[150]"
            />
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 border-[100px] border-white rounded-full z-[151]"
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
