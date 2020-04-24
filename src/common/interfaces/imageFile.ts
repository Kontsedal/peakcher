export interface ImageFile {
  name: string;
  publicUrl: string;
  id: string;
  path: string;
  type: string;
  size: number;
  height: number;
  width: number;
  tags: string[];
  createdAt: number;
  usedTimes: number;
}
