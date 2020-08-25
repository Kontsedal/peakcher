/* eslint-disable react/no-danger */
import React from "react";
import { I18n } from "common/services/I18n";
import { repeatMap } from "utils/array";
import Logo from "assets/logo.svg";
import PropTypes from "prop-types";
import { Button } from "../../components/Button";
import styles from "./styles.module.scss";

const BUBBLES_COUNT = 43;

export const LogInPageView: React.FC<{
  onLogIn: () => void;
}> = ({ onLogIn }) => {
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
            {repeatMap(BUBBLES_COUNT, (index) => (
              <div key={index} className={styles.buble} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

LogInPageView.propTypes = {
  onLogIn: PropTypes.func,
};
LogInPageView.defaultProps = {
  onLogIn: () => {},
};
