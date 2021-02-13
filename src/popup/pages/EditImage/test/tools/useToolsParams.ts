import { useCallback, useState } from "react";
import { Tool } from "../constants";
import { defaultBrushParams } from "./brush/renderer";
import { EntityData } from "../renderer";
import constate from "constate";

const useToolsParams = () => {
  const [data, setData] = useState({
    [Tool.BRUSH]: defaultBrushParams,
  });

  const setToolParams = useCallback(
    (tool: Tool, newParams: Partial<EntityData<typeof tool>["params"]>) => {
      setData((params) => {
        return {
          ...params,
          [tool]: { ...params[tool], params: {...params[tool].params, ...newParams} },
        }
      });
    },
    [setData]
  );

  return [data, setToolParams];
};

export const [ToolsParamsProvider, useToolsParamsContext] = constate(
  useToolsParams
);
