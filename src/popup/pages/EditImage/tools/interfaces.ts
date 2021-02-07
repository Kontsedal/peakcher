import { RenderQueue } from "../renderQueue";
import React from "react";

export type ToolParams = {
  canvas: HTMLCanvasElement;
  render: () => void;
  renderQueue: RenderQueue;
  active: boolean;
};

export type ToolResult = {
  settingsElements?: React.ReactNode
}
