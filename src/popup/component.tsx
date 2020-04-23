import React from "react";
import styles from "./styles.module.scss";
import { EventsService } from "../common/services/Events";

export const App = () => {
  React.useEffect(() => {
    return EventsService.on<{ time: number }>("time", (data) => {
      console.log("got event", data.time);
    });
  });
  return <div className={styles.root}>Hello from popup</div>;
};
