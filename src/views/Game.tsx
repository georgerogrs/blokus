import React, { useEffect, useState } from "react";
import GameGrid from "../components/GameGrid";
import Shape from "../components/Shape";
import ShapeContainer from "../components/ShapeContainer";
import { usePieceLogic } from "../hooks/usePieceLogic";
import { SHAPES } from "../utils/shapes";
import { useMatrixOperations } from "../hooks/useMatrixOperations";
import { useGameState } from "../hooks/useGameState";
import GameOverModal from "../components/Modal/GameOverModal/GameOverModal";
import GridDescriptor from "../components/GridDescriptor";
import { useGamePieceState } from "../hooks/useGamePieceState";

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
    placePieceOnGrid,
    currentPlayer,
    changeTurn,
    lastPlayer,
    winner,
    winningScore,
    incrementTurn,
    playersInGame,
    turnNumber,
    handleGiveUpTurn,
    handleRestartGame,
    updateClickedShapeCoords,
  } = useGameState();
  const { turnPiece, randomRotatePiece } = usePieceLogic();
  const {
    blockClicked,
    selectedGamePiece,
    handleBlockClick,
    resetBlockClicked,
    shuffleObject,
  } = useGamePieceState(updateClickedShapeCoords);

  const [mixedShapes] = useState(shuffleObject(SHAPES));
  const playerColor =
    currentPlayer === 1
      ? "red"
      : currentPlayer === 2
      ? "blue"
      : currentPlayer === 3
      ? "green"
      : currentPlayer === 4
      ? "yellow"
      : "unknown";

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
          let positionsToRotate = changeTurn(currentPlayer);
          if (playersInGame.length === 1) {
            positionsToRotate = 0;
          }
          updateGameGrid(turnPiece(updatedGameGrid, positionsToRotate)); // Update gameGrid
          if (currentPlayer === lastPlayer) {
            incrementTurn();
          }
        }

        resetBlockClicked();
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
    incrementTurn,
    lastPlayer,
    placePieceOnGrid,
    playersInGame,
    playersState,
    resetBlockClicked,
    selectedGamePiece,
    turnPiece,
    updateGameGrid,
    updatePlayerScore,
  ]);

  return (
    <div className="flex flex-row">
      <div className="w-screen flex flex-col justify-start items-center m-1 mt-3">
        <h6 className="text-white text-2xl font-bold drop-shadow-lg">
          Turn: {turnNumber}
        </h6>
        <GameGrid
          gameGrid={gameGrid}
          currentPlayer={currentPlayer}
          handleGridSquareEnter={handleGridSquareEnter}
          handleGridEnter={handleGridEnter}
          handleGridLeave={handleGridLeave}
        />
        <GridDescriptor
          playersState={playersState}
          currentPlayer={currentPlayer}
          playerColor={playerColor}
          gameGrid={gameGrid}
          handleGiveUpTurn={handleGiveUpTurn}
        />
      </div>

      {playersState[currentPlayer] && (
        <ShapeContainer>
          {Object.entries(mixedShapes).map(([name, gamePiece]) => (
            <div key={name} style={{ margin: 20 }}>
              <Shape
                type={randomRotatePiece(gamePiece)}
                playerNumber={currentPlayer}
                playersState={playersState}
                selectedGamePiece={selectedGamePiece}
                position={shapePosition}
                blockClicked={blockClicked}
                handleBlockClick={handleBlockClick}
              />
            </div>
          ))}
        </ShapeContainer>
      )}
      {playersInGame.length < 1 && (
        <GameOverModal
          winner={winner}
          winningScore={winningScore}
          handleRestartGame={handleRestartGame}
        />
      )}
    </div>
  );
};

export default Game;
