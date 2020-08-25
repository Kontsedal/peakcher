import React from "react";

export const repeatMap = (
  repeatTimes: number,
  callback: (index: number) => string | number | React.ReactNode
): unknown => new Array(repeatTimes).fill(0).map((_, index) => callback(index));
