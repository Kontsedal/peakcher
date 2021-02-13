import { defaultBrushParams } from "./tools/brush/renderer";

export enum Tool {
  BRUSH = "BRUSH",
  BACKGROUND = "BACKGROUND"
}

export const defaultParamsMap = {
  [Tool.BRUSH]: defaultBrushParams,
};