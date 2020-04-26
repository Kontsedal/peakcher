import React, { useCallback, useRef } from "react";
import styles from "./styles.module.scss";
import { I18n } from "../../../common/services/I18n";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
  options: string[];
  selectedOptions: string[];
  setCurrentText: (value: string) => void;
  currentText: string;
  showAutocomplete: boolean;
  setInputIsActive: (active: boolean) => void;
  selectOption: (option: string) => void;
  removeOption: (option: string) => void;
};
export const TagsSelectView = ({
  setCurrentText,
  currentText,
  setInputIsActive,
  showAutocomplete,
  options,
  selectOption,
  selectedOptions,
  removeOption,
}: Props) => {
  const rootRef = useRef();
  const outsideClickHandler = useCallback(() => {
    setInputIsActive(false);
  }, []);
  useOutsideClick(rootRef, outsideClickHandler);
  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.box}>
        {selectedOptions.map((option, index) => (
          <div className={styles.selectedOption} key={option} title={option}>
            <div className={styles.selectedOptionText}>{option}</div>
            {index < selectedOptions.length - 1 && ","}
            <div className={styles.hoveredSelectedOption}>
              <div className={styles.hoveredSelectedOptionText}>{option}</div>
              <button
                type="button"
                aria-label="Remove"
                className={styles.hoveredSelectedOptionAction}
                onClick={() => removeOption(option)}
              />
            </div>
          </div>
        ))}
        <input
          type="text"
          className={styles.input}
          value={currentText}
          onFocus={() => setInputIsActive(true)}
          onChange={(e) => setCurrentText(e.target.value)}
        />
      </div>
      {showAutocomplete && (
        <div className={styles.autocompleteBox}>
          {!options.length && (
            <div className={styles.noOptions}>{I18n.t("noSelectOptions")}</div>
          )}
          {options.map((option) => (
            <div
              onKeyDown={() => {}}
              tabIndex={0}
              role="option"
              aria-selected="false"
              key={option}
              className={styles.autocompleteItem}
              title={option}
              onClick={() => {
                selectOption(option);
              }}
            >
              <div className={styles.autocompleteItemText}>{option}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
