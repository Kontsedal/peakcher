import React, { createContext, useCallback, useState } from "react";
import { EntityData, Renderer, useEntityData } from "../../test/renderer";
import { defaultParamsMap, Tool } from "../../test/constants";
import { useToolsParamsContext } from "../../test/tools/useToolsParams";

export const ParamsControl = ({
  renderer,
  entityId,
  activeTool,
}: {
  renderer: Renderer;
  entityId: string;
  activeTool: Tool;
}) => {
  const [data, setData] = useEntityData(renderer, entityId);
  const [toolsParams, setToolParams] = useToolsParamsContext();

  const toolParams = toolsParams[activeTool]
  if (typeof toolParams !== "object") {
    return null;
  }
  return Object.entries(toolsParams[activeTool].params).map(([name, value]) => {
    if (name === "color") {
      return (
        <input
          key={name}
          type="color"
          value={String(value)}
          onChange={(event) => {
            setData({
              ...toolParams,
              // @ts-ignore
              params: { ...toolParams.params, [name]: event.target.value },
            });
            // @ts-ignore
            setToolParams(activeTool, { [name]: event.target.value });
          }}
        />
      );
    }
    if (name === "size") {
      return (
        <input
          key={name}
          type="number"
          min={1}
          max={100}
          step={1}
          value={Number(value)}
          onChange={(event) => {
            setData({
              ...toolParams,
              // @ts-ignore
              params: { ...toolParams.params, [name]: +event.target.value },
            });
            // @ts-ignore
            setToolParams(activeTool, { [name]: event.target.value });
          }}
        />
      );
    }
  });
};
