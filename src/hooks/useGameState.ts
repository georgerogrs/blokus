import { useCallback, useState } from "react";
import { useMatrixOperations } from "./useMatrixOperations";
import { initialShapePosition } from "../utils/constants";
import { useBoardLogic } from "./useBoardLogic";
import { useWinner } from "./useWinner";
import { usePieceLogic } from "../hooks/usePieceLogic";

export interface IPlayersState {
  [key: number]: {
    score: number;
    playedShapes: number[][][];
  };
}

export const useGameState = () => {
  const { createEmptyMatrix, checkMatrixEmpty } = useMatrixOperations();
  const { turnPiece } = usePieceLogic();
  const {
    countShapesOnGrid,
    checkStartingCoords,
    traceGameGrid,
    checkCorrectPlacementOnBoard,
    countScoreOnGrid,
  } = useBoardLogic();
  const { findWinner } = useWinner();

  const gameGridSize = 17;
  const initialPlayersState = {
    1: { score: 0, playedShapes: [] },
    2: { score: 0, playedShapes: [] },
    3: { score: 0, playedShapes: [] },
    4: { score: 0, playedShapes: [] },
  };
  const initialPlayersInGame = [1, 2, 3, 4];
  const lastPlayer = initialPlayersInGame[initialPlayersInGame.length - 1];

  const [gameGrid, setGameGrid] = useState<number[][]>(
    createEmptyMatrix(gameGridSize, gameGridSize)
  );
  const [playersState, setPlayersState] =
    useState<IPlayersState>(initialPlayersState);
  const [shapePosition, setShapePosition] = useState(initialShapePosition);
  const [cursorInGrid, setCursorInGrid] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<number[]>([]);
  const [clickedShapeCoords, setClickedShapeCoords] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [playersInGame, setPlayersInGame] =
    useState<number[]>(initialPlayersInGame);
  const [winner, setWinner] = useState<number | null>(null);
  const [winningScore, setWinningScore] = useState<number>(0);
  const [turnNumber, setTurnNumber] = useState<number>(1);

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

  const resetPlayersInGame = () => setPlayersInGame(initialPlayersInGame);

  const placePieceOnGrid = (
    gameGridCopy: number[][],
    coordsOnGrid: number[],
    gamePiece: number[][],
    clickedShapeCoord: number[],
    currentScore: number,
    currentPlayer: number
  ) => {
    console.log("coordsOnGrid:", coordsOnGrid);
    console.log("clickedShapeCoord:", clickedShapeCoord);

    // Work out how much to go up
    const goUp = coordsOnGrid[0] - clickedShapeCoord[0];

    // Work out how much to go left
    const goLeft = coordsOnGrid[1] - clickedShapeCoord[1];

    console.log("goUp:", goUp);
    console.log("goLeft:", goLeft);

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
          console.error("Not a valid starting position");
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
      console.error("Piece is placed outside the bounds of the board");
      resetShapePosition();
      return { updatedGameGrid: null, updatedScore: null };
    }
  };

  const changeTurn = useCallback(
    (currentPlayer: number) => {
      if (playersInGame.indexOf(currentPlayer) + 1 === playersInGame.length) {
        setCurrentPlayer(playersInGame[0]);
        return playersInGame[0];
      } else {
        const positionsToRotate =
          playersInGame[playersInGame.indexOf(currentPlayer) + 1] -
          currentPlayer;
        setCurrentPlayer(
          playersInGame[playersInGame.indexOf(currentPlayer) + 1]
        );
        return positionsToRotate;
      }
    },
    [playersInGame]
  );

  const handleGiveUpTurn = (currentPlayer: number) => {
    const playersInGameCopy = playersInGame.filter(
      (value) => value !== currentPlayer
    );
    if (playersInGame.length === 1) {
      const winner = findWinner(playersState);
      setWinner(winner.playerNumber);
      setWinningScore(winner.score);
    }
    setPlayersInGame(playersInGameCopy);
    const positionsToRotate = changeTurn(currentPlayer);
    updateGameGrid(turnPiece(gameGrid, positionsToRotate));
  };

  const handleRestartGame = () => {
    setCurrentPlayer(1);
    resetGameGrid();
    resetPlayersState();
    resetPlayersInGame();
    setTurnNumber(1);
  };

  const incrementTurn = useCallback(() => {
    setTurnNumber(turnNumber + 1);
  }, [turnNumber]);

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
    currentPlayer,
    changeTurn,
    lastPlayer,
    resetPlayersInGame,
    winner,
    winningScore,
    incrementTurn,
    playersInGame,
    turnNumber,
    handleGiveUpTurn,
    handleRestartGame,
  };
};
