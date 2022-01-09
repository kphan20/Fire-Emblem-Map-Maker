import React from "react";
import { selectItems } from "./hotbarSlice";
import { HOTBAR_SIZE, convertSelectedToX, convertSelectedToY } from "../utils";
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
      backgroundPositionX: `-${convertSelectedToX(element)}px`,
      backgroundPositionY: `-${convertSelectedToY(element)}px`,
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
    hotbar.push(<div className="hotbarEmpty"></div>);
  }
  return (
    <div id="hotbar" className="absolute">
      {hotbar}
    </div>
  );
}
