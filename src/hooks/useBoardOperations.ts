import { useArrayOperations } from "./useArrayOperations";

export const useBoardOperations = () => {
  const { arrayInArray, withinMatrixBounds } = useArrayOperations();

  const findAllTouchingCells = (
    matrix: number[][],
    coords: number[]
  ): number[][] => {
    const coordValue = matrix[coords[0]][coords[1]]; // Find coord value on matrix

    if (coordValue !== 1) {
      // If the starting coordinate does not contain a 1, return an empty array
      return [];
    }

    const visited: number[][] = [];
    const stack: number[][] = [];
    const memory: number[][] = []; // Holds all unique coords visited

    stack.push(coords); // Add first coordinate to stack

    while (stack.length > 0) {
      const center: number[] = stack.pop()!; // Current center is top of stack

      if (!arrayInArray(visited, center)) {
        visited.push(center); // Add center to list of visited coords

        // Get right coord
        const rightCoord = [center[0], center[1] + 1];
        // Get left coord
        const leftCoord = [center[0], center[1] - 1];
        // Get up coord
        const upCoord = [center[0] - 1, center[1]];
        // Get down coord
        const downCoord = [center[0] + 1, center[1]];

        // Check all directions and push valid ones to stack
        const directions = [rightCoord, leftCoord, upCoord, downCoord];
        for (let direction of directions) {
          if (
            withinMatrixBounds(matrix, direction) && // Check coordinate is within matrix bounds
            matrix[direction[0]]?.[direction[1]] === 1 && // Ensure the value at the coordinate is 1
            !arrayInArray(visited, direction) // Ensure the coordinate has not been visited
          ) {
            stack.push(direction); // Push coordinate to stack to be accessed next
          }
        }

        // Add coord to memory if not already present
        if (!arrayInArray(memory, center)) {
          memory.push(center);
        }
      }
    }

    return memory; // Return all the collected coordinates
  };

  const findInitialCorners = (gameGrid: number[][], gamePiece: number[][]) => {
    const gamePieceHeight = gamePiece?.length;
    const gamePieceWidth = gamePiece[0]?.length;
    const max = gameGrid.length;

    let topLeftCorner = [0, 0];
    if (gamePiece[0][0] !== 1) {
      topLeftCorner = [-1, -1]; // null value
    }

    let bottomLeftCorner = [0, max - gamePieceHeight];
    if (gamePiece[gamePieceHeight - 1][0] !== 1) {
      bottomLeftCorner = [-1, -1]; // null value
    }

    let topRightCorner = [max - gamePieceWidth, 0];
    if (gamePiece[0][gamePieceWidth - 1] !== 1) {
      topRightCorner = [-1, -1]; // null value
    }

    let bottomRightCorner = [max - gamePieceWidth, max - gamePieceHeight];
    if (gamePiece[gamePieceHeight - 1][gamePieceWidth - 1] !== 1) {
      bottomRightCorner = [-1, -1]; // null value
    }

    return [topLeftCorner, bottomLeftCorner, topRightCorner, bottomRightCorner];
  };

  const getCoordinateDiagonals = (coord: number[]) => {
    const topLeftCoord = [coord[0] - 1, coord[1] - 1];
    const topRightCoord = [coord[0] - 1, coord[1] + 1];
    const bottomLeftCoord = [coord[0] + 1, coord[1] - 1];
    const bottomRightCoord = [coord[0] + 1, coord[1] + 1];

    return [topLeftCoord, topRightCoord, bottomLeftCoord, bottomRightCoord];
  };

  // Finds all valid corners for placing a piece on map
  const findValidCorners = (gameGrid: number[][], gamePiece: number[][]) => {
    let mapPopulated = false;

    gameGrid.forEach((row) =>
      row.forEach((cell) => {
        if (cell === 1) {
          mapPopulated = true;
        }
      })
    );

    if (!mapPopulated) {
      return findInitialCorners(gameGrid, gamePiece);
    }

    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < gameGrid[i].length; j++) {
        if (gameGrid[i][j] === 1) {
          const coord = [i, j]; // Coord of selected shape
          const coordinateDiagonals = getCoordinateDiagonals(coord);
          const validCoordinateDiagonals = [...coordinateDiagonals].filter(
            (coord: number[]) => {
              if (
                coord[0] > 0 &&
                coord[1] > 0 &&
                withinMatrixBounds(gameGrid, coord)
              ) {
                if (gameGrid[coord[0]][coord[1]] === 0) {
                  return coord;
                }
              }
            }
          );
        }
      }
    }

    // TODO:
    // - Check diagonals to see if free space
    // - Check if space fits in free space

    return [];
  };

  return {
    findAllTouchingCells,
    findValidCorners,
  };
};
