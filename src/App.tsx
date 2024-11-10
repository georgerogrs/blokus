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
    createGameGrid(21, 21)
  );
  const [hideShape, setHideShape] = useState<boolean>(false);

  const handleOnShapeClick = (gamePiece: number[][]) => {
    // Create a deep copy of gameGrid
    const gameGridCopy = gameGrid?.map((row) => [...row]);
    if (gameGridCopy) {
      let gameGridRow = 0;
      gamePiece.map((row) => {
        row.map((cell, cellIndex) => {
          gameGridCopy[gameGridRow][cellIndex] = cell;
        });
        gameGridRow++;
      });
    }
    setHideShape(true);
    setGameGrid(gameGridCopy);
  };

  useEffect(() => {
    console.log(gameGrid);
  }, [gameGrid]);

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <GameGrid gameGrid={gameGrid} />
        {!hideShape && <Shape handleOnShapeClick={handleOnShapeClick} />}
      </div>
    </>
  );
}

export default App;
