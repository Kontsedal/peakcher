import React, { useCallback, useState } from "react";

export const VIEWS = {
  MAIN: "main",
  LOGIN: "login",
  EDIT_TAG: "edit_tag",
};
export const CurrentViewContext = React.createContext({
  currentView: VIEWS.LOGIN,
  editImageId: null,
  showMainView: () => {},
  showLoginView: () => {},
  showEditImageTagsView: (imageId: string) => {},
});

export const CurrentViewProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState(VIEWS.MAIN);
  const [editImageId, setEditImageId] = useState(null);

  const showMainView = useCallback(() => {
    setCurrentView(VIEWS.MAIN);
  }, [setCurrentView]);
  const showLoginView = useCallback(() => {
    setCurrentView(VIEWS.LOGIN);
  }, [setCurrentView]);
  const showEditImageTagsView = useCallback(
    (imageId) => {
      setEditImageId(imageId);
      setCurrentView(VIEWS.EDIT_TAG);
    },
    [setCurrentView]
  );
  return (
    <CurrentViewContext.Provider
      value={{
        editImageId,
        showMainView,
        currentView,
        showEditImageTagsView,
        showLoginView
      }}
    >
      {children}
    </CurrentViewContext.Provider>
  );
};