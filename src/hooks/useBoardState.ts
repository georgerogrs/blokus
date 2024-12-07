import { useState } from "react";
import { useMatrixOperations } from "./useMatrixOperations";
import { initialShapePosition } from "../utils/constants";
import { useBoardLogic } from "./useBoardLogic";

export const useBoardState = () => {
  const { createEmptyMatrix, checkMatrixEmpty } = useMatrixOperations();
  const {
    countShapesOnGrid,
    checkStartingCoords,
    findGapsInGrid,
    traceGameGrid,
    checkCorrectPlacementOnBoard,
    countScoreOnGrid,
  } = useBoardLogic();

  const [gameGrid, setGameGrid] = useState<number[][]>(
    createEmptyMatrix(20, 20)
  );
  const [score, setScore] = useState<number>(0);
  const [hiddenGamePieces, setHiddenGamePieces] = useState<number[][][]>([]);
  const [shapePosition, setShapePosition] = useState(initialShapePosition);
  const [cursorInGrid, setCursorInGrid] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<number[]>([]);
  const [clickedShapeCoords, setClickedShapeCoords] = useState<number[]>([]);

  const updateGameGrid = (newGrid: number[][]) => setGameGrid(newGrid);

  const updateScore = (newScore: number) => setScore(newScore);

  const hideGamePiece = (gamePiece: number[][]) => {
    setHiddenGamePieces([...hiddenGamePieces, gamePiece]);
  };

  const resetShapePosition = () => {
    setShapePosition(initialShapePosition);
  };

  const updateCursorInGrid = (bool: boolean) => setCursorInGrid(bool);

  const updateCurrentCoords = (newCoords: number[]) =>
    setCurrentCoords(newCoords);

  const updateClickedShapeCoords = (newCoords: number[]) =>
    setClickedShapeCoords(newCoords);

  const placePieceOnGrid = (
    gameGridCopy: number[][],
    coordsOnGrid: number[],
    gamePiece: number[][],
    clickedShapeCoord: number[],
    currentScore: number
  ) => {
    // Work out how much to go up
    const goUp = coordsOnGrid[0] - clickedShapeCoord[0];

    // Work out how much to go left
    const goLeft = coordsOnGrid[1] - clickedShapeCoord[1];

    const startingCoord = [goUp, goLeft];

    if (!isNaN(startingCoord[0]) && !isNaN(startingCoord[1]) && cursorInGrid) {
      const startingTurn = checkMatrixEmpty(gameGrid);
      if (startingTurn) {
        const validStartingPoint = checkStartingCoords(
          gameGridCopy,
          gamePiece,
          startingCoord
        );
        if (!validStartingPoint) {
          resetShapePosition();
          return { updatedGameGrid: null, updatedScore: null };
        }
      }

      let scoreToAdd = 0;
      // Place gamePiece from starting coordinate
      for (let i = 0; i < gamePiece.length; i++) {
        for (let j = 0; j < gamePiece[i].length; j++) {
          if (gamePiece[i][j] === 1) {
            scoreToAdd++;
            if (!gameGridCopy[startingCoord[0] + i])
              return { updatedGameGrid: null, updatedScore: null };
            if (gameGridCopy[startingCoord[0] + i][startingCoord[1] + j] !== 0)
              return { updatedGameGrid: null, updatedScore: null };
            gameGridCopy[startingCoord[0] + i][startingCoord[1] + j] = 1;
          }
        }
      }

      if (!startingTurn) {
        const amountOfShapes = countShapesOnGrid(gameGridCopy);
        if (amountOfShapes !== hiddenGamePieces.length + 1) {
          resetShapePosition();
          return { updatedGameGrid: null, updatedScore: null };
        }

        if (findGapsInGrid(gameGridCopy)) {
          resetShapePosition();
          return { updatedGameGrid: null, updatedScore: null };
        }

        const tracedCoords = traceGameGrid(gameGridCopy, [
          gameGridCopy.length - 1,
          0,
        ]);

        if (!checkCorrectPlacementOnBoard(gameGridCopy, tracedCoords)) {
          resetShapePosition();
          return { updatedGameGrid: null, updatedScore: null };
        }
      }

      const updatedGameGrid = gameGridCopy;
      const updatedScore = currentScore + scoreToAdd;
      const newScore = countScoreOnGrid(gameGridCopy);

      if (newScore !== updatedScore) {
        resetShapePosition();
        return { updatedGameGrid: null, updatedScore: null };
      }

      return { updatedGameGrid, updatedScore };
    } else {
      resetShapePosition();
      return { updatedGameGrid: null, updatedScore: null };
    }
  };

  return {
    gameGrid,
    updateGameGrid,
    score,
    updateScore,
    hiddenGamePieces,
    hideGamePiece,
    shapePosition,
    resetShapePosition,
    cursorInGrid,
    updateCursorInGrid,
    currentCoords,
    updateCurrentCoords,
    clickedShapeCoords,
    updateClickedShapeCoords,
    placePieceOnGrid,
  };
};
