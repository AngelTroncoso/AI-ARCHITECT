import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    level: 1,
    stars: 1,
    title: {
      es: 'Nivel 1: NOVATO — Optimiza el modelo para móvil',
      en: 'Level 1: NOVICE — Mobile Model Compression',
      zh: '第1关：新手 — 移动端模型压缩'
    },
    subtitle: {
      es: 'Comprime el peso del modelo a menos de 100 MB mediante cuantización INT8.',
      en: 'Compress model size to under 100 MB using INT8 quantization.',
      zh: '通过INT8量化将模型大小压缩至100 MB以下。'
    },
    description: {
      es: 'El modelo original ocupa demasiado espacio en dispositivos móviles. Completa la función de cuantización dinámica para reducir la precisión de Float32 a Int8 manteniendo una precisión mayor al 90%.',
      en: 'The original model is too heavy for mobile edge devices. Complete dynamic quantization from Float32 to Int8 while maintaining over 90% accuracy.',
      zh: '原始模型对于移动边缘设备来说过于庞大。在保持90%以上精度的同时，完成从Float32到Int8的动态量化。'
    },
    badgeName: 'Compressor',
    badgeIcon: '📦',
    xpReward: 100,
    targetMetrics: {
      maxSizeMb: 100,
      minAccuracy: 90.0,
      maxLatencyMs: 120
    },
    hint: {
      es: '💡 PISTA DE JENSEN: Usa `torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)` para reducir tensores a INT8.',
      en: '💡 JENSEN HINT: Use `torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)` to convert weights to INT8.',
      zh: '💡 詹森提示：使用 `torch.quantization.quantize_dynamic` 将权重转换为INT8。'
    },
    mentorId: 'jensen-huang',
    starterCode: {
      python: `# ⭐ RETO NIVEL 1: Optimizar modelo para móvil (< 100MB)
from transformers import AutoModel, AutoTokenizer
import torch

def optimize_mobile_model(model_name="bert-base-uncased"):
    """
    TODO: Implementar cuantización dinámica INT8
    OBJETIVO: Tamaño < 100 MB, Precisión >= 90%
    """
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    
    # ✏️ TODO: Escribe tu código de cuantización aquí
    # HINT: Usar torch.quantization.quantize_dynamic
    
    quantized_model = torch.quantization.quantize_dynamic(
        model,
        {torch.nn.Linear}, # Capas a cuantizar
        dtype=torch.qint8  # Cambiar float32 -> int8
    )
    
    # Reducir capas no esenciales (Head Pruning opcional)
    # quantized_model.prune_heads({0: [1, 2], 1: [0]})
    
    return quantized_model
`,
      javascript: `// ⭐ RETO NIVEL 1: Ejecutar modelo comprimido en navegador
import * as tf from '@tensorflow/tfjs';

async function optimizeMobileModel() {
  // Cargar modelo base
  // ✏️ TODO: Reducir precisión de float32 a int8/float16
  tf.setBackend('webgl'); // Aceleración GPU en navegador
  
  const modelConfig = {
    quantizationBytes: 1, // 1 Byte = INT8
    pruneThreshold: 0.15
  };
  
  console.log("Optimizando tensores para WebGL...");
  return modelConfig;
}
`,
      cpp: `// ⭐ RETO NIVEL 1: CUDA Kernel Quantization
#include <cuda_runtime.h>

__global__ void quantize_float_to_int8(const float* input, int8_t* output, float scale, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        // ✏️ TODO: Convertir float32 a int8 escalado
        output[idx] = (int8_t)(input[idx] * scale);
    }
}
`
    },
    videoLesson: {
      mentorName: 'Jensen Huang (NVIDIA)',
      title: {
        es: 'Domina los Tensor Cores y Cuantización INT8',
        en: 'Mastering Tensor Cores and INT8 Quantization',
        zh: '掌握Tensor Core与INT8量化'
      },
      summary: {
        es: 'Aprende cómo la cuantización reduce el ancho de banda necesario en memoria sin perder representatividad vectorial.',
        en: 'Learn how quantization cuts memory bandwidth bottlenecks without degrading vector representations.',
        zh: '了解量化如何在不降低向量表示能力的前提下大幅节省内存带宽。'
      }
    }
  },
  {
    id: 2,
    level: 2,
    stars: 2,
    title: {
      es: 'Nivel 2: INTERMEDIO — Acelera la Inferencia en GPU',
      en: 'Level 2: INTERMEDIATE — Accelerate GPU Inference',
      zh: '第2关：中级 — 加速GPU推理'
    },
    subtitle: {
      es: 'Reduce la latencia de inferencia a menos de 50 ms implementando FlashAttention y KV-Cache.',
      en: 'Reduce inference latency below 50 ms using FlashAttention and KV-Cache.',
      zh: '利用FlashAttention与KV-Cache将推理延迟降低至50 ms以下。'
    },
    description: {
      es: 'Las solicitudes secuenciales están ralentizando el servidor. Agrega procesamiento por lotes dinámico (Batching) e implementa Key-Value Caching en la atención multicabeza para no recalcular tensores pasados.',
      en: 'Sequential requests are choking the inference server. Implement dynamic batching and Key-Value Cache on multi-head attention to avoid recomputing historical tokens.',
      zh: '顺序请求导致推理服务器拥堵。实现动态批处理与键值缓存（KV-Cache），避免重复计算历史Token。'
    },
    badgeName: 'Speed Demon',
    badgeIcon: '⚡',
    xpReward: 250,
    targetMetrics: {
      maxLatencyMs: 50,
      maxCostPer1k: 0.08,
      minAccuracy: 89.0
    },
    hint: {
      es: '💡 PISTA DE DEMIS: Utiliza `past_key_values` para activar KV-Caching y habilita `use_cache=True` en la pasada de inferencia.',
      en: '💡 DEMIS HINT: Pass `past_key_values` and enable `use_cache=True` during forward passes.',
      zh: '💡 德米斯提示：在前向传播中传递 `past_key_values` 并启用 `use_cache=True`。'
    },
    mentorId: 'demis-hassabis',
    starterCode: {
      python: `# ⭐ RETO NIVEL 2: Acelerar inferencia (< 50ms)
import torch
import time

class FastAttentionInference:
    def __init__(self, model):
        self.model = model
        self.kv_cache = None

    def predict_with_kv_cache(self, input_ids):
        """
        ✏️ TODO: Implementar KV-Cache y FlashAttention dynamic batching
        OBJETIVO: Latencia < 50ms
        """
        with torch.no_grad():
            if self.kv_cache is None:
                # Primera pasada completa
                outputs = self.model(input_ids, use_cache=True)
                self.kv_cache = outputs.past_key_values
            else:
                # Pasada incremental solo para el último token
                outputs = self.model(
                    input_ids[:, -1:], 
                    past_key_values=self.kv_cache, 
                    use_cache=True
                )
                self.kv_cache = outputs.past_key_values

        return outputs
`,
      javascript: `// ⭐ RETO NIVEL 2: Dynamic Batch Processing en JS
async function runBatchInference(requestsBatch) {
  // ✏️ TODO: Fusionar tensores de entrada con tf.concat()
  const batchedTensors = tf.tidy(() => {
    return tf.stack(requestsBatch.map(r => r.tensor));
  });
  
  // Inferencia paralelizada
  return batchedTensors;
}
`,
      cpp: `// ⭐ RETO NIVEL 2: Shared Memory Attention Matrix
#include <cuda_runtime.h>

__global__ void flash_attention_kernel(float* Q, float* K, float* V, float* O, int N) {
    extern __shared__ float shared_mem[];
    // ✏️ TODO: Tile-blocking for Softmax dot product
}
`
    },
    videoLesson: {
      mentorName: 'Demis Hassabis (Google DeepMind)',
      title: {
        es: 'Mecanismo de Atención y Complejidad O(N²)',
        en: 'Attention Mechanisms & O(N²) Complexity',
        zh: '注意力机制与O(N²)复杂度'
      },
      summary: {
        es: 'Comprende cómo FlashAttention reorganiza los bloques de matriz en memoria SRAM para evitar accesos lentos a la HBM de la GPU.',
        en: 'Understand how FlashAttention tiles matrix blocks in SRAM to avoid slow GPU HBM memory accesses.',
        zh: '理解FlashAttention如何在SRAM中平铺矩阵块，以避免对GPU HBM的高延迟访问。'
      }
    }
  },
  {
    id: 3,
    level: 3,
    stars: 3,
    title: {
      es: 'Nivel 3: AVANZADO — Reduce Costos de Memoria un 30%',
      en: 'Level 3: ADVANCED — Reduce Memory & Cost by 30%',
      zh: '第3关：高级 — 降低30%内存与成本'
    },
    subtitle: {
      es: 'Reduce el costo de inferencia/1k tokens a menos de $0.05 usando Gradient Checkpointing y Pruning.',
      en: 'Cut inference cost under $0.05 per 1k tokens with Gradient Checkpointing and Head Pruning.',
      zh: '利用梯度检查点与注意力头剪枝，将每1k Token的成本降至$0.05以下。'
    },
    description: {
      es: 'El costo por mil peticiones de la empresa se ha disparado. Implementa Gradient Checkpointing para reducir el consumo de VRAM y poda las cabezas de atención con menor contribución al gradiente.',
      en: 'Inference operational costs are soaring. Implement Gradient Checkpointing to cut VRAM footprint and prune low-saliency attention heads.',
      zh: '推理运行成本飙升。实现梯度检查点以减少VRAM占用，并剪枝显著性较低的注意力头。'
    },
    badgeName: 'Cost Architect',
    badgeIcon: '💎',
    xpReward: 500,
    targetMetrics: {
      maxCostPer1k: 0.05,
      maxLatencyMs: 60,
      minAccuracy: 91.0
    },
    hint: {
      es: '💡 PISTA DE YANN LECUN: Poda el 30% de las cabezas de atención redundantes usando `model.prune_heads({layer: [heads]})`.',
      en: '💡 YANN LECUN HINT: Prune 30% redundant attention heads using `model.prune_heads(...)`.',
      zh: '💡 扬·立昆提示：使用 `model.prune_heads` 剪枝30%的冗余注意力头。'
    },
    mentorId: 'yann-lecun',
    starterCode: {
      python: `# ⭐ RETO NIVEL 3: Reducción de Costos ($0.05 / 1k)
import torch

def optimize_vram_and_prune(model):
    """
    ✏️ TODO: Implementar Gradient Checkpointing y Head Pruning
    OBJETIVO: Costo/1K < $0.05
    """
    # 1. Habilitar Gradient Checkpointing para liberar memoria intermedia
    model.gradient_checkpointing_enable()
    
    # 2. Poda de cabezas de atención inactivas
    heads_to_prune = {
        0: [1, 3, 5], # Capa 0
        1: [0, 2],    # Capa 1
        2: [4, 7]     # Capa 2
    }
    model.prune_heads(heads_to_prune)
    
    print("Cabezas podadas exitosamente. VRAM liberada en 32%.")
    return model
`,
      javascript: `// ⭐ RETO NIVEL 3: Memoria baja en Node.js
async function memoryEfficientRun(model) {
  // ✏️ TODO: Usar tf.dispose() y tf.tidy()
  return tf.tidy(() => {
    // Liberar tensores intermedios
    return model.predict(tf.zeros([1, 128]));
  });
}
`,
      cpp: `// ⭐ RETO NIVEL 3: Memory Pool Allocator
#include <cuda_runtime.h>

class CudaMemoryPool {
public:
    void* allocate(size_t bytes) {
        // ✏️ TODO: Reutilización de punteros de memoria
        return nullptr;
    }
};
`
    },
    videoLesson: {
      mentorName: 'Yann LeCun (Meta AI)',
      title: {
        es: 'Poda de Redes Neuronal y Código Abierto',
        en: 'Neural Network Pruning & Open Science',
        zh: '神经网络剪枝与开源科学'
      },
      summary: {
        es: 'Descubre cómo la redundancia de parámetros en LLMs permite eliminar hasta un 40% de pesos sin alterar las respuestas.',
        en: 'Discover how parameter redundancy allows pruning up to 40% of weights without losing reasoning accuracy.',
        zh: '发现LLM中的参数冗余如何允许在不丧失推理活性的情况下剪枝高达40%的权重。'
      }
    }
  },
  {
    id: 4,
    level: 4,
    stars: 4,
    title: {
      es: 'Nivel 4: MAESTRÍA — Arquitectura Híbrida (CPU + GPU + NPU)',
      en: 'Level 4: MASTERY — Hybrid Architecture (CPU+GPU+NPU)',
      zh: '第4关：大师 — 混合架构（CPU+GPU+NPU）'
    },
    subtitle: {
      es: 'Diseña una canalización heterogénea completa para máxima eficiencia energética y cero latencia perceptible.',
      en: 'Build a complete heterogeneous pipeline for peak energy efficiency and sub-30ms latency.',
      zh: '构建完整的异构流水线，实现峰值能源效率与30ms以下的超低延迟。'
    },
    description: {
      es: 'El desafío final. Distribuye capas ligeras a la NPU del dispositivo, capas de atención densa a la GPU y tareas de tokenización/preproceso a la CPU en paralelo.',
      en: 'The ultimate architect challenge. Offload lightweight layers to NPU, dense attention to GPU, and tokenization to CPU in parallel.',
      zh: '终极架构师挑战。将轻量图层卸载到NPU，密集注意力卸载到GPU，标记化在CPU并行处理。'
    },
    badgeName: 'AI Architect Master',
    badgeIcon: '👑',
    xpReward: 1000,
    targetMetrics: {
      maxLatencyMs: 35,
      maxSizeMb: 80,
      maxCostPer1k: 0.03,
      minAccuracy: 92.5
    },
    hint: {
      es: '💡 PISTA DE SAM ALTMAN & ELON MUSK: Orquesta con pipelines asíncronos y cuantización mixta (FP8 para GPU, INT4 para NPU).',
      en: '💡 SAM & ELON HINT: Orchestrate asynchronous streams with mixed precision (FP8 for GPU, INT4 for NPU).',
      zh: '💡 萨姆与埃隆提示：使用混合精度（GPU使用FP8，NPU使用INT4）编排异步流。'
    },
    mentorId: 'sam-altman',
    starterCode: {
      python: `# ⭐ RETO NIVEL 4: Arquitectura Híbrida Heterogénea
import torch
import concurrent.futures

class HybridAIArchitectPipeline:
    def __init__(self, model_name):
        self.device_cpu = torch.device("cpu")
        self.device_gpu = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
    def execute_hybrid_inference(self, prompt_tokens):
        """
        ✏️ TODO: Enrutar tensores entre NPU (INT4), GPU (FP8/INT8) y CPU
        OBJETIVO: Latencia < 35ms, Costo/1K < $0.03
        """
        # 1. Tokenización y embeddings en CPU
        embeddings = prompt_tokens.to(self.device_cpu)
        
        # 2. Capas de atención en GPU paralelizada
        attention_out = embeddings.to(self.device_gpu)
        
        # 3. Capas MLP en NPU / TensorRT
        
        return attention_out
`,
      javascript: `// ⭐ RETO NIVEL 4: WebGPU + WebAssembly Hybrid Engine
async function hybridBrowserEngine(tokens) {
  // ✏️ TODO: Repartir trabajo entre WebAssembly (CPU) y WebGPU
  console.log("Desplegando motor híbrido heterogéneo...");
  return { success: true, latencyMs: 28 };
}
`,
      cpp: `// ⭐ RETO NIVEL 4: Heterogeneous CUDA Stream Orchestrator
#include <cuda_runtime.h>

void launch_hybrid_pipeline() {
    cudaStream_t stream1, stream2;
    cudaStreamCreate(&stream1);
    cudaStreamCreate(&stream2);
    // ✏️ TODO: Concurrent kernel launch across streams
}
`
    },
    videoLesson: {
      mentorName: 'Sam Altman & Elon Musk',
      title: {
        es: 'La Frontera de la IA: Heterogeneidad y Escala',
        en: 'The Frontier of AI: Heterogeneity & Scale',
        zh: 'AI的前沿：异构性与规模化'
      },
      summary: {
        es: 'Una lección maestra sobre cómo la próxima generación de modelos dependerá de chips especializados NPU/TPU y redes neuronales mixtas.',
        en: 'A masterclass on how next-gen AI will rely on specialized NPUs, TPUs, and mixed precision networks.',
        zh: '关于下一代AI将如何依赖专业NPU、TPU和混合精度网络的专精课程。'
      }
    }
  }
];
