import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ImageData } from "common/interfaces";
import { MdBrush, MdTextFields } from "react-icons/all";
import styles from "./styles.module.scss";
import { ToolButton } from "./components/ToolButton";
import { Button } from "../../components";
import { RenderQueue } from "./renderQueue";
import { useBrush } from "./tools/brush";
import { ToolResult } from "./tools/interfaces";
import { render } from "react-dom";

type Props = {
  image: ImageData;
};
enum Tools {
  TEXT,
  BRUSH,
}

export const EditImagePageView = ({ image }: Props) => {
  const {
    calculateCanvasSize,
    canvas,
    setCanvas,
    renderQueue,
    saveResult,
    render,
    canvasSize,
  } = useRenderContext(image);

  const { activeTool, handleChangeTool, settingsElements } = useTools({
    canvas,
    render,
    renderQueue,
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
          <Button onClick={saveResult} primary>
            Save
          </Button>
        </div>
        <div className={styles.canvasHolder} ref={calculateCanvasSize}>
          <div className={styles.canvas}>
            <canvas
              width={canvasSize.width}
              height={canvasSize.height}
              ref={setCanvas}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function useTools({
  render,
  canvas,
  renderQueue,
}): {
  activeTool: Tools;
  handleChangeTool: (tool: Tools) => void;
} & ToolResult {
  const [activeTool, setActiveTool] = useState<Tools>();
  const handleChangeTool = (tool) => {
    if (tool === activeTool) {
      return setActiveTool(null);
    }
    setActiveTool(tool);
  };
  let toolResults = {};
  toolResults[Tools.BRUSH] = useBrush({
    render,
    canvas: canvas,
    renderQueue: renderQueue,
    active: activeTool === Tools.BRUSH,
  });
  return useMemo(() => {
    let result = { activeTool, handleChangeTool };
    if (toolResults[activeTool]) {
      result = { ...result, ...toolResults[activeTool] };
    }
    return result;
  }, [activeTool, handleChangeTool, toolResults[activeTool]]);
}

function useRenderContext(image) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [imageElement, setImageElement] = useState<HTMLImageElement>();
  const [renderQueue, setRenderQueue] = useState<RenderQueue>();
  useEffect(() => {
    const tmpImage = new Image();
    tmpImage.onload = function () {
      setImageElement(tmpImage);
    };
    tmpImage.src = image.publicUrl;
  }, []);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const calculateCanvasSize = useCallback(
    (wrapperElement) => {
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
    },
    [setCanvasSize, image]
  );
  const render = useCallback(() => {
    if (!canvas || !renderQueue) {
      return;
    }
    renderQueue.render(canvas, 1);
  }, [canvas, renderQueue]);
  useEffect(() => {
    if (!canvas || !imageElement) {
      return;
    }
    const renderQueue = new RenderQueue();
    renderQueue.add("bg", (context, sizeMultiplier) => {
      context.drawImage(
        imageElement,
        0,
        0,
        canvasSize.width,
        canvasSize.height
      );
    });
    renderQueue.render(canvas, 1);
    setRenderQueue(renderQueue);
  }, [canvasSize, imageElement]);

  const saveResult = useCallback(() => {
    if(!renderQueue) {
      return;
    }
    let renderQueueClone = renderQueue.clone();
    const canvasEl = document.createElement("canvas");
    canvasEl.setAttribute("width", image.width + "px");
    canvasEl.setAttribute("height", image.height + "px");
    const sizeMultiplier = image.width / canvasSize.width;
    renderQueueClone.add("bg", (context) => {
      context.drawImage(imageElement, 0, 0, image.width, image.height);
    });
    renderQueueClone.render(canvasEl, sizeMultiplier);
    const downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL("image/jpeg", 1);
    downloadLink.target = "_self";
    downloadLink.download = "result.jpeg";
    downloadLink.click();
  }, [image, canvasSize, imageElement, renderQueue]);

  return {
    calculateCanvasSize,
    canvas,
    setCanvas,
    renderQueue,
    saveResult,
    render,
    canvasSize,
  };
}
