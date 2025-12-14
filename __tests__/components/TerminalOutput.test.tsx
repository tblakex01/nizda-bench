import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TerminalOutput from "../../components/TerminalOutput";
import { RunResponse } from "../../types";

describe("TerminalOutput", () => {
  it("shows idle state instructions", () => {
    render(<TerminalOutput status="idle" result={null} logs={[]} />);

    expect(
      screen.getByText("System Ready. Awaiting Benchmark..."),
    ).toBeInTheDocument();
  });

  it("renders streaming logs during loading", () => {
    render(
      <TerminalOutput
        status="loading"
        result={null}
        logs={["> Initializing connection..."]}
      />,
    );

    expect(
      screen.getByText("CONTACTING NEURAL NETWORK..."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("> Initializing connection..."),
    ).toBeInTheDocument();
  });

  it("shows SVG preview and raw output on success", () => {
    const result: RunResponse = {
      model: "test-model",
      task: "SVG Task",
      code: '<svg data-testid="preview"></svg>',
      status: "Success",
    };

    const { container } = render(
      <TerminalOutput status="success" result={result} logs={[]} />,
    );

    expect(screen.getByText("VISUAL_PREVIEW")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(
      screen.getByText('<svg data-testid="preview"></svg>'),
    ).toBeInTheDocument();
  });

  it("skips the preview when the output is not SVG", () => {
    const result: RunResponse = {
      model: "test-model",
      task: "Code Task",
      code: 'console.log("hello")',
      status: "Success",
    };

    render(<TerminalOutput status="success" result={result} logs={[]} />);

    expect(screen.queryByText("VISUAL_PREVIEW")).not.toBeInTheDocument();
    expect(screen.getByText('console.log("hello")')).toBeInTheDocument();
  });

  it("renders an error state", () => {
    render(<TerminalOutput status="error" result={null} logs={[]} />);

    expect(
      screen.getByText(/Benchmark run failed. Please try again./i),
    ).toBeInTheDocument();
  });
});
