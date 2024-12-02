import React, { useEffect, useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid";
import Shape from "./components/Shape";
import ShapeContainer from "./components/ShapeContainer";
import {
  L_PIECE,
  T_PIECE,
  ZIG_PIECE,
  PLUS_PIECE,
  SQUARE_PIECE,
} from "./gameSettings";
import { useGamePieceOperations } from "./hooks/useGamePieceOperations";
import { useArrayOperations } from "./hooks/useArrayOperations";

const createGameGrid = (width: number, height: number) => {
  const grid = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
};

function App() {
  const { withinMatrixBounds } = useArrayOperations();
  const { rotateGamePiece } = useGamePieceOperations();

  const [gameGrid, setGameGrid] = useState<number[][]>(createGameGrid(20, 20));
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);
  const [hiddenGamePieces, setHiddenGamePieces] = useState<number[][][]>([]);
  const [currentCoords, setCurrentCoords] = useState<number[]>([]);
  const [blockClicked, setBlockClicked] = useState<boolean>(false);
  const [clickedShapeCoords, setClickedShapeCoords] = useState<number[]>([]);

  const handleGridSquareEnter = (coords: number[]) => {
    if (coords) {
      setCurrentCoords(coords);
    }
  };

  const handleGridSquareLeave = (coords: number[]) => {
    console.log("prevCoords", currentCoords);
    console.log("coords", coords);
  };

  const placePieceOnGrid = (
    gameGridCopy: number[][],
    coordsOnGrid: number[],
    gamePiece: number[][],
    clickedShapeCoord: number[]
  ) => {
    // Work out how much to go up
    const goUp = coordsOnGrid[0] - clickedShapeCoord[0];

    // Work out how much to go left
    const goLeft = coordsOnGrid[1] - clickedShapeCoord[1];

    const startingCoord = [goUp, goLeft];

    console.log("startingCoord:", startingCoord);

    if (!isNaN(startingCoord[0]) && !isNaN(startingCoord[1])) {
      // Place gamePiece from starting coordinate
      for (let i = 0; i < gamePiece.length; i++) {
        for (let j = 0; j < gamePiece[i].length; j++) {
          if (gamePiece[i][j] === 1) {
            if (!gameGridCopy[startingCoord[0] + i]) return false;

            gameGridCopy[startingCoord[0] + i][startingCoord[1] + j] = 1;
          }
        }
      }

      return gameGridCopy;
    } else return false;
  };

  const handleBlockClick = (gamePiece: number[][], shapeCoords: number[]) => {
    setBlockClicked(true);
    setSelectedGamePiece(gamePiece);
    setClickedShapeCoords(shapeCoords);
  };

  useEffect(() => {
    const handleBlockMouseUp = (event: MouseEvent) => {
      if (blockClicked) {
        const gameGridCopy = placePieceOnGrid(
          [...gameGrid],
          currentCoords,
          selectedGamePiece,
          clickedShapeCoords
        );
        if (gameGridCopy) {
          setGameGrid(gameGridCopy);

          const hiddenGamePiecesCopy = [...hiddenGamePieces];
          hiddenGamePiecesCopy.push(selectedGamePiece);
          setHiddenGamePieces(hiddenGamePiecesCopy);
        }

        setBlockClicked(false);
      }
    };

    if (blockClicked) {
      // Add the mouseup event listener when block is clicked
      window.addEventListener("mouseup", handleBlockMouseUp);
    } else {
      // Remove the event listener when blockClicked is false
      window.removeEventListener("mouseup", handleBlockMouseUp);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("mouseup", handleBlockMouseUp);
    };
  }, [
    blockClicked,
    selectedGamePiece,
    currentCoords,
    clickedShapeCoords,
    gameGrid,
    hiddenGamePieces,
  ]);

  useEffect(() => {
    console.log("gameGrid", gameGrid);
  }, [gameGrid]);

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <GameGrid
          gameGrid={gameGrid}
          handleGridSquareEnter={handleGridSquareEnter}
          handleGridSquareLeave={handleGridSquareLeave}
        />

        <ShapeContainer>
          <Shape
            type={L_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
          />
          <Shape
            type={T_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
          />
          <Shape
            type={ZIG_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
          />
          <Shape
            type={PLUS_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
          />
          <Shape
            type={SQUARE_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
          />
        </ShapeContainer>
      </div>
    </>
  );
}

export default App;
