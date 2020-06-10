import * as React from "react";
import { ChangeEvent, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./styles.module.scss";
import { Button } from "../../components/Button";
import { CurrentViewContext } from "../../context/CurrentView";
import { getSettings } from "common/store/selectors";
import { actions } from "common/store";

const defaultValueAccessor = (event: ChangeEvent<HTMLInputElement>) =>
  Number(event.target.value);

export const SettingsPage = () => {
  const { showMainView } = useContext(CurrentViewContext);
  const dispatch = useDispatch();
  const settings = useSelector(getSettings);
  const getInputProps = (
    settingName,
    valueAccessor: (
      event: ChangeEvent<HTMLInputElement>
    ) => number | string | boolean = defaultValueAccessor,
    valueAttribute = "value"
  ) => ({
    [valueAttribute]: settings[settingName],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        actions.setSettingValue({
          settingName: settingName,
          settingValue: valueAccessor(event),
        })
      );
    },
  });
  return (
    <div className={style.root}>
      <Button onClick={showMainView}>Close</Button>
      <label htmlFor="popupHeight">popupHeight</label>
      <input
        name="popupHeight"
        type="number"
        {...getInputProps("popupHeight")}
      />
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
};
