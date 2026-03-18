import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ghost, LogIn, Mail, Lock, User, ArrowRight, Sparkles, Timer, ShoppingBag, Users, X, Gift } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, handleFirestoreError, OperationType } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onClose?: () => void;
}

export default function Login({ onLoginSuccess, onClose }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateReferralCode = (uid: string) => {
    return uid.substring(0, 6).toUpperCase();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const path = `users/${user.uid}`;
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', user.uid));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
        return;
      }

      if (!userDoc.exists()) {
        const isAdminEmail = user.email === 'wuxiaowei91@gmail.com';
        const userData: any = {
          username: user.displayName || '新用户',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          balance: 1000,
          role: isAdminEmail ? 'admin' : 'user',
          referralCode: generateReferralCode(user.uid),
          inventory: []
        };

        try {
          await setDoc(doc(db, 'users', user.uid), userData);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
          return;
        }
        onLoginSuccess({ id: user.uid, ...userData });
      } else {
        onLoginSuccess({ id: user.uid, ...userDoc.data() });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message && err.message.startsWith('{')) {
        setError('登录失败：权限不足或配置错误。');
      } else {
        // Map common Firebase errors to friendly messages
        const errorCode = err.code;
        switch (errorCode) {
          case 'auth/user-not-found':
            setError('该邮箱尚未注册，请先注册。');
            break;
          case 'auth/wrong-password':
            setError('密码错误，请重试。');
            break;
          case 'auth/invalid-email':
            setError('无效的邮箱地址。');
            break;
          case 'auth/email-already-in-use':
            setError('该邮箱已被注册，请直接登录。');
            break;
          case 'auth/popup-closed-by-user':
            setError('登录窗口已关闭。');
            break;
          case 'auth/unauthorized-domain':
            setError('当前域名未获授权，请联系管理员。');
            break;
          default:
            setError(err.message || '登录过程中发生错误，请稍后再试。');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await updateProfile(user, { displayName: username });
        
        const isAdminEmail = email === 'wuxiaowei91@gmail.com';
        const userData: any = {
          username: username || '新用户',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          balance: 1000,
          role: isAdminEmail ? 'admin' : 'user',
          referralCode: generateReferralCode(user.uid),
          inventory: []
        };

        // Check referral code
        if (referralCode) {
          const q = query(collection(db, 'users'), where('referralCode', '==', referralCode.toUpperCase()));
          try {
            const referrerSnap = await getDocs(q);
            if (!referrerSnap.empty) {
              const referrerDoc = referrerSnap.docs[0];
              const referrerData = referrerDoc.data();
              // Reward referrer
              await setDoc(doc(db, 'users', referrerDoc.id), {
                ...referrerData,
                balance: (referrerData.balance || 0) + 500
              });
              userData.referredBy = referrerDoc.id;
              userData.balance += 200; // Bonus for new user
            }
          } catch (err) {
            console.warn('Referral check failed:', err);
            // Don't block registration for referral failure
          }
        }

        const path = `users/${user.uid}`;
        try {
          await setDoc(doc(db, 'users', user.uid), userData);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
          return;
        }
        onLoginSuccess({ id: user.uid, ...userData });
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const path = `users/${user.uid}`;
        let userDoc;
        try {
          userDoc = await getDoc(doc(db, 'users', user.uid));
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, path);
          return;
        }

        if (userDoc.exists()) {
          onLoginSuccess({ id: user.uid, ...userDoc.data() });
        } else {
          // Fallback if doc doesn't exist for some reason
          const userData = {
            username: user.displayName || '用户',
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            balance: 1000,
            role: 'user'
          };
          try {
            await setDoc(doc(db, 'users', user.uid), userData);
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, path);
            return;
          }
          onLoginSuccess({ id: user.uid, ...userData });
        }
      }
    } catch (err: any) {
      console.error('Email auth error:', err);
      if (err.message && err.message.startsWith('{')) {
        setError('操作失败：权限不足或配置错误。');
      } else {
        // Map common Firebase errors to friendly messages
        const errorCode = err.code;
        switch (errorCode) {
          case 'auth/user-not-found':
            setError('该邮箱尚未注册，请先注册。');
            break;
          case 'auth/wrong-password':
            setError('密码错误，请重试。');
            break;
          case 'auth/invalid-email':
            setError('无效的邮箱地址。');
            break;
          case 'auth/email-already-in-use':
            setError('该邮箱已被注册，请直接登录。');
            break;
          case 'auth/weak-password':
            setError('密码强度不足，请设置更复杂的密码。');
            break;
          default:
            setError(err.message || '操作过程中发生错误，请稍后再试。');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/90 backdrop-blur-xl p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
      >
        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <LogIn className="w-5 h-5 rotate-180" />
          </button>
        )}

        {/* Left Side: Benefits (Marketing) */}
        <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border-r border-white/5 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Ghost className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-black tracking-tighter leading-tight">
              解锁你的<br />专属龙虾资产
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-brand-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">专属资产编号</h4>
                <p className="text-white/40 text-xs mt-1">每一只龙虾都拥有全网唯一的身份标识</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-brand-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">抽取稀有龙虾</h4>
                <p className="text-white/40 text-xs mt-1">传说级龙虾正在等待它的主人</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm">参与全球排行</h4>
                <p className="text-white/40 text-xs mt-1">与全球玩家竞争，展示你的进化成果</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-brand-primary">新人限时福利</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm font-bold">注册即领：</div>
                <div className="text-[10px] text-white/40">免费盲盒 ×1 + 初始龙虾 ×1 + 1000 虾币</div>
              </div>
              <div className="text-2xl font-black text-brand-primary">FREE</div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-8 relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-black tracking-tighter mb-2">
              {isRegistering ? '立即加入' : '欢迎回来'}
            </h3>
            <p className="text-white/40 text-sm font-medium">
              {isRegistering ? '开启你的数字龙虾培育之旅' : '继续你的龙虾进化之路'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="w-full space-y-4">
            {isRegistering && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-all"
                  required
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="email"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-all"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-all"
                required
              />
            </div>

            {isRegistering && (
              <div className="relative group">
                <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="text"
                  placeholder="邀请码 (可选)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? '处理中...' : isRegistering ? '立即注册' : '登录账号'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="w-full flex items-center gap-4 text-white/10">
            <div className="h-[1px] flex-1 bg-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">或者</span>
            <div className="h-[1px] flex-1 bg-current" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            Google 账号登录
          </button>

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-bold text-white/40 hover:text-white transition-colors text-center"
          >
            {isRegistering ? '已有账号？立即登录' : '没有账号？创建一个'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
