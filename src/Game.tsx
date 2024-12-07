import React, { useEffect, useState } from "react";

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
    score,
    updateScore,
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
          score
        );

        // updatedGameGrid not null -> place piece success
        if (!!updatedGameGrid) {
          updateScore(updatedScore); // Update score
          updateGameGrid(updatedGameGrid); // Update gameGrid
          hideGamePiece(selectedGamePiece); // Hide placed piece
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
    score,
    deepCopyMatrix,
    hideGamePiece,
    placePieceOnGrid,
    updateGameGrid,
    updateScore,
  ]);

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
          Score: {score}
        </h6>
      </div>

      <ShapeContainer>
        {Object.entries(SHAPES).map(([name, gamePiece]) => (
          <div key={name} style={{ margin: 20 }}>
            <Shape
              type={randomRotatePiece(gamePiece)}
              rotateGamePiece={rotateGamePiece}
              hiddenGamePieces={hiddenGamePieces}
              handleBlockClick={handleBlockClick}
              position={shapePosition}
            />
          </div>
        ))}
      </ShapeContainer>
    </>
  );
};

export default Game;
