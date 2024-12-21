import { useState } from "react";
import { useMatrixOperations } from "./useMatrixOperations";
import { initialShapePosition } from "../utils/constants";
import { useBoardLogic } from "./useBoardLogic";

export interface IPlayersState {
  [key: number]: {
    score: number;
    playedShapes: number[][][];
  };
}

export const useBoardState = () => {
  const { createEmptyMatrix, checkMatrixEmpty } = useMatrixOperations();
  const {
    countShapesOnGrid,
    checkStartingCoords,
    traceGameGrid,
    checkCorrectPlacementOnBoard,
    countScoreOnGrid,
  } = useBoardLogic();

  const gameGridSize = 13;
  const initialPlayersState = {
    1: { score: 0, playedShapes: [] },
    2: { score: 0, playedShapes: [] },
    3: { score: 0, playedShapes: [] },
    4: { score: 0, playedShapes: [] },
  };

  const [gameGrid, setGameGrid] = useState<number[][]>(
    createEmptyMatrix(gameGridSize, gameGridSize)
  );
  const [playersState, setPlayersState] =
    useState<IPlayersState>(initialPlayersState);
  const [shapePosition, setShapePosition] = useState(initialShapePosition);
  const [cursorInGrid, setCursorInGrid] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<number[]>([]);
  const [clickedShapeCoords, setClickedShapeCoords] = useState<number[]>([]);

  const updateGameGrid = (newGrid: number[][]) => setGameGrid(newGrid);

  const updatePlayerScore = (newScore: number, playerNumber: number) => {
    const playersStateCopy = { ...playersState };
    playersStateCopy[playerNumber].score = newScore;
    setPlayersState(playersStateCopy);
  };

  const hideGamePiece = (gamePiece: number[][], playerNumber: number) => {
    const playersStateCopy = { ...playersState };
    const playerPlayedShapesCopy = [
      ...playersStateCopy[playerNumber].playedShapes,
    ];
    playerPlayedShapesCopy.push(gamePiece);
    playersStateCopy[playerNumber].playedShapes = playerPlayedShapesCopy;
    setPlayersState(playersStateCopy);
  };

  const resetShapePosition = () => {
    setShapePosition(initialShapePosition);
  };

  const updateCursorInGrid = (bool: boolean) => setCursorInGrid(bool);

  const updateCurrentCoords = (newCoords: number[]) =>
    setCurrentCoords(newCoords);

  const updateClickedShapeCoords = (newCoords: number[]) =>
    setClickedShapeCoords(newCoords);

  const resetGameGrid = () =>
    setGameGrid(createEmptyMatrix(gameGridSize, gameGridSize));

  const resetPlayersState = () => setPlayersState(initialPlayersState);

  const placePieceOnGrid = (
    gameGridCopy: number[][],
    coordsOnGrid: number[],
    gamePiece: number[][],
    clickedShapeCoord: number[],
    currentScore: number,
    currentPlayer: number
  ) => {
    // Work out how much to go up
    const goUp = coordsOnGrid[0] - clickedShapeCoord[0];

    // Work out how much to go left
    const goLeft = coordsOnGrid[1] - clickedShapeCoord[1];

    const startingCoord = [goUp, goLeft];

    if (!isNaN(startingCoord[0]) && !isNaN(startingCoord[1]) && cursorInGrid) {
      const startingTurn = checkMatrixEmpty(gameGrid, currentPlayer);

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
            gameGridCopy[startingCoord[0] + i][startingCoord[1] + j] =
              1 * currentPlayer;
          }
        }
      }

      if (!startingTurn) {
        const amountOfShapes = countShapesOnGrid(gameGridCopy, currentPlayer);
        if (
          amountOfShapes !==
          playersState[currentPlayer].playedShapes.length + 1
        ) {
          resetShapePosition();
          return { updatedGameGrid: null, updatedScore: null };
        }

        const startingCoord = [gameGridCopy.length - 1, 0];
        const tracedCoords = traceGameGrid(
          gameGridCopy,
          startingCoord,
          currentPlayer
        );

        if (
          !checkCorrectPlacementOnBoard(
            gameGridCopy,
            tracedCoords,
            currentPlayer
          )
        ) {
          resetShapePosition();
          return { updatedGameGrid: null, updatedScore: null };
        }
      }

      const updatedGameGrid = gameGridCopy;
      const updatedScore = currentScore + scoreToAdd;
      const newScore = countScoreOnGrid(gameGridCopy, currentPlayer);

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
    playersState,
    updatePlayerScore,
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
    resetGameGrid,
    resetPlayersState,
  };
};
