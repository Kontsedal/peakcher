import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImageData } from "common/interfaces";
import { MdBrush, MdTextFields } from "react-icons/all";
import styles from "./styles.module.scss";
import { ToolButton } from "./components/ToolButton";
import { Painter } from "./Painter";
import { SHAPES } from "./Painter/enums/shapes";
import { defaultParamsMap } from "./Painter/constants/toolsParams";
import { ToolParams } from "./Painter/interfaces/toolParams";
import { doc } from "prettier";
import { Button } from "../../components";

type Props = {
  image: ImageData;
};
enum Tools {
  TEXT,
  BRUSH,
}

const toolShapeMap = {
  [Tools.BRUSH]: SHAPES.BRUSH,
}

export const EditImagePageView = ({ image }: Props) => {
  const painterRef = useRef<Painter>(new Painter());
  const [activeTool, setActiveTool] = useState<Tools>();
  const activeShape = toolShapeMap[activeTool]
  const [activeToolParams, setActiveToolParams] = useState<ToolParams>({});
  const handleChangeTool = (tool) => {
    if (tool === activeTool) {
      return setActiveTool(null);
    }
    const shape = toolShapeMap[tool];
    const defualtShapeParams = defaultParamsMap[shape]
    setActiveTool(tool);
    setActiveToolParams(defualtShapeParams);
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

  const save = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', image.width + 'px')
    canvas.setAttribute('height', image.width + "px");
    const sizeMultiplier = image.width / canvasSize.width;
    canvas.getContext('2d').drawImage(imageElement, 0, 0, image.width, image.height);
    painterRef.current.render(canvas.getContext('2d'), sizeMultiplier)
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/jpeg', 1);
    downloadLink.target = '_self';
    downloadLink.download = 'result.jpeg';
    downloadLink.click();
  }, [image, canvasSize, imageElement])

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
          {activeToolParams && Object.entries(activeToolParams).map(([name, value]) => {
            if(name === "color") {
              return <input type="color" value={value} onChange={(event => {
                const newParams = {...activeToolParams, [name]: event.target.value}
                setActiveToolParams(newParams)
                painterRef.current.update({params: newParams})
              })}/>
            }
            if(name === "size") {
              return <input type="number" min={0} step={1} value={value} onChange={(event => {
                const newParams = {...activeToolParams, [name]: event.target.value}
                setActiveToolParams(newParams)
                painterRef.current.update({params: newParams})
              })}/>
            }
          })}
          <Button onClick={save} primary>
            Save
          </Button>
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
                if(!activeTool) {
                  return
                }
                painterRef.current.create({shape: activeShape, position: cursorPosition, params: activeToolParams })
                draw()
              }}
              onMouseMove={() => {
                if(!activeTool) {
                  return
                }
                painterRef.current.update({ position: cursorPosition })
                draw()
              }}
              onMouseUp={() => {
                if(!activeTool) {
                  return
                }
                painterRef.current.finish()
              }}
              onMouseLeave={() => {
                if(!activeTool) {
                  return
                }
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
