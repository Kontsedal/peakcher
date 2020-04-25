import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppView } from "./view";
import { RootState, actions } from "../common/store";

export const App = () => {
  const dispatch = useDispatch();
  const state = useSelector((currentState: RootState) => currentState);
  const increaseWidth = React.useCallback(() => {
    dispatch(
      actions.setSettings({
        ...state.settings,
        popupWidth: state.settings.popupWidth + 10,
      })
    );
  }, [state.settings.popupWidth]);
  return <AppView state={state} increaseWidth={increaseWidth} />;
};
