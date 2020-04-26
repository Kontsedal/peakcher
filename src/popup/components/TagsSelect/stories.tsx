import React, { useCallback, useState } from "react";
import { TagsSelect } from "./index";

export default { title: "TagsSelect" };

const Wrapper = ({
  options = [],
  selected = [],
  optionTextGetter,
  allowCreate,
}: {
  options: string[];
  selected: string[];
  allowCreate?: boolean;
  optionTextGetter?: (opt: string) => string;
}) => {
  const [optionsList, setOptionsList] = useState(options);
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

  const onCreate = useCallback(
    (newOption) => {
      setOptionsList([...optionsList, newOption]);
    },
    [optionsList, setOptionsList]
  );
  return (
    <div style={{ maxWidth: 500 }}>
      <TagsSelect
        onSelect={onSelect}
        onRemove={onRemove}
        options={optionsList}
        selectedOptions={selectedOptions}
        optionTextGetter={optionTextGetter}
        placeholder={"Select some tags"}
        allowCreate={allowCreate}
        onCreate={onCreate}
      />
    </div>
  );
};
const predefinedOptions = [
  "one",
  "two",
  "three",
  "four",
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

export const withCreateAbility = () => (
  <Wrapper options={predefinedOptions} selected={[]} allowCreate />
);
