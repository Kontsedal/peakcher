import "../src/popup/styles.module.scss";
import { addDecorator } from "@storybook/react";
import React from "react";

addDecorator((storyFn) => (
  <div style={{ minHeight: 300, padding: 10 }}>{storyFn()}</div>
));
