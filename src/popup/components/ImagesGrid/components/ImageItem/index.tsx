import React, { useCallback, useContext, useRef, useState } from "react";
import { File } from "common/interfaces";
import styles from "./styles.module.scss";
import { linkToBase64 } from "utils/file";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import { CurrentViewContext } from "../../../../context/CurrentView";
import { CommunicationService } from "common/services/Communication";
import { ImageItemView } from "./view";
import { useDispatch } from "react-redux";
import { actions } from "../../../../../common/store";

type Props = {
  file: File;
};

export const ImageItem = ({ file }: Props) => {
  const actionsPopupRef = useRef();
  const dispatch = useDispatch();
  const [actionsVisible, setActionsVisible] = useState(false);
  const [base64Link, setBase64Link] = useState<undefined | string>();
  const [base64IsLoading, setBase64IsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const loadBase64 = useCallback(() => {
    setBase64IsLoading(true);
    linkToBase64(file.publicUrl, file.type).then((link) => {
      setBase64IsLoading(false);
      setBase64Link(link);
    });
  }, [file.publicUrl, setBase64Link, setBase64IsLoading]);
  const hideActions = useCallback(() => {
    setActionsVisible(false);
  }, [setActionsVisible]);
  const deleteFile = useCallback(() => {
    setIsRemoving(true);
    CommunicationService.deleteFile({ fileId: file.id }, (response) => {
      setIsRemoving(false);
    });
  }, [file.id, setIsRemoving]);
  const onCopy = useCallback(() => {
    dispatch(actions.incrementUsedTimes({ fileId: file.id }));
  }, [file, dispatch]);
  useOutsideClick(actionsVisible && actionsPopupRef.current, hideActions, {
    excludedClasses: [styles.moreActionsItem, styles.moreActionsItemText],
  });
  const { showEditImageTagsView } = useContext(CurrentViewContext);
  return (
    <ImageItemView
      actionsPopupRef={actionsPopupRef}
      actionsVisible={actionsVisible}
      base64IsLoading={base64IsLoading}
      base64Link={base64Link}
      deleteFile={deleteFile}
      file={file}
      isRemoving={isRemoving}
      loadBase64={loadBase64}
      setActionsVisible={setActionsVisible}
      showEditImageTagsView={showEditImageTagsView}
      onCopy={onCopy}
    />
  );
};
