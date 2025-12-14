import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../../components/Header";
import { MODELS } from "../../constants";
import { ModelOption } from "../../types";

describe("Header", () => {
  it("renders all model options and handles selection changes", async () => {
    const onModelChange = vi.fn();
    render(
      <Header
        selectedModel={ModelOption.GPT_4O}
        onModelChange={onModelChange}
        isProcessing={false}
      />,
    );

    MODELS.forEach((model) => {
      expect(screen.getByRole("option", { name: model })).toBeInTheDocument();
    });

    await userEvent.selectOptions(
      screen.getByLabelText("Target model"),
      ModelOption.GEMINI_3_0_PRO,
    );

    expect(onModelChange).toHaveBeenCalledWith(ModelOption.GEMINI_3_0_PRO);
  });

  it("disables selection while processing", () => {
    render(
      <Header
        selectedModel={ModelOption.GPT_4O}
        onModelChange={vi.fn()}
        isProcessing
      />,
    );

    expect(screen.getByLabelText("Target model")).toBeDisabled();
  });
});
