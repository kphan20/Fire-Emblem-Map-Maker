import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { MAP_DIMENSIONS, TILE_SCALE, TILE_SIZE } from "../utils";
import {
  selectGrid,
  selectRows,
  selectCols,
  addBottomRow,
  addTopRow,
  addRightCol,
  addLeftCol,
  toggleDragFill,
  deleteRow,
  deleteCol,
} from "./mapCanvasSlice";

export default function GridEditor() {
  const dispatch = useAppDispatch();
  const grid = useAppSelector(selectGrid);
  const rows = useAppSelector(selectRows);
  const cols = useAppSelector(selectCols);

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

  /**
   * Changes number of rows in grid, adding or deleting starting from the bottom
   * @param x new number of rows
   * @returns
   */
  const changeGridRows = (x: number) => {
    if (!x) return;
    if (rows < x) {
      for (let i = 0; i < x - rows; i++) {
        dispatch(addBottomRow());
      }
    } else if (rows > x) {
      for (let i = rows; i > x; i--) {
        dispatch(deleteRow());
      }
    }
  };

  /**
   * Changes number of columns in grid, adding or deleting starting from the right
   * @param y new number of columns
   */
  const changeGridCols = (y: number) => {
    if (!y) return;
    if (cols < y) {
      for (let i = 0; i < y - cols; i++) {
        dispatch(addRightCol());
      }
    } else if (cols > y) {
      for (let i = cols; i > y; i--) {
        dispatch(deleteCol());
      }
    }
  };
  return (
    <>
      <div id="gridEditors" className="absolute">
        <button
          id="addBottomRow"
          className="gridEditor"
          onClick={() => dispatch(addBottomRow())}
        >
          Add Bottom Row
        </button>
        <button
          id="addTopRow"
          className="gridEditor"
          onClick={() => dispatch(addTopRow())}
        >
          Add Top Row
        </button>
        <button
          id="addRightCol"
          className="gridEditor"
          onClick={() => dispatch(addRightCol())}
        >
          Add Right Col
        </button>
        <button
          id="addLeftCol"
          className="gridEditor"
          onClick={() => dispatch(addLeftCol())}
        >
          Add Left Col
        </button>
        <button id="submit" className="gridEditor" onClick={submit}>
          Submit
        </button>
        <button
          id="toggleDragFill"
          className="gridEditor"
          onClick={() => dispatch(toggleDragFill())}
        >
          Drag Fill
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
          onBlur={(e) => changeGridRows(parseInt(e.currentTarget.value))}
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
          onBlur={(e) => changeGridCols(parseInt(e.currentTarget.value))}
        />
      </div>
    </>
  );
}
