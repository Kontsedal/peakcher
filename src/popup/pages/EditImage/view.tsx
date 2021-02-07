import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ImageData } from "common/interfaces";
import { MdBrush } from "react-icons/all";
import styles from "./styles.module.scss";
import { ToolButton } from "./components/ToolButton";
import { Button } from "../../components";
import { Renderer, useEntities } from "./test/renderer";
import { Tool } from "./test/constants";
import { Brush } from "./test/tools/brush/component";
import { defaultBrushParams } from "./test/tools/brush/renderer";

type Props = {
  image: ImageData;
};

export const EditImagePageView = ({ image }: Props) => {
  const {
    calculateCanvasSize,
    setCanvas,
    renderer,
    saveResult,
    entitiesElements,
    canvasSize,
  } = useRenderContext(image);

  const { activeTool, handleChangeTool, createToolInstance } = useTools(renderer);
  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <div className={styles.toolbar}>
          {/*<ToolButton*/}
          {/*  onClick={() => handleChangeTool(Tool.TEXT)}*/}
          {/*  active={activeTool === Tool.TEXT}*/}
          {/*>*/}
          {/*  <MdTextFields size={18} />*/}
          {/*</ToolButton>*/}
          <ToolButton
            onClick={() => handleChangeTool(Tool.BRUSH)}
            active={activeTool === Tool.BRUSH}
          >
            <MdBrush size={18} />
          </ToolButton>
          <Button onClick={saveResult} primary>
            Save
          </Button>
        </div>
        <div className={styles.canvasHolder} ref={calculateCanvasSize}>
          <div
            className={styles.canvas}
            style={{ width: canvasSize.width, height: canvasSize.height }}
          >
            <canvas
              width={canvasSize.width}
              height={canvasSize.height}
              ref={setCanvas}
              onMouseDown={createToolInstance}
            />
            {entitiesElements}
          </div>
        </div>
      </div>
    </div>
  );
};

function useTools(renderer: Renderer) {
  const defaultParamsMap = {
    [Tool.BRUSH]: defaultBrushParams
  }
  const [activeTool, setActiveTool] = useState<Tool>();
  const handleChangeTool = (tool) => {
    if (tool === activeTool) {
      return setActiveTool(null);
    }
    setActiveTool(tool);
  };

  const createToolInstance = useCallback(() => {
    renderer.add(activeTool, defaultParamsMap[activeTool]);
  }, [activeTool]);

  return useMemo(() => ({ activeTool, handleChangeTool, createToolInstance }), [
    activeTool,
    handleChangeTool,
    createToolInstance,
  ]);
}

function useRenderContext(image) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [imageElement, setImageElement] = useState<HTMLImageElement>();
  const [renderer] = useState<Renderer>(new Renderer());
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
    if (!canvas) {
      return;
    }
    renderer.render({
      canvas,
      multiplier: 1,
    });
  }, [canvas]);
  useEffect(() => {
    if (!canvas || !imageElement) {
      return;
    }
    renderer.add(Tool.BACKGROUND, { imageElement });
  }, [canvasSize, imageElement]);

  const saveResult = useCallback(() => {
    // if (!renderer) {
    //   return;
    // }
    // const canvasEl = document.createElement("canvas");
    // canvasEl.setAttribute("width", image.width + "px");
    // canvasEl.setAttribute("height", image.height + "px");
    // const sizeMultiplier = image.width / canvasSize.width;
    // renderQueueClone.add("bg", (context) => {
    //   context.drawImage(imageElement, 0, 0, image.width, image.height);
    // });
    // renderQueueClone.render(canvasEl, sizeMultiplier);
    // const downloadLink = document.createElement("a");
    // downloadLink.href = canvas.toDataURL("image/jpeg", 1);
    // downloadLink.target = "_self";
    // downloadLink.download = "result.jpeg";
    // downloadLink.click();
  }, [image, canvasSize, imageElement, renderer]);

  let entities = useEntities(renderer);

  useEffect(() => {
    render()
  }, [entities, render])

  const entitiesElements = entities.map((entity) => {
    if (entity.tool === Tool.BRUSH) {
      return (
        <Brush
          key={entity.id}
          id={entity.id}
          canvas={canvas}
          renderer={renderer}
        />
      );
    }
  });

  return {
    calculateCanvasSize,
    canvas,
    setCanvas,
    renderer,
    saveResult,
    render,
    canvasSize,
    entitiesElements,
  };
}
