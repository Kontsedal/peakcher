import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

export const UploadIndicatorView: React.FC<{
  progress: number;
}> = ({ progress }) => (
  <div className={styles.root}>
    <div style={{ width: `${progress}%` }} className={styles.bar} />
  </div>
);

UploadIndicatorView.defaultProps = {
  progress: 0,
};

UploadIndicatorView.propTypes = {
  progress: PropTypes.number,
};
