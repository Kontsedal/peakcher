import React from "react";
import styles from "./styles.module.scss";

interface Props {
  counter: number;
  increment: () => void;
}
export const AppView = ({ increment, counter }: Props) => {
  return (
    <div className={styles.root}>
      <p>
        Counter:
        {counter}
      </p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
