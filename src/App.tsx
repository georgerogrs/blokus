import React, { useEffect, useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid";
import Shape from "./components/Shape";
import ShapeContainer from "./components/ShapeContainer";
import { L_PIECE, T_PIECE, ZIG_PIECE } from "./gameSettings";
import { useGameEngine } from "./hooks/useGameEngine";

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

const rotateGamePiece = (gamePiece: number[][]) => {
  const rotatedGamePiece = [];
  for (let i = 0; i < gamePiece[0].length; i++) {
    const array = [];
    for (let j = 0; j < gamePiece.length; j++) {
      array.push(gamePiece[j][i]);
    }
    rotatedGamePiece.push(array.reverse());
  }
  return rotatedGamePiece;
};

const findValidCorners = (gameGrid: number[][]) => {
  let mapPopulated = false;
  gameGrid.forEach((row) =>
    row.forEach((cell) => {
      if (cell === 1) {
        mapPopulated = true;
      }
    })
  );

  if (!mapPopulated) {
    const max = gameGrid.length - 1;
    return [
      [0, 0],
      [0, max],
      [max, 0],
      [max, max],
    ];
  }

  return [];
};

function App() {
  const { findAllTouchingCells } = useGameEngine();
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
    removeUnplacedPieces();
    const gameGridCopy: number[][] = gameGrid.map((row) => {
      return row.map((cell) => (cell === 2 ? 0 : cell === 1 ? 1 : 0));
    });

    let startingPoints = findValidCorners(gameGridCopy);
    startingPoints = [
      [0, 0],
      [0, 17],
    ];
    startingPoints.map((startingPoint) => {
      gamePiece.forEach((row) => {
        row.forEach((cell, cellIndex) => {
          if (cell === 1) {
            gameGridCopy[startingPoint[1]][startingPoint[0] + cellIndex] = 2;
          }
        });
        startingPoint[1]++;
      });
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
            type={T_PIECE}
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
        </ShapeContainer>
      </div>
    </>
  );
}

export default App;
