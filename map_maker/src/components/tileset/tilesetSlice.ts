import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

// Makes selectedTile simply a numerical index
export interface tilesetState {
  selectedTile: number;
  selectedX: string;
  selectedY: string;
}

const initialState = {
  selectedTile: -1,
  selectedX: "",
  selectedY: "",
};

export const tilesetSlice = createSlice({
  name: "tileset",
  initialState,
  reducers: {
    // Changes selectedTile
    select: (state, action: PayloadAction<number>) => {
      state.selectedTile = action.payload;
    },
  },
});

export const { select } = tilesetSlice.actions;

// Selector of the selected tile
export const selectSelectedTile = (state: RootState) =>
  state.tileset.selectedTile;

export default tilesetSlice.reducer;
