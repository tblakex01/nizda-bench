import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchBenchmarks, runBenchmark } from "../../services/api";
import { BENCHMARK_TASKS, MOCK_RESPONSES } from "../../constants";
import { ModelOption } from "../../types";

const generateContentMock = vi.fn();

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: generateContentMock,
    },
  })),
}));

describe("services/api", () => {
  beforeEach(() => {
    generateContentMock.mockReset();
  });

  describe("fetchBenchmarks", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns benchmark tasks after simulated delay", async () => {
      const promise = fetchBenchmarks();

      await vi.advanceTimersByTimeAsync(500);
      await expect(promise).resolves.toEqual(BENCHMARK_TASKS);
    });
  });

  describe("runBenchmark", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("calls Gemini and returns structured response for the Gemini model", async () => {
      const mockText = '<svg><circle cx="50" cy="50" r="10" /></svg>';
      generateContentMock.mockResolvedValue({ text: mockText });

      const response = await runBenchmark({
        model_name: ModelOption.GEMINI_3_0_PRO,
        benchmark_id: "svg_panda",
      });

      expect(generateContentMock).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gemini-3-pro-preview",
          contents: BENCHMARK_TASKS.find((b) => b.id === "svg_panda")?.prompt,
        }),
      );
      expect(response).toEqual({
        model: ModelOption.GEMINI_3_0_PRO,
        task: "SVG Panda",
        code: mockText,
        status: "Success",
      });
    });

    it("returns an error response if Gemini request fails", async () => {
      generateContentMock.mockRejectedValue(new Error("network down"));

      const response = await runBenchmark({
        model_name: ModelOption.GEMINI_3_0_PRO,
        benchmark_id: "floor_plan_3d",
      });

      expect(response.status).toBe("Error");
      expect(response.code).toContain("network down");
      expect(response.task).toBe("3D Floor Plan");
    });

    it("returns mock responses for non-Gemini models after the simulated delay", async () => {
      vi.useFakeTimers();
      const promise = runBenchmark({
        model_name: ModelOption.DEEPSEEK_V3_2,
        benchmark_id: "svg_panda",
      });

      await vi.advanceTimersByTimeAsync(2000);
      const response = await promise;

      expect(response).toEqual({
        model: ModelOption.DEEPSEEK_V3_2,
        task: "SVG Panda",
        code: MOCK_RESPONSES["svg_panda"],
        status: "Success",
      });
    });

    it("falls back to a default response when a benchmark prompt is missing", async () => {
      vi.useFakeTimers();
      const promise = runBenchmark({
        model_name: ModelOption.GPT_4O,
        benchmark_id: "unknown_task",
      });

      await vi.advanceTimersByTimeAsync(2000);
      const response = await promise;

      expect(response.task).toBe("Unknown Task");
      expect(response.code).toBe(
        "// No visualization available for this task.",
      );
      expect(response.status).toBe("Success");
    });
  });
});
