export interface UploadStatus {
  id: string;
  uploading: boolean;
  error: boolean;
  progress: number;
}

export interface UploadStatusMap {
  [key: string]: UploadStatus;
}
