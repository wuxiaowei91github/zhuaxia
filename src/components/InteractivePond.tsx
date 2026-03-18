import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ghost, Sparkles, Waves } from 'lucide-react';

const LOBSTERS_IN_POND = [
  { id: 1, color: 'text-brand-primary', size: 40, delay: 0 },
  { id: 2, color: 'text-brand-secondary', size: 30, delay: 2 },
  { id: 3, color: 'text-yellow-400', size: 35, delay: 4 },
  { id: 4, color: 'text-purple-400', size: 25, delay: 1 },
  { id: 5, color: 'text-emerald-400', size: 45, delay: 3 },
];

export default function InteractivePond() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePondClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples([...ripples, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div 
      className="glass-card h-[300px] relative overflow-hidden cursor-pointer group border-brand-primary/20 bg-gradient-to-b from-brand-primary/5 to-brand-dark/50"
      onClick={handlePondClick}
    >
      {/* Water Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20"
        />
      </div>

      <div className="absolute top-6 left-8 z-10">
        <h3 className="text-xl font-black flex items-center gap-2 text-white">
          <Waves className="w-5 h-5 text-brand-primary animate-pulse" /> 公共虾塘
        </h3>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">点击水面互动 · 看看谁在游泳</p>
      </div>

      {/* Swimming Lobsters */}
      {LOBSTERS_IN_POND.map((lobster) => (
        <motion.div
          key={lobster.id}
          initial={{ x: -100, y: Math.random() * 200 + 50 }}
          animate={{ 
            x: [ -100, 800 ],
            y: [ Math.random() * 200 + 50, Math.random() * 200 + 50, Math.random() * 200 + 50 ]
          }}
          transition={{ 
            duration: 15 + Math.random() * 10, 
            repeat: Infinity, 
            delay: lobster.delay,
            ease: "easeInOut"
          }}
          className={`absolute ${lobster.color} opacity-40 hover:opacity-100 transition-opacity`}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Ghost size={lobster.size} />
          </motion.div>
        </motion.div>
      ))}

      {/* Ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          style={{ left: ripple.x, top: ripple.y }}
          className="absolute w-10 h-10 border-2 border-brand-primary/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      ))}

      {/* Floating Sparkles */}
      <div className="absolute bottom-6 right-8">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <Sparkles className="w-3 h-3 text-brand-secondary" />
          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">当前有 5 只龙虾正在嬉戏</span>
        </div>
      </div>
    </div>
  );
}
