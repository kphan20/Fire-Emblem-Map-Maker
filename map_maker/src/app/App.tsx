import React, { useState } from "react";
import "./App.css";
import Hotbar from "../components/hotbar/Hotbar";
import { add, clear } from "../components/hotbar/hotbarSlice";
import Tileset from "../components/tileset/Tileset";
import MapCanvas from "../components/map_canvas/MapCanvas";
import GridEditor from "../components/map_canvas/GridEditor";
import { useAppDispatch, useAppSelector } from "./hooks";
import { selectSelectedTile } from "../components/tileset/tilesetSlice";
import {
  TILE_SCALE,
  TILE_SIZE,
  convertSelectedToX,
  convertSelectedToY,
} from "../components/utils";

// Upper level container for app features
export default function App() {
  // Used to toggle whether or not the tileset palette is visible
  const [tilesetVisible, toggleTileset] = useState(true);

  // Calls typed useDispatch from hooks.ts
  const dispatch = useAppDispatch();

  // Stores the current selected tile from the tileset
  const selectedTile = useAppSelector(selectSelectedTile);

  // Contains the initial styling object for the selected tile display
  const selectedStyle = {
    height: `${TILE_SIZE * TILE_SCALE}`,
    width: `${TILE_SIZE * TILE_SCALE}`,
    backgroundPositionX: `-${convertSelectedToX(selectedTile)}px`,
    backgroundPositionY: `-${convertSelectedToY(selectedTile)}px`,
  };

  return (
    <>
      <div id="tileset" className="absolute">
        <button
          id="toggleTileset"
          onClick={() => toggleTileset(!tilesetVisible)}
        >
          {tilesetVisible ? ">" : "<"}
        </button>
        {tilesetVisible && <Tileset />}
      </div>
      <GridEditor />
      <MapCanvas />
      <div id="hotbarOptions" className="absolute">
        <button id="hotbarAdd" onClick={() => dispatch(add(selectedTile))}>
          Add selected to hotbar
        </button>
        <button id="hotbarClear" onClick={() => dispatch(clear())}>
          Clear
        </button>
      </div>
      <div id="selectedTile" className="absolute" style={selectedStyle}></div>
      <Hotbar />
    </>
  );
}
