import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Zap, Sparkles, AlertCircle, Loader2, Bot, User as UserIcon, Target, CheckCircle } from 'lucide-react';
import { Lobster, User, Mission } from '../types';
import { clawService } from '../services/clawService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'standard' | 'advanced';
  timestamp: Date;
}

interface ClawInteractionModalProps {
  lobster: Lobster;
  user: User | null;
  mission?: Mission;
  onClose: () => void;
  onCompleteMission?: (success: boolean) => void;
  prefillPrompt?: string;
}

export default function ClawInteractionModal({ 
  lobster, 
  user, 
  mission, 
  onClose,
  onCompleteMission,
  prefillPrompt
}: ClawInteractionModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [missionSuccess, setMissionSuccess] = useState(false);

  useEffect(() => {
    const initialMessage = mission 
      ? `你好，主人！我是 ${lobster.name}。我已经准备好协助你完成任务：【${mission.title}】。请告诉我具体的需求。`
      : `你好，主人！我是 ${lobster.name} 的龙虾之爪 (openClaw)。今天有什么我可以帮你的吗？`;
    
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date(),
      }
    ]);
  }, [mission, lobster.name]);
  const [input, setInput] = useState(prefillPrompt || '');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      if (mission) {
        response = await clawService.performMission(
          lobster,
          mission,
          input,
          isAdvanced ? 'advanced' : 'standard'
        );
        if (response.success) {
          setMissionSuccess(true);
        }
      } else {
        response = await clawService.interact(
          lobster,
          input,
          isAdvanced ? 'advanced' : 'standard'
        );
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        mode: response.mode,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Claw interaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl h-[80vh] bg-brand-dark border border-white/10 rounded-[40px] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                {mission ? (
                  <span className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-secondary" />
                    任务模式: {mission.title}
                  </span>
                ) : (
                  <>
                    {lobster.name} 的龙虾之爪 <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded-full">openClaw</span>
                  </>
                )}
              </h3>
              <p className="text-xs text-white/40">
                {mission ? `难度: ${mission.difficulty}` : `当前模式: ${isAdvanced ? '高阶版 (Gemini 3.1 Pro)' : '普通版 (Gemini 3 Flash)'}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdvanced(!isAdvanced)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                isAdvanced 
                ? 'bg-brand-secondary text-brand-dark border-brand-secondary shadow-lg shadow-brand-secondary/20' 
                : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
              }`}
            >
              {isAdvanced ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              {isAdvanced ? '高阶版' : '普通版'}
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-brand-primary/20 text-brand-primary'
                }`}>
                  {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-brand-secondary text-brand-dark font-medium rounded-tr-none' 
                  : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                }`}>
                  {msg.content}
                  {msg.mode === 'advanced' && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                      <Sparkles className="w-3 h-3" /> 高阶版推理完成
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 items-center bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                <span className="text-xs text-white/40 font-bold italic">
                  {mission ? '龙虾正在执行任务指令...' : (isAdvanced ? '龙虾正在深度思考中...' : '龙虾正在快速响应...')}
                </span>
              </div>
            </motion.div>
          )}
          {missionSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center py-4"
            >
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[32px] text-center space-y-4 max-w-sm">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-emerald-400">任务阶段性成功！</h4>
                  <p className="text-xs text-white/60 mt-1">龙虾已出色完成指令，你可以选择继续对话或提交任务领取奖励。</p>
                </div>
                <button
                  onClick={() => onCompleteMission?.(true)}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                >
                  提交任务并领取奖励
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isAdvanced ? "请输入高阶指令，龙虾将进行深度推理..." : "和你的龙虾聊聊吧..."}
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all pr-16"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 p-3 rounded-xl transition-all ${
                input.trim() && !isLoading 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isAdvanced ? 'bg-brand-secondary' : 'bg-brand-primary'}`} />
              {isAdvanced ? '高级推理模式' : '基础对话模式'}
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              龙虾之爪由 Gemini AI 驱动
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
