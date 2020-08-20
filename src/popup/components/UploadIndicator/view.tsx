import React from "react";
import styles from "./styles.module.scss";

export const UploadIndicatorView = ({ progress }: { progress: number }) => (
  <div className={styles.root}>
    <div style={{ width: `${progress}%` }} className={styles.bar} />
  </div>
);
