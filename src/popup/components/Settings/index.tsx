import * as React from "react";
import { ChangeEvent, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRemoteSpaceInfo, getSettings } from "common/store/selectors";
import { actions } from "common/store";
import { CurrentViewContext } from "../../context/currentView";
import { SettingsView } from "./view";
import { CommunicationService } from "../../../common/services/Communication";

const defaultValueAccessor = (event: ChangeEvent<HTMLInputElement>) =>
  Number(event.target.value);

export const Settings: React.FC = () => {
  const { settingsIsShown, showSettings } = useContext(CurrentViewContext);
  const dispatch = useDispatch();
  const settings = useSelector(getSettings);
  const remoteSpaceInfo = useSelector(getRemoteSpaceInfo);

  const getInputProps = (
    settingName,
    valueAccessor: (
      event: ChangeEvent<HTMLInputElement>
    ) => number | string | boolean = defaultValueAccessor
  ) => ({
    value: settings[settingName],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        actions.setSettingValue({
          settingName,
          settingValue: valueAccessor(event),
        })
      );
    },
  });
  const onLogOut = useCallback(() => {
    CommunicationService.logOut();
    showSettings(false);
  }, [showSettings]);
  if (!settingsIsShown) {
    return null;
  }
  return (
    <SettingsView
      remoteSpaceInfo={remoteSpaceInfo}
      onLogOut={onLogOut}
      getInputProps={getInputProps}
      closeSettings={() => {
        showSettings(false);
      }}
    />
  );
};
