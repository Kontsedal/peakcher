import styles from "./styles.module.scss";
import LinkIcon from "./assets/link.svg";
import MoreIcon from "./assets/actions.svg";
import React, { MutableRefObject } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { File } from "common/interfaces";
import cn from "classnames";

type Props = {
  file: File;
  setActionsVisible: (visible: boolean) => void;
  actionsPopupRef?: MutableRefObject<any>;
  actionsVisible: boolean;
  base64IsLoading: boolean;
  base64Link?: string;
  showEditImageTagsView: (id: string) => void;
  loadBase64: () => void;
  deleteFile: () => void;
};

export const ImageItemView = ({
  file,
  setActionsVisible,
  actionsPopupRef,
  actionsVisible,
  showEditImageTagsView,
  base64IsLoading,
  base64Link,
  loadBase64,
  deleteFile,
}: Props) => (
  <div className={styles.imageItem}>
    <img src={file.publicUrl} />
    <div className={styles.hoverContainer}>
      <div className={styles.hoverActions}>
        <CopyToClipboard text={file.publicUrl}>
          <button className={cn(styles.actionButton, styles.linkButton)}>
            <LinkIcon className={styles.linkButtonIcon} />
            Link
          </button>
        </CopyToClipboard>
        <button
          onClick={() => setActionsVisible(true)}
          className={cn(styles.actionButton, styles.moreActionsButton)}
        >
          <div
            className={styles.moreActionsPopup}
            ref={actionsPopupRef}
            style={{ display: actionsVisible ? "block" : "none" }}
          >
            <div
              className={styles.moreActionsItem}
              onClick={() => showEditImageTagsView(file.id)}
            >
              Edit tags
            </div>
            <div className={styles.moreActionsItem}>Edit image</div>
            {!base64IsLoading && !base64Link && (
              <div onClick={loadBase64} className={styles.moreActionsItem}>
                Get Base64
              </div>
            )}
            {base64IsLoading && (
              <div className={cn(styles.moreActionsItem, styles.loading)}>
                <div className={styles.loader} />
              </div>
            )}

            {base64Link && (
              <CopyToClipboard text={base64Link}>
                <div className={styles.moreActionsItem}>
                  <div className={styles.moreActionsItemText}>Copy Base64</div>
                </div>
              </CopyToClipboard>
            )}
            <div className={styles.moreActionsItem} onClick={deleteFile}>
              Remove
            </div>
          </div>

          <MoreIcon />
        </button>
      </div>
    </div>
  </div>
);
