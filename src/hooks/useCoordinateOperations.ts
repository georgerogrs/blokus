export const useCoordinateOperations = () => {
  const getCoordDiagonals = (coord: number[]) => {
    const upperLeft: number[] = [coord[0] - 1, coord[1] - 1];
    const upperRight: number[] = [coord[0] - 1, coord[1] + 1];
    const lowerLeft: number[] = [coord[0] + 1, coord[1] - 1];
    const lowerRight: number[] = [coord[0] + 1, coord[1] + 1];

    return [upperLeft, upperRight, lowerLeft, lowerRight];
  };

  return { getCoordDiagonals };
};
