import React, { useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid";
import Shape from "./components/Shape";
import ShapeContainer from "./components/ShapeContainer";
import {
  BENCH_PIECE,
  DUAL_PIECE,
  L_PIECE,
  PLUS_PIECE,
  SINGLE_PIECE,
  SNAKE_PIECE,
  SQUARE_PIECE,
  T_PIECE,
  ZIG_PIECE,
} from "./gameSettings";
import { useBoardOperations } from "./hooks/useBoardOperations";
import { useGamePieceOperations } from "./hooks/useGamePieceOperations";

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
  const { findAllTouchingCells, findValidCorners } = useBoardOperations();
  const { rotateGamePiece } = useGamePieceOperations();

  const [gameGrid, setGameGrid] = useState<number[][]>(createGameGrid(20, 20));
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);
  const [hiddenGamePieces, setHiddenGamePieces] = useState<number[][][]>([]);

  const removeUnplacedPieces = () => {
    const gameGridCopy = gameGrid.map((row) => {
      return row.map((cell) => (cell === 2 ? 0 : cell === 1 ? 1 : 0));
    });
    setGameGrid(gameGridCopy);
  };

  const handleOnShapeClick = (gamePiece: number[][]) => {
    removeUnplacedPieces(); // Hide all shape outlines

    const gameGridCopy: number[][] = gameGrid.map((row) => {
      return row.map((cell) => (cell === 2 ? 0 : cell === 1 ? 1 : 0));
    });

    const startingPoints = findValidCorners(gameGridCopy, gamePiece); // Get all valid corners to place piece

    startingPoints.map((startingPoint) => {
      try {
        return gamePiece.forEach((row) => {
          row.forEach((cell, cellIndex) => {
            if (cell === 1) {
              gameGridCopy[startingPoint[1]][startingPoint[0] + cellIndex] = 2;
            }
          });
          startingPoint[1]++;
        });
      } catch {
        return null; // Game piece outline does not fit on grid -> return null
      }
    });

    setSelectedGamePiece(gamePiece);
    setGameGrid(gameGridCopy);
  };

  const handleOnShapeOnBoardClick = (rowIndex: number, cellIndex: number) => {
    if (gameGrid[rowIndex][cellIndex] === 2) {
      const touchingCells = findAllTouchingCells(gameGrid, [
        rowIndex,
        cellIndex,
      ]);
      const gameGridCopy = [...gameGrid];
      touchingCells?.forEach((coordinate) => {
        gameGridCopy[coordinate[0]][coordinate[1]] = 1;
      });
      setGameGrid(gameGridCopy);
      // Copy hidden game pieces array
      const hiddenGamePiecesCopy = [...hiddenGamePieces];
      // Push current game piece
      hiddenGamePiecesCopy.push(selectedGamePiece);
      setHiddenGamePieces(hiddenGamePiecesCopy);
    }
    removeUnplacedPieces();
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <GameGrid
          gameGrid={gameGrid}
          handleOnShapeOnBoardClick={handleOnShapeOnBoardClick}
        />

        <ShapeContainer>
          <Shape
            type={L_PIECE}
            handleOnShapeClick={handleOnShapeClick}
            rotateGamePiece={rotateGamePiece}
            removeUnplacedPieces={removeUnplacedPieces}
            hiddenGamePieces={hiddenGamePieces}
          />
          <Shape
            type={ZIG_PIECE}
            handleOnShapeClick={handleOnShapeClick}
            rotateGamePiece={rotateGamePiece}
            removeUnplacedPieces={removeUnplacedPieces}
            hiddenGamePieces={hiddenGamePieces}
          />
          <Shape
            type={PLUS_PIECE}
            handleOnShapeClick={handleOnShapeClick}
            rotateGamePiece={rotateGamePiece}
            removeUnplacedPieces={removeUnplacedPieces}
            hiddenGamePieces={hiddenGamePieces}
          />
          <Shape
            type={DUAL_PIECE}
            handleOnShapeClick={handleOnShapeClick}
            rotateGamePiece={rotateGamePiece}
            removeUnplacedPieces={removeUnplacedPieces}
            hiddenGamePieces={hiddenGamePieces}
          />
          <Shape
            type={BENCH_PIECE}
            handleOnShapeClick={handleOnShapeClick}
            rotateGamePiece={rotateGamePiece}
            removeUnplacedPieces={removeUnplacedPieces}
            hiddenGamePieces={hiddenGamePieces}
          />
          <Shape
            type={SNAKE_PIECE}
            handleOnShapeClick={handleOnShapeClick}
            rotateGamePiece={rotateGamePiece}
            removeUnplacedPieces={removeUnplacedPieces}
            hiddenGamePieces={hiddenGamePieces}
          />
        </ShapeContainer>
      </div>
    </>
  );
}

export default App;
