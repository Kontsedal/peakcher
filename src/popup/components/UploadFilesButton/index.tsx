import { I18n } from "common/services/I18n";
import React, { useRef, useState } from "react";
import { fileToLink, getImageSizes } from "utils/file";
import { v4 as uuid } from "uuid";
import { CommunicationService } from "common/services/Communication";
import s from "./styles.module.scss";
import { Button } from "../Button";

export const UploadFilesButton: React.FC = () => {
  const [inputVersion, setInputVersion] = useState(0);
  const inputRef = useRef<HTMLInputElement>();
  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const filesToUpload = Array.from(files).map((file) => ({
      fileUrl: fileToLink(file),
      name: file.name,
      size: file.size,
      type: file.type,
      width: 0,
      height: 0,
      uploadId: uuid(),
    }));
    const errorFilesNames = [];
    await Promise.all(
      filesToUpload.map(async (file, index) => {
        try {
          const sizes = await getImageSizes(file.fileUrl);
          filesToUpload[index].width = sizes.width;
          filesToUpload[index].height = sizes.height;
        } catch (error) {
          errorFilesNames.push(file.name);
        }
      })
    );
    setInputVersion(inputVersion + 1);
    CommunicationService.uploadFiles({
      files: filesToUpload,
      notifyUser: false,
    });
  };
  return (
    <>
      <Button
        primary
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        {I18n.t("addFile")}
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        key={inputVersion}
        className={s.input}
        onChange={onChange}
      />
    </>
  );
};
