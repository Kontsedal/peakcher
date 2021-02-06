import { Position } from "./interfaces/position";
import { v4 as uuid } from "uuid";
import { SHAPES } from "./enums/shapes";
import { createShape } from "./shapes/factory";
import { Drawable } from "./interfaces/drawable";
import { ToolParams } from "./interfaces/toolParams";

type CreateAction = {
  type: "create";
  payload: {
    position: Position;
    params: ToolParams;
    shape: SHAPES;
    shapeId: string;
  };
};
type UpdateAction = {
  type: "update";
  payload: {
    position: Position;
    params: ToolParams;
    shapeId: string;
  };
};
type FinishAction = {
  type: "finish";
  payload: {
    shapeId: string;
  };
};
type Action = CreateAction | UpdateAction | FinishAction;

export class Painter {
  history: Action[] = [];
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
    this.history.push({
      payload: { position, params, shape, shapeId: this.currentShapeId },
      type: "create",
    });
    this.updateShapes()
  }
  update(position: Position, params?: ToolParams) {
    if (!this.currentShapeId) {
      return;
    }
    this.history.push({
      payload: { position, params, shapeId: this.currentShapeId },
      type: "update",
    });
    this.updateShapes()
  }
  finish() {
    this.currentShapeId = undefined;
    this.history.push({
      payload: { shapeId: this.currentShapeId },
      type: "finish",
    });
  }
  updateShapes() {
    this.history.forEach((action) => {
      if (action.type === "create") {
        const shape = createShape({
          position: action.payload.position,
          params: action.payload.params,
          shape: action.payload.shape,
        });
        this.shapesSet.add(shape);
        this.shapesMap.set(action.payload.shapeId, shape);
      }

      if (action.type === "update") {
        const shape = this.shapesMap.get(action.payload.shapeId);
        shape.update(action.payload.position, action.payload.params);
      }
    });
  }
  getCurrentShape() {
    return this.shapesMap.get(this.currentShapeId)
  }
  render(ctx: CanvasRenderingContext2D, sizeMultiplier: number) {
    this.shapesSet.forEach((shape) => {
      shape.render(ctx, sizeMultiplier);
    });
  }
}
