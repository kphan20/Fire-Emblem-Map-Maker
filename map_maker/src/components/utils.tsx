// Default size of tiles in tileset images
export const TILE_SIZE = 16;

// Max size of hotbar
export const HOTBAR_SIZE = 8;

// Default scaling of tile size on map editor
export const TILE_SCALE = 2;

// Maximum distance moved before mouse movement is considered a mouse drag
export const DRAG_RADIUS = 0.01;

// Size of tileset map
export const MAP_DIMENSIONS = 512;

// Interface for style object
export interface MAP_TILE_STYLE {
  backgroundPositionX: string;
  backgroundPositionY: string;
}

/**
 * Generates map cell div
 * @param style Optional style object for generated div
 * @returns {JSX.Element}
 */
export const createCell = (style?: MAP_TILE_STYLE): JSX.Element => {
  return <div className="cell" style={style}></div>;
};

/**
 * Converts selected tile index to horizontal position in background tileset image
 * @param num tile index to be converted
 * @returns {number}
 */
export const convertSelectedToX = (num: number): number => {
  return (num % (MAP_DIMENSIONS / TILE_SIZE)) * TILE_SIZE * TILE_SCALE;
};

/**
 * Converts selected tile index to vertical position in background tileset image
 * @param num tile index to be converted
 * @returns {number}
 */
export const convertSelectedToY = (num: number): number => {
  return (
    TILE_SCALE *
    (MAP_DIMENSIONS -
      TILE_SIZE -
      Math.floor(num / (MAP_DIMENSIONS / TILE_SIZE)) * TILE_SIZE)
  );
};
