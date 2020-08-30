import React, { useState } from "react";
import { Toggle } from "./index";

export default { title: "Toggle" };

export const Common: React.FC = () => {
  const [value, setValue] = useState(false);
  return (
    <Toggle
      onChange={(event) => setValue(event.target.checked)}
      value={value}
      name="storybook"
    />
  );
};
