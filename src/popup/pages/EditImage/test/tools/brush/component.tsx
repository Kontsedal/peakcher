import { Renderer, useEntityData } from "../../renderer";
import { useCallback, useState } from "react";
import { useMouse } from "../../../utils";
import { Tool } from "../../constants";

export const Brush = ({
  renderer,
  id,
  canvas,
}: {
  renderer: Renderer;
  id: string;
  canvas: HTMLCanvasElement;
}) => {
  const [active, setActive] = useState(true);
  const [entityData, setEntityData] = useEntityData<Tool.BRUSH>(renderer, id);

  const onMouseMove = useCallback(
    (cursor) => {
      if (!active) {
        return;
      }
      setEntityData((entityData) => ({
        ...entityData,
        points: [...entityData.points, cursor],
      }));
    },
    [active, setEntityData]
  );
  const onMouseUp = useCallback(() => {
    setActive(false);
  }, [setActive]);
  useMouse({
    element: canvas,
    onUp: onMouseUp,
    onMove: onMouseMove,
  });

  return null;
};
