import React, { useEffect, useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid";
import Shape from "./components/Shape";
import ShapeContainer from "./components/ShapeContainer";
import { L_PIECE, T_PIECE, ZIG_PIECE } from "./gameSettings";

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

function App() {
  const [gameGrid, setGameGrid] = useState<number[][]>(createGameGrid(20, 20));
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);
  const [hiddenGamePieces, setHiddenGamePieces] = useState<number[][][]>([]);

  const placePiece = () => {
    const gameGridCopy = gameGrid.map((row) => {
      return row.map((cell) => (cell === 2 ? 1 : cell === 1 ? 1 : 0));
    });
    setGameGrid(gameGridCopy);
  };

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

    let gameGridRow = 0;
    gamePiece.forEach((row) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 1) {
          gameGridCopy[gameGridRow][cellIndex] = 2;
        }
      });
      gameGridRow++;
    });
    setSelectedGamePiece(gamePiece);
    setGameGrid(gameGridCopy);
  };

  const handleOnShapeOnBoardClick = (rowIndex: number, cellIndex: number) => {
    if (gameGrid[rowIndex][cellIndex] === 2) {
      placePiece();
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
        (
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
        )
      </div>
    </>
  );
}

export default App;
