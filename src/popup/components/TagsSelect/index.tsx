import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { TagsSelectView } from "./view";

type Props = {
  options: string[];
  selectedOptions: string[];
  onSelect: (tag: string) => void;
  onRemove: (tag: string) => void;
  optionTextGetter?: (option: string) => string | React.ReactNode;
  placeholder?: string;
  allowCreate?: boolean;
  onCreate?: (option: string) => void;
  className?: string;
};
export const TagsSelect: React.FC<Props> = ({
  options = [],
  selectedOptions,
  onSelect,
  onRemove,
  optionTextGetter,
  placeholder,
  allowCreate = false,
  onCreate = () => {},
  className,
}) => {
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
    [setCurrentText, setInputIsActive, onSelect]
  );

  const createOption = useCallback(
    (newOption: string) => {
      onCreate(newOption);
      selectOption(newOption);
    },
    [onCreate, selectOption]
  );
  const handleSetCurrentText = useCallback(
    (text) => {
      setCurrentText(text);
      setInputIsActive(true);
    },
    [setCurrentText]
  );
  return (
    <TagsSelectView
      setCurrentText={handleSetCurrentText}
      currentText={currentText}
      options={filteredOptions}
      showAutocomplete={inputIsActive}
      setInputIsActive={setInputIsActive}
      selectOption={selectOption}
      removeOption={onRemove}
      selectedOptions={selectedOptions}
      optionTextGetter={optionTextGetter}
      placeholder={placeholder}
      allowCreate={allowCreate}
      onCreate={createOption}
      className={className}
    />
  );
};

TagsSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  optionTextGetter: PropTypes.func,
  placeholder: PropTypes.string,
  allowCreate: PropTypes.bool,
  onCreate: PropTypes.func,
  className: PropTypes.string,
};

TagsSelect.defaultProps = {
  onRemove: undefined,
  optionTextGetter: (item) => item,
  placeholder: undefined,
  allowCreate: false,
  onCreate: undefined,
  className: undefined,
};
