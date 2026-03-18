export type LobsterStage = 'mini' | 'small' | 'large' | 'super';

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
}

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  type: 'search' | 'code' | 'data' | 'api';
  status: 'active' | 'inactive';
}

export type LobsterRarity = 'common' | 'rare' | 'legendary';

export interface Lobster {
  id: string;
  serialNumber: string;
  rarity: LobsterRarity;
  name: string;
  stage: LobsterStage;
  growthValue: number;
  health: number; // 0-100
  energy: number; // 0-100
  skills: Skill[];
  mcpTools: MCPTool[];
  imageUrl: string;
  ownerId: string;
  birthDate: string;
  isClonable: boolean;
  parents?: string[];
  isForSale?: boolean;
  price?: number;
}

export type ItemType = 'food' | 'medicine' | 'evolution' | 'boost';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  quantity: number;
  imageUrl: string;
  effect: {
    health?: number;
    energy?: number;
    growth?: number;
  };
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ItemType;
  imageUrl: string;
  effect: {
    health?: number;
    energy?: number;
    growth?: number;
  };
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  balance: number;
  inventory: InventoryItem[];
  role?: 'user' | 'admin';
  referralCode?: string;
  referredBy?: string;
}

export type MissionType = 'code' | 'writing' | 'research' | 'data' | 'creative';
export type MissionStatus = 'available' | 'in_progress' | 'completed' | 'failed';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward: {
    balance: number;
    growth: number;
  };
  requiredStage: LobsterStage;
  requiredSkills?: string[]; // IDs of skills
  requiredTools?: string[]; // IDs of MCP tools
  status: MissionStatus;
  deadline?: string;
}

export interface Post {
  id: string;
  userId: string;
  user: string;
  avatar: string;
  content: string;
  image?: string;
  likes: string[]; // Array of user IDs
  comments: {
    id: string;
    userId: string;
    user: string;
    content: string;
    time: string;
  }[];
  time: string;
}
