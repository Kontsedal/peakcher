import React, { useCallback, useContext, useRef, useState } from "react";
import { ImageData } from "common/interfaces";
import { linkToBase64 } from "utils/file";
import { CommunicationService } from "common/services/Communication";
import { useDispatch } from "react-redux";
import { useOutsideClick } from "popup/hooks/useOutsideClick";
import { CurrentViewContext } from "popup/context/currentView";
import { actions } from "common/store";
import { I18n } from "common/services/I18n";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { ImageItemView } from "./view";
import { ToastContext } from "../../../Toast/context";
import { ToastTypes } from "../../../Toast";

type Props = {
  file: ImageData;
};

export const ImageItem: React.FC<Props> = ({ file }) => {
  const actionsPopupRef = useRef();
  const {
    actionsVisible,
    hideActions,
    version,
    base64IsLoading,
    base64Link,
    deleteFile,
    loadError,
    setLoadError,
    setLoading,
    reload,
    forceDelete,
    loading,
    isRemoving,
    loadBase64,
    setActionsVisible,
    onCopy,
  } = useImageActions(file);
  useOutsideClick(actionsVisible && actionsPopupRef.current, hideActions, {
    excludedClasses: [styles.moreActionsItem, styles.moreActionsItemText],
  });
  const { showEditImageTagsView, showEditImageView } = useContext(
    CurrentViewContext
  );
  return (
    <ImageItemView
      key={version}
      actionsPopupRef={actionsPopupRef}
      actionsVisible={actionsVisible}
      base64IsLoading={base64IsLoading}
      base64Link={base64Link}
      deleteFile={deleteFile}
      hasLoadingError={loadError}
      onImageLoadError={() => setLoadError(true)}
      onImageLoad={() => setLoading(false)}
      onReload={reload}
      forceDelete={forceDelete}
      loading={loading}
      file={file}
      isRemoving={isRemoving}
      loadBase64={loadBase64}
      setActionsVisible={setActionsVisible}
      showEditImageTagsView={showEditImageTagsView}
      showEditImageView={showEditImageView}
      onCopy={onCopy}
    />
  );
};

function useImageActions(file: ImageData) {
  const dispatch = useDispatch();
  const { showToast } = useContext(ToastContext);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [base64Link, setBase64Link] = useState<undefined | string>();
  const [base64IsLoading, setBase64IsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(false);
  // to reload view
  const [version, setVersion] = useState(1);
  const loadBase64 = useCallback(() => {
    setBase64IsLoading(true);
    linkToBase64(file.publicUrl, file.type).then((link) => {
      setBase64IsLoading(false);
      setBase64Link(link);
    });
  }, [file.publicUrl, file.type, setBase64Link, setBase64IsLoading]);
  const hideActions = useCallback(() => {
    setActionsVisible(false);
  }, [setActionsVisible]);
  const deleteFile = useCallback(() => {
    setIsRemoving(true);
    CommunicationService.deleteFile({ fileId: file.id }, (response) => {
      setIsRemoving(false);
      if (response.success) {
        showToast({
          text: I18n.t("fileDeleteSuccessMessage"),
          type: ToastTypes.SUCCESS,
        });
      }
      if (response.error) {
        showToast({
          text: I18n.t("fileDeleteErrorMessage"),
          type: ToastTypes.ERROR,
        });
      }
    });
  }, [file.id, setIsRemoving, showToast]);
  const onCopy = useCallback(() => {
    dispatch(actions.incrementUsedTimes({ fileId: file.id }));
    showToast({
      text: I18n.t("urlCopySuccessMessage"),
      type: ToastTypes.SUCCESS,
    });
  }, [file, dispatch, showToast]);
  const forceDelete = useCallback(() => {
    dispatch(actions.deleteFile(file.id));
    showToast({
      text: I18n.t("fileDeleteSuccessMessage"),
      type: ToastTypes.SUCCESS,
    });
  }, [file, showToast, dispatch]);
  const reload = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    setVersion((oldVersion) => oldVersion + 1);
  }, [setVersion, setLoadError]);

  return {
    actionsVisible,
    hideActions,
    version,
    base64IsLoading,
    base64Link,
    deleteFile,
    loadError,
    setLoadError,
    setLoading,
    reload,
    forceDelete,
    loading,
    isRemoving,
    loadBase64,
    setActionsVisible,
    onCopy,
  };
}

ImageItem.propTypes = {
  file: PropTypes.exact({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    publicUrl: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    usedTimes: PropTypes.number.isRequired,
  }).isRequired,
};
