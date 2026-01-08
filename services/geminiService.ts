
import { GoogleGenAI } from "@google/genai";
import { SalaryInputs, Currency, SalaryBreakdown } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSalaryInsights = async (
  inputs: SalaryInputs,
  breakdown: SalaryBreakdown,
  currency: Currency
): Promise<string> => {
  try {
    const prompt = `
      我是一個薪水計算應用程式。使用者輸入了以下數據：
      - 時薪: ${inputs.hourlyRate} ${currency}
      - 工作時數: ${inputs.workHours} 小時
      
      計算結果如下：
      - 總薪資約: ${breakdown.total.toLocaleString()} ${currency}

      請以繁體中文提供一段簡短、友善且專業的財務分析或建議（約 150 字內）。
      內容可以包含：
      1. 這個收入水平在一般情況下的生活品質評估（僅供參考）。
      2. 針對此收入水平的簡單理財或儲蓄小撇步。
      3. 鼓勵的話語。
      請直接給出建議內容，不需要開頭問候。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "暫時無法取得分析建議，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("無法連線至 AI 服務");
  }
};
