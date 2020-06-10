import React, { useCallback, useContext, useRef, useState } from "react";
import cn from "classnames";
import { File } from "common/interfaces";
import styles from "./styles.module.scss";
import LinkIcon from "./assets/link.svg";
import MoreIcon from "./assets/actions.svg";
import { linkToBase64 } from "utils/file";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CurrentViewContext } from "../../../../context/CurrentView";

type Props = {
  file: File;
};

export const ImageItem = ({ file }: Props) => {
  const actionsPopupRef = useRef();
  let [actionsVisible, setActionsVisible] = useState(false);
  const [base64Link, setBase64Link] = useState<undefined | string>();
  const loadBase64 = useCallback(() => {
    linkToBase64(file.publicUrl, file.type).then((link) => setBase64Link(link));
  }, [file.publicUrl, setBase64Link]);
  const hideActions = useCallback(() => {
    setActionsVisible(false);
  }, [setActionsVisible]);
  useOutsideClick(actionsVisible && actionsPopupRef.current, hideActions);
  const {showEditImageTagsView} = useContext(CurrentViewContext)
  return (
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
              onMouseEnter={loadBase64}
              style={{ display: actionsVisible ? "block" : "none" }}
            >
              <div className={styles.moreActionsItem} onClick={() => showEditImageTagsView(file.id)}>Edit tags</div>
              <div className={styles.moreActionsItem}>Edit image</div>
              <CopyToClipboard text={base64Link}>
                <div
                  className={cn(
                    styles.moreActionsItem,
                    !base64Link && styles.loading
                  )}
                >
                  <div className={styles.moreActionsItemText}>Copy Base64</div>
                  <div className={styles.loader} />
                </div>
              </CopyToClipboard>
              <div className={styles.moreActionsItem}>Remove</div>
            </div>

            <MoreIcon />
          </button>
        </div>
      </div>
    </div>
  );
};