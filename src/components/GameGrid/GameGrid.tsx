import React, { useEffect, useState } from "react";
import GridSquare from "./GridSquare";

interface GameGridProps {
  gameGrid: number[][] | undefined;
  placePiece: () => void;
}

const GameGrid = ({ gameGrid, placePiece }: GameGridProps) => {
  const handleOnClick = (rowIndex: number, cellIndex: number) => {
    if (gameGrid) {
      if (gameGrid[rowIndex][cellIndex] === 2) {
        placePiece();
      }
    }
  };

  return (
    <div
      className="m-3 border-black cursor-pointer"
      style={{ borderWidth: "1px" }}
    >
      {gameGrid?.map((row, rowIndex) => {
        return (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, cellIndex) => {
              let backgroundColor = "transparent";
              if (cell === 1) {
                backgroundColor = "red";
              }
              if (cell === 2) {
                backgroundColor = "lightblue";
              }
              return (
                <GridSquare
                  key={cellIndex}
                  backgroundColor={backgroundColor}
                  onClick={() => handleOnClick(rowIndex, cellIndex)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GameGrid;
