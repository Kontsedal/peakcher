import React, { useCallback, useState } from "react";
import { TagsSelect } from "./index";

export default { title: "TagsSelect" };

const Wrapper = ({
  options = [],
  selected = [],
}: {
  options: string[];
  selected: string[];
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
      />
    </div>
  );
};

export const basic = () => (
  <Wrapper
    options={[
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
    ]}
    selected={[]}
  />
);
