import { Position } from "../interfaces/position";
import { Drawable } from "../interfaces/drawable";
import { BrushParams } from "../interfaces/toolParams";
import { defaultBrushParams } from "../constants/toolsParams";

export class Brush implements Drawable {
  params: BrushParams = defaultBrushParams;
  position = { x: 0, y: 0 };
  boxControls: false;
  points: Position[] = []
  constructor(position: Position, params: BrushParams) {
    if (position) {
      this.position = position;
    }
    if (params) {
      this.params = {...this.params, ...params};
    }
  }
  update(position: Position, params: BrushParams) {
    if(params) {
      this.params = params
    }
    if(position) {
      this.points.push({ x: position.x, y: position.y })
    }
  }
  render(ctx, sizeMultiplier) {
    ctx.beginPath();
    ctx.lineWidth = this.params.size * sizeMultiplier;
    ctx.strokeStyle = this.params.color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(
      this.position.x * sizeMultiplier,
      this.position.y * sizeMultiplier
    );
    this.points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.closePath();
  }
}
