import React from "react";
import cn from "classnames";
import { MdClear, MdDone, MdWarning } from "react-icons/all";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const ICON_COLOR = "rgba(255,255,255, 0.7)";
export enum ToastTypes {
  SUCCESS,
  ERROR,
}

const ICON_MAP = {
  [ToastTypes.SUCCESS]: <MdDone color={ICON_COLOR} />,
  [ToastTypes.ERROR]: <MdWarning color={ICON_COLOR} />,
};

const CLASS_MAP = {
  [ToastTypes.SUCCESS]: styles.success,
  [ToastTypes.ERROR]: styles.error,
};
export const Toast: React.FC<{
  text: string;
  type: ToastTypes;
  onClose: () => void;
}> = ({ text, type, onClose }) => {
  return (
    <div className={cn(styles.toast, CLASS_MAP[type])}>
      <div className={styles.icon}>{ICON_MAP[type]}</div>
      <span className={styles.text}>{text}</span>
      <button type="button" onClick={onClose} className={styles.close}>
        <MdClear color={ICON_COLOR} />
      </button>
    </div>
  );
};

Toast.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf([ToastTypes.ERROR, ToastTypes.SUCCESS]),
  onClose: PropTypes.func,
};

Toast.defaultProps = {
  text: "",
  type: ToastTypes.SUCCESS,
  onClose: () => {},
};
