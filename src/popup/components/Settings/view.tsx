import React, { ChangeEvent } from "react";
import { MdChevronLeft } from "react-icons/all";
import style from "./styles.module.scss";
import { Button } from "../Button";
import { I18n } from "../../../common/services/I18n";
import { Toggle } from "../Toggle";
import { RemoteSpaceInfo } from "../../../common/interfaces";
import { UsedSpace } from "./components/UsedSpace";

type Props = {
  closeSettings: () => void;
  onLogOut: () => void;
  remoteSpaceInfo: RemoteSpaceInfo;
  getInputProps: (
    inputName: string,
    valueExtractor?: (event) => boolean | string | number
  ) => {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: any;
  };
};
export const SettingsView = ({
  closeSettings,
  getInputProps,
  remoteSpaceInfo,
  onLogOut,
}: Props) => (
  <div className={style.root}>
    <div className={style.header}>
      <Button flat onClick={closeSettings}>
        <MdChevronLeft size={30} />
      </Button>
      <h2>{I18n.t("settingsWindowTitle")}</h2>
    </div>
    <div className={style.content}>
      <UsedSpace total={remoteSpaceInfo.total} used={remoteSpaceInfo.used} />
      <div className={style.field}>
        <label htmlFor="popupHeight">{I18n.t("windowHeightInputLabel")}</label>
        <input
          name="popupHeight"
          type="number"
          {...getInputProps("popupHeight")}
        />
      </div>
      <div className={style.field}>
        <label htmlFor="popupWidth">{I18n.t("windowWidthInputLabel")}</label>
        <input
          name="popupWidth"
          type="number"
          {...getInputProps("popupWidth")}
        />
      </div>
      <div className={style.field}>
        <label htmlFor="searchColumnsCount">
          {I18n.t("imagesInRowInputLabel")}
        </label>
        <input
          name="searchColumnsCount"
          type="number"
          {...getInputProps("searchColumnsCount")}
        />
      </div>
      <div className={style.field}>
        <label htmlFor="protectFromDataConflicts">
          {I18n.t("dataLossProtectLabel")}
        </label>
        <Toggle
          title={I18n.t("dataLossProtectDetails")}
          name="protectFromDataConflicts"
          {...getInputProps(
            "protectFromDataConflicts",
            (event) => event.target.checked
          )}
        />
      </div>
      <div className={style.logOut}>
        <Button primary onClick={onLogOut}>
          {I18n.t("logOutButtonText")}
        </Button>
      </div>
    </div>
  </div>
);
