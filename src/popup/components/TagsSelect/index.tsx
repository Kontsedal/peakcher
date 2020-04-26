import React, { useCallback, useMemo, useState } from "react";
import { TagsSelectView } from "./view";

type Props = {
  options: string[];
  selectedOptions: string[];
  onSelect: (tag: string) => void;
  onRemove: (tag: string) => void;
  optionTextGetter?: (option: string) => string;
  placeholder?: string;
};
export const TagsSelect = ({
  options = [],
  selectedOptions,
  onSelect,
  onRemove,
  optionTextGetter,
  placeholder,
}: Props) => {
  const [currentText, setCurrentText] = useState("");
  const [inputIsActive, setInputIsActive] = useState(false);
  const filteredOptions: string[] = useMemo(() => {
    return options.filter(
      (option) =>
        option.toLowerCase().includes(currentText) &&
        !selectedOptions.includes(option)
    );
  }, [options, selectedOptions, currentText]);
  const selectOption = useCallback(
    (option: string) => {
      onSelect(option);
      setCurrentText("");
      setInputIsActive(false);
    },
    [selectedOptions]
  );
  return (
    <TagsSelectView
      setCurrentText={setCurrentText}
      currentText={currentText}
      options={filteredOptions}
      showAutocomplete={inputIsActive}
      setInputIsActive={setInputIsActive}
      selectOption={selectOption}
      removeOption={onRemove}
      selectedOptions={selectedOptions}
      optionTextGetter={optionTextGetter}
      placeholder={placeholder}
    />
  );
};
