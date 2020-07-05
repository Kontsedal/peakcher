import React, { useState } from "react";
import { SORT_OPTIONS, SortSelect } from "./index";

export default { title: "Sort select" };

export const common = () => {
  const [value, setValue] = useState(SORT_OPTIONS.NEW_FIRST);
  return <SortSelect value={value} onChange={setValue} />;
};
