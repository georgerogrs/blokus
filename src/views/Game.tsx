import React, { useCallback, useEffect, useState } from "react";

import GameGrid from "../components/GameGrid";
import Shape from "../components/Shape";
import ShapeContainer from "../components/ShapeContainer";
import { usePieceLogic } from "../hooks/usePieceLogic";
import { SHAPES } from "../utils/shapes";
import { useMatrixOperations } from "../hooks/useMatrixOperations";
import { useBoardState } from "../hooks/useBoardState";

const Game = () => {
  const { deepCopyMatrix } = useMatrixOperations();
  const {
    gameGrid,
    updateGameGrid,
    playersState,
    updatePlayerScore,
    hideGamePiece,
    shapePosition,
    updateCursorInGrid,
    currentCoords,
    updateCurrentCoords,
    clickedShapeCoords,
    updateClickedShapeCoords,
    placePieceOnGrid,
    resetGameGrid,
    resetPlayersState,
  } = useBoardState();
  const { turnPiece, randomRotatePiece } = usePieceLogic();

  const [blockClicked, setBlockClicked] = useState<boolean>(false);
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);
  const initialPlayersInGame = [1, 2, 3, 4];
  const [playersInGame, setPlayersInGame] =
    useState<number[]>(initialPlayersInGame);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const resetPlayersInGame = () => setPlayersInGame(initialPlayersInGame);

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
    setPlayersInGame(playersInGameCopy);
    const positionsToRotate = changeTurn(currentPlayer);
    updateGameGrid(turnPiece(gameGrid, positionsToRotate));
  };

  const handleGridEnter = () => {
    updateCursorInGrid(true);
  };

  const handleGridLeave = () => {
    updateCursorInGrid(false);
  };

  const handleGridSquareEnter = (coords: number[]) => {
    if (coords) {
      updateCurrentCoords(coords);
    }
  };

  const handleBlockClick = (gamePiece: number[][], shapeCoords: number[]) => {
    setBlockClicked(true);
    setSelectedGamePiece(gamePiece);
    updateClickedShapeCoords(shapeCoords);
  };

  const handleRestartGame = () => {
    setCurrentPlayer(1);
    resetGameGrid();
    resetPlayersState();
    resetPlayersInGame();
  };

  useEffect(() => {
    const handleBlockHoldMouseUp = (event: MouseEvent) => {
      if (blockClicked) {
        const gameGridCopy = deepCopyMatrix(gameGrid);

        const { updatedGameGrid, updatedScore } = placePieceOnGrid(
          gameGridCopy,
          currentCoords,
          selectedGamePiece,
          clickedShapeCoords,
          playersState[currentPlayer].score,
          currentPlayer
        );

        // updatedGameGrid not null -> place piece success
        if (!!updatedGameGrid) {
          updatePlayerScore(updatedScore, currentPlayer); // Update score
          hideGamePiece(selectedGamePiece, currentPlayer); // Hide placed piece
          const positionsToRotate = changeTurn(currentPlayer);
          updateGameGrid(turnPiece(updatedGameGrid, positionsToRotate)); // Update gameGrid
        }

        setBlockClicked(false);
      }
    };

    if (blockClicked) {
      // Add the mouseup event listener when block is clicked
      window.addEventListener("mouseup", handleBlockHoldMouseUp);
    } else {
      // Remove the event listener when blockClicked is false
      window.removeEventListener("mouseup", handleBlockHoldMouseUp);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("mouseup", handleBlockHoldMouseUp);
    };
  }, [
    blockClicked,
    changeTurn,
    clickedShapeCoords,
    currentCoords,
    currentPlayer,
    deepCopyMatrix,
    gameGrid,
    hideGamePiece,
    placePieceOnGrid,
    playersState,
    selectedGamePiece,
    turnPiece,
    updateGameGrid,
    updatePlayerScore,
  ]);

  return (
    <>
      <div className="w-screen flex flex-col justify-center items-center mt-3">
        <GameGrid
          gameGrid={gameGrid}
          handleGridSquareEnter={handleGridSquareEnter}
          handleGridEnter={handleGridEnter}
          handleGridLeave={handleGridLeave}
        />
        {playersState[currentPlayer] && (
          <h6 className="text-white text-[20px] my-2.5">
            Score: {playersState[currentPlayer].score}
          </h6>
        )}
        <button
          onClick={() => handleGiveUpTurn(currentPlayer)}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          type="button"
        >
          Give up
        </button>
      </div>

      {playersState[currentPlayer] && (
        <ShapeContainer>
          {Object.entries(SHAPES).map(([name, gamePiece]) => (
            <div key={name} style={{ margin: 20 }}>
              <Shape
                type={randomRotatePiece(gamePiece)}
                playerNumber={currentPlayer}
                playersState={playersState}
                handleBlockClick={handleBlockClick}
                position={shapePosition}
              />
            </div>
          ))}
        </ShapeContainer>
      )}
      {playersInGame.length < 1 && (
        <div className="fixed top-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-50 z-20">
          <div
            className="absolute top-1/3 py-7 px-7 rounded bg-opacity-100"
            style={{ backgroundColor: "#282c34" }}
          >
            <h1 className="text-white my-2.5">Game Over</h1>
            <button
              onClick={() => {
                handleRestartGame();
              }}
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
              type="button"
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Game;
