import { Position } from "./position";
import { ToolParams } from "./toolParams";
import { SHAPES } from "../enums/shapes";

export interface Drawable {
  position: Position;
  params: Record<string, any>;
  boxControls?: boolean;
  type: SHAPES;
  render(ctx: CanvasRenderingContext2D, sizeMultiplier: number): void;
  update(params: { position?: Position; params?: ToolParams }): void;
}
