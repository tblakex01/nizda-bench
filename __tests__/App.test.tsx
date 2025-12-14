import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { BENCHMARK_TASKS } from "../constants";
import { ModelOption, RunResponse } from "../types";

const fetchBenchmarksMock = vi.fn();
const runBenchmarkMock = vi.fn();

vi.mock("../services/api", () => ({
  fetchBenchmarks: () => fetchBenchmarksMock(),
  runBenchmark: (payload: { model_name: string; benchmark_id: string }) =>
    runBenchmarkMock(payload),
}));

describe("App", () => {
  beforeEach(() => {
    fetchBenchmarksMock.mockResolvedValue(BENCHMARK_TASKS);
    runBenchmarkMock.mockReset();
  });

  it("loads benchmarks on mount and shows the count", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/AVAILABLE_TASKS \(3\)/)).toBeInTheDocument();
      expect(screen.getByText("SVG Panda")).toBeInTheDocument();
    });
  });

  it("runs a benchmark, shows loading state, streams logs, and renders the result", async () => {
    const user = userEvent.setup();

    let resolveRun: (value: RunResponse) => void = () => {};
    runBenchmarkMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRun = resolve;
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText("Run SVG Panda")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Run SVG Panda"));

    expect(
      await screen.findByText("CONTACTING NEURAL NETWORK..."),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("> Initializing connection..."),
      ).toBeInTheDocument();
    });

    resolveRun({
      model: ModelOption.DEEPSEEK_V3_2,
      task: "SVG Panda",
      code: "<svg></svg>",
      status: "Success",
    });

    await waitFor(() => {
      expect(screen.getByText("RAW_OUTPUT")).toBeInTheDocument();
      expect(screen.getByText("<svg></svg>")).toBeInTheDocument();
    });
  });

  it("handles a benchmark error without leaving the interval running", async () => {
    const user = userEvent.setup();

    runBenchmarkMock.mockRejectedValue(new Error("fail"));

    render(<App />);
    await waitFor(() => {
      expect(screen.getByLabelText("Run 3D Floor Plan")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Run 3D Floor Plan"));

    await waitFor(() => {
      expect(runBenchmarkMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Benchmark run failed. Please try again./i),
      ).toBeInTheDocument();
    });
  });
});
