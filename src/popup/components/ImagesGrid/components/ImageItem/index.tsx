import React from "react";
import cn from 'classnames'
import { File } from "common/interfaces";
import styles from "./styles.module.scss";
import LinkIcon from "./assets/link.svg";
import MoreIcon from "./assets/actions.svg";

type Props = {
  file: File;
};

export const ImageItem = ({ file }: Props) => {
  return (
    <div className={styles.imageItem}>
      <img src={file.publicUrl} />
      <div className={styles.hoverContainer}>
        <div className={styles.hoverActions}>
          <button className={cn(styles.actionButton, styles.linkButton)}>
            <LinkIcon className={styles.linkButtonIcon} />
            Link
          </button>
          <button className={cn(styles.actionButton, styles.moreActionsButton)}>
            <MoreIcon/>
          </button>
        </div>
      </div>
    </div>
  );
};
