import { Drawable } from "../interfaces/drawable";
import { Position } from "../interfaces/position";

export class Shape implements Drawable {
  position = { x: 0, y: 0 };
  params = {};
  constructor(position: Position, params: any) {
    if (position) {
      this.position = position;
    }
    if (params) {
      this.params = params;
    }
  }

  update(position: Position, params: Record<string, any>) {}

  render(ctx, sizeMultiplier) {}
}
