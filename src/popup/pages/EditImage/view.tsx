import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImageData } from "common/interfaces";
import { MdBrush, MdTextFields } from "react-icons/all";
import styles from "./styles.module.scss";
import { ToolButton } from "./components/ToolButton";
import { Painter } from "./Painter";
import { SHAPES } from "./Painter/enums/shapes";

type Props = {
  image: ImageData;
};
enum Tools {
  TEXT,
  BRUSH,
}
export const EditImagePageView = ({ image }: Props) => {
  const painterRef = useRef<Painter>(new Painter());
  const [activeTool, setActiveTool] = useState<Tools>();
  const handleChangeTool = (tool) => {
    if (tool === activeTool) {
      return setActiveTool(null);
    }
    setActiveTool(tool);
  };
  const [imageElement, setImageElement] = useState<HTMLImageElement>();
  useEffect(() => {
    const tmpImage = new Image();
    tmpImage.onload = function () {
      setImageElement(tmpImage);
    };
    tmpImage.src = image.publicUrl;
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>();
  const drawAreaRef = useRef<HTMLDivElement>();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const calculateCanvasSize = (wrapperElement) => {
    if (!wrapperElement || canvasSize.width || canvasSize.height) {
      return;
    }
    const wrapperWidth = wrapperElement.offsetWidth;
    const wrapperHeight = wrapperElement.offsetHeight;
    let resultWidth = wrapperWidth > image.width ? image.width : wrapperWidth;
    const imageRatio = image.width / image.height;
    let resultHeight = resultWidth / imageRatio;
    if (resultHeight > wrapperHeight) {
      resultHeight = wrapperHeight;
      resultWidth = wrapperHeight * imageRatio;
    }
    setCanvasSize({ width: resultWidth, height: resultHeight });
  };
  const draw = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    painterRef.current.render(canvasRef.current.getContext("2d"), 1)
  }, [canvasRef]);
  useEffect(() => {
    if (!canvasRef.current || !imageElement) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(imageElement, 0, 0, canvasSize.width, canvasSize.height);
  }, [canvasSize, imageElement]);

  const currentShape = painterRef.current.getCurrentShape();

  console.log({currentShape})

  const { cursorPosition } = useCursorPosition(drawAreaRef);
  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <div className={styles.toolbar}>
          <ToolButton
            onClick={() => handleChangeTool(Tools.TEXT)}
            active={activeTool === Tools.TEXT}
          >
            <MdTextFields size={18} />
          </ToolButton>
          <ToolButton
            onClick={() => handleChangeTool(Tools.BRUSH)}
            active={activeTool === Tools.BRUSH}
          >
            <MdBrush size={18} />
          </ToolButton>
        </div>
        <div className={styles.canvasHolder} ref={calculateCanvasSize}>
          <div className={styles.canvas} ref={drawAreaRef}>
            <canvas
              width={canvasSize.width}
              height={canvasSize.height}
              ref={(element) => {
                canvasRef.current = element;
                draw();
              }}
              onMouseDown={() => {
                painterRef.current.create({shape: SHAPES.BRUSH, position: cursorPosition })
                draw()
              }}
              onMouseMove={() => {
                painterRef.current.update(cursorPosition)
                draw()
              }}
              onMouseUp={() => {
                painterRef.current.finish()
              }}
              onMouseLeave={() => {
                painterRef.current.finish()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function useCursorPosition(drawAreaRef) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!drawAreaRef.current) {
      return;
    }
    const handler = (event) => {
      setCursorPosition({
        x: event.offsetX >= 0 ? event.offsetX : 0,
        y: event.offsetY >= 0 ? event.offsetY : 0,
      });
    };
    drawAreaRef.current.addEventListener("mousemove", handler);
    return () => drawAreaRef.current.removeEventListener("mousemove", handler);
  }, [drawAreaRef.current]);

  return { cursorPosition };
}
