import React, { MutableRefObject } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ImageData } from "common/interfaces";
import cn from "classnames";
import { MdWarning } from "react-icons/all";
import { I18n } from "common/services/I18n";
import PropTypes from "prop-types";
import { Action } from "./components/Action";
import MoreIcon from "./assets/actions.svg";
import LinkIcon from "./assets/link.svg";
import styles from "./styles.module.scss";
import { Button } from "../../../Button";

export type Props = {
  file: ImageData;
  setActionsVisible: (visible: boolean) => void;
  actionsPopupRef?: MutableRefObject<HTMLDivElement>;
  actionsVisible: boolean;
  base64IsLoading: boolean;
  isRemoving: boolean;
  base64Link?: string;
  showEditImageTagsView: (id: string) => void;
  loadBase64: () => void;
  deleteFile: () => void;
  onCopy?: () => void;
  onImageLoadError: () => void;
  forceDelete: () => void;
  onReload: () => void;
  hasLoadingError: boolean;
  onImageLoad: () => void;
  loading: boolean;
};

export const ImageItemView: React.FC<Props> = ({
  file,
  setActionsVisible,
  actionsPopupRef,
  actionsVisible,
  showEditImageTagsView,
  base64IsLoading,
  base64Link,
  loadBase64,
  deleteFile,
  isRemoving,
  forceDelete,
  onImageLoadError,
  onCopy,
  onReload,
  hasLoadingError,
  onImageLoad,
  loading,
}) => (
  <div className={styles.imageItem}>
    {hasLoadingError && (
      <div className={styles.loadingError}>
        <MdWarning size={20} className={styles.icon} />
        <p>{I18n.t("imageLoadErrorText")}</p>
        <div className={styles.errorActions}>
          <Button onClick={onReload} primary>
            Reload
          </Button>
          <Button onClick={forceDelete}>
            {I18n.t("removeFileToUploadButtonTitle")}
          </Button>
        </div>
      </div>
    )}
    <img
      alt={file.tags.join(", ")}
      onLoad={onImageLoad}
      onError={onImageLoadError}
      src={file.publicUrl}
      style={{ visibility: hasLoadingError ? "hidden" : "visible" }}
    />
    {!loading && (
      <div className={styles.hoverContainer}>
        <div className={styles.hoverActions}>
          <CopyToClipboard text={file.publicUrl} onCopy={onCopy}>
            <button
              type="button"
              className={cn(styles.actionButton, styles.linkButton)}
            >
              <LinkIcon className={styles.linkButtonIcon} />
              Link
            </button>
          </CopyToClipboard>
          <button
            type="button"
            onClick={() => setActionsVisible(true)}
            className={cn(styles.actionButton, styles.moreActionsButton)}
          >
            <div
              className={styles.moreActionsPopup}
              ref={actionsPopupRef}
              style={{ display: actionsVisible ? "block" : "none" }}
            >
              <Action
                text="Edit tags"
                onClick={() => showEditImageTagsView(file.id)}
              />
              {/* <Action text="Edit image" onClick={() => {}} /> */}
              <Action
                text={base64Link ? "Copy Base64" : "Get Base64"}
                isLoading={base64IsLoading}
                textToCopy={base64Link}
                onCopy={onCopy}
                onClick={
                  !base64Link && !base64IsLoading ? loadBase64 : undefined
                }
              />
              <Action
                text="Remove"
                onClick={deleteFile}
                isLoading={isRemoving}
              />
            </div>
            <MoreIcon />
          </button>
        </div>
      </div>
    )}
  </div>
);

ImageItemView.propTypes = {
  file: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.symbol),
    name: PropTypes.number.isRequired,
    publicUrl: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    path: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    usedTimes: PropTypes.number.isRequired,
  }).isRequired,
  setActionsVisible: PropTypes.func.isRequired,
  actionsPopupRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  actionsVisible: PropTypes.bool.isRequired,
  base64IsLoading: PropTypes.bool.isRequired,
  isRemoving: PropTypes.bool.isRequired,
  base64Link: PropTypes.string.isRequired,
  showEditImageTagsView: PropTypes.func.isRequired,
  loadBase64: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onImageLoadError: PropTypes.func.isRequired,
  forceDelete: PropTypes.func.isRequired,
  onReload: PropTypes.func.isRequired,
  hasLoadingError: PropTypes.bool.isRequired,
  onImageLoad: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
