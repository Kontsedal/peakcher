import React from "react";
import { Toast, TOAST_TYPES } from "./";

export default { title: "Toast" };

export const success = () => (
  <Toast
    type={TOAST_TYPES.SUCCESS}
    text="Operation was successful"
    onClose={() => {}}
  />
);

export const error = () => (
  <Toast
    type={TOAST_TYPES.ERROR}
    text="Operation was unsuccessful"
    onClose={() => {}}
  />
);
