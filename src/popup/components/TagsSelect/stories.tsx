import React, { useCallback, useState } from "react";
import { TagsSelect } from "./index";

export default { title: "TagsSelect" };

const Wrapper: React.FC<{
  options: string[];
  selected: string[];
  allowCreate?: boolean;
  optionTextGetter?: (opt: string) => string;
  // eslint-disable-next-line react/prop-types
}> = ({ options = [], selected = [], optionTextGetter, allowCreate }) => {
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
        placeholder="Select some tags"
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
  "ololo1",
  "ololo2",
  "ololo3",
  "ololo4",
  "ololo5",
  "ololo6",
  "ololo7",
  "ololo8",
  "ololo9",
  "ololo00",
  "ololo87",
  "ololo456",
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
export const basic: React.FC = () => (
  <Wrapper options={predefinedOptions} selected={[]} />
);

export const customOptionsText: React.FC = () => (
  <Wrapper
    options={predefinedOptions}
    selected={[]}
    optionTextGetter={(option) =>
      `[${Math.floor(Math.random() * 100)}] ${option}`
    }
  />
);

export const withCreateAbility: React.FC = () => (
  <Wrapper options={predefinedOptions} selected={[]} allowCreate />
);
