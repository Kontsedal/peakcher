import * as React from "react";
import { ChangeEvent, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CurrentViewContext } from "../../context/CurrentView";
import { getSettings } from "common/store/selectors";
import { actions } from "common/store";
import { SettingsView } from "./view";

const defaultValueAccessor = (event: ChangeEvent<HTMLInputElement>) =>
  Number(event.target.value);

export const Settings = () => {
  const { settingsIsShown, showSettings } = useContext(CurrentViewContext);
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
  if (!settingsIsShown) {
    return null;
  }
  return (
    <SettingsView
      getInputProps={getInputProps}
      closeSettings={() => {
        showSettings(false);
      }}
    />
  );
};
