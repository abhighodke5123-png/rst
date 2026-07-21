import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with recommended telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// AI Trip Planner Endpoint
app.post("/api/ai/plan", async (req, res) => {
  const { destination, duration, interests, budget, travellers } = req.body;

  if (!destination || !duration) {
    return res.status(400).json({ error: "Destination and duration are required." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Gemini API Key is not configured in the environment settings.",
    });
  }

  try {
    const prompt = `
      You are a premium, expert travel planner at RAASTA Travels.
      Generate a customized road-trip and itinerary plan based on these parameters:
      - Destination: ${destination}
      - Duration: ${duration} Days
      - Key Interests: ${Array.isArray(interests) ? interests.join(", ") : "general sightseeing, local food"}
      - Travel Budget Tier: ${budget || "moderate"}
      - Travel Companion Type: ${travellers || "group of friends"}

      Ensure the plan incorporates RAASTA's signature travel style: immersive, unscripted, focusing on scenic views, local hidden gems, and pristine sunset points.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional travel captain and luxury travel itinerary designer. Be adventurous, extremely precise, and design perfect schedules.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tripTitle: { type: Type.STRING },
            vibeSummary: { type: Type.STRING, description: "A catchy 1-2 sentence description of the trip's mood." },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  placesVisited: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  mealsRecommended: { type: Type.STRING },
                  localSecretTip: { type: Type.STRING }
                },
                required: ["dayNumber", "title", "activities", "placesVisited", "mealsRecommended", "localSecretTip"]
              }
            },
            packingEssentials: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            safetyAdvisories: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedBudgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                stay: { type: Type.STRING },
                travel: { type: Type.STRING },
                activities: { type: Type.STRING },
                food: { type: Type.STRING }
              },
              required: ["stay", "travel", "activities", "food"]
            },
            whatsappText: {
              type: Type.STRING,
              description: "A beautifully structured, highly readable and clean plain-text summary of this itinerary with appropriate emojis. Make it look professional and exciting, ready to be sent to our travel agency WhatsApp number for a final quote. Include the RAASTA Travels branding at the top and bottom!"
            }
          },
          required: ["tripTitle", "vibeSummary", "itinerary", "packingEssentials", "safetyAdvisories", "estimatedBudgetBreakdown", "whatsappText"]
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    const planResult = JSON.parse(jsonText);
    res.json(planResult);
  } catch (error: any) {
    console.error("Gemini AI planning error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI plan." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
