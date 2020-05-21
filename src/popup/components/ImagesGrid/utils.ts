import { File } from "common/interfaces";

export const getImagesPositions = ({
  images,
  columnsCount,
  gridWidth,
  imagesOffset,
}: {
  images: File[];
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
  images.forEach((image) => {
    const newHeight = (columnWidth / image.width) * image.height;
    const columnNumber = columnsHeights.indexOf(Math.min(...columnsHeights));
    const columnHeight = columnsHeights[columnNumber];
    const newY = columnHeight + imagesOffset;
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
