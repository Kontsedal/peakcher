import React from "react";
import { useSelector } from "react-redux";
import { AppView } from "./view";
import { RootState } from "../common/store";

export const App = () => {
  const state = useSelector((currentState: RootState) => currentState);
  return <AppView state={state} />;
};
