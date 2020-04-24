export interface FileToUpload {
  fileUrl: string;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  uploadId?: string;
}
