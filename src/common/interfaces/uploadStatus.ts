export interface UploadFileInfo {
  id: string;
  uploading: boolean;
  error: boolean;
  progress: number;
}

export interface UploadStatus {
  [key: string]: UploadFileInfo;
}
