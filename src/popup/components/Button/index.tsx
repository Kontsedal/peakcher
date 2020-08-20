import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

type Props = {
  children?: React.ReactNode;
  className?: string;
  primary?: boolean;
  flat?: boolean;
  onClick?: () => void;
};
export const Button: React.FC<Props> = ({
  children,
  className,
  primary,
  flat,
  onClick,
}) => (
  <button
    type="button"
    className={cn(
      styles.button,
      primary && styles.primary,
      flat && styles.flat,
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.defaultProps = {
  children: null,
  className: null,
  primary: false,
  flat: false,
  onClick: null,
};

Button.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  primary: PropTypes.bool,
  flat: PropTypes.bool,
  onClick: PropTypes.func,
};
