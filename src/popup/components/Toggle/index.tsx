import React, { ChangeEvent, useRef } from "react";
import { v4 as uuid } from "uuid";
import styles from "./styles.module.scss";

type Props = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: boolean;
  [key: string]: any;
};
export const Toggle = ({ name, onChange, value, ...props }: Props) => {
  const idRef = useRef(uuid() + "_toggle_" + name);
  return (
    <label htmlFor={idRef.current} className={styles.wrapper} {...props}>
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
