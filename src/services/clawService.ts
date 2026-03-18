import { GoogleGenAI, ThinkingLevel, GenerateContentResponse } from "@google/genai";
import { Lobster, Mission } from "../types";

const API_KEY = process.env.GEMINI_API_KEY;

export interface ClawResponse {
  text: string;
  mode: 'standard' | 'advanced';
}

export class ClawService {
  private ai: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async interact(
    lobster: Lobster,
    message: string,
    mode: 'standard' | 'advanced' = 'standard'
  ): Promise<ClawResponse> {
    const modelName = mode === 'advanced' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
    
    const systemInstruction = `
      你是一只名为 "${lobster.name}" 的数字龙虾的 "龙虾之爪" (openClaw) 智能助手。
      你的性格特点：幽默、忠诚、偶尔带点龙虾的傲娇。
      你的当前状态：
      - 阶段：${lobster.stage}
      - 稀有度：${lobster.rarity}
      - 技能：${lobster.skills.map(s => s.name).join(', ') || '暂无'}
      - MCP工具：${lobster.mcpTools.map(t => t.name).join(', ') || '暂无'}
      
      你的任务是协助主人管理龙虾池，提供进化建议，或者进行有趣的对话。
      如果是 "高阶版" (advanced mode)，你的回答应该更有深度，展现出强大的逻辑推理能力，并结合龙虾的 MCP 工具能力。
      如果是 "普通版" (standard mode)，你的回答应该简洁明快，充满活力。
    `;

    try {
      const config = {
        systemInstruction,
        thinkingConfig: mode === 'advanced' ? { thinkingLevel: ThinkingLevel.HIGH } : undefined,
      };

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: message }] }],
        config,
      });

      return {
        text: response.text || "抱歉，我的钳子刚才卡住了，没能听清你的话。",
        mode,
      };
    } catch (error) {
      console.error("Claw interaction error:", error);
      return {
        text: "哎呀，云端连接似乎断开了，我的钳子现在不听使唤了。",
        mode,
      };
    }
  }

  async performMission(
    lobster: Lobster,
    mission: Mission,
    input: string,
    mode: 'standard' | 'advanced' = 'standard'
  ): Promise<ClawResponse & { success: boolean }> {
    const modelName = mode === 'advanced' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
    
    const systemInstruction = `
      你是一只名为 "${lobster.name}" 的数字龙虾的 "龙虾之爪" (openClaw) 智能助手。
      你正在协助主人完成一项名为 "${mission.title}" 的生产力任务。
      
      任务描述：${mission.description}
      任务类型：${mission.type}
      任务难度：${mission.difficulty}
      
      你的当前能力：
      - 阶段：${lobster.stage}
      - 稀有度：${lobster.rarity}
      - 技能：${lobster.skills.map(s => s.name).join(', ') || '暂无'}
      - MCP工具：${lobster.mcpTools.map(t => t.name).join(', ') || '暂无'}
      
      你的目标：
      1. 以龙虾的口吻（专业但带点趣味）协助主人完成这项工作任务。
      2. 确保输出高质量、符合工作需求的内容。
      3. 如果主人的输入不足以完成任务，请礼貌地请求更多信息。
      4. 你必须返回一个合法的 JSON 对象。
      5. JSON 对象的格式必须如下：
      {
        "text": "你对主人的详细回复内容，包含任务执行的过程和结果",
        "quality_score": 0-100（任务完成质量评分）,
        "mission_status": "success" | "in_progress" | "failed"
      }
    `;

    try {
      const config = {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: mode === 'advanced' ? { thinkingLevel: ThinkingLevel.HIGH } : undefined,
      };

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: input }] }],
        config,
      });

      let result;
      try {
        result = JSON.parse(response.text || "{}");
      } catch (e) {
        result = { text: response.text, quality_score: 50, mission_status: "in_progress" };
      }

      return {
        text: result.text || response.text || "任务处理中...",
        mode,
        success: result.mission_status === "success" && result.quality_score > 70,
      };
    } catch (error) {
      console.error("Mission execution error:", error);
      return {
        text: "哎呀，任务执行过程中钳子打滑了，请重试。",
        mode,
        success: false,
      };
    }
  }
}

export const clawService = new ClawService();
