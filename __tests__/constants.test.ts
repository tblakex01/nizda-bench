import { describe, expect, it } from "vitest";
import { BENCHMARK_TASKS, MOCK_RESPONSES, MODELS } from "../constants";

const requiredFields: Array<keyof (typeof BENCHMARK_TASKS)[number]> = [
  "id",
  "title",
  "category",
  "prompt",
  "description",
];

describe("constants", () => {
  it("ensures every benchmark has all required fields populated", () => {
    for (const task of BENCHMARK_TASKS) {
      requiredFields.forEach((field) => {
        expect(task[field]).toBeTruthy();
      });
    }
  });

  it("has a mock response for every benchmark id", () => {
    const taskIds = BENCHMARK_TASKS.map((task) => task.id);

    expect(Object.keys(MOCK_RESPONSES)).toEqual(
      expect.arrayContaining(taskIds),
    );
  });

  it("exposes at least one model for selection", () => {
    expect(MODELS.length).toBeGreaterThan(0);
  });
});
