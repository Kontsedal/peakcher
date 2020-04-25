import React, { useCallback, useMemo, useState } from "react";
import { TagsSelectView } from "./view";

type Props = {
  options: string[];
};
export const TagsSelect = ({ options = [] }: Props) => {
  const [currentText, setCurrentText] = useState("");
  const [inputIsActive, setInputIsActive] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const filteredOptions: string[] = useMemo(() => {
    return options.filter(
      (option) =>
        option.toLowerCase().includes(currentText) &&
        !selectedOptions.includes(option)
    );
  }, [options, selectedOptions, currentText]);
  const selectOption = useCallback(
    (option: string) => {
      setSelectedOptions(selectedOptions.concat([option]));
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
      selectedOptions={selectedOptions}
    />
  );
};
