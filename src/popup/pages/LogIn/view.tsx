import React from "react";
import styles from "./styles.module.scss";
import Logo from "../../../assets/logo.svg";
import { Button } from "../../components/Button";
import { I18n } from "../../../common/services/I18n";
export const LogInPageView = ({ onLogIn }: { onLogIn: () => void }) => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div
          className={styles.welcome}
          dangerouslySetInnerHTML={{ __html: I18n.t("welcomeText") }}
        />
        <Button primary onClick={onLogIn} className={styles.button}>
          {I18n.t("dropboxLoginText")}
        </Button>
        <div className={styles.bublesContainer}>
          <div className={styles.bubleWrap}>
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
            <div className={styles.buble} />
          </div>
        </div>
      </div>
    </div>
  );
};
