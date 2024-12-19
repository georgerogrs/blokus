import React, { useCallback, useEffect, useState } from "react";

import GameGrid from "./components/GameGrid";
import Shape from "./components/Shape";
import ShapeContainer from "./components/ShapeContainer";
import { usePieceLogic } from "./hooks/usePieceLogic";
import { SHAPES } from "./utils/shapes";
import { useMatrixOperations } from "./hooks/useMatrixOperations";
import { useBoardState } from "./hooks/useBoardState";

const Game = () => {
  const { deepCopyMatrix } = useMatrixOperations();
  const {
    gameGrid,
    updateGameGrid,
    userScores,
    updateUserScore,
    hiddenGamePieces,
    hideGamePiece,
    shapePosition,
    updateCursorInGrid,
    currentCoords,
    updateCurrentCoords,
    clickedShapeCoords,
    updateClickedShapeCoords,
    placePieceOnGrid,
  } = useBoardState();
  const { rotateGamePiece, randomRotatePiece } = usePieceLogic();

  const [blockClicked, setBlockClicked] = useState<boolean>(false);
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);

  const [currentPlayer, setCurrentPlayer] = useState(1);

  const changeTurn = useCallback(() => {
    switch (currentPlayer) {
      case 1:
        setCurrentPlayer(2);
        break;
      case 2:
        setCurrentPlayer(3);
        break;
      case 3:
        setCurrentPlayer(4);
        break;
      case 4:
        setCurrentPlayer(1);
        break;
    }
  }, [currentPlayer]);

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

  useEffect(() => {
    const handleBlockHoldMouseUp = (event: MouseEvent) => {
      if (blockClicked) {
        const gameGridCopy = deepCopyMatrix(gameGrid);

        const { updatedGameGrid, updatedScore } = placePieceOnGrid(
          gameGridCopy,
          currentCoords,
          selectedGamePiece,
          clickedShapeCoords,
          userScores[currentPlayer],
          currentPlayer
        );

        // updatedGameGrid not null -> place piece success
        if (!!updatedGameGrid) {
          updateUserScore(currentPlayer, updatedScore); // Update score
          updateGameGrid(rotateGamePiece(updatedGameGrid)); // Update gameGrid
          hideGamePiece(selectedGamePiece); // Hide placed piece
          changeTurn();
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
    gameGrid,
    currentCoords,
    selectedGamePiece,
    clickedShapeCoords,
    currentPlayer,
    userScores,
    deepCopyMatrix,
    hideGamePiece,
    placePieceOnGrid,
    updateGameGrid,
    rotateGamePiece,
    changeTurn,
    updateUserScore,
  ]);

  useEffect(() => {
    console.log("userScores:", userScores);
  }, [userScores]);

  return (
    <>
      <div className="w-screen flex flex-col justify-center items-center mt-6">
        <GameGrid
          gameGrid={gameGrid}
          handleGridSquareEnter={handleGridSquareEnter}
          handleGridEnter={handleGridEnter}
          handleGridLeave={handleGridLeave}
        />
        <h6 style={{ color: "white", fontSize: 20, marginBlock: 10 }}>
          Score: {userScores[currentPlayer]}
        </h6>
      </div>

      <ShapeContainer>
        {currentPlayer === 1 &&
          Object.entries(SHAPES).map(([name, gamePiece]) => (
            <div key={name} style={{ margin: 20 }}>
              <Shape
                type={randomRotatePiece(gamePiece)}
                rotateGamePiece={rotateGamePiece}
                hiddenGamePieces={hiddenGamePieces}
                handleBlockClick={handleBlockClick}
                position={shapePosition}
                color={"red"}
              />
            </div>
          ))}
        {currentPlayer === 2 &&
          Object.entries(SHAPES).map(([name, gamePiece]) => (
            <div key={name} style={{ margin: 20 }}>
              <Shape
                type={randomRotatePiece(gamePiece)}
                rotateGamePiece={rotateGamePiece}
                hiddenGamePieces={hiddenGamePieces}
                handleBlockClick={handleBlockClick}
                position={shapePosition}
                color={"blue"}
              />
            </div>
          ))}
        {currentPlayer === 3 &&
          Object.entries(SHAPES).map(([name, gamePiece]) => (
            <div key={name} style={{ margin: 20 }}>
              <Shape
                type={randomRotatePiece(gamePiece)}
                rotateGamePiece={rotateGamePiece}
                hiddenGamePieces={hiddenGamePieces}
                handleBlockClick={handleBlockClick}
                position={shapePosition}
                color={"green"}
              />
            </div>
          ))}
        {currentPlayer === 4 &&
          Object.entries(SHAPES).map(([name, gamePiece]) => (
            <div key={name} style={{ margin: 20 }}>
              <Shape
                type={randomRotatePiece(gamePiece)}
                rotateGamePiece={rotateGamePiece}
                hiddenGamePieces={hiddenGamePieces}
                handleBlockClick={handleBlockClick}
                position={shapePosition}
                color={"yellow"}
              />
            </div>
          ))}
      </ShapeContainer>
    </>
  );
};

export default Game;
