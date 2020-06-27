import React from "react";
import { Button } from "./index";

export default { title: "Button" };

export const basic = () => <Button>Click me</Button>;
export const primary = () => <Button primary>Click me</Button>;
export const flat = () => <Button flat>Click me</Button>;
export const primaryFlat = () => (
  <Button flat primary>
    Click me
  </Button>
);
