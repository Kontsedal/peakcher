import { SHAPES } from "../enums/shapes";
import { Brush } from "./brush";
import { Position } from "../interfaces/position";

export const createShape = ({
  shape,
  position,
  params,
}: {
  shape: SHAPES;
  position: Position;
  params: any;
}) => {
  switch (+shape) {
    case SHAPES.BRUSH:
      return new Brush(position, params);
    default:
      throw new Error("Unsupported shape type");
  }
};
