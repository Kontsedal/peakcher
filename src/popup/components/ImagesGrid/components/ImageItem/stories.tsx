/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { ImageItemView } from "./view";
import { mockImageData } from "../../../../../../.storybook/mockData";

export default { title: "ImageItem" };

const Component: React.FC<{
  base64IsLoading: boolean;
  actionsVisible: boolean;
  hasLoadingError?: boolean;
  base64Link: string;
  // eslint-disable-next-line react/prop-types
}> = ({ base64IsLoading, actionsVisible, base64Link, ...rest }) => {
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
        showEditImageView={() => {}}
        onImageLoad={() => {}}
        onReload={() => {}}
        forceDelete={() => {}}
        hasLoadingError={false}
        {...rest}
      />
    </div>
  );
};
export const basic: React.FC = () => (
  <Component base64Link="" actionsVisible={false} base64IsLoading={false} />
);
export const visibleActions: React.FC = () => (
  <Component base64Link="" actionsVisible base64IsLoading={false} />
);
export const base64IsLoading: React.FC = () => (
  <Component base64Link="" actionsVisible base64IsLoading />
);
export const base64Loaded: React.FC = () => (
  <Component base64Link="some link" actionsVisible base64IsLoading={false} />
);

export const loadingError: React.FC = () => (
  <Component hasLoadingError actionsVisible base64IsLoading base64Link="" />
);
