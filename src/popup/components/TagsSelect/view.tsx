import React, { useCallback, useMemo, useRef } from "react";
import cn from "classnames";
import { I18n } from "common/services/I18n";
import { useOutsideClick } from "popup/hooks/useOutsideClick";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

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
  optionTextGetter?: (option: string) => string | Record<string, unknown>;
  allowCreate?: boolean;
  onCreate?: (option: string) => void;
  className?: string;
};
export const TagsSelectView: React.FC<Props> = ({
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
}) => {
  const rootRef = useRef();
  const outsideClickHandler = useCallback(() => {
    setInputIsActive(false);
  }, [setInputIsActive]);
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
          {!options.length && (
            <div className={styles.noOptions}>{I18n.t("noSelectOptions")}</div>
          )}
          <div className={styles.options}>
            {options.map((option) => (
              <button
                tabIndex={0}
                type="button"
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
          {canCreateOption && (
            <button
              type="button"
              className={cn(styles.autocompleteItem, styles.createNewTagButton)}
              onClick={() => onCreate(currentText)}
            >
              <span className={styles.autocompleteItemText}>
                {I18n.t("createTag", [currentText])}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

TagsSelectView.defaultProps = {
  placeholder: undefined,
  optionTextGetter: (item) => item,
  allowCreate: false,
  onCreate: () => {},
  className: undefined,
};

TagsSelectView.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCurrentText: PropTypes.func.isRequired,
  currentText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  showAutocomplete: PropTypes.bool.isRequired,
  setInputIsActive: PropTypes.func.isRequired,
  selectOption: PropTypes.func.isRequired,
  removeOption: PropTypes.func.isRequired,
  optionTextGetter: PropTypes.func,
  allowCreate: PropTypes.bool,
  onCreate: PropTypes.func,
  className: PropTypes.string,
};
