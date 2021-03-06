import React from "react";
import { RemoteSpaceInfo, Settings } from "common/interfaces";
import { SettingsView } from "./view";

export default { title: "Settings block" };

const Component = ({
  settings,
  remoteSpaceInfo,
}: {
  settings: Settings;
  remoteSpaceInfo: RemoteSpaceInfo;
}) => {
  const getInputProps = (settingName) => ({
    value: settings[settingName],
    onChange: () => {},
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
export const common: React.FC = () => (
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

export const mediumSpaceLeft: React.FC = () => (
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

export const fewSpaceLeft: React.FC = () => (
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
