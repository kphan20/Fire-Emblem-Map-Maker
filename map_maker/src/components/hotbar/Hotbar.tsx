import React from "react";
import { selectItems } from "./hotbarSlice";
import { HOTBAR_SIZE, TILE_SIZE, TILE_SCALE, MAP_DIMENSIONS } from "../utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { select } from "../tileset/tilesetSlice";

// Represents tile hotbar for quicker tile selection
export default function Hotbar() {
  // Gets current items in the hotbar
  const items = useAppSelector(selectItems);
  const dispatch = useAppDispatch();

  // Creates hotbar div element array
  const hotbar: JSX.Element[] = items.map((element) => {
    // Correctly positions css sprites
    const style = {
      backgroundPositionX: `-${
        (element % (MAP_DIMENSIONS / TILE_SIZE)) * TILE_SIZE * TILE_SCALE
      }px`,
      backgroundPositionY: `-${
        MAP_DIMENSIONS * TILE_SCALE -
        TILE_SIZE * TILE_SCALE -
        Math.floor(element / (MAP_DIMENSIONS / TILE_SIZE)) *
          TILE_SIZE *
          TILE_SCALE
      }px`,
    };
    // Returns div element with onClick that changes current selected tile
    return (
      <div
        className="hotbarCell"
        onClick={() => {
          dispatch(select(element));
        }}
        style={style}
      ></div>
    );
  });

  // Pads until desired hotbar length is achieved
  while (hotbar.length < HOTBAR_SIZE) {
    hotbar.push(<div className="hotbarCell"></div>);
  }
  return (
    <div id="hotbar" className="absolute">
      {hotbar}
    </div>
  );
}
