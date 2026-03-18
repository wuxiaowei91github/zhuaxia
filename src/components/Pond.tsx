import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lobster } from '../types';

interface PondProps {
  lobsters: Lobster[];
  onSelect: (lobster: Lobster) => void;
}

interface LobsterPosition {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export default function Pond({ lobsters, onSelect }: PondProps) {
  const [positions, setPositions] = useState<LobsterPosition[]>([]);

  useEffect(() => {
    // Initialize positions
    const initialPositions = lobsters.map(l => ({
      id: l.id,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 60 + 20, // 20% to 80%
      rotation: Math.random() * 360,
      scale: l.stage === 'mini' ? 0.6 : l.stage === 'small' ? 0.8 : l.stage === 'large' ? 1 : 1.2
    }));
    setPositions(initialPositions);

    // Update positions periodically
    const interval = setInterval(() => {
      setPositions(prev => prev.map(p => ({
        ...p,
        x: Math.max(5, Math.min(95, p.x + (Math.random() - 0.5) * 10)),
        y: Math.max(10, Math.min(90, p.y + (Math.random() - 0.5) * 10)),
        rotation: p.rotation + (Math.random() - 0.5) * 45
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [lobsters.length]);

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-blue-900/40 to-brand-dark/60 rounded-[40px] overflow-hidden border border-white/10 glass-card mb-8 group">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 400, x: Math.random() * 1000, opacity: 0 }}
            animate={{ 
              y: -100, 
              opacity: [0, 0.5, 0],
              x: `calc(${Math.random() * 100}% + ${Math.sin(i) * 50}px)`
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              delay: Math.random() * 10 
            }}
            className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
          />
        ))}
        
        {/* Seaweed */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end opacity-30">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="w-8 h-32 bg-green-500/40 rounded-t-full origin-bottom blur-md"
              style={{ height: 100 + Math.random() * 100 }}
            />
          ))}
        </div>
      </div>

      {/* Lobsters */}
      <AnimatePresence>
        {positions.map((pos) => {
          const lobster = lobsters.find(l => l.id === pos.id);
          if (!lobster) return null;

          return (
            <motion.div
              key={lobster.id}
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                x: `${pos.x}%`, 
                y: `${pos.y}%`, 
                rotate: pos.rotation,
                scale: pos.scale
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 50, 
                damping: 20,
                x: { duration: 3, ease: "easeInOut" },
                y: { duration: 3, ease: "easeInOut" },
                rotate: { duration: 3, ease: "easeInOut" }
              }}
              className="absolute -ml-12 -mt-12 cursor-pointer z-10"
              onClick={() => onSelect(lobster)}
            >
              <div className="relative group/lobster">
                <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-xl opacity-0 group-hover/lobster:opacity-100 transition-opacity" />
                <img 
                  src={lobster.imageUrl} 
                  alt={lobster.name}
                  className="w-24 h-24 object-cover rounded-full border-2 border-white/20 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/lobster:opacity-100 transition-opacity">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
                    {lobster.name}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">生态池运行中</span>
      </div>
    </div>
  );
}
