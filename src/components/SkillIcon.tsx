import React from 'react';
import { Zap, Shield, Search, Star, Heart, Battery, Sparkles, Target, Wand2, Cpu, Droplets, Flame } from 'lucide-react';

interface SkillIconProps {
  icon: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Search,
  Star,
  Heart,
  Battery,
  Sparkles,
  Target,
  Wand2,
  Cpu,
  Droplets,
  Flame,
};

export default function SkillIcon({ icon, className = "w-5 h-5" }: SkillIconProps) {
  const IconComponent = iconMap[icon] || Star;
  return <IconComponent className={className} />;
}
