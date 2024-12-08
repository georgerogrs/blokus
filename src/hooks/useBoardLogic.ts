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

  const countShapesOnGrid = (gameGrid: number[][]) => {
    const piecesOnBoard: number[][][] = [];

    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < gameGrid[0].length; j++) {
        if (gameGrid[i][j] === 1) {
          const touchingCells = findAllTouchingCells(gameGrid, [i, j]);

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

  const countScoreOnGrid = (gameGrid: number[][]) => {
    let score = 0;
    gameGrid.forEach((row) =>
      row.forEach((cell) => {
        if (cell === 1) {
          score += 1;
        }
      })
    );

    return score;
  };

  const traceGameGrid = (gameGrid: number[][], startingCoord: number[]) => {
    const visitedCells = findAllTouchingCells(gameGrid, startingCoord);

    let hasNewCells = true;
    while (hasNewCells) {
      hasNewCells = false;
      for (let i = 0; i < visitedCells.length; i++) {
        const coord = visitedCells[i];
        const coordDiagonals = getCoordDiagonals(coord);
        for (const diagonal of coordDiagonals) {
          if (
            diagonal[0] >= 0 &&
            diagonal[1] >= 0 &&
            withinMatrixBounds(gameGrid, diagonal)
          ) {
            if (
              !arrayInMatrix(visitedCells, diagonal) &&
              gameGrid[diagonal[0]][diagonal[1]] === 1
            ) {
              const newCells = findAllTouchingCells(gameGrid, diagonal);
              newCells.forEach((cell) => visitedCells.push(cell));
              hasNewCells = true;
            }
          }
        }
      }
    }

    return visitedCells;
  };

  const checkCorrectPlacementOnBoard = (
    gameGrid: number[][],
    coords: number[][]
  ) => {
    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < gameGrid[0].length; j++) {
        if (gameGrid[i][j] === 1 && !arrayInMatrix(coords, [i, j])) {
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
