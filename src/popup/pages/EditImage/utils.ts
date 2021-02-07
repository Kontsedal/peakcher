import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export function useCursorPosition(container) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!container) {
      return;
    }
    const handler = (event) => {
      setCursorPosition({
        x: event.offsetX >= 0 ? event.offsetX : 0,
        y: event.offsetY >= 0 ? event.offsetY : 0,
      });
    };
    container.addEventListener("mousemove", handler);
    return () => container.removeEventListener("mousemove", handler);
  }, [container]);

  return cursorPosition;
}

type CursorPosition = {
  x: number;
  y: number;
};
export const getCursorPosition = (event: MouseEvent): CursorPosition => {
  return {
    x: event.offsetX >= 0 ? event.offsetX : 0,
    y: event.offsetY >= 0 ? event.offsetY : 0,
  };
};

type UseMouseProps = {
  element: HTMLElement;
  onDown?: (cursor: CursorPosition) => void;
  onUp?: (cursor: CursorPosition) => void;
  onMove?: (cursor: CursorPosition, isDrawing: boolean) => void;
  active: boolean
};
export const useMouse = ({ element, onDown, onUp, onMove, active }: UseMouseProps) => {
  const drawingRef = useRef(false)
  useEffect(() => {
    if (!element) {
      return;
    }
    const handleMouseDown = (event) => {
      drawingRef.current = true;
      onDown && onDown(getCursorPosition(event));
    };
    const handleMouseUp = (event) => {
      drawingRef.current = false;
      onUp && onUp(getCursorPosition(event));
    };
    const handleMouseMove = (event) => {
      onMove && onMove(getCursorPosition(event), drawingRef.current);
    };
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);
    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, [element, onUp, onMove, onDown, active]);
};

export const useToolBase = ({
  defaultCustomProps,
  defaultParams,
}: {
  defaultCustomProps: any;
  defaultParams: any;
}) => {
  const [id, setId] = useState(uuid());
  const [params, setParams] = useState(defaultParams);
  const [customProps, setCustomProps] = useState(defaultCustomProps);
  const reset = useCallback(() => {
    setId(uuid());
    setCustomProps(defaultCustomProps);
  }, [setId, setCustomProps, defaultCustomProps]);

  return useMemo(
    () => ({
      id,
      params,
      setParams,
      customProps,
      setCustomProps,
      reset,
    }),
    [id, params, setParams, customProps, setCustomProps, reset]
  );
};


export function positive(num: number) {
  return num >= 0 ? num : 0
}
