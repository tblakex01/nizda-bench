export interface Benchmark {
  id: string;
  title: string;
  category: string;
  prompt: string;
  description: string;
}

export interface RunRequest {
  model_name: string;
  benchmark_id: string;
}

export interface RunResponse {
  model: string;
  task: string;
  code: string;
  status: "Success" | "Error";
}

export enum ModelOption {
  DEEPSEEK_V3_2 = "DeepSeek V3.2",
  MISTRAL_LARGE_3 = "Mistral Large 3",
  GPT_4O = "GPT-4o",
  GEMINI_3_0_PRO = "Gemini 3.0 Pro",
}
