import { MentorCharacter } from '../types';

export const CHARACTERS: MentorCharacter[] = [
  {
    id: 'sam-altman',
    name: 'Sam Altman',
    company: 'OpenAI',
    role: 'CEO & Co-founder',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sam_Altman_crop.jpg/800px-Sam_Altman_crop.jpg',
    color: '#10a37f',
    voiceName: 'Puck',
    greeting: {
      es: '¡Hola! Soy Sam Altman de OpenAI. Necesito tu ayuda para escalar modelos de lenguaje de forma eficiente.',
      en: "Hi! I'm Sam Altman from OpenAI. I need your help scaling language models efficiently.",
      zh: '你好！我是OpenAI around Sam Altman。我们需要你的帮助来高效扩展语言模型。'
    },
    bio: {
      es: 'Líder en la revolución de los Grandes Modelos de Lenguaje (LLMs) y la búsqueda de AGI.',
      en: 'Leader in the LLM revolution and the pursuit of Artificial General Intelligence.',
      zh: '大语言模型革命和通用人工智能（AGI）追求的领军人物。'
    },
    customAdvice: {
      es: 'Intenta reducir la atención redundante con Kv-Cache o cuantización dynamic a INT8.',
      en: 'Try reducing redundant attention using KV-Cache or dynamic INT8 quantization.',
      zh: '尝试使用KV-Cache或动态INT8量化来减少冗余注意力。'
    },
    models: [
      {
        id: 'gpt2',
        name: 'GPT-2',
        hfTag: 'openai-community/gpt2',
        type: 'pequeño',
        baseMetrics: {
          latencyMs: 140,
          sizeMb: 500,
          paramsM: 124,
          costPer1k: 0.12,
          accuracy: 91.2,
          memoryUsageMb: 850,
          energyJoules: 4.2,
        },
        description: {
          es: 'Modelo autoregresivo clásico de 124M parámetros.',
          en: 'Classic 124M parameter autoregressive transformer.',
          zh: '经典的124M参数自回归Transformer模型。'
        }
      },
      {
        id: 'distilgpt2',
        name: 'DistilGPT-2',
        hfTag: 'distilbert/distilgpt2',
        type: 'optimizado',
        baseMetrics: {
          latencyMs: 78,
          sizeMb: 320,
          paramsM: 82,
          costPer1k: 0.08,
          accuracy: 89.8,
          memoryUsageMb: 512,
          energyJoules: 2.5,
        },
        description: {
          es: 'Versión destilada 33% más pequeña y 2x más rápida.',
          en: 'Distilled version 33% smaller and 2x faster.',
          zh: '蒸馏版本，体积缩小33%，速度提升2倍。'
        }
      },
      {
        id: 'gpt-neo-125m',
        name: 'GPT-Neo 125M',
        hfTag: 'EleutherAI/gpt-neo-125m',
        type: 'intermedio',
        baseMetrics: {
          latencyMs: 165,
          sizeMb: 520,
          paramsM: 125,
          costPer1k: 0.15,
          accuracy: 92.4,
          memoryUsageMb: 920,
          energyJoules: 5.1,
        },
        description: {
          es: 'Modelo denso open-source con atención local/global intercalada.',
          en: 'Dense open-source model with local/global attention layers.',
          zh: '带有局部/全局交替注意力的开源密集模型。'
        }
      }
    ]
  },
  {
    id: 'demis-hassabis',
    name: 'Demis Hassabis',
    company: 'Google DeepMind',
    role: 'CEO & Founder',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Demis_Hassabis_Royal_Society.jpg/800px-Demis_Hassabis_Royal_Society.jpg',
    color: '#4285f4',
    voiceName: 'Charon',
    greeting: {
      es: '¡Saludos! Soy Demis Hassabis de Google DeepMind. La neurociencia y las arquitecturas de atención son la clave.',
      en: "Greetings! I'm Demis Hassabis from Google DeepMind. Neuroscience and attention architectures are key.",
      zh: '你好！我是Google DeepMind的Demis Hassabis。神经科学和注意力架构是关键。'
    },
    bio: {
      es: 'Premio Nobel y pionero en aprendizaje por refuerzo, AlphaGo, AlphaFold y Gemini.',
      en: 'Nobel laureate and pioneer in RL, AlphaGo, AlphaFold, and Gemini.',
      zh: '诺贝尔奖获得者，强化学习、AlphaGo、AlphaFold和Gemini的先驱。'
    },
    customAdvice: {
      es: 'Observa la matriz de atención Softmax. Un Scaled Dot-Product eficiente evita la saturación de memoria en GPU.',
      en: 'Examine the Softmax attention matrix. Efficient Scaled Dot-Product avoids GPU memory saturation.',
      zh: '检查Softmax注意力矩阵。高效的缩放点积可以避免GPU内存饱和。'
    },
    models: [
      {
        id: 'bert-base-uncased',
        name: 'BERT Base Uncased',
        hfTag: 'google-bert/bert-base-uncased',
        type: 'pequeño',
        baseMetrics: {
          latencyMs: 150,
          sizeMb: 440,
          paramsM: 110,
          costPer1k: 0.14,
          accuracy: 93.1,
          memoryUsageMb: 800,
          energyJoules: 4.0,
        },
        description: {
          es: 'Modelo bidireccional estándar industrial para comprensión.',
          en: 'Industry standard bidirectional representation model.',
          zh: '用于自然语言理解的行业标准双向模型。'
        }
      },
      {
        id: 't5-small',
        name: 'T5 Small',
        hfTag: 'google-t5/t5-small',
        type: 'optimizado',
        baseMetrics: {
          latencyMs: 110,
          sizeMb: 242,
          paramsM: 60,
          costPer1k: 0.09,
          accuracy: 90.5,
          memoryUsageMb: 450,
          energyJoules: 2.8,
        },
        description: {
          es: 'Arquitectura Encoder-Decoder ligera para tareas Text-to-Text.',
          en: 'Lightweight Encoder-Decoder architecture for text-to-text tasks.',
          zh: '轻量级编码器-解码器架构，用于文本到文本任务。'
        }
      },
      {
        id: 'flan-t5-base',
        name: 'FLAN-T5 Base',
        hfTag: 'google/flan-t5-base',
        type: 'intermedio',
        baseMetrics: {
          latencyMs: 180,
          sizeMb: 990,
          paramsM: 250,
          costPer1k: 0.22,
          accuracy: 94.8,
          memoryUsageMb: 1400,
          energyJoules: 6.8,
        },
        description: {
          es: 'Modelo instruccionado con gran capacidad de razonamiento zero-shot.',
          en: 'Instruction-tuned model with high zero-shot reasoning.',
          zh: '经指令微调的模型，具有强大的零样本推理能力。'
        }
      }
    ]
  },
  {
    id: 'jensen-huang',
    name: 'Jensen Huang',
    company: 'NVIDIA',
    role: 'CEO & Co-founder',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jensen_Huang_Computex_2023_%28cropped%29.jpg/800px-Jensen_Huang_Computex_2023_%28cropped%29.jpg',
    color: '#76b900',
    voiceName: 'Fenrir',
    greeting: {
      es: '¡Hola dev! Soy Jensen Huang de NVIDIA. ¡El cómputo acelerado con Tensor Cores multiplicará tu rendimiento!',
      en: "Hey dev! I'm Jensen Huang from NVIDIA. Accelerated computing with Tensor Cores will multiply your performance!",
      zh: '嘿，开发者！我是NVIDIA的Jensen Huang。使用Tensor Cores的加速计算将倍增你的性能！'
    },
    bio: {
      es: 'Arquitecto de la era de la IA, GPUs Hopper/Blackwell y aceleración CUDA.',
      en: 'Architect of the AI hardware revolution, Hopper/Blackwell GPUs, and CUDA.',
      zh: 'AI硬件革命的构建者，Hopper/Blackwell GPU及CUDA驱动者。'
    },
    customAdvice: {
      es: 'Aprovecha TensorRT y la memoria compartida (Shared Memory) para evitar el cuello de botella en Global Memory.',
      en: 'Leverage TensorRT and Shared Memory to remove Global Memory bandwidth bottlenecks.',
      zh: '利用TensorRT和共享内存消除全局内存带宽瓶颈。'
    },
    models: [
      {
        id: 'megatron-gpt',
        name: 'Megatron-GPT',
        hfTag: 'NVIDIA/megatron-gpt-345m',
        type: 'intermedio',
        baseMetrics: {
          latencyMs: 210,
          sizeMb: 1300,
          paramsM: 345,
          costPer1k: 0.30,
          accuracy: 94.2,
          memoryUsageMb: 2100,
          energyJoules: 8.5,
        },
        description: {
          es: 'Modelo optimizado para entrenamiento distribuido en clústeres GPU.',
          en: 'Optimized model for distributed GPU cluster training.',
          zh: '针对分布式GPU集群训练优化的模型。'
        }
      },
      {
        id: 'nemo-gpt',
        name: 'NeMo-GPT (NLP)',
        hfTag: 'NVIDIA/nemo-megatron-gpt-1.3b',
        type: 'avanzado',
        baseMetrics: {
          latencyMs: 320,
          sizeMb: 2600,
          paramsM: 1300,
          costPer1k: 0.55,
          accuracy: 96.1,
          memoryUsageMb: 3800,
          energyJoules: 14.2,
        },
        description: {
          es: 'Framework acelerado para agentes empresariales y voz.',
          en: 'Accelerated framework for enterprise agents and voice.',
          zh: '用于企业级智能体和语音的加速框架。'
        }
      },
      {
        id: 'megatron-bert',
        name: 'Megatron-BERT',
        hfTag: 'NVIDIA/megatron-bert-uncased-345m',
        type: 'optimizado',
        baseMetrics: {
          latencyMs: 130,
          sizeMb: 1250,
          paramsM: 345,
          costPer1k: 0.18,
          accuracy: 93.9,
          memoryUsageMb: 1800,
          energyJoules: 5.8,
        },
        description: {
          es: 'Kernel BERT optimizado para alta tasa de inferencia.',
          en: 'Optimized BERT kernel for high throughput inference.',
          zh: '高吞吐量推理优化的BERT内核。'
        }
      }
    ]
  },
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    company: 'Tesla / xAI',
    role: 'Founder',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/800px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
    color: '#e82127',
    voiceName: 'Kore',
    greeting: {
      es: '¡Qué tal! Soy Elon Musk. En xAI y Tesla buscamos la máxima eficiencia en tiempo real y visión multimodal.',
      en: "What's up! I'm Elon Musk. At xAI and Tesla we seek maximum real-time efficiency and multimodal vision.",
      zh: '你好！我是Elon Musk。在xAI和Tesla，我们寻求极高的实时效率和多模态视觉。'
    },
    bio: {
      es: 'Impulsor de Grok, Tesla FSD Autopilot y la supercomputadora Colossus.',
      en: 'Driving force behind Grok, Tesla FSD Autopilot, and the Colossus supercomputer.',
      zh: 'Grok、Tesla FSD自动驾驶和Colossus超算背后的推手。'
    },
    customAdvice: {
      es: 'Elimina capas innecesarias. El mejor parámetro es el que no existe.',
      en: 'Eliminate unnecessary layers. The best parameter is no parameter.',
      zh: '消除不必要的图层。最好的参数就是没有参数。'
    },
    models: [
      {
        id: 'grok-inspired-small',
        name: 'Grok-Inspired Small',
        hfTag: 'xai-org/grok-1-lite-sim',
        type: 'optimizado',
        baseMetrics: {
          latencyMs: 120,
          sizeMb: 480,
          paramsM: 120,
          costPer1k: 0.11,
          accuracy: 92.0,
          memoryUsageMb: 700,
          energyJoules: 3.8,
        },
        description: {
          es: 'Modelo enfocado en respuestas velozmente resumidas sin rodeos.',
          en: 'Fast, concise reasoning model designed for real-time edge.',
          zh: '面向实时边缘计算设计的快速简洁推理模型。'
        }
      },
      {
        id: 'transformer-lightweight',
        name: 'Transformer Lightweight',
        hfTag: 'tesla/autogluon-transformer-light',
        type: 'pequeño',
        baseMetrics: {
          latencyMs: 65,
          sizeMb: 190,
          paramsM: 45,
          costPer1k: 0.05,
          accuracy: 88.5,
          memoryUsageMb: 320,
          energyJoules: 1.9,
        },
        description: {
          es: 'Red neuronal ligera integrada para control vehicular síncrono.',
          en: 'Ultra-light neural network for vehicle real-time telemetry.',
          zh: '用于车辆实时遥测的超轻量级神经网络。'
        }
      },
      {
        id: 'vision-language-tiny',
        name: 'Vision-Language Tiny',
        hfTag: 'xai/vlm-tiny-edge',
        type: 'intermedio',
        baseMetrics: {
          latencyMs: 195,
          sizeMb: 750,
          paramsM: 210,
          costPer1k: 0.25,
          accuracy: 91.5,
          memoryUsageMb: 1100,
          energyJoules: 6.2,
        },
        description: {
          es: 'VLM compacto para detección de obstáculos y comprensión visual.',
          en: 'Compact VLM for edge object detection and visual QA.',
          zh: '用于边缘目标检测和视觉问答的紧凑型VLM。'
        }
      }
    ]
  },
  {
    id: 'satya-nadella',
    name: 'Satya Nadella',
    company: 'Microsoft',
    role: 'CEO',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Satya_Nadella_2017.jpg',
    color: '#00a4ef',
    voiceName: 'Zephyr',
    greeting: {
      es: '¡Hola! Soy Satya Nadella. Nuestra serie Phi demuestra que los modelos pequeños de alta calidad dominan el futuro.',
      en: "Hello! I'm Satya Nadella. Our Phi series proves small, high-quality models are the future.",
      zh: '你好！我是Satya Nadella。我们的Phi系列证明了小巧高质量的模型才是未来。'
    },
    bio: {
      es: 'Transformador de Microsoft e impulsor de la serie de SLMs Phi y Copilot.',
      en: 'Leader transforming Microsoft into the premier AI cloud platform.',
      zh: '将微软转型为顶级AI云平台的领导者。'
    },
    customAdvice: {
      es: 'Aplica libros de texto de alta calidad ("Textbooks Are All You Need") para mantener precisión con mínimos parámetros.',
      en: 'Use high-quality textbook data distillation to keep precision with minimal params.',
      zh: '使用高质量的教科书数据蒸馏，以最少的参数保持高精度。'
    },
    models: [
      {
        id: 'phi-2',
        name: 'Phi-2 (2.7B Quantized)',
        hfTag: 'microsoft/phi-2',
        type: 'intermedio',
        baseMetrics: {
          latencyMs: 110,
          sizeMb: 850,
          paramsM: 270,
          costPer1k: 0.10,
          accuracy: 94.5,
          memoryUsageMb: 1200,
          energyJoules: 3.5,
        },
        description: {
          es: 'Modelo SLM líder con razonamiento superior a su clase.',
          en: 'State-of-the-art small language model with high reasoning.',
          zh: '具有极高推理能力的最先进小型语言模型。'
        }
      },
      {
        id: 'phi-1.5',
        name: 'Phi-1.5',
        hfTag: 'microsoft/phi-1_5',
        type: 'optimizado',
        baseMetrics: {
          latencyMs: 85,
          sizeMb: 520,
          paramsM: 140,
          costPer1k: 0.07,
          accuracy: 92.1,
          memoryUsageMb: 750,
          energyJoules: 2.6,
        },
        description: {
          es: 'Optimizado para código y matemáticas en dispositivos locales.',
          en: 'Optimized for python code and logic on local devices.',
          zh: '针对本地设备上的Python代码和逻辑进行了优化。'
        }
      },
      {
        id: 'codebert-base',
        name: 'CodeBERT Base',
        hfTag: 'microsoft/codebert-base',
        type: 'pequeño',
        baseMetrics: {
          latencyMs: 95,
          sizeMb: 490,
          paramsM: 125,
          costPer1k: 0.09,
          accuracy: 93.0,
          memoryUsageMb: 680,
          energyJoules: 3.1,
        },
        description: {
          es: 'Modelo bimodal capacitado en lenguajes de programación e NL.',
          en: 'Bimodal model trained on natural and programming languages.',
          zh: '在自然语言和编程语言上训练的双模态模型。'
        }
      }
    ]
  },
  {
    id: 'yann-lecun',
    name: 'Yann LeCun',
    company: 'Meta AI',
    role: 'Chief AI Scientist',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Yann_LeCun_in_2018.jpg/800px-Yann_LeCun_in_2018.jpg',
    color: '#0668e1',
    voiceName: 'Puck',
    greeting: {
      es: '¡Bonjour! Soy Yann LeCun de Meta AI. ¡El código abierto es la única vía para el progreso científico real de la IA!',
      en: "Bonjour! I'm Yann LeCun from Meta AI. Open source is the only way for true AI progress!",
      zh: '你好！我是Meta AI around Yann LeCun。开源是人工智能真正进步的唯一途径！'
    },
    bio: {
      es: 'Premio Turing, inventor de las CNNs y defensor ferviente del Open Source en LLaMA.',
      en: 'Turing Award winner, CNN inventor, and open-source champion with LLaMA.',
      zh: '图灵奖得主，CNN发明者，LLaMA开源倡导者。'
    },
    customAdvice: {
      es: 'Pruning (poda de cabezas de atención) y cuantización sin pérdida preservan la exactitud y reducen un 40% la latencia.',
      en: 'Pruning attention heads and lossless quantization preserve accuracy while saving 40% latency.',
      zh: '剪枝注意力头和无损量化可在保持精度的同时节省40%的延迟。'
    },
    models: [
      {
        id: 'llama-2-7b',
        name: 'LLaMA-2 7B (Quantized)',
        hfTag: 'meta-llama/Llama-2-7b-hf',
        type: 'avanzado',
        baseMetrics: {
          latencyMs: 250,
          sizeMb: 1800,
          paramsM: 700,
          costPer1k: 0.35,
          accuracy: 95.8,
          memoryUsageMb: 2800,
          energyJoules: 10.5,
        },
        description: {
          es: 'El estándar de oro open source cuantizado a 4-bits.',
          en: 'The gold standard open-source LLM 4-bit quantized.',
          zh: '开源金标准LLM的4位量化版本。'
        }
      },
      {
        id: 'roberta-base',
        name: 'RoBERTa Base',
        hfTag: 'FacebookAI/roberta-base',
        type: 'optimizado',
        baseMetrics: {
          latencyMs: 105,
          sizeMb: 470,
          paramsM: 125,
          costPer1k: 0.10,
          accuracy: 93.6,
          memoryUsageMb: 720,
          energyJoules: 3.2,
        },
        description: {
          es: 'Robustly Optimized BERT Approach con entrenamiento mejorado.',
          en: 'Robustly Optimized BERT Approach with improved training.',
          zh: '经过改进训练的鲁棒优化BERT方法。'
        }
      },
      {
        id: 'vision-transformer-base',
        name: 'ViT Base (Vision Transformer)',
        hfTag: 'google/vit-base-patch16-224',
        type: 'intermedio',
        baseMetrics: {
          latencyMs: 140,
          sizeMb: 340,
          paramsM: 86,
          costPer1k: 0.16,
          accuracy: 92.8,
          memoryUsageMb: 600,
          energyJoules: 4.5,
        },
        description: {
          es: 'Transformer aplicado directamente a patches de imágenes.',
          en: 'Pure transformer model applied directly to image patches.',
          zh: '直接应用于图像块的纯Transformer模型。'
        }
      }
    ]
  },
  {
    id: 'andrew-ng',
    name: 'Andrew Ng',
    company: 'Landing AI / Coursera',
    role: 'Founder & AI Pioneer',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Andrew_Ng_at_the_Global_Artificial_Intelligence_Summit_2020.jpg/800px-Andrew_Ng_at_the_Global_Artificial_Intelligence_Summit_2020.jpg',
    color: '#ff6f00',
    voiceName: 'Charon',
    greeting: {
      es: '¡Hola! Soy Andrew Ng. AI is the new electricity. ¡Aprender a optimizarla te convertirá en un arquitecto indispensable!',
      en: "Hi! I'm Andrew Ng. AI is the new electricity. Learning to optimize it makes you essential!",
      zh: '你好！我是吴恩达（Andrew Ng）。人工智能是新的电力。学会优化它会让你不可或缺！'
    },
    bio: {
      es: 'Profesor de Stanford, cofundador de Google Brain y educador global de IA.',
      en: 'Stanford Professor, Google Brain co-founder, and global AI educator.',
      zh: '斯坦福大学教授，Google Brain联合创始人，全球AI教育家。'
    },
    customAdvice: {
      es: 'Data-Centric AI: Un pipeline eficiente de preprocesamiento de tensores acelera la inferencia más que cambiar la red.',
      en: 'Data-centric AI: Clean tensor pre-processing speeds up inference more than changing model weights.',
      zh: '以数据为中心的AI：干净的张量预处理比更改模型权重更能加快推理速度。'
    },
    models: [
      {
        id: 'deep-learning-base',
        name: 'Data-Centric ResNet',
        hfTag: 'landingai/resnet-data-centric',
        type: 'pequeño',
        baseMetrics: {
          latencyMs: 50,
          sizeMb: 98,
          paramsM: 25,
          costPer1k: 0.03,
          accuracy: 91.0,
          memoryUsageMb: 210,
          energyJoules: 1.2,
        },
        description: {
          es: 'ResNet ultraliviano purificado para despliegue industrial.',
          en: 'Ultra-light ResNet sanitized for industrial deployment.',
          zh: '用于工业部署的超轻量级净化ResNet。'
        }
      }
    ]
  },
  {
    id: 'geoffrey-hinton',
    name: 'Geoffrey Hinton',
    company: 'University of Toronto',
    role: 'Nobel Laureate & Godfather of AI',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Geoffrey_Hinton_in_2018.jpg/800px-Geoffrey_Hinton_in_2018.jpg',
    color: '#9c27b0',
    voiceName: 'Puck',
    greeting: {
      es: '¡Hola! Soy Geoffrey Hinton. Padre del Deep Learning y Premio Nobel 2024. ¡Aprender a comprimir y optimizar redes neuronales es fundamental!',
      en: "Hello! I'm Geoffrey Hinton. Godfather of Deep Learning & Nobel Laureate. Learning to compress and optimize neural networks is vital!",
      zh: '你好！我是深度学习之父、2024年诺贝尔奖获得者杰弗里·辛顿（Geoffrey Hinton）。'
    },
    bio: {
      es: 'Premio Nobel de Física 2024, Premio Turing y pionero del algoritmo de backpropagation.',
      en: '2024 Physics Nobel Laureate, Turing Award winner, and backpropagation pioneer.',
      zh: '2024年诺贝尔物理学奖得主，图灵奖得主，反向传播算法先驱。'
    },
    customAdvice: {
      es: 'Aplica Destilación de Conocimiento (Knowledge Distillation) para transferir la capacidad de un modelo gigante a uno compacto sin perder precisión.',
      en: 'Use Knowledge Distillation to transfer teacher network dark knowledge into compact student models.',
      zh: '使用知识蒸馏（Knowledge Distillation）将大模型的泛化能力转移到轻量级模型中。'
    },
    models: [
      {
        id: 'capsule-distil-net',
        name: 'Capsule-DistilNet',
        hfTag: 'toronto/capsule-distil-base',
        type: 'optimizado',
        baseMetrics: {
          latencyMs: 82,
          sizeMb: 195,
          paramsM: 45,
          costPer1k: 0.05,
          accuracy: 94.1,
          memoryUsageMb: 320,
          energyJoules: 1.6,
        },
        description: {
          es: 'Modelo destilado de alta precisión inspirado en cápsulas neuronales profundas.',
          en: 'High-precision distilled network inspired by deep neural capsule layers.',
          zh: '受深层神经胶囊层的高精度蒸馏模型。'
        }
      }
    ]
  }
];
