import { Position } from "./position";
import { ToolParams } from "./toolParams";

export interface Drawable {
  position: Position;
  params: Record<string, any>;
  boxControls?: boolean;
  render(ctx: CanvasRenderingContext2D, sizeMultiplier: number): void;
  update(position: Position, params: ToolParams): void;
}
