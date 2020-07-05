import React, { useCallback, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { I18n } from "../../../common/services/I18n";
import { useOutsideClick } from "../../hooks/useOutsideClick";

//TODO: Rewrite to enum
export const SORT_OPTIONS = {
  NEW_FIRST: "NEW_FIRST",
  OLD_FIRST: "OLD_FIRST",
  POPULAR_FIRST: "POPULAR_FIRST",
  UNPOPULAR_FIRST: "UNPOPULAR_FIRST",
  WITHOUT_TAGS: "WITHOUT_TAGS",
};

const OPTIONS_TEXTS = {
  [SORT_OPTIONS.NEW_FIRST]: I18n.t("sortFromNew"),
  [SORT_OPTIONS.OLD_FIRST]: I18n.t("sortFromOld"),
  [SORT_OPTIONS.POPULAR_FIRST]: I18n.t("sortFromPopular"),
  [SORT_OPTIONS.UNPOPULAR_FIRST]: I18n.t("sortFromUnpopular"),
  [SORT_OPTIONS.WITHOUT_TAGS]: I18n.t("withoutTags"),
};

export const SortSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hideDropdown = useCallback(() => {
    setExpanded(false);
  }, [setExpanded]);
  const showDropdown = useCallback(() => {
    setExpanded(true);
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
      <div className={styles.value} onClick={toggleDropdown}>
        {OPTIONS_TEXTS[value]}
        {expanded && (
          <div className={styles.dropdown} ref={dropdownRef}>
            {optionsArr.map(([option, optionText]) =>
              option !== value ? (
                <div
                  className={styles.option}
                  key={option}
                  onClick={() => handleChange(option)}
                >
                  {optionText}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};
