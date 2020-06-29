import React from "react";
import { useSelector } from "react-redux";
import { getUploadStatus } from "../../../common/store/selectors";
import { UploadIndicatorView } from "./view";
import { UploadFileInfo } from "../../../common/interfaces";

export const UploadIndicator = () => {
  const uploadStatus = useSelector(getUploadStatus);
  let statuses: Array<UploadFileInfo> = Object.values(uploadStatus);
  let allUploaded = statuses.every((item) => !item.uploading);
  if (allUploaded) {
    return null;
  }
  console.warn({ statuses });
  let sum = statuses.reduce((result, status) => result + status.progress, 0);
  return <UploadIndicatorView progress={sum / statuses.length} />;
};
