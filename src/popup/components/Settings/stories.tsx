import React, { ChangeEvent } from "react";
import { SettingsView } from "./view";
import { RemoteSpaceInfo, Settings } from "common/interfaces";

export default { title: "Settings block" };
const defaultValueAccessor = (event: ChangeEvent<HTMLInputElement>) =>
  Number(event.target.value);

const Component = ({
  settings,
  remoteSpaceInfo,
}: {
  settings: Settings;
  remoteSpaceInfo: RemoteSpaceInfo;
}) => {
  const getInputProps = (
    settingName,
    valueAccessor: (
      event: ChangeEvent<HTMLInputElement>
    ) => number | string | boolean = defaultValueAccessor
  ) => ({
    value: settings[settingName],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {},
  });
  return (
    <div
      style={{
        width: 400,
        height: 600,
        background: "#d5d5d5",
        position: "relative",
        display: "inline-block",
      }}
    >
      <SettingsView
        onLogOut={() => {}}
        closeSettings={() => {}}
        remoteSpaceInfo={remoteSpaceInfo}
        getInputProps={getInputProps}
      />
    </div>
  );
};
export const common = () => (
  <Component
    settings={{
      popupHeight: 500,
      popupWidth: 1000,
      protectFromDataConflicts: false,
      searchColumnsCount: 4,
    }}
    remoteSpaceInfo={{
      used: 123 * 1024 * 1024,
      total: 500 * 1024 * 1024,
    }}
  />
);

export const mediumSpaceLeft = () => (
  <Component
    settings={{
      popupHeight: 500,
      popupWidth: 1000,
      protectFromDataConflicts: false,
      searchColumnsCount: 4,
    }}
    remoteSpaceInfo={{
      used: 350 * 1024 * 1024,
      total: 500 * 1024 * 1024,
    }}
  />
);

export const fewSpaceLeft = () => (
  <Component
    settings={{
      popupHeight: 500,
      popupWidth: 1000,
      protectFromDataConflicts: false,
      searchColumnsCount: 4,
    }}
    remoteSpaceInfo={{
      used: 480 * 1024 * 1024,
      total: 500 * 1024 * 1024,
    }}
  />
);
