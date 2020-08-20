import React from "react";
import { ImageItemView } from "./view";
import { mockImageData } from "../../../../../../.storybook/mockData";

export default { title: "ImageItem" };

const Component = ({
  base64IsLoading,
  actionsVisible,
  base64Link,
  ...rest
}) => {
  const width = 300;
  const height = (mockImageData.height / mockImageData.width) * width;
  return (
    <div style={{ width, height }}>
      <ImageItemView
        isRemoving={false}
        file={mockImageData}
        showEditImageTagsView={() => {}}
        setActionsVisible={() => {}}
        loadBase64={() => {}}
        deleteFile={() => {}}
        base64Link=""
        actionsVisible={false}
        loading={false}
        base64IsLoading={false}
        onImageLoadError={() => {}}
        onImageLoad={() => {}}
        onReload={() => {}}
        forceDelete={() => {}}
        hasLoadingError={false}
        {...rest}
      />
    </div>
  );
};
export const basic = () => (
  <Component base64Link="" actionsVisible={false} base64IsLoading={false} />
);
export const visibleActions = () => (
  <Component base64Link="" actionsVisible base64IsLoading={false} />
);
export const base64IsLoading = () => (
  <Component base64Link="" actionsVisible base64IsLoading />
);
export const base64Loaded = () => (
  <Component base64Link="some link" actionsVisible base64IsLoading={false} />
);

// @ts-ignore
export const loadingError = () => <Component hasLoadingError />;
