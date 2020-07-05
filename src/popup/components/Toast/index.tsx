import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import { MdClear, MdDone, MdWarning } from "react-icons/all";

const ICON_COLOR = "rgba(255,255,255, 0.7)";
export enum TOAST_TYPES {
  SUCCESS,
  ERROR,
}

const ICON_MAP = {
  [TOAST_TYPES.SUCCESS]: <MdDone color={ICON_COLOR} />,
  [TOAST_TYPES.ERROR]: <MdWarning color={ICON_COLOR} />,
};

const CLASS_MAP = {
  [TOAST_TYPES.SUCCESS]: styles.success,
  [TOAST_TYPES.ERROR]: styles.error,
};
export const Toast = ({ text, type, onClose }) => {
  return (
    <div className={cn(styles.toast, CLASS_MAP[type])}>
      <div className={styles.icon}>{ICON_MAP[type]}</div>
      <span className={styles.text}>{text}</span>
      <button onClick={onClose} className={styles.close}>
        <MdClear color={ICON_COLOR} />
      </button>
    </div>
  );
};
