import React, { useEffect, useState } from "react";
import GridSquare from "./GridSquare";
import { SELECT_BG_COLOR } from "../../gameSettings";

interface GameGridProps {
  gameGrid: number[][] | undefined;
  handleOnShapeOnBoardClick: (rowIndex: number, cellIndex: number) => void;
}

const GameGrid = ({ gameGrid, handleOnShapeOnBoardClick }: GameGridProps) => {
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
                backgroundColor = SELECT_BG_COLOR;
              }
              return (
                <GridSquare
                  key={cellIndex}
                  backgroundColor={backgroundColor}
                  onClick={() => handleOnShapeOnBoardClick(rowIndex, cellIndex)}
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
