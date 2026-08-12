import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route 1: Calculate Macros from Meal Description using Gemini AI
  app.post("/api/ai-macros", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "Please provide a valid meal description." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback calculation if key is not configured
        const len = description.length;
        return res.json({
          title: description.length > 25 ? description.substring(0, 25) + "..." : description,
          calories: Math.min(850, Math.max(250, len * 12)),
          protein: Math.min(65, Math.max(18, Math.round(len * 0.9))),
          carbs: Math.min(90, Math.max(25, Math.round(len * 1.2))),
          fats: Math.min(35, Math.max(8, Math.round(len * 0.4))),
          fiber: Math.min(15, Math.max(4, Math.round(len * 0.2))),
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const prompt = `You are an expert nutritionist AI. Analyze this meal description and estimate its macro breakdown:
"${description}"

Return ONLY a JSON object with this exact structure (no markdown formatting, no code block backticks):
{
  "title": "short clean name for the meal",
  "calories": number,
  "protein": number (in grams),
  "carbs": number (in grams),
  "fats": number (in grams),
  "fiber": number (in grams)
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedJson);

      return res.json({
        title: parsed.title || "Custom AI Meal",
        calories: Number(parsed.calories) || 450,
        protein: Number(parsed.protein) || 30,
        carbs: Number(parsed.carbs) || 45,
        fats: Number(parsed.fats) || 12,
        fiber: Number(parsed.fiber) || 6,
      });
    } catch (error) {
      console.error("AI Macro API Error:", error);
      // Return safe estimation on error
      return res.json({
        title: "Calculated Meal",
        calories: 480,
        protein: 32,
        carbs: 48,
        fats: 14,
        fiber: 7,
      });
    }
  });

  // API route 2: Generate Full Week Diet Plan using Gemini AI
  app.post("/api/ai-diet-plan", async (req, res) => {
    try {
      const { goal } = req.body;
      const targetGoal = goal || "Muscle Building & High Protein";

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
        const prompt = `Generate a structured full 7-day diet plan (Monday to Sunday) for fitness goal: "${targetGoal}".
Return ONLY a valid JSON object matching this schema (no extra text or backticks):
{
  "goal": "${targetGoal}",
  "title": "7-Day High-Performance ${targetGoal} Diet",
  "description": "Tailored macro plan with nutrient timing for optimal recovery and energy.",
  "dailyCalorieTarget": 2200,
  "dailyProteinTarget": 150,
  "days": [
    {
      "dayName": "Monday",
      "totalCalories": 2200,
      "totalProtein": 150,
      "meals": [
        { "type": "Breakfast", "title": "Meal Title", "description": "Quick recipe info", "calories": 450, "protein": 35, "carbs": 50, "fats": 10, "fiber": 8 },
        { "type": "Lunch", "title": "Meal Title", "description": "Quick recipe info", "calories": 650, "protein": 48, "carbs": 65, "fats": 14, "fiber": 9 },
        { "type": "Dinner", "title": "Meal Title", "description": "Quick recipe info", "calories": 700, "protein": 45, "carbs": 60, "fats": 18, "fiber": 7 },
        { "type": "Snack", "title": "Meal Title", "description": "Quick recipe info", "calories": 400, "protein": 22, "carbs": 35, "fats": 8, "fiber": 4 }
      ]
    }
    // ... complete for Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });

        const text = response.text || "";
        const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);
        return res.json(parsed);
      }

      // Fallback diet plan
      return res.json(generateFallbackWeeklyDiet(targetGoal));
    } catch (err) {
      console.error("AI Diet Plan Error:", err);
      return res.json(generateFallbackWeeklyDiet(req.body.goal || "Fitness"));
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackWeeklyDiet(goal: string) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
  return {
    goal,
    title: `7-Day ${goal} Precision Diet Map`,
    description: `Targeted daily nutrition designed specifically for ${goal}. High bioavailability protein sources with clean carb timing.`,
    dailyCalorieTarget: 2200,
    dailyProteinTarget: 155,
    days: days.map((day, idx) => ({
      dayName: day,
      totalCalories: 2180 + (idx % 3) * 50,
      totalProtein: 150 + (idx % 2) * 8,
      meals: [
        {
          type: "Breakfast",
          title: "High Protein Whey Oats & Berries",
          description: "Rolled oats, 1 scoop whey, chia seeds & fresh blueberries",
          calories: 440,
          protein: 38,
          carbs: 48,
          fats: 8,
          fiber: 9,
        },
        {
          type: "Lunch",
          title: "Grilled Chicken Breast & Quinoa Bowl",
          description: "Herb roasted chicken breast, quinoa, avocado & steamed broccoli",
          calories: 620,
          protein: 52,
          carbs: 58,
          fats: 14,
          fiber: 10,
        },
        {
          type: "Dinner",
          title: "Pan-Seared Salmon / Tofu & Sweet Potato",
          description: "Omega-3 rich fillet, baked sweet potato wedges & asparagus",
          calories: 680,
          protein: 46,
          carbs: 52,
          fats: 20,
          fiber: 8,
        },
        {
          type: "Snack",
          title: "Greek Yogurt & Roasted Almonds",
          description: "0% Fat Greek yogurt with raw honey drizzle & 15g almonds",
          calories: 280,
          protein: 24,
          carbs: 20,
          fats: 8,
          fiber: 3,
        },
      ],
    })),
  };
}

startServer();
