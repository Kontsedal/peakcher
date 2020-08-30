import React from "react";
import { Toast, ToastTypes } from ".";

export default { title: "Toast" };

export const success: React.FC = () => (
  <Toast
    type={ToastTypes.SUCCESS}
    text="Operation was successful"
    onClose={() => {}}
  />
);

export const error: React.FC = () => (
  <Toast
    type={ToastTypes.ERROR}
    text="Operation was unsuccessful"
    onClose={() => {}}
  />
);
