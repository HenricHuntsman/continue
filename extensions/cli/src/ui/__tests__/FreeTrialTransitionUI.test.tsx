import { render } from "ink-testing-library";
import React from "react";
import { vi } from "vitest";

import { FreeTrialTransitionUI } from "../FreeTrialTransitionUI.js";

// Mock the 'open' module to prevent actual URL opening during tests
vi.mock("open", () => ({
  default: vi.fn(),
}));

// Mock the NavigationContext
vi.mock("../context/NavigationContext.js", () => ({
  useNavigation: () => ({
    navigateTo: vi.fn(),
    closeCurrentScreen: vi.fn(),
    isScreenActive: vi.fn(() => false),
    state: { currentScreen: "free-trial", screenData: null },
  }),
}));

describe("FreeTrialTransitionUI - Rendering and Props Tests", () => {
  const mockOnReload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Choice Screen Rendering", () => {
    it("displays all three options with proper formatting", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      expect(frame).toContain("🚀 Usage limit reached!");
      expect(frame).toContain("1. 🦙 Set up local Ollama");
      expect(frame).toContain("2. 🔑 Enter your Anthropic API key");
      expect(frame).toContain("3. ⚙️ Switch to a different configuration");
      expect(frame).toContain("↑/↓ to navigate or 1/2/3 to select");
    });

    it("highlights first option by default", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      expect(frame).toContain("➤ 1. 🦙 Set up local Ollama");
      expect(frame).not.toContain("➤ 2. 🔑 Enter your Anthropic API key");
      expect(frame).not.toContain(
        "➤ 3. ⚙️ Switch to a different configuration",
      );
    });

    it("renders without crashing when all props are provided", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      expect(frame).toBeDefined();
      expect(frame?.length).toBeGreaterThan(0);
    });

    it("renders without crashing when onShowConfigSelector is not provided", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI
          onReload={mockOnReload}
          // onShowConfigSelector not provided
        />,
      );

      const frame = lastFrame();
      expect(frame).toBeDefined();
      expect(frame?.length).toBeGreaterThan(0);
      expect(frame).toContain("3. ⚙️ Switch to a different configuration");
    });

    it("includes proper user instructions", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      expect(frame).toContain("Choose how you'd like to continue:");
      expect(frame).toContain(
        "↑/↓ to navigate or 1/2/3 to select, Enter to confirm",
      );
    });

    it("shows all options with proper descriptions", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      expect(frame).toContain("Set up local Ollama (recommended)");
      expect(frame).toContain("Enter your Anthropic API key");
      expect(frame).toContain("Switch to a different configuration");
    });
  });

  describe("Component Props and Interface", () => {
    it("accepts all required callback props", () => {
      // Test that component accepts and renders with all props
      expect(() => {
        render(<FreeTrialTransitionUI onReload={mockOnReload} />);
      }).not.toThrow();
    });

    it("accepts optional onShowConfigSelector prop", () => {
      // Test that component works without onShowConfigSelector
      expect(() => {
        render(<FreeTrialTransitionUI onReload={mockOnReload} />);
      }).not.toThrow();
    });
  });

  describe("Visual Styling and Layout", () => {
    it("renders with proper border styling", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      // Check for box border characters (unicode box drawing)
      expect(frame).toMatch(/[╭╮╯╰│─]/);
    });

    it("displays with proper spacing and formatting", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      // Should have proper spacing between lines
      expect(frame?.split("\n").length).toBeGreaterThan(5);
    });

    it("shows selection indicator on first option by default", () => {
      const { lastFrame } = render(
        <FreeTrialTransitionUI onReload={mockOnReload} />,
      );

      const frame = lastFrame();
      const lines = frame?.split("\n") || [];
      const modelsLine = lines.find((line) =>
        line.includes("Set up local Ollama"),
      );
      const apiKeyLine = lines.find((line) =>
        line.includes("Enter your Anthropic API key"),
      );
      const configLine = lines.find((line) =>
        line.includes("Switch to a different configuration"),
      );

      expect(modelsLine).toContain("➤");
      expect(apiKeyLine).not.toContain("➤");
      expect(configLine).not.toContain("➤");
    });
  });

  describe("URL Opening Security", () => {
    it("should use mocked open function to prevent actual URL opening", async () => {
      // This test verifies that we properly mock the 'open' module
      // to prevent actual URLs from being opened during test runs
      const openModule = await import("open");
      expect(openModule.default).toBeDefined();
      expect(typeof openModule.default).toBe("function");
    });
  });
});
