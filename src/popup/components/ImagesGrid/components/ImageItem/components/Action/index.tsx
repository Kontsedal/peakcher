import React from "react";
import cn from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styles from "../../styles.module.scss";

export const Action: React.FC<{
  text: string;
  textToCopy?: string;
  isLoading?: boolean;
  onClick: () => void;
  onCopy?: () => void;
}> = ({ text, isLoading, onClick, textToCopy, onCopy }) => {
  const element = (
    <button
      type="button"
      onClick={!isLoading ? onClick : undefined}
      className={cn(styles.moreActionsItem, isLoading && styles.loading)}
    >
      {isLoading && <div className={styles.loader} />}
      {!isLoading && <div className={styles.moreActionsItemText}>{text}</div>}
    </button>
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
