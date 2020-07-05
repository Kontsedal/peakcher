import styles from "./styles.module.scss";
import LinkIcon from "./assets/link.svg";
import MoreIcon from "./assets/actions.svg";
import React, { MutableRefObject } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { File } from "common/interfaces";
import cn from "classnames";
import { Action } from "./components/Action";

type Props = {
  file: File;
  setActionsVisible: (visible: boolean) => void;
  actionsPopupRef?: MutableRefObject<any>;
  actionsVisible: boolean;
  base64IsLoading: boolean;
  isRemoving: boolean;
  base64Link?: string;
  showEditImageTagsView: (id: string) => void;
  loadBase64: () => void;
  deleteFile: () => void;
  onCopy?: () => void;
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
  isRemoving,
  onCopy,
}: Props) => (
  <div className={styles.imageItem}>
    <img src={file.publicUrl} />
    <div className={styles.hoverContainer}>
      <div className={styles.hoverActions}>
        <CopyToClipboard text={file.publicUrl} onCopy={onCopy}>
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
            <Action
              text="Edit tags"
              onClick={() => showEditImageTagsView(file.id)}
            />
            <Action text="Edit image" onClick={() => {}} />
            <Action
              text={base64Link ? "Copy Base64" : "Get Base64"}
              isLoading={base64IsLoading}
              textToCopy={base64Link}
              onCopy={onCopy}
              onClick={!base64Link && !base64IsLoading ? loadBase64 : undefined}
            />
            <Action text="Remove" onClick={deleteFile} isLoading={isRemoving} />
          </div>
          <MoreIcon />
        </button>
      </div>
    </div>
  </div>
);
