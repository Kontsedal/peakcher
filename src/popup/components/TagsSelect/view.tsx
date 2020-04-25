import React, { useEffect } from "react";
import styles from "./styles.module.scss";
import onClickOutside from "react-onclickoutside";

type Props = {
  options: string[];
  selectedOptions: string[];
  setCurrentText: (value: string) => void;
  currentText: string;
  showAutocomplete: boolean;
  setInputIsActive: (active: boolean) => void;
  selectOption: (option: string) => void;
};
export const View = ({
  setCurrentText,
  currentText,
  setInputIsActive,
  showAutocomplete,
  options,
  selectOption,
  selectedOptions,
}: Props) => {
  useEffect(() => {
    // hehe, suck it
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    View.handleClickOutside = () => setInputIsActive(false);
  });
  return (
    <div className={styles.root}>
      <div className={styles.box}>
        {selectedOptions.map((option) => (
          <div className={styles.selectedOption} key={option} title={option}>
            {option}
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

export const TagsSelectView = onClickOutside(
  View,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  () => View.handleClickOutside
);
