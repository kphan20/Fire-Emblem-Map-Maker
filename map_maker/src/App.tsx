import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Hotbar from "./components/hotbar/Hotbar";
import { add, clear } from "./components/hotbar/hotbarSlice";
import Tileset from "./components/tileset/Tileset";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectSelectedTile } from "./components/tileset/tilesetSlice";
import {
  TILE_SCALE,
  TILE_SIZE,
  DRAG_RADIUS,
  MAP_DIMENSIONS,
  MAP_TILE_STYLE,
} from "./components/utils";

// Upper level container for app features
export default function App() {
  // Used to toggle whether or not the tileset palette is visible
  const [tilesetVisible, toggleTileset] = useState(true);

  // Used to determine whether drag clicks should fill tile editor
  const [dragFill, setDragFill] = useState(false);

  // Calls typed useDispatch from hooks.ts
  const dispatch = useAppDispatch();

  // Stores the current selected tile from the tileset
  const selectedTile = useAppSelector(selectSelectedTile);

  /**
   * Generates map cell div
   * @param style Optional style object for generated div
   * @returns {JSX.Element}
   */
  const createCell = (style?: MAP_TILE_STYLE): JSX.Element => {
    return <div className="cell" style={style}></div>;
  };

  /**
   * Converts selected tile index to horizontal position in background tileset image
   * @returns {number}
   */
  const convertSelectedToX = (): number => {
    return (
      (selectedTile % (MAP_DIMENSIONS / TILE_SIZE)) * TILE_SIZE * TILE_SCALE
    );
  };

  /**
   * Converts selected tile index to vertical position in background tileset image
   * @returns {number}
   */
  const convertSelectedToY = (): number => {
    return (
      TILE_SCALE *
      (MAP_DIMENSIONS -
        TILE_SIZE -
        Math.floor(selectedTile / (MAP_DIMENSIONS / TILE_SIZE)) * TILE_SIZE)
    );
  };

  /**
   * Converts position of css sprite to selected tile index
   * @param x horizontal position of tile
   * @param y vertical position of tile
   * @returns {number}
   */
  const convertPositionToSelected = (x: number, y: number): number => {
    const newX = -x / (TILE_SCALE * TILE_SIZE);
    const newY = (y / TILE_SCALE + MAP_DIMENSIONS - TILE_SIZE) / TILE_SIZE;
    return newX + newY * (MAP_DIMENSIONS / TILE_SIZE);
  };

  /**
   * Converts string with pixel measurement to number
   * @param length String with px attached to number (i.e. 30px)
   * @returns {number} Number without px
   */
  const removePixel = (length: string): number => {
    return parseInt(length.substring(0, length.length - 2));
  };

  // Contains the initial styling object for the selected tile display
  const selectedStyle = {
    height: `${TILE_SIZE * TILE_SCALE}`,
    width: `${TILE_SIZE * TILE_SCALE}`,
    backgroundPositionX: `-${convertSelectedToX()}px`,
    backgroundPositionY: `-${convertSelectedToY()}px`,
  };

  // Stores x and y background position of selected tile
  const [posX, changePosX] = useState<string>();
  const [posY, changePosY] = useState<string>();

  // Changes selected tile display on selected tile change
  useEffect(() => {
    changePosX(`-${convertSelectedToX()}px`);
    changePosY(`-${convertSelectedToY()}px`);
  }, [selectedTile]);

  // Contains dom reference for the map tile container
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants to define the size of the tile map builder
  const [rows, changeRows] = useState(3);
  const [cols, changeCols] = useState(3);

  // Stores the tile map builder
  const [grid, changeGrid] = useState<JSX.Element[]>();

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

  // Generates the empty tile grid upon component mounting
  useEffect(() => {
    changeGrid(gridGenerator(rows, cols));
  }, []);

  /**
   * Handles the editing of tiles in the map editor
   * @param id index of changed tile in map editor
   */
  const changeGridTile = (id: number) => {
    const style: MAP_TILE_STYLE = {
      backgroundPositionX: posX!,
      backgroundPositionY: posY!,
    };
    changeGrid((previous) => {
      previous![id] = createCell(style);
      return [...previous!];
    });
  };

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
          changeGridTile(yCoord * cols + xCoord);
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
        for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
          for (let j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
            if (j > rows - 1 || i > cols - 1) break;
            changeGridTile(j * cols + i);
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
    container.addEventListener("mouseup", mouseup);
    container.addEventListener("wheel", zoom);
    window.addEventListener("mouseup", mouseup);
    // Clean up
    return () => {
      container.removeEventListener("mousedown", mousedown);
      container.removeEventListener("mousemove", mousemoving);
      container.removeEventListener("mouseup", mouseup);
      container.removeEventListener("wheel", zoom);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [posX, posY, rows, cols, zoomScale, dragFill]);

  /**
   * Rearranges map editor array so that the tiles are listed from bottom to top, left to right
   * @param tileArray array of map tile elements
   * @returns {JSX.Element[]} rearranged array
   */
  const rearrangeTiles = (tileArray: JSX.Element[]): JSX.Element[] => {
    const rearrange = [];
    let rowHolder = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rowHolder.push(tileArray[i * cols + j]);
      }
      rearrange.push(rowHolder);
      rowHolder = [];
    }
    rearrange.reverse();
    const finalArr: JSX.Element[] = [];
    rearrange.forEach((row) => {
      row.forEach((mapTile) => {
        finalArr.push(mapTile);
      });
    });
    return finalArr;
  };

  // Series of helper function that expand map editor array
  /**
   * Adds tiles to bottom of grid while saving previous edits to the grid
   */
  const addBottomRow = () => {
    // increments row count
    changeRows((previous) => previous + 1);

    // creates appropriate size row and concats to original array
    const newRow: JSX.Element[] = [];
    for (let i = 0; i < cols; i++) {
      newRow?.push(createCell());
    }
    changeGrid((previous) => {
      return previous?.concat(newRow);
    });
  };
  /**
   * Adds tiles to top of grid
   */
  const addTopRow = () => {
    changeRows((previous) => previous + 1);
    // no issues have been seen so far with using fill, but be wary of reference issues
    const newRow = Array(cols).fill(createCell());
    changeGrid((previous) => {
      return newRow.concat(previous);
    });
  };

  /**
   * Adds column to the right
   * The reason this method is different is due to its use in a loop while depending on
   * two states which are changing
   * @param columns current number of columns
   * @param tileGrid current map grid
   * @returns {() => JSX.Element[]}
   */
  const addRightCol =
    (
      columns: number = cols,
      tileGrid: JSX.Element[] = grid!
    ): (() => JSX.Element[]) =>
    () => {
      const gridCopy = [...tileGrid];
      for (let i = 1; i < rows; i++) {
        gridCopy.splice(i * (columns + 1) - 1, 0, createCell());
      }
      gridCopy.push(createCell());
      changeCols((previous) => previous + 1);
      changeGrid(gridCopy);
      return gridCopy;
    };

  /**
   * Adds column to the left
   */
  const addLeftCol = () => {
    const gridCopy = [...grid!];
    for (let i = 0; i < rows; i++) {
      gridCopy.splice(i * (cols + 1), 0, createCell());
    }
    changeCols((previous) => previous + 1);
    changeGrid(gridCopy);
  };

  // Handles map submission
  const submit = async () => {
    const arr = rearrangeTiles(grid!);
    const results = [];
    for (let i = 0; i < arr.length; i++) {
      const style = arr[i].props.style;
      try {
        results.push(
          convertPositionToSelected(
            removePixel(style.backgroundPositionX),
            removePixel(style.backgroundPositionY)
          )
        );
      } catch (error) {
        // produce error message
        return;
      }
    }
    //fs.writeFile("test.json", JSON.stringify(results));
    const data = {
      rows: rows,
      cols: cols,
      mapData: results,
    };
    const response = await fetch("http://127.0.0.1:3000", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(data),
    });
    // console.log(JSON.stringify(results));
    // let element = document.createElement("a");
    // element.setAttribute(
    //   "href",
    //   "data:text/plain;charset=utf-8," +
    //     encodeURIComponent(`${cols},${rows},${JSON.stringify(results)}`)
    // );
    // element.setAttribute("download", "test.txt");
    // element.style.display = "none";
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
    console.log(response);
    return response;
  };

  // Controls input elements editing row and column number
  const [rowsForm, changeRowsForm] = useState(rows);
  const [colsForm, changeColsForm] = useState(cols);

  // automatically updates input values when dimensions change
  // ideally, finding a way to use the rows state for the form
  // would be nice but changeGridRows/Cols would be affected
  useEffect(() => {
    changeRowsForm(rows);
    changeColsForm(cols);
  }, [rows, cols]);

  // Curried function to handle change in input elements
  const dimensionChange =
    (changeFunction: (x: number) => void) =>
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.value)
        changeFunction(parseInt(e.currentTarget.value));
    };

  /**
   * Changes number of rows in grid, adding or deleting starting from the bottom
   * @param x new number of rows
   */
  const changeGridRows = (x: number) => {
    if (rows < x) {
      for (let i = 0; i < x - rows; i++) {
        addBottomRow();
      }
    }
    if (rows > x) {
      // implement after implementing row deletion
      for (let i = rows; i > x; i--) {
        changeGrid((previous) => previous?.slice(0, previous.length - cols));
      }
      changeRows(x);
    }
  };

  /**
   * Deletes rightmost column
   * @param y current column count
   * @param tileGrid current map grid iteration
   * @returns {() => JSX.Element[]}
   */
  const deleteRightCol =
    (y: number = cols, tileGrid: JSX.Element[] = grid!) =>
    () => {
      for (let i = tileGrid.length - 1; i >= 0; i -= y) {
        tileGrid.splice(i, 1);
      }
      changeGrid(tileGrid);
      changeCols((previous) => previous - 1);
      return tileGrid;
    };

  /**
   * Changes number of columns in grid, adding or deleting starting from the right
   * @param y new number of columns
   */
  const changeGridCols = (y: number) => {
    if (cols < y) {
      let currentGrid = grid!;
      for (let i = cols; i < y; i++) {
        currentGrid = addRightCol(i, currentGrid)();
      }
    }
    if (cols > y) {
      // implement after implementing col deletion
      let gridCopy = grid!;
      for (let i = cols; i > y; i--) {
        gridCopy = deleteRightCol(i, gridCopy)();
      }
    }
  };

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
      <div id="tileset" className="absolute">
        <button
          id="toggleTileset"
          onClick={() => toggleTileset(!tilesetVisible)}
        >
          {tilesetVisible ? ">" : "<"}
        </button>
        {tilesetVisible && <Tileset />}
      </div>
      <div id="gridEditors" className="absolute">
        <button id="addBottomRow" className="gridEditor" onClick={addBottomRow}>
          Add Bottom row
        </button>
        <button id="addTopRow" className="gridEditor" onClick={addTopRow}>
          Add Top Row
        </button>
        <button id="addRightCol" className="gridEditor" onClick={addRightCol()}>
          Add Right Col
        </button>
        <button id="addLeftCol" className="gridEditor" onClick={addLeftCol}>
          Add Left Col
        </button>
        <button id="submit" className="gridEditor" onClick={submit}>
          Submit
        </button>
        <button
          id="toggleDragFill"
          className="gridEditor"
          onClick={() => setDragFill((previous) => !previous)}
        >
          Drag Fill
        </button>
      </div>
      <div id="container" className="absolute" ref={containerRef}>
        {grid}
      </div>
      <div id="hotbarOptions" className="absolute">
        <button id="hotbarAdd" onClick={() => dispatch(add(selectedTile))}>
          Add selected to hotbar
        </button>
        <button id="hotbarClear" onClick={() => dispatch(clear())}>
          Clear
        </button>
        <button id="recenter" onClick={recenter}>
          Recenter map
        </button>
      </div>
      <div id="sizeInput" className="absolute">
        <span>Rows:</span>
        <input
          id="rowChange"
          className="gridEditor"
          type="number"
          min="0"
          max="50"
          value={rowsForm}
          onChange={(e) => changeRowsForm(parseInt(e.currentTarget.value))}
          onBlur={dimensionChange(changeGridRows)}
        />
        <br></br>
        <span>Columns:</span>
        <input
          id="colsChange"
          className="gridEditor"
          type="number"
          min="0"
          max="50"
          value={colsForm}
          onChange={(e) => changeColsForm(parseInt(e.currentTarget.value))}
          onBlur={dimensionChange(changeGridCols)}
        />
      </div>
      <div id="selectedTile" className="absolute" style={selectedStyle}></div>
      <Hotbar />
    </>
  );
}
