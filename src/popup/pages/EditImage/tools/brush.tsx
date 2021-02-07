import React, { useCallback, useEffect } from "react";
import { useMouse, useToolBase } from "../utils";
import { ToolParams, ToolResult } from "./interfaces";

export function useBrush({
  canvas,
  render,
  renderQueue,
  active,
}: ToolParams): ToolResult {
  const {
    params,
    setParams,
    customProps,
    setCustomProps: setPoints,
    id,
    reset,
  } = useToolBase({
    defaultParams: {
      color: "black",
      size: 10,
    },
    defaultCustomProps: [],
  });
  const points = customProps;
  const renderLine = useCallback(
    (ctx: CanvasRenderingContext2D, sizeMultiplier: number) => {
      ctx.beginPath();
      ctx.lineWidth = params.size * sizeMultiplier;
      ctx.strokeStyle = params.color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x * sizeMultiplier, point.y * sizeMultiplier);
          return;
        }
        ctx.lineTo(point.x * sizeMultiplier, point.y * sizeMultiplier);
      });
      ctx.stroke();
      ctx.closePath();
    },
    [points, params, id]
  );
  useEffect(() => {
    if (!active) {
      return;
    }
    renderQueue.add(id, renderLine);
    render();
  }, [renderLine, active]);
  const onMouseDown = useCallback(
    (cursor) => {
      setPoints((points) => [...points, cursor]);
    },
    [setPoints]
  );
  const onMouseMove = useCallback(
    (cursor, drawing) => {
      if (!drawing) {
        return;
      }
      setPoints((points) => [...points, cursor]);
    },
    [setPoints]
  );
  useMouse({
    element: canvas,
    onDown: onMouseDown,
    onMove: onMouseMove,
    onUp: reset,
    active,
  });

  const settingsElements = (
    <>
      <input
        type="color"
        value={params.color}
        onChange={(event) => {
          setParams((params) => ({ ...params, color: event.target.value }));
        }}
      />
      <input
        type="number"
        min={0}
        step={1}
        value={params.size}
        onChange={(event) => {
          setParams((params) => ({ ...params, size: +event.target.value }));
        }}
      />
    </>
  );

  return { settingsElements, controlElements: null };
}
