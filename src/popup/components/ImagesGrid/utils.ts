import { ImageData } from "common/interfaces";
import { CONFIG } from "../../../config";

export const getImagesPositions = ({
  images,
  columnsCount,
  gridWidth,
  imagesOffset,
}: {
  images: ImageData[];
  gridWidth: number;
  columnsCount: number;
  imagesOffset;
}): {
  [key: string]: { x: number; y: number; width: number; height: number };
} => {
  const columnWidth =
    gridWidth / columnsCount -
    (imagesOffset * (columnsCount - 1)) / columnsCount;
  const result = {};
  const columnsHeights = new Array(columnsCount).fill(0);
  images.forEach((image, index) => {
    let newHeight = (columnWidth / image.width) * image.height;
    if (newHeight < CONFIG.MIN_GRID_IMAGE_HEIGHT) {
      newHeight = CONFIG.MIN_GRID_IMAGE_HEIGHT;
    }
    const columnNumber = columnsHeights.indexOf(Math.min(...columnsHeights));
    let newY = columnsHeights[columnNumber];
    if (index > columnsCount) {
      newY += imagesOffset;
    }
    columnsHeights[columnNumber] = newY + newHeight;
    result[image.id] = {
      x: columnNumber * columnWidth + columnNumber * imagesOffset,
      y: newY,
      width: columnWidth,
      height: newHeight,
    };
  });
  return result;
};
