import { RenderFunction } from "../../interfaces";

export type BackgroundData = {
  params?: {};
  imageElement: HTMLImageElement;
};
export const renderBackground: RenderFunction = ({ canvas, data }) => {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(data.imageElement, 0, 0, canvas.width, canvas.height);
};
