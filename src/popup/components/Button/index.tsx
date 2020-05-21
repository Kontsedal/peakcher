import React from "react";
import styles from "./styles.module.scss";
import cn from "classnames";

type Props = {
  children?: any;
  className?: string;
  primary?: boolean;
  onClick?: () => void;
  [key: string]: any;
};
export const Button = ({
  children,
  className,
  primary,
  onClick,
  ...rest
}: Props) => (
  <button
    className={cn(styles.button, primary && styles.primary, className)}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);
