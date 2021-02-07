import { Point, RenderFunction } from "../../interfaces";

export type BrushData = {
  params: {
    color: string;
    size: string;
  };
  points: Point[];
};
export const defaultBrushParams = {
  params: {
    color: 'black',
    size: 10
  },
  points: []
}
export const renderBrush: RenderFunction = ({ canvas, data, multiplier }) => {
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.lineWidth = data.params.size * multiplier;
  ctx.strokeStyle = data.params.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  data.points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x * multiplier, point.y * multiplier);
      return;
    }
    ctx.lineTo(point.x * multiplier, point.y * multiplier);
  });
  ctx.stroke();
  ctx.closePath();
};
