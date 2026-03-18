import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, CreditCard, Smartphone, CheckCircle2, Sparkles, Zap } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecharge: (amount: number) => void;
}

const RECHARGE_OPTIONS = [
  { amount: 100, price: 9.9, bonus: 0, label: '初入虾海' },
  { amount: 500, price: 45, bonus: 50, label: '小有积蓄', popular: true },
  { amount: 1000, price: 88, bonus: 150, label: '大户人家' },
  { amount: 5000, price: 398, bonus: 1000, label: '龙虾霸主' },
];

export default function RechargeModal({ isOpen, onClose, onRecharge }: RechargeModalProps) {
  const [selectedOption, setSelectedOption] = useState(RECHARGE_OPTIONS[1]);
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRecharge = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onRecharge(selectedOption.amount + selectedOption.bonus);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,99,33,0.4)]">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">充值成功！</h2>
              <p className="text-white/40">已为您存入 {selectedOption.amount + selectedOption.bonus} 虾币</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 text-brand-primary font-bold text-sm uppercase tracking-widest mb-2">
                  <Coins className="w-4 h-4" /> 贝壳充值
                </div>
                <h2 className="text-3xl font-display font-bold text-white">获取更多虾币</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {RECHARGE_OPTIONS.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => setSelectedOption(option)}
                    className={`relative p-4 rounded-2xl border transition-all text-left ${
                      selectedOption.amount === option.amount
                        ? 'bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {option.popular && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-brand-dark text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase tracking-tighter">
                        最受欢迎
                      </div>
                    )}
                    <div className="text-xs text-white/40 mb-1">{option.label}</div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xl font-black text-white">{option.amount}</span>
                      <span className="text-[10px] text-white/40 font-bold">虾币</span>
                    </div>
                    {option.bonus > 0 && (
                      <div className="text-[10px] text-brand-primary font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> 赠送 {option.bonus}
                      </div>
                    )}
                    <div className="mt-3 text-sm font-bold text-white/80">¥{option.price}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">支付方式</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('alipay')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      paymentMethod === 'alipay' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-xs font-bold">支付宝</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wechat')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      paymentMethod === 'wechat' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-xs font-bold">微信支付</span>
                  </button>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleRecharge}
                className="w-full bg-white text-brand-dark py-4 rounded-2xl font-black text-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                    <span>处理中...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>立即支付 ¥{selectedOption.price}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-white/20">
                点击支付即表示您同意 <span className="underline">《虚拟商品服务协议》</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
