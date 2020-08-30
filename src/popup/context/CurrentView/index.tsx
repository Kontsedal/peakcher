import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Logger } from "../../../common/services/Logger";

export const VIEWS = {
  MAIN: "main",
  LOGIN: "login",
  EDIT_TAG: "edit_tag",
};
export const CurrentViewContext = React.createContext({
  currentView: VIEWS.LOGIN,
  editImageId: null,
  settingsIsShown: false,
  showSettings: (show: boolean) => Logger.log(show),
  showMainView: () => {},
  showLoginView: () => {},
  showEditImageTagsView: (imageId: string) => Logger.log(imageId),
});

export const CurrentViewProvider: React.FC = ({ children }) => {
  const [currentView, setCurrentView] = useState(VIEWS.MAIN);
  const [editImageId, setEditImageId] = useState(null);
  const [settingsIsShown, setSettingsIsShown] = useState(false);

  const showMainView = useCallback(() => {
    setCurrentView(VIEWS.MAIN);
  }, [setCurrentView]);
  const showLoginView = useCallback(() => {
    setCurrentView(VIEWS.LOGIN);
  }, [setCurrentView]);
  const showSettings = useCallback(
    (show: boolean) => {
      setSettingsIsShown(show);
    },
    [setSettingsIsShown]
  );
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
        showLoginView,
        showSettings,
        settingsIsShown,
      }}
    >
      {children}
    </CurrentViewContext.Provider>
  );
};

CurrentViewProvider.defaultProps = {
  children: null,
};

CurrentViewProvider.propTypes = {
  children: PropTypes.element,
};
