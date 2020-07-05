import React from "react";
import styles from "../../styles.module.scss";
import cn from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Action = ({
  text,
  isLoading,
  onClick,
  textToCopy,
  onCopy,
}: {
  text: string;
  textToCopy?: string;
  isLoading?: boolean;
  onClick: () => void;
  onCopy?: () => void;
}) => {
  const element = (
    <div
      onClick={!isLoading ? onClick : undefined}
      className={cn(styles.moreActionsItem, isLoading && styles.loading)}
    >
      {isLoading && <div className={styles.loader} />}
      {!isLoading && <div className={styles.moreActionsItemText}>{text}</div>}
    </div>
  );
  if (textToCopy) {
    return (
      <CopyToClipboard text={textToCopy} onCopy={onCopy}>
        {element}
      </CopyToClipboard>
    );
  }
  return element;
};
