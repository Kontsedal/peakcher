import React, { useCallback, useState } from "react";
import { TagsSelect } from "./index";

export default { title: "TagsSelect" };

const Wrapper = ({
  options = [],
  selected = [],
  optionTextGetter,
}: {
  options: string[];
  selected: string[];
  optionTextGetter?: (opt: string) => string;
}) => {
  const [selectedOptions, setSelectedOptions] = useState(selected);
  const onSelect = useCallback(
    (option) => {
      setSelectedOptions([...selectedOptions, option]);
    },
    [selectedOptions]
  );
  const onRemove = useCallback(
    (option) => {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    },
    [selectedOptions]
  );
  return (
    <div style={{ maxWidth: 500 }}>
      <TagsSelect
        onSelect={onSelect}
        onRemove={onRemove}
        options={options}
        selectedOptions={selectedOptions}
        optionTextGetter={optionTextGetter}
      />
    </div>
  );
};
const predefinedOptions = [
  "one",
  "two",
  "three",
  "fore",
  "five",
  "six",
  "seven",
  "shit",
  "dog",
  "ololo",
  "karammmmmmmmmmmmmmmmmmmmbaaaaaaaaaz",
  "ukuleleleleleleleleel---//fwf",
  "morre",
  "ahahahahahah",
  "apple",
  "dozg",
  "fox",
  "jooojooo",
  "wakawaka",
];
export const basic = () => (
  <Wrapper options={predefinedOptions} selected={[]} />
);

export const customOptionsText = () => (
  <Wrapper
    options={predefinedOptions}
    selected={[]}
    optionTextGetter={(option) =>
      `[${Math.floor(Math.random() * 100)}] ${option}`
    }
  />
);
