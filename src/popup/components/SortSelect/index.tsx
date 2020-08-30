import React, { useCallback, useRef, useState } from "react";
import { I18n } from "common/services/I18n";
import PropTypes from "prop-types";
import { useOutsideClick } from "popup/hooks/useOutsideClick";
import styles from "./styles.module.scss";

export enum SortOptions {
  NEW_FIRST = "NEW_FIRST",
  OLD_FIRST = "OLD_FIRST",
  POPULAR_FIRST = "POPULAR_FIRST",
  UNPOPULAR_FIRST = "UNPOPULAR_FIRST",
  WITHOUT_TAGS = "WITHOUT_TAGS",
}

const OPTIONS_TEXTS = {
  [SortOptions.NEW_FIRST]: I18n.t("sortFromNew"),
  [SortOptions.OLD_FIRST]: I18n.t("sortFromOld"),
  [SortOptions.POPULAR_FIRST]: I18n.t("sortFromPopular"),
  [SortOptions.UNPOPULAR_FIRST]: I18n.t("sortFromUnpopular"),
  [SortOptions.WITHOUT_TAGS]: I18n.t("withoutTags"),
};

export const SortSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  const hideDropdown = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);
  const toggleDropdown = useCallback(() => {
    setExpanded(!expanded);
  }, [setExpanded, expanded]);
  const handleChange = (option: string) => {
    hideDropdown();
    onChange(option);
  };
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef.current, hideDropdown, {
    excludedClasses: [styles.value],
  });

  const optionsArr = Object.entries(OPTIONS_TEXTS);
  return (
    <div className={styles.root}>
      <p className={styles.label}>{I18n.t("sortTitle")}</p>
      <button
        type="button"
        tabIndex={0}
        className={styles.value}
        onClick={toggleDropdown}
      >
        {OPTIONS_TEXTS[value]}
        {expanded && (
          <div className={styles.dropdown} ref={dropdownRef}>
            {optionsArr.map(([option, optionText]) =>
              option !== value ? (
                <button
                  type="button"
                  className={styles.option}
                  key={option}
                  onClick={() => handleChange(option)}
                >
                  {optionText}
                </button>
              ) : null
            )}
          </div>
        )}
      </button>
    </div>
  );
};

SortSelect.propTypes = {
  value: PropTypes.oneOf([
    SortOptions.NEW_FIRST,
    SortOptions.OLD_FIRST,
    SortOptions.POPULAR_FIRST,
    SortOptions.UNPOPULAR_FIRST,
    SortOptions.WITHOUT_TAGS,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
};
