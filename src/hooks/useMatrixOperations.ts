export const useMatrixOperations = () => {
  const arraysEqual = (a: number[], b: number[]) => {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const arrayInMatrix = (parent: number[][], child: number[]) => {
    let isMatch = false;
    parent.forEach((subArray) => {
      if (arraysEqual(subArray, child)) {
        isMatch = true;
      }
    });

    return isMatch;
  };

  const withinMatrixBounds = (matrix: number[][], coordinates: number[]) => {
    if (coordinates[0] < matrix.length && coordinates[1] < matrix[0].length) {
      return true;
    } else return false;
  };

  const deepCopyMatrix = (matrix: number[][]) => matrix.map((row) => [...row]);

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

      if (!arrayInMatrix(visited, center)) {
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
            !arrayInMatrix(visited, direction) // Ensure the coordinate has not been visited
          ) {
            stack.push(direction); // Push coordinate to stack to be accessed next
          }
        }

        // Add coord to memory if not already present
        if (!arrayInMatrix(memory, center)) {
          memory.push(center);
        }
      }
    }

    return memory; // Return all the collected coordinates
  };

  const sortMatrix = (matrix: number[][]) => {
    for (let i = 0; i < matrix.length; i++) {
      matrix.sort((a, b) => a[i] - b[i]);
    }
    return matrix;
  };

  const checkMatricesMatch = (matrixA: number[][], matrixB: number[][]) => {
    // Sort matrices
    const sortedMatrixA = sortMatrix([...matrixA]);
    const sortedMatrixB = sortMatrix([...matrixB]);

    for (let i = 0; i < sortedMatrixA.length; i++) {
      for (let j = 0; j < sortedMatrixA[i].length; j++) {
        if (sortedMatrixB[i][j] !== sortedMatrixA[i][j]) {
          return false;
        }
      }
    }

    return true;
  };

  const createEmptyMatrix = (width: number, height: number) => {
    const grid = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push(0);
      }
      grid.push(row);
    }
    return grid;
  };

  const checkMatrixEmpty = (matrix: number[][], num: number) => {
    let isEmpty = true;
    let numberToCheck = 1;
    if (num) numberToCheck = num;
    matrix.forEach((row) =>
      row.forEach((cell) => {
        if (cell === numberToCheck) {
          isEmpty = false;
        }
      })
    );

    return isEmpty;
  };

  return {
    arrayInMatrix,
    withinMatrixBounds,
    deepCopyMatrix,
    findAllTouchingCells,
    sortMatrix,
    checkMatricesMatch,
    createEmptyMatrix,
    checkMatrixEmpty,
  };
};
