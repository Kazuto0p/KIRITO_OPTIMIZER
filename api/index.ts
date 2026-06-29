import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

// Initialize Express
const app = express();
app.use(express.json());

// Lazy initialize Gemini setup safely to avoid startup crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or is a placeholder. Please set a valid API key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Low-latency configuration & optimization recommendations API
app.post("/api/optimize-device", async (req, res) => {
  try {
    const { deviceModel, platform, currentLagEstimate, additionalDetails } = req.body;

    if (!deviceModel) {
      return res.status(400).json({ error: "No device model specified." });
    }

    const ai = getAiClient();

    const systemPrompt = `You are an elite Esports Hardware Engineer & Brazilian mobile competitive Sensi Specialist. \nYour goal is to optimize players' gaming devices to lower physical input lag, maximize touch sampling rates, and generate perfect Brazilian-style competitive 'Sensi' presets (inspired by legendary competitive Free Fire and shooter configurations, scale 0-200). \nAnalyze the device model provided: "${deviceModel}" on platform "${platform}". \nProvide verified hardware facts, specific developer settings, and precise terminal/shell commands (ADB shell for Android, Registry hacks for PC/Windows, Accessibility tweaks for iOS/Console). \nGenerate precise sensitivity values from 0 to 200 (inclusive) representing: General (Geral), Red Dot (Ponto Vermelho), 2x Scope (Mira 2x), 4x Scope (Mira 4x), AWM Scope, and suggestion of DPI (Minimum Width/Menor Largura) to maximize headshot hitrate (known in Brazil as "subir capa"). \nAll text and descriptions MUST be in English. Respond ONLY in highly structured, complete JSON matching the specified schema. Keep advice concise, premium, and actionable. Avoid fluff.`;

    const instructions = `Recommend optimizations and Brazilian-style competitive Sensi ratios on a 0-200 sensitivity scale for: \nDevice: ${deviceModel} \nPlatform: ${platform} \nReported Lag Level: ${currentLagEstimate || "Unknown"} \nAdditional context: ${additionalDetails || "None"}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        deviceInfo: {
          type: Type.OBJECT,
          properties: {
            model: { type: Type.STRING, description: "Official hardware model name" },
            nativeTouchSamplingRateHz: { type: Type.INTEGER, description: "Typical hardware touch sampling rate in Hz (e.g. 240, 360, 480)" },
            nativeRefreshRateHz: { type: Type.INTEGER, description: "Maximum screen refresh rate in Hz" },
            panelType: { type: Type.STRING, description: "Screen panel type (e.g. Super AMOLED, IPS, OLED, TN)" }
          },
          required: ["model", "nativeTouchSamplingRateHz", "nativeRefreshRateHz", "panelType"]
        },
        lagAnalysis: { type: Type.STRING, description: "Concise professional assessment of current input latency on this particular model." },
        hardwareOptimizationSteps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Title of setting or component" },
              instruction: { type: Type.STRING, description: "Exact step-by-step optimization adjustment" }
            },
            required: ["title", "instruction"]
          }
        },
        sensitivityTweaks: {
          type: Type.OBJECT,
          properties: {
            pointerSpeedMultiplier: { type: Type.NUMBER, description: "Suggested software speed multiplier or adjustment level" },
            touchAndHoldDelayMs: { type: Type.INTEGER, description: "Optimal screen response hold delay in ms" },
            advancedTweaks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Advanced system feature name" },
                  setting: { type: Type.STRING, description: "Target state (e.g. Enable/Disable/Multiplier)" },
                  reason: { type: Type.STRING, description: "Gaming benefit or reduction in buffer queues" }
                },
                required: ["name", "setting", "reason"]
              }
            }
          },
          required: ["pointerSpeedMultiplier", "touchAndHoldDelayMs", "advancedTweaks"]
        },
        brazilianSensi: {
          type: Type.OBJECT,
          properties: {
            dpi: { type: Type.INTEGER, description: "Suggested DPI / 'Menor Largura' for Android developer settings, or custom desktop DPI (e.g. 500, 640, 800, 960)" },
            geral: { type: Type.INTEGER, description: "Sensitivity value for General camera movement, scale 0-200" },
            redDot: { type: Type.INTEGER, description: "Sensitivity value for Red Dot, scale 0-200" },
            mira2x: { type: Type.INTEGER, description: "Sensitivity value for 2x Scope, scale 0-200" },
            mira4x: { type: Type.INTEGER, description: "Sensitivity value for 4x Scope, scale 0-200" },
            awm: { type: Type.INTEGER, description: "Sensitivity value for Sniper/AWM Scope, scale 0-200" },
            olhadinha: { type: Type.INTEGER, description: "Sensitivity value for Free Look, scale 0-200" },
            velocidadePonteiro: { type: Type.STRING, description: "Recommended Developer / Accessibility pointer speed configuration (e.g. 'Maximum speed', '9/10', 'Fast')" },
            capacidadeCapa: { type: Type.STRING, description: "Explanation of how this configuration helps headshot alignment / swipe-up drag headshots, in English only." }
          },
          required: ["dpi", "geral", "redDot", "mira2x", "mira4x", "awm", "olhadinha", "velocidadePonteiro", "capacidadeCapa"]
        },
        adbOrRegTweaks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              environment: { type: Type.STRING, description: "Target terminal environment (e.g. ADB, CMD, Registry, Shell)" },
              command: { type: Type.STRING, description: "The exact copy-pasteable shell command or registry parameter change" },
              description: { type: Type.STRING, description: "What this command updates or bypasses in hardware driver queue" }
            },
            required: ["environment", "command", "description"]
          }
        },
        proGamerTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top 3 elite recommendations to stabilize FPS or bypass system touch buffers."
        }
      },
      required: [
        "deviceInfo",
        "lagAnalysis",
        "hardwareOptimizationSteps",
        "sensitivityTweaks",
        "brazilianSensi",
        "adbOrRegTweaks",
        "proGamerTips"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: instructions,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini optimization error:", error);
    res.status(500).json({ 
      error: "Failed to generate optimized parameters.",
      details: error.message || error 
    });
  }
});

export default app;
