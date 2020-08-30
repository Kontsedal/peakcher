import React, { ChangeEvent, useRef } from "react";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

type Props = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: boolean;
  title?: string;
};
export const Toggle: React.FC<Props> = ({ name, onChange, value, title }) => {
  const idRef = useRef(`${uuid()}_toggle_${name}`);
  return (
    <label htmlFor={idRef.current} className={styles.wrapper} title={title}>
      <input
        type="checkbox"
        name={name}
        id={idRef.current}
        onChange={onChange}
        checked={value}
        className={styles.originalInput}
      />
      <div className={styles.background}>
        <div className={styles.ball} />
      </div>
    </label>
  );
};

Toggle.defaultProps = {
  onChange: () => {},
  name: "",
  value: false,
  title: "",
};
Toggle.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.bool,
  title: PropTypes.string,
};
