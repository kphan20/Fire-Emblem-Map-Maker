import React from "react";
import tilesetImage from "../../resources/Sacae1.png";
import { TILE_SIZE, MAP_DIMENSIONS } from "../utils";
import { add } from "../hotbar/hotbarSlice";
import { select } from "./tilesetSlice";
import { useAppDispatch } from "../../app/hooks";
import "./Tileset.css";

// Holds tileset palette and selection grid
export default function Tileset() {
  // Holds divs responsible for selecting tiles on the tileset palette
  const overlayGrid: JSX.Element[] = [];
  const dispatch = useAppDispatch();

  // Will hardcode in image dimensions until suitable method to find dimensions is found

  /**
   * Adds grid elements to overlay grid
   */
  const generateSelectionGrid = () => {
    // 0-indexes tiles left to right, starting from the bottom row
    for (let y = 0; y < MAP_DIMENSIONS; y += TILE_SIZE) {
      for (let x = 0; x < MAP_DIMENSIONS; x += TILE_SIZE) {
        const style = {
          top: `${((MAP_DIMENSIONS - y - TILE_SIZE) / MAP_DIMENSIONS) * 100}%`,
          right: `${
            ((MAP_DIMENSIONS - x - TILE_SIZE) / MAP_DIMENSIONS) * 100
          }%`,
          width: `${TILE_SIZE}px`,
          height: `${TILE_SIZE}px`,
          margin: "none",
        };
        overlayGrid.push(
          <div
            className="tilesetSelection"
            style={style}
            onClick={() => {
              dispatch(
                select(
                  x / TILE_SIZE + ((y / TILE_SIZE) * MAP_DIMENSIONS) / TILE_SIZE
                )
              );
              // console.log(
              //   x / TILE_SIZE + ((y / TILE_SIZE) * MAP_DIMENSIONS) / TILE_SIZE
              // );
            }}
          ></div>
        );
      }
    }
  };
  generateSelectionGrid();
  return (
    <div id="tilesetContainer">
      {overlayGrid}
      <img src={tilesetImage} />
    </div>
  );
}
