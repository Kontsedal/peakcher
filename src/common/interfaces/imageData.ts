export type ImageData = {
  width: number;
  height: number;
  tags: string[];
  name: string;
  publicUrl: string;
  id: string;
  path: string;
  type: string;
  size: number;
  createdAt: number;
  usedTimes: number;
};

export type ImageDataMap = {
  [key: string]: ImageData;
};
