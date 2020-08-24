import React from "react";
import { useSelector } from "react-redux";
import { getUploadStatus } from "common/store/selectors";
import { UploadStatus } from "common/interfaces";
import { Logger } from "common/services/Logger";
import { UploadIndicatorView } from "./view";

export const UploadIndicator: React.FC = () => {
  const uploadStatus = useSelector(getUploadStatus);
  const statuses: Array<UploadStatus> = Object.values(uploadStatus);
  const allUploaded = statuses.every((item) => !item.uploading);
  if (allUploaded) {
    return null;
  }
  Logger.warn({ statuses });
  const sum = statuses.reduce((result, status) => result + status.progress, 0);
  return <UploadIndicatorView progress={sum / statuses.length} />;
};
