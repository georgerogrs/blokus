import { useArrayOperations } from "./useArrayOperations";

export const useGameEngine = () => {
  const { arrayInArray } = useArrayOperations();

  const withinMatrixBounds = (matrix: number[][], coordinates: number[]) => {
    if (coordinates[0] < matrix.length && coordinates[1] < matrix[0].length) {
      return true;
    } else return false;
  };

  const findAllTouchingCells = (matrix: number[][], coords: number[]) => {
    const coordValue = matrix[coords[0]][coords[1]]; // Find coord value on matrix
    if (coordValue === 2) {
      // If valid

      const visited = [];
      const stack = [];
      const memory = [];

      stack.push(coords);

      while (stack.length > 0) {
        const center: number[] = stack[stack.length - 1];
        visited.push(center);

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
          matrix[rightCoord[0]][rightCoord[1]] &&
          !arrayInArray(visited, rightCoord) // Check coordinate has been visited
        ) {
          stack.push(rightCoord);
        } else if (
          withinMatrixBounds(matrix, leftCoord) && // Check coordinate is within matrix bounds
          matrix[leftCoord[0]][leftCoord[1]] &&
          !arrayInArray(visited, leftCoord) // Check coordinate has been visited
        ) {
          stack.push(leftCoord);
        } else if (
          withinMatrixBounds(matrix, upCoord) && // Check coordinate is within matrix bounds
          matrix[upCoord[0]][upCoord[1]] &&
          !arrayInArray(visited, upCoord) // Check coordinate has been visited
        ) {
          stack.push(upCoord);
        } else if (
          withinMatrixBounds(matrix, downCoord) && // Check coordinate is within matrix bounds
          matrix[downCoord[0]][downCoord[1]] &&
          !arrayInArray(visited, downCoord) // Check coordinate has been visited
        ) {
          stack.push(downCoord);
        } else {
          stack.pop();
        }
        if (!arrayInArray(memory, center)) {
          memory.push(center);
        }
      }

      return memory;
    }
  };

  return {
    findAllTouchingCells,
  };
};
