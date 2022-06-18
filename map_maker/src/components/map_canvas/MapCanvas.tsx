import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSelectedTile } from "../tileset/tilesetSlice";
import {
  selectCols,
  selectRows,
  selectGrid,
  selectDragFill,
  changeGridTile,
} from "./mapCanvasSlice";
import {
  TILE_SIZE,
  TILE_SCALE,
  DRAG_RADIUS,
  convertSelectedToX,
  convertSelectedToY,
} from "../utils";
export default function MapCanvas() {
  // Contains dom reference for the map tile container
  const containerRef = useRef<HTMLDivElement>(null);

  // redux components
  const dispatch = useAppDispatch();
  const rows = useAppSelector(selectRows);
  const cols = useAppSelector(selectCols);
  const grid = useAppSelector(selectGrid);
  // Used to determine whether drag clicks should fill tile editor
  const dragFill = useAppSelector(selectDragFill);
  const selectedTile = useAppSelector(selectSelectedTile);

  // Stores x and y background position of selected tile
  const [posX, changePosX] = useState<string>();
  const [posY, changePosY] = useState<string>();

  useEffect(() => {
    changePosX(`-${convertSelectedToX(selectedTile)}px`);
    changePosY(`-${convertSelectedToY(selectedTile)}px`);
  }, [selectedTile]);

  // Stores the zoom scale of the map editor between renders
  const [zoomScale, changeScale] = useState(1);

  // Detects mouse inputs and changes map editor accordingly
  useEffect(() => {
    const container = containerRef.current!;
    // Resizes grid upon changes in dimensions
    container.style.setProperty("--rows", `${rows}`);
    container.style.setProperty("--columns", `${cols}`);
    container.style.setProperty("--tilesize", `${TILE_SIZE * TILE_SCALE}px`);

    // tracks current mouse position [x, y]
    let mousePos = [0, 0];

    // tracks initial drag point for drag fill
    let dragFillInit = [0, 0];

    // used to determine whether a drag action has occurred
    let dragStart = [0, 0];

    // used to check whether the left mouse button is held down
    let isDown = false;

    // flag to check whether the container is being dragged or not
    let isDrag = false;

    // used to ensure container is not dragged outside of viewport
    let minTop = 0;
    let maxTop = 0;
    let minLeft = 0;
    let maxLeft = 0;

    // Used to get position relative to container div (for drag fill logic)
    const scaledDivPos = container.getBoundingClientRect();

    /**
     * Checks if a number is within bounds
     * @param min   Lower bound
     * @param max   Upper bound
     * @param check Examined number
     * @returns {number} Returns the one of the bounds or the number
     */
    const boundChecker = (min: number, max: number, check: number): number => {
      if (check < min) {
        return min;
      }
      if (check > max) {
        return max;
      }
      return check;
    };

    /**
     * Checks if the drag distance is greater than the radius constant
     * @param xDiff change in x
     * @param yDiff change in y
     * @returns {boolean} whether the container is being dragged or not
     */
    const checkDragDistance = (xDiff: number, yDiff: number): boolean => {
      return xDiff ** 2 + yDiff ** 2 > DRAG_RADIUS;
    };

    // Handles beginning of click
    const mousedown = (e: MouseEvent) => {
      // Sets initial mouse position (relative to the change in container position)
      mousePos = dragStart = [
        e.clientX - container.offsetLeft,
        e.clientY - container.offsetTop,
      ];

      // Sets initial mouse position (relative to inside of container)
      dragFillInit = [e.clientX - scaledDivPos.x, e.clientY - scaledDivPos.y];

      // Ensures other mouse functions don't trigger accidentally
      isDown = true;

      // Logic to determine bounds when moving the map editor
      const numCols = parseInt(container.style.getPropertyValue("--columns"));
      const numRows = parseInt(container.style.getPropertyValue("--rows"));
      const xDiff =
        window.visualViewport.width - numCols * TILE_SCALE * TILE_SIZE;
      const yDiff =
        window.visualViewport.height - numRows * TILE_SCALE * TILE_SIZE;

      // scaleFactor determined after extensive experimentation
      // complexity may be due to uncertainty with how offset measurements
      // are given - offset left/top just did not give the correct
      // measurements when scale was greater than 1
      const scaleFactor = TILE_SIZE * (zoomScale - 1);
      const colFactor = numCols * scaleFactor;
      const rowFactor = numRows * scaleFactor;
      let sign = xDiff >= 0 ? 1 : -1;
      let bound = xDiff - sign * colFactor;
      minLeft = Math.min(sign * colFactor, bound);
      maxLeft = Math.max(sign * colFactor, bound);
      sign = yDiff >= 0 ? 1 : -1;
      bound = yDiff - sign * rowFactor;
      minTop = Math.min(sign * rowFactor, bound);
      maxTop = Math.max(sign * rowFactor, bound);
    };

    // Handles movement of mouse
    const mousemoving = (e: MouseEvent) => {
      if (!isDown) {
        return;
      }

      // Gets current mouse position
      mousePos = [
        e.clientX - container.offsetLeft,
        e.clientY - container.offsetTop,
      ];

      // Gets current position of container
      let currentX = container.offsetLeft; //removePixel(container.style.left) || 0;
      let currentY = container.offsetTop; //removePixel(container.style.top) || 0;

      // Calcs change in position
      const xDiff = mousePos[0] - dragStart[0];
      const yDiff = mousePos[1] - dragStart[1];
      currentX += xDiff;
      currentY += yDiff;

      // If the position changed beyond some radius, toggle isDrag
      if (checkDragDistance(xDiff, yDiff)) {
        isDrag = true;
      }
      if (!dragFill) {
        // Moves container within bounds
        currentX = boundChecker(minLeft, maxLeft, currentX);
        currentY = boundChecker(minTop, maxTop, currentY);
        container.style.left = `${currentX}px`;
        container.style.top = `${currentY}px`;
      }
    };

    // Handles mouse release
    const mouseup = (e: MouseEvent) => {
      if (!isDown) return;
      isDown = false;

      // If the mouse wasn't dragged, place a tile in the map editor
      if (!isDrag) {
        // Checks if there is a valid tile selected
        if (selectedTile > -1) {
          const currRect = container.getBoundingClientRect();
          let xCoord = e.clientX - currRect.x;
          let yCoord = e.clientY - currRect.y;
          xCoord = Math.floor(xCoord / (TILE_SCALE * TILE_SIZE * zoomScale));
          yCoord = Math.floor(yCoord / (TILE_SCALE * TILE_SIZE * zoomScale));
          const payload = {
            id: yCoord * cols + xCoord,
            style: { backgroundPositionX: posX!, backgroundPositionY: posY! },
          };
          dispatch(changeGridTile(payload));
        }
      } else if (dragFill) {
        // Fills in the selected squares
        let x1 = Math.floor(
          dragFillInit[0] / (TILE_SCALE * TILE_SIZE * zoomScale)
        );
        let y1 = Math.floor(
          dragFillInit[1] / (TILE_SCALE * TILE_SIZE * zoomScale)
        );
        let x2 = Math.floor(
          (e.clientX - scaledDivPos.x) / (TILE_SCALE * TILE_SIZE * zoomScale)
        );
        let y2 = Math.floor(
          (e.clientY - scaledDivPos.y) / (TILE_SCALE * TILE_SIZE * zoomScale)
        );
        const style = {
          backgroundPositionX: posX!,
          backgroundPositionY: posY!,
        };
        for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
          for (let j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
            if (j > rows - 1 || i > cols - 1) break;
            dispatch(changeGridTile({ id: j * cols + i, style: style }));
          }
        }
      }
      isDrag = false;
    };

    // Handles scroll wheel zoom in container
    const zoom = (e: WheelEvent) => {
      e.preventDefault();
      let scale = zoomScale;
      scale += e.deltaY * -0.01;
      // Limits zoom in between 1 and 4
      scale = Math.min(Math.max(1, scale), 4);
      container.style.transform = `scale(${scale})`;
      changeScale(scale);
    };

    container.addEventListener("mousedown", mousedown);
    container.addEventListener("mousemove", mousemoving);
    document.addEventListener("mousemove", mousemoving);
    container.addEventListener("mouseup", mouseup);
    container.addEventListener("wheel", zoom);
    window.addEventListener("mouseup", mouseup);
    // Clean up
    return () => {
      container.removeEventListener("mousedown", mousedown);
      container.removeEventListener("mousemove", mousemoving);
      document.removeEventListener("mousemove", mousemoving);
      container.removeEventListener("mouseup", mouseup);
      container.removeEventListener("wheel", zoom);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [posX, posY, rows, cols, zoomScale, dragFill]);

  /**
   * Brings the map back into a more centralized view
   */
  const recenter = () => {
    const container = containerRef.current!;
    // if width of map is less than the screen's, center it
    // otherwise, bring map to left edge
    const width = container.offsetWidth;
    const winWidth = window.visualViewport.width;
    const widthCalc = width < winWidth ? `calc(50vw - ${width / 2}px)` : "0px";
    container.style.left = widthCalc;
    // similar logic to width
    const height = container.offsetHeight;
    const winHeight = window.visualViewport.height;
    const heightCalc =
      height < winHeight ? `calc(50vh - ${height / 2}px)` : "0px";
    container.style.top = heightCalc;
  };
  return (
    <>
      <div id="container" className="absolute" ref={containerRef}>
        {grid}
      </div>
      <button id="recenter" className="absolute" onClick={recenter}>
        Recenter Map
      </button>
    </>
  );
}
