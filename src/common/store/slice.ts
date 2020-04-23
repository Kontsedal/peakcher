/* eslint-disable no-param-reassign */

import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "counter",
  initialState: {
    counter: 0,
  },
  reducers: {
    increment: (state, action) => {
      const { payload = 1 } = action;
      state.counter += payload;
    },
    setState: (state, action) => action.payload,
  },
});
