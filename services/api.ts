import { GoogleGenAI } from "@google/genai";
import { BENCHMARK_TASKS, MOCK_RESPONSES } from "../constants";
import { Benchmark, RunRequest, RunResponse, ModelOption } from "../types";

// Simulates GET /api/benchmarks
export const fetchBenchmarks = async (): Promise<Benchmark[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return BENCHMARK_TASKS;
};

// POST /api/run
export const runBenchmark = async (
  request: RunRequest,
): Promise<RunResponse> => {
  const task = BENCHMARK_TASKS.find((b) => b.id === request.benchmark_id);
  const taskTitle = task?.title || "Unknown Task";

  // Real Gemini API Integration
  if (request.model_name === ModelOption.GEMINI_3_0_PRO) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: task ? task.prompt : "Hello",
        config: {
          // Strict system instruction to match the "Terminal" aesthetic output requirements
          systemInstruction:
            "You are an expert coding engine for the Nizda Bench evaluation platform. " +
            "Your goal is to generate high-quality code artifacts based on the user prompt.\n" +
            "Rules:\n" +
            "1. Return ONLY the raw code (e.g., the SVG string, the React component, the Three.js script).\n" +
            "2. Do NOT use markdown code fences (like ```xml or ```javascript). Return pure text.\n" +
            "3. Do NOT provide explanations, conversational text, or preamble.\n" +
            "4. If the request is for an SVG, ensure it is a valid, self-contained <svg> string.",
        },
      });

      return {
        model: request.model_name,
        task: taskTitle,
        code: response.text || "// No output generated from Gemini",
        status: "Success",
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        model: request.model_name,
        task: taskTitle,
        code: `// Error connecting to Gemini API:\n// ${error instanceof Error ? error.message : "Unknown error"}`,
        status: "Error",
      };
    }
  }

  // Simulate processing delay for mock models
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mockCode =
    MOCK_RESPONSES[request.benchmark_id] ||
    "// No visualization available for this task.";

  return {
    model: request.model_name,
    task: taskTitle,
    code: mockCode,
    status: "Success",
  };
};
