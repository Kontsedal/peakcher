import React, { ChangeEvent } from "react";
import { MdChevronLeft } from "react-icons/all";
import PropTypes from "prop-types";
import { I18n } from "common/services/I18n";
import { RemoteSpaceInfo } from "common/interfaces";
import style from "./styles.module.scss";
import { Button } from "../Button";
import { Toggle } from "../Toggle";
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
    value: number | boolean;
  };
};
export const SettingsView: React.FC<Props> = ({
  closeSettings,
  getInputProps,
  remoteSpaceInfo,
  onLogOut,
}) => (
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
          onChange={getInputProps("popupHeight").onChange}
          value={getInputProps("popupHeight").value as number}
        />
      </div>
      <div className={style.field}>
        <label htmlFor="popupWidth">{I18n.t("windowWidthInputLabel")}</label>
        <input
          name="popupWidth"
          type="number"
          onChange={getInputProps("popupWidth").onChange}
          value={getInputProps("popupWidth").value as number}
        />
      </div>
      <div className={style.field}>
        <label htmlFor="searchColumnsCount">
          {I18n.t("imagesInRowInputLabel")}
        </label>
        <input
          name="searchColumnsCount"
          type="number"
          onChange={getInputProps("searchColumnsCount").onChange}
          value={getInputProps("searchColumnsCount").value as number}
        />
      </div>
      <div className={style.field}>
        <label htmlFor="protectFromDataConflicts">
          {I18n.t("dataLossProtectLabel")}
        </label>
        <Toggle
          title={I18n.t("dataLossProtectDetails")}
          name="protectFromDataConflicts"
          onChange={
            getInputProps(
              "protectFromDataConflicts",
              (event) => event.target.checked
            ).onChange
          }
          value={
            getInputProps(
              "protectFromDataConflicts",
              (event) => event.target.checked
            ).value as boolean
          }
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

SettingsView.propTypes = {
  closeSettings: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  remoteSpaceInfo: PropTypes.shape({
    total: PropTypes.number,
    used: PropTypes.number,
  }).isRequired,
  onLogOut: PropTypes.func.isRequired,
};
