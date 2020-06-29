import React from "react";
import styles from "../../styles.module.scss";
import cn from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Action = ({
  text,
  isLoading,
  onClick,
  textToCopy,
}: {
  text: string;
  textToCopy?: string;
  isLoading?: boolean;
  onClick: () => void;
}) => {
  const element = (
    <div
      onClick={!isLoading && onClick}
      className={cn(styles.moreActionsItem, isLoading && styles.loading)}
    >
      {isLoading && <div className={styles.loader} />}
      {!isLoading && <div className={styles.moreActionsItemText}>{text}</div>}
    </div>
  );
  if (textToCopy) {
    return <CopyToClipboard text={textToCopy}>{element}</CopyToClipboard>;
  }
  return element;
};
