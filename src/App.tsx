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
  const { rotateGamePiece } = useGamePieceOperations();

  const [gameGrid, setGameGrid] = useState<number[][]>(createGameGrid(20, 20));
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);
  const [hiddenGamePieces, setHiddenGamePieces] = useState<number[][][]>([]);
  const [currentCoords, setCurrentCoords] = useState<number[]>([]);
  const [blockClicked, setBlockClicked] = useState<boolean>(false);
  const [clickedShapeCoords, setClickedShapeCoords] = useState<number[]>([]);
  const [cursorInGrid, setCursorInGrid] = useState<boolean>(false);
  const initialPosition = { x: 0, y: 0 };
  const [gamePieceDefaultPosition, setGamePieceDefaultPosition] =
    useState(initialPosition);

  useState<boolean>(false);

  const handleGridEnter = () => {
    setCursorInGrid(true);
  };

  const handleGridLeave = () => {
    setCursorInGrid(false);
  };

  const handleGridSquareEnter = (coords: number[]) => {
    if (coords) {
      setCurrentCoords(coords);
    }
  };

  const handleBlockClick = (gamePiece: number[][], shapeCoords: number[]) => {
    setBlockClicked(true);
    setSelectedGamePiece(gamePiece);
    setClickedShapeCoords(shapeCoords);
  };

  useEffect(() => {
    const resetGamePieces = () => {
      setGamePieceDefaultPosition(initialPosition);
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

      if (
        !isNaN(startingCoord[0]) &&
        !isNaN(startingCoord[1]) &&
        cursorInGrid
      ) {
        // TODO: Check is able to go on game grid

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
      } else {
        resetGamePieces();
      }
    };

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
    cursorInGrid,
    gamePieceDefaultPosition,
  ]);

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <GameGrid
          gameGrid={gameGrid}
          handleGridSquareEnter={handleGridSquareEnter}
          handleGridEnter={handleGridEnter}
          handleGridLeave={handleGridLeave}
        />

        <ShapeContainer>
          <Shape
            type={L_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
            position={gamePieceDefaultPosition}
          />
          <Shape
            type={T_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
            position={gamePieceDefaultPosition}
          />
          <Shape
            type={ZIG_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
            position={gamePieceDefaultPosition}
          />
          <Shape
            type={PLUS_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
            position={gamePieceDefaultPosition}
          />
          <Shape
            type={SQUARE_PIECE}
            rotateGamePiece={rotateGamePiece}
            hiddenGamePieces={hiddenGamePieces}
            handleBlockClick={handleBlockClick}
            position={gamePieceDefaultPosition}
          />
        </ShapeContainer>
      </div>
    </>
  );
}

export default App;
