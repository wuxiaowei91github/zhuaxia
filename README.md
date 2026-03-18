# 抓虾 (Zhuā Xiā) - 养虾人的温馨社区

一个充满亲近感的虚拟龙虾领养与成长平台，在这里与虾友分享快乐，共同进化。

## 🌟 核心特性

- **AI 驱动的龙虾之爪 (openClaw)**：利用 Google Gemini 模型，为每一只龙虾赋予独特的灵魂与智慧。
- **任务中心 (Mission Center)**：派遣你的龙虾执行 AI 任务（代码审查、文案撰写、调研等），赚取收益并加速进化。
- **实时生态池 (Pond Habitat)**：动态交互式水池，实时观察龙虾的游动与状态。
- **社区互动**：分享龙虾成长瞬间，点赞、评论，结识志同道合的“虾友”。
- **MCP 工具集成**：为龙虾装备强大的 MCP 工具（搜索、代码、数据等），提升其生产力。
- **繁殖与进化**：通过基因融合创造更稀有的后代，见证龙虾从 Mini 到 Super 的华丽蜕变。

## 🛠️ 技术栈

- **前端**：React 18, TypeScript, Vite
- **动画**：Framer Motion, Lucide React (图标)
- **样式**：Tailwind CSS
- **后端**：Firebase (Firestore, Authentication)
- **AI 能力**：Google Gemini API (@google/genai)

## 🚀 快速开始

### 环境配置

1. 在根目录下创建 `.env` 文件，并添加以下变量：
   ```env
   GEMINI_API_KEY=你的_GEMINI_API_KEY
   ```

2. 配置 Firebase：
   - 在 Firebase 控制台创建项目。
   - 启用 Firestore 和 Google Authentication。
   - 将你的 Firebase 配置信息填入 `src/firebase-applet-config.json`。

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📄 安全规则

项目包含完整的 `firestore.rules`，确保了数据的安全性与访问控制。在部署到生产环境前，请务必在 Firebase 控制台部署这些规则。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来完善这个温馨的社区！

---
由 **AI Studio Build** 驱动开发。
