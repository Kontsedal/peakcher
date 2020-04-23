import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppView } from "./view";
import { RootState, actions } from "../common/store";

export const App = () => {
  const dispatch = useDispatch();
  const counter = useSelector((state: RootState) => state.counter);
  const increment = React.useCallback(() => {
    dispatch(actions.increment(100));
  }, []);
  return <AppView counter={counter} increment={increment} />;
};
