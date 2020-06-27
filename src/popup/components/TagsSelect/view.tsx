import React, { useCallback, useMemo, useRef } from "react";
import styles from "./styles.module.scss";
import { I18n } from "../../../common/services/I18n";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import cn from "classnames";
import { Button } from "../Button";

type Props = {
  options: string[];
  selectedOptions: string[];
  setCurrentText: (value: string) => void;
  currentText: string;
  placeholder?: string;
  showAutocomplete: boolean;
  setInputIsActive: (active: boolean) => void;
  selectOption: (option: string) => void;
  removeOption: (option: string) => void;
  optionTextGetter?: (option: string) => string | object;
  allowCreate?: boolean;
  onCreate?: (option: string) => void;
  className?: string;
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
  optionTextGetter = (option) => option,
  placeholder,
  allowCreate,
  onCreate,
  className,
}: Props) => {
  const rootRef = useRef();
  const outsideClickHandler = useCallback(() => {
    setInputIsActive(false);
  }, []);
  const canCreateOption = useMemo(() => {
    if (!allowCreate || !currentText) {
      return false;
    }
    return options.every((item) => item !== currentText);
  }, [options, currentText, allowCreate]);
  useOutsideClick(rootRef.current, outsideClickHandler);
  return (
    <div className={cn(styles.root, className)} ref={rootRef}>
      <div className={styles.box}>
        {selectedOptions.map((option) => (
          <div className={styles.selectedOption} key={option} title={option}>
            <div className={styles.selectedOptionText}>{option}</div>,
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
          placeholder={!selectedOptions.length ? placeholder : ""}
        />
      </div>
      {showAutocomplete && (
        <div className={styles.autocompleteBox}>
          {canCreateOption && (
            <button
              className={cn(styles.autocompleteItem, styles.createNewTagButton)}
              onClick={() => onCreate(currentText)}
            >
              <span className={styles.autocompleteItemText}>
                {I18n.t("createTag", [currentText])}
              </span>
            </button>
          )}
          {!options.length && (
            <div className={styles.noOptions}>{I18n.t("noSelectOptions")}</div>
          )}
          {options.map((option) => (
            <button
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
              <div className={styles.autocompleteItemText}>
                {optionTextGetter(option)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
