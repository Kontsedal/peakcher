import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

type Props = {
  children?: any;
  className?: string;
  primary?: boolean;
  flat?: boolean;
  onClick?: () => void;
  [key: string]: any;
};
export const Button = ({
  children,
  className,
  primary,
  flat,
  onClick,
  ...rest
}: Props) => (
  <button
    className={cn(
      styles.button,
      primary && styles.primary,
      flat && styles.flat,
      className
    )}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);
