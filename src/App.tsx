import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Ghost, 
  ShoppingBag, 
  Users, 
  User as UserIcon,
  Bell,
  Search,
  Zap,
  Sparkles,
  PlusCircle,
  LogOut,
  Store,
  Shield,
  Target
} from 'lucide-react';

import Dashboard from './views/Dashboard';
import MyLobsters from './views/MyLobsters';
import Marketplace from './views/Marketplace';
import Community from './views/Community';
import Profile from './views/Profile';
import Shop from './views/Shop';
import Admin from './views/Admin';
import LobsterDetail from './views/LobsterDetail';
import AdoptionFlow from './components/AdoptionFlow';
import ClawInteractionModal from './components/ClawInteractionModal';
import BreedingModal from './components/BreedingModal';
import RechargeModal from './components/RechargeModal';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import MissionCenter from './components/MissionCenter';
import { Lobster, Post, User, ShopItem, Mission } from './types';
import { MOCK_USER, MOCK_LOBSTERS, MOCK_POSTS, MOCK_MISSIONS } from './mockData';
import { clawService } from './services/clawService';
import { auth, onAuthStateChanged, signOut, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

type View = 'dashboard' | 'my-lobsters' | 'marketplace' | 'community' | 'profile' | 'shop' | 'admin' | 'missions';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedLobster, setSelectedLobster] = useState<Lobster | null>(null);
  const [lobsters, setLobsters] = useState<Lobster[]>([]);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isAdoptionOpen, setIsAdoptionOpen] = useState(false);
  const [isBreedingOpen, setIsBreedingOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [trialLobster, setTrialLobster] = useState<Lobster | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeMission, setActiveMission] = useState<{ mission: Mission, lobster: Lobster } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            // Auto-assign admin role for specific email
            const role = firebaseUser.email === 'wuxiaowei91@gmail.com' ? 'admin' : userData.role || 'user';
            setUser({ ...userData, id: firebaseUser.uid, inventory: userData.inventory || [], role });
            setShowLoginModal(false);
            setTrialLobster(null);
          } else {
            // User exists in Auth but not in Firestore
            // We should probably keep them as null user so they see the login/registration flow
            // which will handle document creation
            setUser(null);
            console.warn('User authenticated but Firestore document missing for UID:', firebaseUser.uid);
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
          // If it's a permission error, it will be handled by the global handler if we use it
          // But here we just log it
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const requireAuth = (action: () => void) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      action();
    }
  };

  useEffect(() => {
    if (!user) {
      // Show some mock lobsters for guests to browse
      setLobsters(MOCK_LOBSTERS.slice(0, 3));
      return;
    }

    const q = query(collection(db, 'lobsters'), where('ownerId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lobsterList: Lobster[] = [];
      snapshot.forEach((doc) => {
        lobsterList.push({ id: doc.id, ...doc.data() } as Lobster);
      });
      setLobsters(lobsterList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdopt = (name: string, type: 'fire' | 'water' | 'tech', rarity: string, serialNumber: string, methodId: string, price: number) => {
    if (!user) return;
    // ... rest of the function

    const newLobster: Lobster = {
      id: `L-${Math.random().toString(36).substr(2, 9)}`,
      serialNumber: serialNumber,
      rarity: rarity as any,
      name,
      stage: 'mini',
      growthValue: 0,
      health: 100,
      energy: 50,
      skills: [],
      mcpTools: [],
      imageUrl: `https://picsum.photos/seed/${name}-${type}/800/800`,
      ownerId: user.id,
      birthDate: new Date().toISOString().split('T')[0],
      isClonable: false,
    };
    setLobsters([newLobster, ...lobsters]);
    setCurrentView('my-lobsters');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    try {
      await setDoc(doc(db, 'users', updatedUser.id), updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const handleUpdateLobster = async (updatedLobster: Lobster) => {
    setLobsters(prev => prev.map(l => l.id === updatedLobster.id ? updatedLobster : l));
    if (selectedLobster?.id === updatedLobster.id) {
      setSelectedLobster(updatedLobster);
    }
    
    try {
      await setDoc(doc(db, 'lobsters', updatedLobster.id), updatedLobster);
    } catch (error) {
      console.error('Update lobster error:', error);
    }
  };

  const renderView = () => {
    if (selectedLobster) {
      return (
        <LobsterDetail 
          lobster={selectedLobster} 
          user={user}
          onUpdateUser={handleUpdateUser}
          onUpdateLobster={handleUpdateLobster}
          onBack={() => setSelectedLobster(null)} 
        />
      );
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard user={user} onShowLogin={() => setShowLoginModal(true)} onStartAdoption={() => requireAuth(() => setIsAdoptionOpen(true))} onViewMissions={() => setCurrentView('missions')} />;
      case 'my-lobsters': 
        if (!user) {
          setCurrentView('dashboard');
          return <Dashboard user={user} onShowLogin={() => setShowLoginModal(true)} onStartAdoption={() => requireAuth(() => setIsAdoptionOpen(true))} onViewMissions={() => setCurrentView('missions')} />;
        }
        return <MyLobsters 
          lobsters={lobsters} 
          user={user}
          onSelect={setSelectedLobster} 
          onShowLogin={() => setShowLoginModal(true)}
          onGoToMarket={() => setCurrentView('marketplace')}
          onStartBreeding={() => requireAuth(() => setIsBreedingOpen(true))}
        />;
      case 'marketplace': 
        return <Marketplace 
          onStartAdoption={() => requireAuth(() => setIsAdoptionOpen(true))} 
          lobsters={lobsters}
          user={user}
          onBuyLobster={handleBuyLobster}
        />;
      case 'shop': return <Shop user={user} onPurchase={handlePurchase} onShowLogin={() => setShowLoginModal(true)} />;
      case 'community': return <Community 
        posts={posts} 
        user={user} 
        lobsters={lobsters}
        onShowLogin={() => setShowLoginModal(true)} 
        onLike={handleLike}
        onComment={handleComment}
        onCreatePost={handleCreatePost}
      />;
      case 'missions': return <MissionCenter 
        user={user} 
        lobsters={lobsters} 
        onStartMission={handleStartMission} 
      />;
      case 'admin': return user?.role === 'admin' ? <Admin /> : <Dashboard user={user} onShowLogin={() => setShowLoginModal(true)} onStartAdoption={() => requireAuth(() => setIsAdoptionOpen(true))} onViewMissions={() => setCurrentView('missions')} />;
      case 'profile': return user ? <Profile user={user} /> : <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
          <UserIcon className="w-10 h-10 text-white/20" />
        </div>
        <div>
          <h3 className="text-xl font-bold">登录解锁个人中心</h3>
          <p className="text-white/40 text-sm mt-2">管理你的龙虾资产，查看进化进度</p>
        </div>
        <button 
          onClick={() => setShowLoginModal(true)}
          className="px-8 py-3 bg-brand-primary rounded-xl font-bold"
        >
          立即登录
        </button>
      </div>;
      default: return <Dashboard user={user} onShowLogin={() => setShowLoginModal(true)} onStartAdoption={() => requireAuth(() => setIsAdoptionOpen(true))} onViewMissions={() => setCurrentView('missions')} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: '首页', icon: LayoutDashboard },
    ...(user ? [{ id: 'my-lobsters', label: '我的', icon: Ghost }] : []),
    { id: 'missions', label: '任务板', icon: Target },
    { id: 'shop', label: '商城', icon: Store },
    { id: 'marketplace', label: '集市', icon: ShoppingBag },
    { id: 'community', label: '圈子', icon: Users },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: '管理', icon: Shield }] : []),
  ];

  const handleRecharge = (amount: number) => {
    if (!user) return;
    setUser({ ...user, balance: user.balance + amount });
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!user) return;
    if (user.balance < item.price) {
      alert('虾币不足，请先充值！');
      return;
    }

    const newBalance = user.balance - item.price;
    const inventory = user.inventory || [];
    const existingItemIndex = inventory.findIndex(i => i.id === item.id);
    let newInventory = [...inventory];

    if (existingItemIndex > -1) {
      newInventory[existingItemIndex] = {
        ...newInventory[existingItemIndex],
        quantity: newInventory[existingItemIndex].quantity + 1
      };
    } else {
      newInventory.push({
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type,
        quantity: 1,
        imageUrl: item.imageUrl,
        effect: item.effect
      });
    }

    const updatedUser = { ...user, balance: newBalance, inventory: newInventory };
    setUser(updatedUser);

    try {
      await setDoc(doc(db, 'users', user.id), updatedUser);
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const handleBreed = async (p1Id: string, p2Id: string) => {
    if (!user) return;
    
    const p1 = lobsters.find(l => l.id === p1Id);
    const p2 = lobsters.find(l => l.id === p2Id);
    if (!p1 || !p2) return;

    const newLobster: Lobster = {
      id: `L-${Math.random().toString(36).substr(2, 9)}`,
      serialNumber: `LOB-${Math.floor(100000 + Math.random() * 900000)}`,
      name: `${p1.name} & ${p2.name} 的后代`,
      rarity: Math.random() > 0.8 ? 'legendary' : (Math.random() > 0.5 ? 'rare' : 'common'),
      stage: 'mini',
      growthValue: 0,
      health: 100,
      energy: 100,
      skills: [],
      mcpTools: [],
      imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80',
      ownerId: user.id,
      birthDate: new Date().toISOString().split('T')[0],
      isClonable: false,
      parents: [p1Id, p2Id]
    };

    const updatedUser = {
      ...user,
      balance: user.balance - 500
    };

    try {
      await setDoc(doc(db, 'lobsters', newLobster.id), newLobster);
      await setDoc(doc(db, 'users', user.id), updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Breeding error:', error);
      throw error;
    }
  };

  const handleBuyLobster = async (lobster: Lobster) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (user.balance < (lobster.price || 0)) {
      showNotification('虾币不足，请先充值！', 'error');
      return;
    }

    try {
      const sellerId = lobster.ownerId;
      const price = lobster.price || 0;
      const platformFee = Math.floor(price * 0.05);
      const sellerProceeds = price - platformFee;

      // 1. Update Buyer
      const updatedBuyer = {
        ...user,
        balance: user.balance - price
      };

      // 2. Update Lobster
      const updatedLobster = {
        ...lobster,
        ownerId: user.id,
        isForSale: false
      };

      // 3. Update Seller (Fetch first)
      const sellerDoc = await getDoc(doc(db, 'users', sellerId));
      if (sellerDoc.exists()) {
        const sellerData = sellerDoc.data() as User;
        const updatedSeller = {
          ...sellerData,
          balance: (sellerData.balance || 0) + sellerProceeds
        };
        await setDoc(doc(db, 'users', sellerId), updatedSeller);
      }

      // Persist changes
      await setDoc(doc(db, 'users', user.id), updatedBuyer);
      await setDoc(doc(db, 'lobsters', lobster.id), updatedLobster);

      setUser(updatedBuyer);
      showNotification(`成功购买 ${lobster.name}！`, 'success');
    } catch (error) {
      console.error('Purchase error:', error);
      showNotification('购买失败，请稍后再试。', 'error');
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const likes = post.likes || [];
    const hasLiked = likes.includes(user.id);
    const updatedLikes = hasLiked 
      ? likes.filter(id => id !== user.id)
      : [...likes, user.id];

    const updatedPost = { ...post, likes: updatedLikes };
    
    try {
      await setDoc(doc(db, 'posts', postId), updatedPost);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
      console.error('Like error:', error);
      handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
    }
  };

  const handleCreatePost = async (content: string, image?: string) => {
    if (!user) return;

    const newPost: Post = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      user: user.username,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100',
      content,
      image,
      likes: [],
      comments: [],
      time: '刚刚'
    };

    setPosts([newPost, ...posts]);
    showNotification('动态发布成功！', 'success');

    try {
      await setDoc(doc(db, 'posts', newPost.id), newPost);
    } catch (error) {
      console.error('Create post error:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comments = post.comments || [];
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      user: user.username,
      content,
      time: '刚刚'
    };

    const updatedPost = {
      ...post,
      comments: [...comments, newComment]
    };

    try {
      await setDoc(doc(db, 'posts', postId), updatedPost);
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const handleStartMission = (mission: Mission, lobster: Lobster) => {
    setActiveMission({ mission, lobster });
  };

  const handleCompleteMission = async (success: boolean) => {
    if (!activeMission || !user) return;

    const { mission, lobster } = activeMission;

    if (success) {
      const updatedUser = {
        ...user,
        balance: user.balance + mission.reward.balance
      };

      const updatedLobster = {
        ...lobster,
        growthValue: Math.min(lobster.growthValue + mission.reward.growth, 1000)
      };

      try {
        await setDoc(doc(db, 'users', user.id), updatedUser);
        await setDoc(doc(db, 'lobsters', lobster.id), updatedLobster);
        setUser(updatedUser);
        setLobsters(prev => prev.map(l => l.id === lobster.id ? updatedLobster : l));
        showNotification(`任务成功！获得 ${mission.reward.balance} 虾币和 ${mission.reward.growth} XP`, 'success');
      } catch (error) {
        console.error('Mission completion error:', error);
      }
    } else {
      showNotification('任务失败，请再接再厉。', 'error');
    }

    setActiveMission(null);
  };

  const handleShareToCommunity = (lobster: Lobster) => {
    if (!user) return;
    const rarityLabel = lobster.rarity === 'legendary' ? '传说级' : lobster.rarity === 'rare' ? '稀有级' : '普通级';
    const newPost: Post = {
      id: `p-${Date.now()}`,
      userId: user.id,
      user: user.username,
      avatar: user.avatar,
      content: `🎉 刚刚领养了一只${rarityLabel}龙虾“${lobster.name}”！编号：${lobster.serialNumber}。运气爆表，快来围观！ #抓虾进化 #新成员`,
      image: lobster.imageUrl,
      likes: [],
      comments: [],
      time: '刚刚'
    };
    setPosts([newPost, ...posts]);
    setCurrentView('community');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence>
        {showLoginModal && (
          <Login 
            onLoginSuccess={(u) => {
              setUser(u);
              setShowLoginModal(false);
            }} 
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </AnimatePresence>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-bottom border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => {
                setCurrentView('dashboard');
                setSelectedLobster(null);
              }}
            >
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center neon-glow">
                <Ghost className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tighter">抓虾</span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as View);
                    setSelectedLobster(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    currentView === item.id && !selectedLobster
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <Search className="w-4 h-4 text-white/30 mr-2" />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="bg-transparent border-none focus:outline-none text-sm w-32"
              />
            </div>
            <div className="relative group">
              <button className="p-2 text-white/40 hover:text-white transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full" />
              </button>
              
              {/* Notifications Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-80 bg-brand-dark/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-sm">通知中心</h4>
                  <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">3 条新通知</span>
                </div>
                <div className="space-y-3">
                  {[
                    { title: '进化成功', desc: '你的“闪电侠”已进化到大型阶段！', time: '2分钟前', icon: Zap, color: 'text-brand-primary' },
                    { title: '集市动态', desc: '你关注的“极客螯”价格下调了。', time: '1小时前', icon: ShoppingBag, color: 'text-brand-secondary' },
                    { title: '系统消息', desc: '欢迎来到抓虾进化社区！', time: '1天前', icon: Sparkles, color: 'text-yellow-400' },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${n.color}`}>
                        <n.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold">{n.title}</div>
                        <div className="text-[10px] text-white/40 line-clamp-1">{n.desc}</div>
                        <div className="text-[9px] text-white/20 mt-1">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest border-t border-white/5 pt-4">
                  清除所有通知
                </button>
              </div>
            </div>
            <div 
              className="flex items-center gap-3 pl-4 border-l border-white/10"
            >
              {user ? (
                <>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-white/80">{user.username}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] text-brand-secondary font-black tracking-tighter">{user.balance} 虾币</div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRechargeOpen(true);
                        }}
                        className="p-1 bg-brand-primary/20 hover:bg-brand-primary/40 rounded-full transition-all group"
                      >
                        <PlusCircle className="w-3 h-3 text-brand-primary group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <div className="relative group/profile">
                    <div 
                      className="cursor-pointer"
                      onClick={() => setCurrentView('profile')}
                    >
                      <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-brand-primary/20 hover:border-brand-primary transition-colors" />
                    </div>
                    
                    <div className="absolute top-full right-0 mt-2 w-48 bg-brand-dark/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-300 p-2">
                      <button 
                        onClick={() => signOut(auth)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-brand-primary rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20"
                >
                  登录 / 注册
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 pt-0 pb-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedLobster ? '-detail' : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border ${
              notification.type === 'success' 
                ? 'bg-emerald-500 border-emerald-400 text-white' 
                : 'bg-red-500 border-red-400 text-white'
            }`}
          >
            {notification.type === 'success' ? <Sparkles className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            <span className="font-bold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <RechargeModal 
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        onRecharge={handleRecharge}
      />

      <AdoptionFlow 
        isOpen={isAdoptionOpen} 
        onClose={() => setIsAdoptionOpen(false)} 
        onAdopt={handleAdopt} 
        onShareToCommunity={handleShareToCommunity}
        totalLobsters={lobsters.length}
        userBalance={user?.balance || 0}
      />

      {isBreedingOpen && user && (
        <BreedingModal
          user={user}
          lobsters={lobsters}
          onClose={() => setIsBreedingOpen(false)}
          onBreed={handleBreed}
        />
      )}

      <Onboarding />

      <AnimatePresence>
        {activeMission && (
          <ClawInteractionModal
            lobster={activeMission.lobster}
            user={user}
            mission={activeMission.mission}
            onClose={() => setActiveMission(null)}
            onCompleteMission={handleCompleteMission}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-xl border-t border-white/5 px-6 py-4">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                setSelectedLobster(null);
              }}
              className={`flex flex-col items-center gap-1 transition-all ${
                currentView === item.id && !selectedLobster ? 'text-brand-primary' : 'text-white/30'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === 'profile' ? 'text-brand-primary' : 'text-white/30'
            }`}
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
