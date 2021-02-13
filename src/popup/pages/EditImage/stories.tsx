import React from "react";
import { EditImagePageView } from "./view";
import { mockImageData } from "../../../../.storybook/mockData";
import { ToolsParamsProvider } from "./test/tools/useToolsParams";

export default { title: "Image editor" };

export const common = () => (
  <div style={{ width: 800, height: 500 }}>
    <ToolsParamsProvider>
      <EditImagePageView image={mockImageData} />
    </ToolsParamsProvider>
  </div>
);
