import React, { useCallback, useEffect, useRef } from "react";
import { positive, useMouse, useToolBase } from "../utils";
import { ToolParams, ToolResult } from "./interfaces";
import s from "./styles.module.scss";
import { Button } from "../../../components";

export function useText({
  canvas,
  render,
  renderQueue,
  active,
}: ToolParams): ToolResult {
  const {
    params,
    setParams,
    customProps,
    setCustomProps: setBoxPosition,
    id,
    reset,
  } = useToolBase({
    defaultParams: {
      color: "white",
      size: 20,
    },
    defaultCustomProps: {
      visible: false,
      x: 0,
      y: 0,
      width: 200,
      height: 70,
      text: "",
    },
  });
  const boxPosition = customProps;
  const textboxRef = useRef<HTMLDivElement>();
  const renderText = useCallback(
    (ctx: CanvasRenderingContext2D, sizeMultiplier: number) => {},
    [boxPosition, params, id]
  );
  useEffect(() => {
    if (!active) {
      return;
    }
    renderQueue.add(id, renderText);
    render();
  }, [renderText, active]);
  const onMouseDown = useCallback(
    (cursor) => {
      reset();
      setBoxPosition((position) => ({ ...position, x: cursor.x, y: cursor.y }));
    },
    [setBoxPosition, reset]
  );
  const onMouseUp = useCallback(() => {
    if (typeof textboxRef.current !== "undefined") {
      textboxRef.current.focus();
    }
  }, [setBoxPosition]);
  const onMouseMove = useCallback(
    (cursor, drawing) => {
      if (!drawing) {
        return;
      }
      setBoxPosition((position) => ({
        ...position,
        visible: true,
        width: positive(cursor.x - position.x),
        height: positive(cursor.y - position.y),
      }));
    },
    [setBoxPosition]
  );
  useMouse({
    element: canvas,
    onDown: onMouseDown,
    onMove: onMouseMove,
    onUp: onMouseUp,
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

  const controlElements = customProps.visible && (
    <div
      style={{
        width: customProps.width,
        height: customProps.height,
        left: customProps.x,
        top: customProps.y,
      }}
      className={s.textBoxWrapper}
    >
      <div
        contentEditable
        className={s.textBox}
        ref={textboxRef}
        style={{
          fontSize: params.size,
          color: params.color,
        }}
      >
        {customProps.text}
      </div>
      <Button className={s.saveBtn} onClick={reset}>
        Save
      </Button>
    </div>
  );

  return { settingsElements, controlElements: controlElements };
}
