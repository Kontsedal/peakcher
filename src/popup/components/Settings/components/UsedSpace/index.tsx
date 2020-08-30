import * as React from "react";
import { I18n } from "common/services/I18n";
import PropTypes from "prop-types";
import * as classes from "./styles.scss";

interface Props {
  total: number;
  used: number;
}
const bytesToMegabytes = (bites: number): number => bites / 1024 / 1024;
const getBarColor = (percentUsed: number): string => {
  if (percentUsed <= 50) {
    return "rgb(202, 241, 205)";
  }
  if (percentUsed > 50 && percentUsed < 80) {
    return "rgb(241,235,202)";
  }
  return "rgb(241,202,202)";
};
export const UsedSpace: React.FC<Props> = ({ total, used }) => {
  const totalMb = bytesToMegabytes(total).toFixed(0);
  const usedMb = bytesToMegabytes(used).toFixed(0);
  const percent = (used * 100) / total;
  return (
    <div className={classes.root}>
      <div
        className={classes.bar}
        style={{
          backgroundColor: getBarColor(percent),
          width: `${percent}%`,
        }}
      />
      <span className={classes.text}>
        {I18n.t("usedSpaceBarText", [usedMb, totalMb])}
      </span>
    </div>
  );
};

UsedSpace.propTypes = {
  total: PropTypes.number.isRequired,
  used: PropTypes.number.isRequired,
};
