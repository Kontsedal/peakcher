import React from "react";
import { EditImagePageView } from "./view";
import { mockImageData } from "../../../../.storybook/mockData";

export default { title: "Image editor" };

export const common = () => (
  <div style={{ width: 800, height: 500 }}>
    <EditImagePageView image={mockImageData} />
  </div>
);
