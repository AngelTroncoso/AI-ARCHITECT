import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

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

// API 5: Low-Latency Quick Hint (Model: gemini-3.1-flash-lite)
app.post("/api/quick-hint", async (req, res) => {
  try {
    const { code, progLang, userLang } = req.body;
    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: `Analiza rápido este código en ${progLang || 'python'} y da un solo consejo de 1 frase en ${userLang === 'es' ? 'español' : 'inglés'}:\n\`\`\`\n${code}\n\`\`\``,
        config: {
          systemInstruction: "Eres un copiloto de optimización de compiladores GPU ultra rápido. Responde en máximo 25 palabras con un tip directo.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
        }
      });
      return res.json({ hint: response.text });
    }
    return res.json({ hint: "⚡ Tip rápido: Agrega `quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)` para reducir 75% de VRAM." });
  } catch (err: any) {
    console.error("Quick hint error:", err);
    res.json({ hint: "⚡ Consejo: Usa `use_cache=True` en la atención autoregresiva para acelerar la latencia." });
  }
});

// API 6: High Thinking Mode Evaluation (Model: gemini-3.1-pro-preview with ThinkingLevel.HIGH)
app.post("/api/deep-think-eval", async (req, res) => {
  try {
    const { code, challenge, userLang } = req.body;
    const ai = getGenAIClient();
    if (ai) {
      const prompt = `Calcula el análisis matemático profundo de tensores, consumo de memoria VRAM, bandwidth de GPU, FLOPS y matriz de atención para este código:\n\`\`\`\n${code}\n\`\`\`\nDesafío: ${challenge?.title?.es || "AGI Challenge"}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "Eres el científico jefe de supercomputación y arquitectura de aceleradores hardware de OpenAI/Google DeepMind. Analiza en detalle los cuellos de botella de memoria y FLOPS con alto razonamiento.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });
      return res.json({ analysis: response.text });
    }
    return res.json({
      analysis: `### 🧠 Análisis de Razonamiento Profundo (Thinking Level: HIGH)\n- **Análisis de Memoria VRAM**: Los pesos en FP32 consumen 4 bytes/parámetro. La conversión a INT8 reduce a 1 byte/parámetro, disminuyendo el ancho de banda requerido en GPU de 1.2 TB/s a 300 GB/s.\n- **Matriz de Atención**: Se evita $O(N^2)$ al almacenar KV-Cache, convirtiendo la fase de decodificación en $O(1)$ por token.\n- **Cuello de Botella**: Bound por anchos de banda de memoria (Memory-Bound kernel). Se recomienda alineación de tensores a 128-bits.`
    });
  } catch (err: any) {
    console.error("Deep think error:", err);
    res.status(500).json({ error: "Failed to execute deep thinking analysis" });
  }
});

// API 7: Google Search Grounding for Live AI Benchmarks (Model: gemini-3.6-flash + googleSearch)
app.post("/api/search-grounding", async (req, res) => {
  try {
    const { query, userLang } = req.body;
    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: query || "Muestrame las ultimas métricas de benchmark y optimización de PyTorch vLLM y HuggingFace Open LLM Leaderboard 2026",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || "Fuente Web",
        uri: chunk.web?.uri || "#"
      })).filter((s: any) => s.uri !== "#");

      return res.json({
        text: response.text,
        sources
      });
    }
    return res.json({
      text: "De acuerdo con las últimas publicaciones de HuggingFace y PyTorch Docs:\n- **FlashAttention-3**: Proporciona hasta 1.8x de aceleración sobre H100 GPUs mediante asincronía de tensores.\n- **vLLM PagedAttention**: Reduce el desperdicio de memoria KV-Cache a menos del 4%.\n- **BitsAndBytes NF4**: Permite ejecutar LLaMA 70B en GPUs de consumo de 24GB VRAM.",
      sources: [
        { title: "HuggingFace Open LLM Leaderboard v2", uri: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard" },
        { title: "vLLM High-Throughput Engine Docs", uri: "https://docs.vllm.ai" },
        { title: "PyTorch 2.4 Quantization Guide", uri: "https://pytorch.org/docs/stable/quantization.html" }
      ]
    });
  } catch (err: any) {
    console.error("Search grounding error:", err);
    res.status(500).json({ error: "Search grounding failed" });
  }
});

// API 8: Google Maps Grounding for World AI Supercomputer Datacenters (Model: gemini-3.6-flash + googleMaps)
app.post("/api/maps-grounding", async (req, res) => {
  try {
    const { query } = req.body;
    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: query || "Ubica centros de datos de supercomputación de IA y GPU clusters en Estados Unidos como xAI Colossus Memphis, OpenAI Stargate Texas, Google Council Bluffs Iowa",
        config: {
          tools: [{ googleMaps: {} }]
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapLinks = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || chunk.maps?.title || "Centro de Datos IA",
        uri: chunk.web?.uri || chunk.maps?.uri || "https://maps.google.com"
      }));

      return res.json({
        text: response.text,
        mapLinks
      });
    }
    return res.json({
      text: "🌐 **Clusters y Datacenters Principales de IA Globales**:\n1. **xAI Colossus Cluster** - Memphis, Tennessee, EE. UU. (100,000 GPUs NVIDIA H100/H200).\n2. **Google Cloud Data Center** - Council Bluffs, Iowa, EE. UU. (Infraestructura principal para modelos Gemini).\n3. **OpenAI Stargate Supercomputer** - Abilene, Texas, EE. UU. (100,000+ GPUs Blackwell B200).\n4. **TSMC Fab 18 Advanced Node** - Tainan, Taiwán (Fabricación de chips de IA de 3nm/2nm).",
      mapLinks: [
        { title: "Memphis xAI Colossus GPU Cluster (Google Maps)", uri: "https://maps.google.com/?q=Memphis+Tennessee+Data+Center" },
        { title: "Council Bluffs Google AI Data Center (Google Maps)", uri: "https://maps.google.com/?q=Council+Bluffs+Iowa+Google+Data+Center" },
        { title: "Abilene Texas Stargate Site (Google Maps)", uri: "https://maps.google.com/?q=Abilene+Texas" }
      ]
    });
  } catch (err: any) {
    console.error("Maps grounding error:", err);
    res.status(500).json({ error: "Maps grounding failed" });
  }
});

// API 9: Audio Transcription (Model: gemini-3.6-flash audio input)
app.post("/api/transcribe-audio", async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) return res.status(400).json({ error: "No audio data provided" });

    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "audio/wav",
                data: audioBase64
              }
            },
            {
              text: "Transcripción exacta del audio ingresado por el usuario sobre optimización de modelos de IA:"
            }
          ]
        }
      });
      return res.json({ transcription: response.text });
    }
    return res.json({ transcription: "Quiero reducir el tamaño de mi modelo LLaMA usando cuantización de 8 bits sin perder más del 1% de precisión." });
  } catch (err: any) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Audio transcription failed" });
  }
});

// API 10: Generate AI Avatar/Badge Image (Model: gemini-3.1-flash-lite-image)
app.post("/api/generate-ai-avatar", async (req, res) => {
  try {
    const { prompt, mentorName } = req.body;
    const ai = getGenAIClient();
    if (ai) {
      const fullPrompt = prompt || `Futuristic pixel-art cybernetic avatar badge of AI mentor ${mentorName || 'Sam Altman'}, neon glowing, highly detailed 8-bit game style.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: fullPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          return res.json({ imageUrl });
        }
      }
    }
    return res.json({ imageUrl: null });
  } catch (err: any) {
    console.error("Generate avatar error:", err);
    res.json({ imageUrl: null });
  }
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
