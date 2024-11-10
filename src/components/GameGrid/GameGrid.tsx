import React, { useEffect, useState } from "react";
import GridSquare from "./GridSquare";

interface GameGridProps {
  gameGrid: number[][] | undefined;
}

const GameGrid = ({ gameGrid }: GameGridProps) => {
  return (
    <div className="m-3 border-black" style={{ borderWidth: "1px" }}>
      {gameGrid?.map((row, rowIndex) => {
        return (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, cellIndex) => {
              let backgroundColor = "transparent";
              if (cell != 0) {
                backgroundColor = "red";
              }
              return (
                <GridSquare key={cellIndex} backgroundColor={backgroundColor} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GameGrid;
