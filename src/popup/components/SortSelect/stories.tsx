import React, { useState } from "react";
import { SortOptions, SortSelect } from "./index";

export default { title: "Sort select" };

export const Common: React.FC = () => {
  const [value, setValue] = useState(SortOptions.NEW_FIRST);
  const onChange = (newValue) => {
    setValue(newValue);
  };
  return <SortSelect value={value} onChange={onChange} />;
};
