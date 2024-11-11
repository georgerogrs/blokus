import React, { useEffect, useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid";
import Shape from "./components/Shape";

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
  const [gameGrid, setGameGrid] = useState<number[][] | undefined>(
    createGameGrid(20, 20)
  );
  const [hideShape, setHideShape] = useState<boolean>(false);

  const placePiece = () => {
    const gameGridCopy = gameGrid?.map((row) => {
      return row.map((cell) => {
        if (cell === 2) {
          return 1;
        } else return 0;
      });
    });

    setGameGrid(gameGridCopy);
  };

  const handleOnShapeClick = (gamePiece: number[][]) => {
    // Create a deep copy of gameGrid
    const gameGridCopy = gameGrid?.map((row) => [...row]);
    if (gameGridCopy) {
      let gameGridRow = 0;
      gamePiece.map((row) => {
        row.map((cell, cellIndex) => {
          if (cell === 1) {
            gameGridCopy[gameGridRow][cellIndex] = 2;
          }
        });
        gameGridRow++;
      });
    }
    setHideShape(true);
    setGameGrid(gameGridCopy);
  };
  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <GameGrid gameGrid={gameGrid} placePiece={placePiece} />
        <Shape handleOnShapeClick={handleOnShapeClick} />
      </div>
    </>
  );
}

export default App;
