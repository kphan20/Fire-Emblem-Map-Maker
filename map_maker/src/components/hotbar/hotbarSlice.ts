import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { HOTBAR_SIZE } from "../utils";

// Makes the hotbar state have an array that stores tile indices
export interface HotbarState {
  items: number[];
}

const initialState: HotbarState = {
  items: [],
};

export const hotbarSlice = createSlice({
  name: "hotbar",
  initialState,
  reducers: {
    // Adds tile index to hotbar if it's not full and the tile index not already included
    add: (state, action: PayloadAction<number>) => {
      if (
        state.items.length < HOTBAR_SIZE &&
        !state.items.includes(action.payload)
      ) {
        state.items.push(action.payload);
      } else {
        console.error("Hotbar size exceeded");
      }
    },
    // Deletes hotbar item at specified index
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
    // Deletes all hotbar items
    clear: (state) => {
      state.items = [];
    },
  },
});

export const { add, deleteItem, clear } = hotbarSlice.actions;

// Selector for items array
export const selectItems = (state: RootState) => state.hotbar.items;

export default hotbarSlice.reducer;
