import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY as string;
const ai = new GoogleGenAI({ apiKey });

export const analyzeInventory = async (inventory: any, activities: any[]) => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `
    Analyze the following inventory data and recent activities for Product: ${inventory.productName} (SKU: ${inventory.sku}).
    Current Stock: ${inventory.currentStock}
    Target Stock: ${inventory.targetStock}
    Expected Sales: ${inventory.expectedSales} units/month
    Unit Cost: $${inventory.unitCost}
    Allocated Budget: $${inventory.allocatedBudget}
    Lead Time: ${inventory.leadTime} days
    Season Multiplier: ${inventory.seasonMultiplier}x
    Safety Buffer: ${inventory.safetyBuffer}%
    
    Recent Activities:
    ${activities.map(a => `- ${a.timestamp}: ${a.description} (${a.units || ''} units)`).join('\n')}
    
    Provide actionable intelligence for the manager. 
    Include:
    1. A summary of the current situation.
    2. A specific decision recommendation (e.g., 'Order 50 Units').
    3. The reasoning behind the recommendation.
    4. Potential risks (e.g., stockout risk, spoilage risk).
    
    Format the output as JSON with fields: summary, recommendation, reasoning, risks (array), stockoutEta (days).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    },
  });

  return JSON.parse(response.text || '{}');
};

export const getChatResponse = async (history: any[], message: string, fast: boolean = false) => {
  const model = fast ? "gemini-3.1-flash-lite-preview" : "gemini-3-flash-preview";
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: "You are a smart inventory assistant. Help the manager make decisions based on inventory data, lead times, and demand forecasts. Be concise and professional.",
    },
  });

  // Convert history to Gemini format
  const contents = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const analyzeStockImage = async (base64Image: string) => {
  const model = "gemini-3.1-pro-preview";
  const prompt = "Analyze this image of inventory stock. Estimate the number of units visible and describe the condition (e.g., organized, low stock, damaged packaging).";
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    }
  });

  return response.text;
};

export const getMarketTrends = async (location: string) => {
  const model = "gemini-3-flash-preview";
  const prompt = `What are the current market trends for general retail inventory in ${location}? Are there any local events or seasonal factors affecting demand right now?`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }]
    }
  });

  return response.text;
};
