import { Position } from "./position";

export interface Drawable {
  position: Position;
  params: Record<string, any>;
  boxControls?: boolean;
  render(ctx: CanvasRenderingContext2D, sizeMultiplier: number): void;
}
