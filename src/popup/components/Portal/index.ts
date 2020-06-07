import ReactDOM from "react-dom";
import React, { FunctionComponent } from "react";

export const Portal: FunctionComponent<{ selector: string }> = ({
  children,
  selector,
}) => {
  return ReactDOM.createPortal(children, document.querySelector(selector));
};
