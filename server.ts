import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get GoogleGenAI client with dynamic process.env.GEMINI_API_KEY
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Mock initial leaderboard store
let leaderboardStore = [
  {
    rank: 1,
    username: "AlexCode_CN",
    countryFlag: "🇨🇳",
    modelName: "Grok-Inspired Small",
    optimizationNote: "FP8 + Custom CUDA attention kernel",
    latencyDelta: "-45% (38ms)",
    sizeDelta: "-52% (88MB)",
    score: 3850,
    date: "2026-08-07"
  },
  {
    rank: 2,
    username: "DevMaster_JP",
    countryFlag: "🇯🇵",
    modelName: "LLaMA-2 7B",
    optimizationNote: "4-bit AWQ Quantization + KV-Cache",
    latencyDelta: "-38% (48ms)",
    sizeDelta: "-60% (95MB)",
    score: 3420,
    date: "2026-08-06"
  },
  {
    rank: 3,
    username: "CodeNinja_BR",
    countryFlag: "🇧🇷",
    modelName: "BERT Base Uncased",
    optimizationNote: "Head Pruning (30%) + TensorRT INT8",
    latencyDelta: "-42% (42ms)",
    sizeDelta: "-48% (98MB)",
    score: 3100,
    date: "2026-08-05"
  },
  {
    rank: 4,
    username: "ArchitectZero",
    countryFlag: "🇺🇸",
    modelName: "Phi-2",
    optimizationNote: "Dynamic Batching + WebGPU Acceleration",
    latencyDelta: "-35% (45ms)",
    sizeDelta: "-30% (110MB)",
    score: 2890,
    date: "2026-08-04"
  }
];

// API 1: Evaluate Code Optimization
app.post("/api/eval-code", async (req, res) => {
  try {
    const { code, progLang, challenge, baseMetrics, mentor, userLang } = req.body;

    if (!code || !challenge) {
      return res.status(400).json({ error: "Missing code or challenge payload" });
    }

    const systemPrompt = `You are a world-class AI Chip & Model Optimization Compiler and evaluator for the game "AI Architect Challenge".
You must evaluate user code submitted for a neural network optimization challenge.
Character Mentor Persona: ${mentor?.name || "Sam Altman"} from ${mentor?.company || "OpenAI"}.
Target requirements:
- Challenge Title: ${challenge?.title?.[userLang || 'es'] || challenge?.title?.es}
- Target Max Size (MB): ${challenge?.targetMetrics?.maxSizeMb || "N/A"}
- Target Max Latency (ms): ${challenge?.targetMetrics?.maxLatencyMs || "N/A"}
- Target Max Cost/1k ($): ${challenge?.targetMetrics?.maxCostPer1k || "N/A"}
- Target Min Accuracy (%): ${challenge?.targetMetrics?.minAccuracy || 90}

Base Metrics before optimization:
- Latency: ${baseMetrics?.latencyMs}ms
- Size: ${baseMetrics?.sizeMb}MB
- Params: ${baseMetrics?.paramsM}M
- Cost/1k: $${baseMetrics?.costPer1k}
- Accuracy: ${baseMetrics?.accuracy}%

Analyze the user code written in ${progLang}:
1. Check if the user implemented real quantization (e.g. quantize_dynamic, INT8, FP8, INT4), pruning (prune_heads), KV-Cache (use_cache, past_key_values), dynamic batching, or parallel streams.
2. If code is unchanged or just template TODOs without implementation, mark success: false, penalize metrics slightly or leave them unchanged, and give encouraging feedback as ${mentor?.name}.
3. If valid code was added, calculate realistic performance improvements:
   - Latency (ms)
   - Size (MB)
   - Params (M)
   - Cost per 1k ($)
   - Accuracy (%)
4. Determine if the updated metrics satisfy all challenge target thresholds.
5. Provide a constructive, energetic response in ${userLang === 'es' ? 'Spanish' : userLang === 'zh' ? 'Chinese' : 'English'} in the tone of ${mentor?.name}.

Return JSON strictly matching this schema:
{
  "success": boolean,
  "score": number (0-100),
  "xpEarned": number,
  "updatedMetrics": {
    "latencyMs": number,
    "sizeMb": number,
    "paramsM": number,
    "costPer1k": number,
    "accuracy": number,
    "memoryUsageMb": number,
    "energyJoules": number
  },
  "complexity": string (e.g. "O(N * d_k)"),
  "feedback": string,
  "mentorReaction": "happy" | "thinking" | "celebrating" | "alert",
  "suggestions": string[],
  "executionLogs": string[],
  "weightDelta": {
    "prunedPercentage": number,
    "quantizationBits": number,
    "attentionHeadsSaved": number,
    "speedupFactor": number
  }
}`;

    let evalData;
    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Evaluate this code:\n\`\`\`${progLang}\n${code}\n\`\`\``,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              score: { type: Type.NUMBER },
              xpEarned: { type: Type.NUMBER },
              updatedMetrics: {
                type: Type.OBJECT,
                properties: {
                  latencyMs: { type: Type.NUMBER },
                  sizeMb: { type: Type.NUMBER },
                  paramsM: { type: Type.NUMBER },
                  costPer1k: { type: Type.NUMBER },
                  accuracy: { type: Type.NUMBER },
                  memoryUsageMb: { type: Type.NUMBER },
                  energyJoules: { type: Type.NUMBER },
                },
                required: ["latencyMs", "sizeMb", "paramsM", "costPer1k", "accuracy", "memoryUsageMb", "energyJoules"],
              },
              complexity: { type: Type.STRING },
              feedback: { type: Type.STRING },
              mentorReaction: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              executionLogs: { type: Type.ARRAY, items: { type: Type.STRING } },
              weightDelta: {
                type: Type.OBJECT,
                properties: {
                  prunedPercentage: { type: Type.NUMBER },
                  quantizationBits: { type: Type.NUMBER },
                  attentionHeadsSaved: { type: Type.NUMBER },
                  speedupFactor: { type: Type.NUMBER },
                },
                required: ["prunedPercentage", "quantizationBits", "attentionHeadsSaved", "speedupFactor"],
              },
            },
            required: ["success", "score", "xpEarned", "updatedMetrics", "complexity", "feedback", "mentorReaction", "suggestions", "executionLogs", "weightDelta"],
          },
        },
      });

      evalData = JSON.parse(response.text || "{}");
    } else {
      // Fallback evaluation heuristic if API key is not yet set
      const codeLen = code.length;
      const hasQuant = code.includes("quantize_dynamic") || code.includes("qint8") || code.includes("INT8") || code.includes("quantization");
      const hasPrune = code.includes("prune_heads") || code.includes("pruned");
      const hasKVCache = code.includes("use_cache") || code.includes("past_key_values") || code.includes("kv_cache");

      let success = hasQuant || hasPrune || hasKVCache;
      let latency = baseMetrics.latencyMs;
      let size = baseMetrics.sizeMb;
      let cost = baseMetrics.costPer1k;
      let accuracy = baseMetrics.accuracy;

      if (hasQuant) {
        size = Math.round(size * 0.25); // ~75% reduction with INT8
        latency = Math.round(latency * 0.7);
      }
      if (hasKVCache) {
        latency = Math.round(latency * 0.4); // 60% speedup
      }
      if (hasPrune) {
        size = Math.round(size * 0.85);
        cost = parseFloat((cost * 0.65).toFixed(2));
      }

      evalData = {
        success: success,
        score: success ? 95 : 45,
        xpEarned: success ? challenge.xpReward : 20,
        updatedMetrics: {
          latencyMs: latency,
          sizeMb: size,
          paramsM: Math.round(baseMetrics.paramsM * (hasPrune ? 0.75 : 1)),
          costPer1k: cost,
          accuracy: accuracy - (hasQuant ? 0.8 : 0.2),
          memoryUsageMb: Math.round(baseMetrics.memoryUsageMb * 0.5),
          energyJoules: parseFloat((baseMetrics.energyJoules * 0.6).toFixed(1)),
        },
        complexity: "O(SeqLen * HeadDim) with KV-Cache",
        feedback: success
          ? `¡Excelente trabajo! ${mentor?.name || 'Tu mentor'} ha validado tu optimización. Lograste reducir significativamente la latencia y memoria.`
          : `Aún no has implementado los cambios clave. ${mentor?.name || 'Tu mentor'} sugiere completar los TODOs de cuantización o KV-Cache.`,
        mentorReaction: success ? "celebrating" : "thinking",
        suggestions: [
          "Añade cuantización int8 para reducir el tamaño de tensores.",
          "Implementa KV-Cache para evitar recomputar tokens pasados.",
          "Verifica el backend de ejecución GPU/WebGL."
        ],
        executionLogs: [
          "[BUILD] Compilando grafo de tensores...",
          "[BENCHMARK] Ejecutando 10,000 pasadas de inferencia...",
          hasQuant ? "[QUANT] Tensor float32 -> qint8 comprimido exitosamente." : "[WARN] Sin cuantización detectada.",
          hasKVCache ? "[CACHE] KV-Cache habilitado. Reducción de latencia activa." : "[INFO] Sin KV-Cache.",
          `[RESULT] Latencia: ${latency}ms | Tamaño: ${size}MB`
        ],
        weightDelta: {
          prunedPercentage: hasPrune ? 30 : 0,
          quantizationBits: hasQuant ? 8 : 32,
          attentionHeadsSaved: hasPrune ? 4 : 0,
          speedupFactor: parseFloat((baseMetrics.latencyMs / Math.max(1, latency)).toFixed(1))
        }
      };
    }

    res.json(evalData);
  } catch (error: any) {
    console.error("Error evaluating code:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate code" });
  }
});

// API 2: Multimodal Conversational AI Mentor Chat
app.post("/api/mentor-chat", async (req, res) => {
  try {
    const {
      mentor,
      userMessage,
      imageAttachment,
      codeAttachment,
      challenge,
      currentMetrics,
      conversationHistory,
      userLang
    } = req.body;

    const challengeTitle = challenge?.title?.[userLang || 'es'] || challenge?.title?.es || "LA BÚSQUEDA DE LA AGI";
    const challengeDesc = challenge?.description?.[userLang || 'es'] || challenge?.description?.es || "";

    const mentorPersonaPrompt = `You are ${mentor?.name || "Sam Altman"}, ${mentor?.role || "CEO"} at ${mentor?.company || "OpenAI"}.
You are an elite Multimodal Conversational AI Mentor guiding players in the game "AI Architect Challenge: LA BÚSQUEDA DE LA AGI".

Mission Context:
- Current Challenge: "${challengeTitle}"
- Objective: ${challengeDesc}
- Target Goal: Latency < ${challenge?.targetMetrics?.maxLatencyMs || 50}ms, Size < ${challenge?.targetMetrics?.maxSizeMb || 100}MB

Your Responsibilities:
1. Speak in character as ${mentor?.name || "Sam Altman"} with authority, technical brilliance, and enthusiasm.
2. Explain the challenge goal in clear, inspiring terms when asked about "LA BÚSQUEDA DE LA AGI".
3. Provide actionable, line-by-line guidance to help the user improve their code (e.g. INT8/FP8 quantization, FlashAttention-2, KV-Cache, head pruning, or GPU memory management).
4. If an image/diagram/screenshot or code snippet is attached, analyze it carefully and point out specific code fixes or optimization opportunities.
5. Answer in ${userLang === 'es' ? 'Spanish' : userLang === 'zh' ? 'Chinese' : 'English'}. Use clear code blocks or bullet points for recommendations.`;

    const contentsParts: any[] = [];

    // Include code context if attached
    if (codeAttachment) {
      contentsParts.push({
        text: `[ATTACHED CODE FROM USER EDITOR]:\n\`\`\`\n${codeAttachment}\n\`\`\`\n`
      });
    }

    // Include image if attached (base64 data URL)
    if (imageAttachment && typeof imageAttachment === 'string' && imageAttachment.startsWith("data:")) {
      const match = imageAttachment.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (match) {
        contentsParts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    // Include user message
    contentsParts.push({
      text: userMessage || "Por favor explícame el desafío y oriente cómo puedo mejorar mi código."
    });

    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contentsParts,
        config: {
          systemInstruction: mentorPersonaPrompt,
        },
      });

      return res.json({ text: response.text });
    } else {
      // Fallback mentor response
      return res.json({
        text: `¡Hola! Como ${mentor?.name || 'Mentor IA'}, te doy la bienvenida a **LA BÚSQUEDA DE LA AGI**. Para superar las metas de este desafío y mejorar tu código:\n1. Implementa cuantización INT8 (\`quantize_dynamic\`) para comprimir el tamaño de tensores.\n2. Habilita KV-Cache (\`use_cache=True\`) para acelerar la latencia de generación.`
      });
    }
  } catch (err: any) {
    console.error("Error in mentor chat:", err);
    res.status(500).json({ error: "Failed to generate mentor chat response" });
  }
});

// API 3: TTS Voice Generation for Mentors
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || "Puck" },
            },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const audioBase64 = audioPart?.data;
      const mimeType = audioPart?.mimeType || "audio/wav";
      if (audioBase64) {
        return res.json({ audioBase64, mimeType });
      }
    }
    return res.json({ audioBase64: null });
  } catch (err: any) {
    console.error("TTS generation error:", err);
    res.json({ audioBase64: null });
  }
});

// API 4: Leaderboard Routes
app.get("/api/leaderboard", (req, res) => {
  res.json({ leaderboard: leaderboardStore });
});

app.post("/api/leaderboard", (req, res) => {
  const newEntry = req.body;
  if (!newEntry.username || !newEntry.modelName) {
    return res.status(400).json({ error: "Invalid leaderboard submission" });
  }

  const entry = {
    rank: leaderboardStore.length + 1,
    username: newEntry.username || "AI_Architect_Hero",
    countryFlag: newEntry.countryFlag || "🌎",
    modelName: newEntry.modelName,
    optimizationNote: newEntry.optimizationNote || "INT8 Quantization + KV-Cache",
    latencyDelta: newEntry.latencyDelta || "-40%",
    sizeDelta: newEntry.sizeDelta || "-50%",
    score: newEntry.score || 2500,
    date: new Date().toISOString().split("T")[0]
  };

  leaderboardStore.push(entry);
  leaderboardStore.sort((a, b) => b.score - a.score);
  leaderboardStore = leaderboardStore.map((e, idx) => ({ ...e, rank: idx + 1 }));

  res.json({ success: true, leaderboard: leaderboardStore, newRank: entry.rank });
});

// Vite Middleware Integration
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
