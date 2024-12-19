import { useCoordinateOperations } from "./useCoordinateOperations";
import { useMatrixOperations } from "./useMatrixOperations";
import { usePieceLogic } from "./usePieceLogic";

export const useBoardLogic = () => {
  const {
    checkMatricesMatch,
    findAllTouchingCells,
    withinMatrixBounds,
    arrayInMatrix,
  } = useMatrixOperations();
  const { rotateGamePiece } = usePieceLogic();
  const { getCoordDiagonals } = useCoordinateOperations();

  const countShapesOnGrid = (gameGrid: number[][], currentPlayer: number) => {
    const piecesOnBoard: number[][][] = [];

    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < gameGrid[0].length; j++) {
        if (gameGrid[i][j] === currentPlayer) {
          const touchingCells = findAllTouchingCells(
            gameGrid,
            [i, j],
            currentPlayer
          );

          let pieceAccountedFor = false;
          for (let k = 0; k < piecesOnBoard.length; k++) {
            if (checkMatricesMatch(piecesOnBoard[k], touchingCells)) {
              pieceAccountedFor = true;
            }
          }
          if (!pieceAccountedFor) piecesOnBoard.push(touchingCells);
        }
      }
    }

    return piecesOnBoard.length;
  };

  const checkStartingCoords = (
    gameGrid: number[][],
    gamePiece: number[][],
    startingCoord: number[]
  ) => {
    if (
      startingCoord[0] === gameGrid.length - gamePiece.length &&
      startingCoord[1] === 0 && // Starting coords
      gamePiece[gamePiece.length - 1][0] === 1 // Corner of game piece is  filled
    ) {
      return true;
    }
    return false;
  };

  const findGapsInGridRows = (gameGrid: number[][]) => {
    let prevRowFilled = true;
    for (let i = gameGrid.length - 1; i >= 0; i--) {
      const rowFilled = gameGrid[i].some((cell) => cell === 1);
      if (!prevRowFilled && rowFilled) return true;
      prevRowFilled = rowFilled;
    }
    return false;
  };

  const findGapsInGridColumns = (gameGrid: number[][]) => {
    const rotatedGameGrid = rotateGamePiece(
      rotateGamePiece(rotateGamePiece(gameGrid))
    );
    return findGapsInGridRows(rotatedGameGrid);
  };

  const findGapsInGrid = (gameGrid: number[][]) => {
    const gapsInRows = findGapsInGridRows(gameGrid);
    const gapsInColumns = findGapsInGridColumns(gameGrid);

    return gapsInRows || gapsInColumns;
  };

  const countScoreOnGrid = (gameGrid: number[][], currentPlayer: number) => {
    let score = 0;
    gameGrid.forEach((row) =>
      row.forEach((cell) => {
        if (cell === currentPlayer) {
          score += 1;
        }
      })
    );

    return score;
  };

  const traceGameGrid = (
    gameGrid: number[][],
    startingCoord: number[],
    currentPlayer: number
  ) => {
    const visitedCells = findAllTouchingCells(
      gameGrid,
      startingCoord,
      currentPlayer
    );

    let finalRun = false;
    while (!finalRun) {
      finalRun = true;
      // eslint-disable-next-line no-loop-func
      visitedCells.forEach((coord) => {
        const coordDiagonals = getCoordDiagonals(coord);
        const additionalCoords = coordDiagonals.filter((coord) => {
          if (
            coord[0] > 0 &&
            coord[1] > 0 &&
            withinMatrixBounds(gameGrid, coord)
          ) {
            if (
              !arrayInMatrix(visitedCells, coord) &&
              gameGrid[coord[0]][coord[1]] === currentPlayer
            ) {
              findAllTouchingCells(gameGrid, coord, currentPlayer).forEach(
                (coord) => visitedCells.push(coord)
              );
              return coord;
            }
          }
        });
        if (additionalCoords.length > 0) finalRun = false;
      });
    }

    return visitedCells;
  };

  const checkCorrectPlacementOnBoard = (
    gameGrid: number[][],
    coords: number[][],
    currentPlayer: number
  ) => {
    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < gameGrid[0].length; j++) {
        if (
          gameGrid[i][j] === currentPlayer &&
          !arrayInMatrix(coords, [i, j])
        ) {
          return false;
        }
      }
    }
    return true;
  };

  return {
    countShapesOnGrid,
    checkStartingCoords,
    findGapsInGrid,
    traceGameGrid,
    checkCorrectPlacementOnBoard,
    countScoreOnGrid,
  };
};
