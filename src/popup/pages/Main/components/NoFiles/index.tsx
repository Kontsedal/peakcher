import React from "react";
import { I18n } from "common/services/I18n";
import styles from "./styles.module.scss";
import PictureIcon from "./assets/picture.svg";

export const NoFiles: React.FC = () => (
  <div className={styles.noFiles}>
    <PictureIcon className={styles.icon} />
    <h2>{I18n.t("noImagesTitle")}</h2>
    <p>{I18n.t("noImagesDescription")}</p>
  </div>
);
