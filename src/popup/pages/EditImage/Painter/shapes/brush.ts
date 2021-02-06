import { Position } from "../interfaces/position";
import { Shape } from "./shape";

type BrushParams = {
  color: string;
  size: number;
};

export class Brush extends Shape {
  params: BrushParams = {
    color: "black",
    size: 10,
  };
  boxControls: false;
  points: Position[] = []
  constructor(position: Position, params: BrushParams) {
    super(position, params)
  }
  update(position: Position, params: BrushParams) {
    if(params) {
      this.params = params
    }
    if(position) {
      this.points.push(position)
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
