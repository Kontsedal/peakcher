import { Position } from "./interfaces/position";
import { v4 as uuid } from "uuid";
import { SHAPES } from "./enums/shapes";
import { createShape } from "./shapes/factory";
import { Shape } from "./shapes/shape";

enum ACTION_TYPES {
  CREATE,
  UPDATE,
}

type Action = {
  type: "create" | "update" | "finish";
  payload: Record<string, any>;
};

export class Painter {
  history: Action[] = [];
  currentShapeId: string;
  create({
    shape,
    position,
    params,
  }: {
    shape: SHAPES;
    position: Position;
    params?: Record<string, any>;
  }) {
    this.currentShapeId = uuid();
    this.history.push({
      payload: { position, params, shape, shapeId: this.currentShapeId },
      type: "create",
    });
  }
  update(position: Position, params?: Record<string, any>) {
    if(!this.currentShapeId) {
      return;
    }
    this.history.push({
      payload: { position, params, shapeId: this.currentShapeId },
      type: "update",
    });
  }
  finish() {
    this.currentShapeId = undefined;
  }
  render(ctx: CanvasRenderingContext2D, sizeMultiplier: number) {
    console.log(this.history)
    const shapesMap = new Map<string, Shape>();
    const shapesSet = new Set<Shape>();
    this.history.forEach((action) => {
      if (action.type === "create") {
        const shape = createShape({
          position: action.payload.position,
          params: action.payload.params,
          shape: action.payload.shape,
        });
        shapesSet.add(shape);
        shapesMap.set(action.payload.shapeId, shape);
      }

      if (action.type === "update") {
        const shape = shapesMap.get(action.payload.shapeId);
        shape.update(action.payload.position, action.payload.params);
      }
    });

    shapesSet.forEach((shape) => {
      shape.render(ctx, sizeMultiplier);
    });
  }
}
