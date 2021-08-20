import { configureStore } from "@reduxjs/toolkit";
import hotbarReducer from "../components/hotbar/hotbarSlice";
import tilesetReducer from "../components/tileset/tilesetSlice";

export const store = configureStore({
  reducer: {
    hotbar: hotbarReducer,
    tileset: tilesetReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
