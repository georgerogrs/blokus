import { useArrayOperations } from "./useArrayOperations";

export const useBoardOperations = () => {
  const { arrayInArray } = useArrayOperations();

  const withinMatrixBounds = (matrix: number[][], coordinates: number[]) => {
    if (coordinates[0] < matrix.length && coordinates[1] < matrix[0].length) {
      return true;
    } else return false;
  };

  // Uses DFS to find all cells touching a clicked coordinate
  const findAllTouchingCells = (matrix: number[][], coords: number[]) => {
    const coordValue = matrix[coords[0]][coords[1]]; // Find coord value on matrix

    if (coordValue === 2) {
      // If valid
      const visited = [];
      const stack = [];
      const memory = []; // Holds all unique coords visited

      stack.push(coords); // Add first coordinate to stack

      while (stack.length > 0) {
        const center: number[] = stack[stack.length - 1]; // Current center is top of stack

        visited.push(center); // Add center to list of visited coords

        // Get right coord
        const rightCoord = [center[0], center[1] + 1];
        // Get left coord
        const leftCoord = [center[0], center[1] - 1];
        // Get up coord
        const upCoord = [center[0] - 1, center[1]];
        // Get down coord
        const downCoord = [center[0] + 1, center[1]];

        if (
          withinMatrixBounds(matrix, rightCoord) && // Check coordinate is within matrix bounds
          !!matrix[rightCoord[0]] &&
          !!matrix[rightCoord[0]][rightCoord[1]] &&
          !arrayInArray(visited, rightCoord) // Check coordinate has not been visited
        ) {
          stack.push(rightCoord); // Push coordinate to stack to be accessed next
        } else if (
          withinMatrixBounds(matrix, leftCoord) && // Check coordinate is within matrix bounds
          !!matrix[leftCoord[0]] &&
          !!matrix[leftCoord[0]][leftCoord[1]] &&
          !arrayInArray(visited, leftCoord) // Check coordinate has not been visited
        ) {
          stack.push(leftCoord); // Push coordinate to stack to be accessed next
        } else if (
          withinMatrixBounds(matrix, upCoord) && // Check coordinate is within matrix bounds
          !!matrix[upCoord[0]] &&
          !!matrix[upCoord[0]][upCoord[1]] &&
          !arrayInArray(visited, upCoord) // Check coordinate has not been visited
        ) {
          stack.push(upCoord); // Push coordinate to stack to be accessed next
        } else if (
          withinMatrixBounds(matrix, downCoord) && // Check coordinate is within matrix bounds
          !!matrix[downCoord[0]] &&
          !!matrix[downCoord[0]][downCoord[1]] &&
          !arrayInArray(visited, downCoord) // Check coordinate has not been visited
        ) {
          stack.push(downCoord); // Push coordinate to stack to be accessed next
        } else {
          stack.pop(); // No unvisited touching coords -> pop off stack
        }

        if (!arrayInArray(memory, center)) {
          memory.push(center); // Add coord to memory
        }
      }

      return memory;
    }
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
