import React, { ChangeEvent } from "react";
import { SettingsView } from "./view";
import { Settings } from "common/interfaces";

export default { title: "Settings block" };
const defaultValueAccessor = (event: ChangeEvent<HTMLInputElement>) =>
  Number(event.target.value);

const Component = ({ settings }: { settings: Settings }) => {
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
      <SettingsView closeSettings={() => {}} getInputProps={getInputProps} />
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
  />
);
