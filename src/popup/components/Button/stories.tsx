import React from "react";
import { Button } from "./index";

export default { title: "Button" };

export const basic: React.FC = () => <Button>Click me</Button>;
export const primary: React.FC = () => <Button primary>Click me</Button>;
export const flat: React.FC = () => <Button flat>Click me</Button>;
export const primaryFlat: React.FC = () => (
  <Button flat primary>
    Click me
  </Button>
);
