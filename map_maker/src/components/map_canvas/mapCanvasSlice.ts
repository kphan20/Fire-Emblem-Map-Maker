import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createCell, MAP_TILE_STYLE } from "../utils";

// Makes selectedTile simply a numerical index
export interface mapCanvasState {
  grid: JSX.Element[];
  rows: number;
  cols: number;
  dragFill: boolean;
}

/**
 * Creates map editor grid array
 * @param x number of rows
 * @param y number of columns
 * @returns {JSX.Element[]} array of map tile elements
 */
const gridGenerator = (x: number, y: number): JSX.Element[] => {
  const arr = [];
  for (let i = 0; i < x * y; i++) {
    arr.push(createCell());
  }
  return arr;
};

const initialState = {
  grid: gridGenerator(3, 3),
  rows: 3,
  cols: 3,
  dragFill: false,
};

interface changeGridInterface {
  id: number;
  style: MAP_TILE_STYLE;
}

export const mapCanvasSlice = createSlice({
  name: "mapCanvas",
  initialState,
  reducers: {
    // edits a tile in the grid
    changeGridTile: (
      state: mapCanvasState,
      action: PayloadAction<changeGridInterface>
    ) => {
      const newGrid = [...state.grid];
      newGrid[action.payload.id] = createCell(action.payload.style);
      return { ...state, grid: newGrid };
    },
    // adds empty row to bottom of grid
    addBottomRow: (state: mapCanvasState) => {
      const newGrid = [...state.grid];
      for (let i = 0; i < state.cols; i++) {
        newGrid.push(createCell());
      }
      return { ...state, grid: newGrid, rows: state.rows + 1 };
    },
    // adds empty row to top
    addTopRow: (state: mapCanvasState) => {
      const newRow = Array(state.cols).fill(createCell());
      return {
        ...state,
        grid: newRow.concat(state.grid),
        rows: state.rows + 1,
      };
    },
    // adds empty column to right
    addRightCol: (state: mapCanvasState) => {
      const newGrid = [...state.grid];
      // downside of using flattened grid array - splice may not be very efficient
      for (let i = 1; i < state.rows; i++) {
        newGrid.splice(i * (state.cols + 1) - 1, 0, createCell());
      }
      newGrid.push(createCell());
      return { ...state, grid: newGrid, cols: state.cols + 1 };
    },
    // adds empty column to left
    addLeftCol: (state: mapCanvasState) => {
      const newGrid = [...state.grid];
      for (let i = 0; i < state.rows; i++) {
        newGrid.splice(i * (state.cols + 1), 0, createCell());
      }
      return { ...state, grid: newGrid, cols: state.cols + 1 };
    },
    // deletes bottom row by default - may implement top row deletion later
    deleteRow: (state: mapCanvasState) => {
      const newGrid = state.grid.slice(0, state.grid.length - state.cols);
      return { ...state, grid: newGrid, rows: state.rows - 1 };
    },
    // deletes right column by default
    deleteCol: (state: mapCanvasState) => {
      const newGrid = [...state.grid];
      for (let i = newGrid.length - 1; i >= 0; i -= state.cols) {
        newGrid.splice(i, 1);
      }
      return { ...state, grid: newGrid, cols: state.cols - 1 };
    },
    toggleDragFill: (state: mapCanvasState) => {
      return { ...state, dragFill: !state.dragFill };
    },
  },
});

export const {
  changeGridTile,
  addBottomRow,
  addTopRow,
  addLeftCol,
  addRightCol,
  deleteRow,
  deleteCol,
  toggleDragFill,
} = mapCanvasSlice.actions;

// Selector of the grid
export const selectGrid = (state: RootState) => state.mapCanvas.grid;
// Selector of the number of rows
export const selectRows = (state: RootState) => state.mapCanvas.rows;
// Selector of the number of columns
export const selectCols = (state: RootState) => state.mapCanvas.cols;
// Selector of drag fill boolean
export const selectDragFill = (state: RootState) => state.mapCanvas.dragFill;

export default mapCanvasSlice.reducer;
