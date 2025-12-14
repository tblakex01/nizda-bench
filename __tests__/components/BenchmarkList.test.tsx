import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BenchmarkList from "../../components/BenchmarkList";
import { Benchmark } from "../../types";

const benchmarks: Benchmark[] = [
  {
    id: "task-1",
    title: "3D Example",
    category: "Visual 3D",
    prompt: "Render 3D",
    description: "3D description",
  },
  {
    id: "task-2",
    title: "2D Example",
    category: "Visual 2D",
    prompt: "Render 2D",
    description: "2D description",
  },
];

describe("BenchmarkList", () => {
  it("shows the total number of tasks and renders task details", () => {
    render(
      <BenchmarkList
        benchmarks={benchmarks}
        onRun={vi.fn()}
        isProcessing={false}
        activeBenchmarkId={null}
      />,
    );

    expect(screen.getByText("AVAILABLE_TASKS (2)")).toBeInTheDocument();
    expect(screen.getByText("3D Example")).toBeInTheDocument();
    expect(screen.getByText("2D description")).toBeInTheDocument();
  });

  it("applies category-specific styling and disables buttons during processing", () => {
    render(
      <BenchmarkList
        benchmarks={benchmarks}
        onRun={vi.fn()}
        isProcessing
        activeBenchmarkId="task-1"
      />,
    );

    const visual3DBadges = screen.getAllByText("Visual 3D");
    const visual2DBadges = screen.getAllByText("Visual 2D");

    expect(visual3DBadges[0]).toHaveClass("text-purple-400");
    expect(visual2DBadges[0]).toHaveClass("text-green-400");

    const activeRunButton = screen.getAllByLabelText("Run 3D Example")[0];
    expect(activeRunButton).toBeDisabled();
    expect(activeRunButton).toHaveClass("animate-pulse");
  });

  it("invokes onRun with the correct id when clicking run", async () => {
    const onRun = vi.fn();
    render(
      <BenchmarkList
        benchmarks={benchmarks}
        onRun={onRun}
        isProcessing={false}
        activeBenchmarkId={null}
      />,
    );

    await userEvent.click(screen.getAllByLabelText("Run 2D Example")[0]);

    expect(onRun).toHaveBeenCalledWith("task-2");
  });
});
