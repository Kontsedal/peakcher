import { v4 as uuid } from "uuid";
import { ImageData } from "common/interfaces";
import * as utils from "../utils";

const buildImage = ({
  width,
  height,
  id,
}: {
  width: number;
  height: number;
  id: string;
}): ImageData => ({
  name: uuid(),
  publicUrl: uuid(),
  id,
  path: uuid(),
  type: uuid(),
  size: Math.random() * 1000000,
  height,
  width,
  tags: [],
  createdAt: Date.now(),
  usedTimes: 0,
});

describe("ImagesGrid utils", () => {
  describe("Grid calculation", () => {
    it("should calculate grid correctly", () => {
      const imagesSizes = [
        { width: 100, height: 200, id: "1" },
        { width: 100, height: 300, id: "2" },
        { width: 100, height: 150, id: "3" },
        { width: 100, height: 300, id: "4" },
        { width: 100, height: 150, id: "5" },
        { width: 100, height: 145, id: "6" },
      ];
      const images = imagesSizes.map(buildImage);
      const expectedResult = {
        1: { width: 100, height: 200, x: 0, y: 0 },
        2: { width: 100, height: 300, x: 100, y: 0 },
        3: { width: 100, height: 150, x: 200, y: 0 },
        4: { width: 100, height: 300, x: 200, y: 150 },
        5: { width: 100, height: 150, x: 0, y: 200 },
        6: { width: 100, height: 145, x: 100, y: 300 },
      };
      expect(expectedResult).toEqual(
        utils.getImagesPositions({
          images,
          columnsCount: 3,
          imagesOffset: 0,
          gridWidth: 300,
        })
      );
    });
  });
});
