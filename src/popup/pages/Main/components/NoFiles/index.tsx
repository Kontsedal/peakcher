import React from "react";
import styles from "./styles.module.scss";
import PictureIcon from "./assets/picture.svg";
import { I18n } from "../../../../../common/services/I18n";

export const NoFiles = () => (
  <div className={styles.noFiles}>
    <PictureIcon className={styles.icon} />
    <h2>{I18n.t("noImagesTitle")}</h2>
    <p>{I18n.t("noImagesDescription")}</p>
  </div>
);
