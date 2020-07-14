import React, { FunctionComponent } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

export const ToolButton: FunctionComponent<{
  active: boolean;
  onClick: () => void;
}> = ({ active, onClick, children }) => (
  <button
    className={cn(styles.button, active && styles.active)}
    onClick={onClick}
  >
    {children}
  </button>
);
