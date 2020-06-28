import React from "react";
import style from "./styles.module.scss";
import { Button } from "../Button";

type Props = {
  closeSettings: () => void;
  getInputProps: (
    inputName: string,
    valueExtractor?: (event) => boolean | string | number,
    valueAttribute?: string
  ) => void;
};
export const SettingsView = ({ closeSettings, getInputProps }: Props) => (
  <div className={style.root}>
    <Button onClick={closeSettings}>Close</Button>
    <label htmlFor="popupHeight">popupHeight</label>
    <input name="popupHeight" type="number" {...getInputProps("popupHeight")} />
    <label htmlFor="popupWidth">popupWidth</label>
    <input name="popupWidth" type="number" {...getInputProps("popupWidth")} />
    <label htmlFor="searchColumnsCount">searchColumnsCount</label>
    <input
      name="searchColumnsCount"
      type="number"
      {...getInputProps("searchColumnsCount")}
    />
    <label htmlFor="protectFromDataConflicts">protectFromDataConflicts</label>
    <input
      name="protectFromDataConflicts"
      type="checkbox"
      {...getInputProps(
        "protectFromDataConflicts",
        (event) => event.target.checked,
        "checked"
      )}
    />
  </div>
);
