import { Lobster, User, Post, ShopItem, Mission } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  username: '虾友小王',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100',
  balance: 1250,
  inventory: [
    { 
      id: 'i1', 
      name: '初级龙虾粮', 
      description: '基础食物，恢复少量能量',
      type: 'food', 
      quantity: 2, 
      imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=400&q=80',
      effect: { energy: 20 }
    },
    { 
      id: 'i2', 
      name: '超级成长水', 
      description: '加速龙虾成长，增加成长值',
      type: 'boost', 
      quantity: 5, 
      imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=400&q=80',
      effect: { growth: 50 }
    },
  ]
};

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: '代码逻辑审查',
    description: '协助主人检查一段复杂的 TypeScript 代码逻辑，找出潜在的内存泄漏风险。',
    type: 'code',
    difficulty: 'medium',
    reward: { balance: 300, growth: 150 },
    requiredStage: 'small',
    status: 'available'
  },
  {
    id: 'm2',
    title: '行业竞品调研',
    description: '利用深海雷达（搜索工具）调研当前 AI 养成类游戏的市场现状。',
    type: 'research',
    difficulty: 'hard',
    reward: { balance: 800, growth: 400 },
    requiredStage: 'large',
    requiredTools: ['search-tool'],
    status: 'available'
  },
  {
    id: 'm3',
    title: '创意文案撰写',
    description: '为龙虾池的周年庆典撰写一段充满感染力的宣传文案。',
    type: 'writing',
    difficulty: 'easy',
    reward: { balance: 150, growth: 50 },
    requiredStage: 'mini',
    status: 'available'
  }
];

export const MOCK_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'shop-1',
    name: '有机海藻粮',
    description: '高品质有机海藻，恢复大量能量。',
    price: 50,
    type: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=400&q=80',
    effect: { energy: 40 }
  },
  {
    id: 'shop-2',
    name: '深海营养液',
    description: '富含多种矿物质，恢复龙虾健康。',
    price: 100,
    type: 'medicine',
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=400&q=80',
    effect: { health: 30 }
  },
  {
    id: 'shop-3',
    name: '进化催化剂',
    description: '大幅提升成长值，助力龙虾进化。',
    price: 500,
    type: 'evolution',
    imageUrl: 'https://images.unsplash.com/photo-1626131728300-4881744a4741?auto=format&fit=crop&w=400&q=80',
    effect: { growth: 200 }
  },
  {
    id: 'shop-4',
    name: '活力药剂',
    description: '瞬间补满能量，让龙虾充满活力。',
    price: 150,
    type: 'boost',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
    effect: { energy: 100 }
  }
];

export const MOCK_LOBSTERS: Lobster[] = [
  {
    id: 'L-001',
    serialNumber: 'ZX-SEA-2026-000001',
    rarity: 'legendary',
    name: '闪电侠',
    stage: 'large',
    growthValue: 850,
    health: 95,
    energy: 80,
    skills: [
      { id: 's1', name: '快速抓取', description: '提高处理速度', icon: 'Zap', level: 3 },
      { id: 's2', name: '深度分析', description: '增强数据洞察', icon: 'Search', level: 2 },
    ],
    mcpTools: [
      { id: 'm1', name: 'Google Search', description: '实时搜索互联网信息', type: 'search', status: 'active' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80',
    ownerId: 'u1',
    birthDate: '2024-01-15',
    isClonable: true,
  },
  {
    id: 'L-002',
    serialNumber: 'ZX-SEA-2026-000002',
    rarity: 'common',
    name: '小萌虾',
    stage: 'mini',
    growthValue: 120,
    health: 100,
    energy: 100,
    skills: [],
    mcpTools: [],
    imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80',
    ownerId: 'u1',
    birthDate: '2024-03-10',
    isClonable: false,
  },
  {
    id: 'L-003',
    serialNumber: 'ZX-SEA-2026-000003',
    rarity: 'rare',
    name: '铁甲龙',
    stage: 'small',
    growthValue: 340,
    health: 70,
    energy: 40,
    skills: [
      { id: 's3', name: '坚韧护甲', description: '减少状态损耗', icon: 'Shield', level: 1 },
    ],
    mcpTools: [],
    imageUrl: 'https://images.unsplash.com/photo-1626131728300-4881744a4741?auto=format&fit=crop&w=800&q=80',
    ownerId: 'u1',
    birthDate: '2024-02-20',
    isClonable: true,
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    user: '虾王阿强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100',
    content: '我的“闪电侠”终于进化到超级阶段了！这波喂养资料选得太对了，速度直接拉满。🚀 #龙虾进化 #超级龙虾',
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80',
    likes: ['u1', 'u3'],
    comments: [
      { id: 'c1', userId: 'u1', user: '虾友小王', content: '太强了！求攻略', time: '1小时前' }
    ],
    time: '2小时前'
  },
  {
    id: 'p2',
    userId: 'u3',
    user: '资深养虾人',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100',
    content: '分享一个克隆心得：新手建议先克隆具备“深度分析”技能的龙虾，对后续收集稀有资料非常有帮助。',
    likes: ['u1'],
    comments: [],
    time: '5小时前'
  }
];
