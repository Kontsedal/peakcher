import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImageData } from "common/interfaces";
import { MdBrush, MdTextFields } from "react-icons/all";
import styles from "./styles.module.scss";
import { ToolButton } from "./components/ToolButton";
import { Button } from "../../components";
import { RenderQueue } from "./renderQueue";
import { useBrush } from "./tools/brush";

type Props = {
  image: ImageData;
};
enum Tools {
  TEXT,
  BRUSH,
}

export const EditImagePageView = ({ image }: Props) => {
  const renderQueueRef = useRef<RenderQueue>(new RenderQueue(["bg"]));
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
    renderQueueRef.current.render(canvasRef.current, 1);
  }, [canvasRef]);
  useEffect(() => {
    if (!canvasRef.current || !imageElement) {
      return;
    }
    renderQueueRef.current.add("bg", (context, sizeMultiplier) => {
      context.drawImage(
        imageElement,
        0,
        0,
        canvasSize.width,
        canvasSize.height
      );
    });
    renderQueueRef.current.render(canvasRef.current, 1);
  }, [canvasSize, imageElement]);

  const save = useCallback(() => {
    let renderQueue = renderQueueRef.current.clone();
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", image.width + "px");
    canvas.setAttribute("height", image.height + "px");
    const sizeMultiplier = image.width / canvasSize.width;
    renderQueue.add("bg", (context) => {
      context.drawImage(imageElement, 0, 0, image.width, image.height);
    });
    renderQueue.render(canvas, sizeMultiplier);
    const downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL("image/jpeg", 1);
    downloadLink.target = "_self";
    downloadLink.download = "result.jpeg";
    downloadLink.click();
  }, [image, canvasSize, imageElement]);

  const { settingsElements } = useBrush({
    render: draw,
    canvas: canvasRef.current,
    renderQueue: renderQueueRef.current,
  });

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
          {settingsElements}
          <Button onClick={save} primary>
            Save
          </Button>
        </div>
        <div className={styles.canvasHolder} ref={calculateCanvasSize}>
          <div className={styles.canvas}>
            <canvas
              width={canvasSize.width}
              height={canvasSize.height}
              ref={(element) => {
                canvasRef.current = element;
                draw();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
