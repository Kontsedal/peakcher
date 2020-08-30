import React, { useState } from "react";
import { SortOptions, SortSelect } from "./index";

export default { title: "Sort select" };

export const Common: React.FC = () => {
  const [value, setValue] = useState(SortOptions.NEW_FIRST);
  return <SortSelect value={value} onChange={setValue} />;
};
