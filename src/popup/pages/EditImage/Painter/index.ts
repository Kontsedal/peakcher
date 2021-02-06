import { Position } from "./interfaces/position";
import { v4 as uuid } from "uuid";
import { SHAPES } from "./enums/shapes";
import { createShape } from "./shapes/factory";
import { Drawable } from "./interfaces/drawable";
import { ToolParams } from "./interfaces/toolParams";

export class Painter {
  currentShapeId: string;
  private shapesMap: Map<string, Drawable> = new Map<string, Drawable>();
  private shapesSet: Set<Drawable> = new Set<Drawable>();
  create({
    shape,
    position,
    params,
  }: {
    shape: SHAPES;
    position: Position;
    params?: ToolParams;
  }) {
    this.currentShapeId = uuid();
    const shapeInstance = createShape({
      position: position,
      params: params,
      shape: shape,
    });
    this.shapesSet.add(shapeInstance);
    this.shapesMap.set(this.currentShapeId, shapeInstance);
  }
  update({ position, params }: { position?: Position; params?: ToolParams }) {
    if (!this.currentShapeId) {
      return;
    }
    const shape = this.shapesMap.get(this.currentShapeId);
    shape.update({
      position: position,
      params: params,
    });
  }
  finish() {
    const currentShape = this.getCurrentShape();
    if (currentShape.type === SHAPES.BRUSH) {
      this.currentShapeId = undefined;
    }
  }
  getCurrentShape() {
    return this.shapesMap.get(this.currentShapeId);
  }
  render(ctx: CanvasRenderingContext2D, sizeMultiplier: number) {
    this.shapesSet.forEach((shape) => {
      shape.render(ctx, sizeMultiplier);
    });
  }
}
