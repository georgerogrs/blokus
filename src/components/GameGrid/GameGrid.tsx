import React, { useEffect, useState } from "react";
import GridSquare from "./GridSquare";
import GhostGridSquare from "./GhostGridSquare";

interface GameGridProps {
  gameGrid: number[][] | undefined;
  handleGridSquareEnter: (coords: number[]) => void;
  handleGridEnter: () => void;
  handleGridLeave: () => void;
}

const GameGrid = ({
  gameGrid,
  handleGridSquareEnter,
  handleGridEnter,
  handleGridLeave,
}: GameGridProps) => {
  return (
    <div style={{ position: "relative" }}>
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
                } else if (cell === 2) {
                  backgroundColor = "blue";
                } else if (cell === 3) {
                  backgroundColor = "green";
                } else if (cell === 4) {
                  backgroundColor = "yellow";
                }
                return (
                  <GridSquare
                    key={cellIndex}
                    backgroundColor={backgroundColor}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 14.5,
        }}
        onMouseEnter={handleGridEnter}
        onMouseLeave={handleGridLeave}
      >
        {gameGrid?.map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              style={{
                display: "flex",
              }}
            >
              {row.map((cell, cellIndex) => {
                return (
                  <GhostGridSquare
                    key={cellIndex}
                    coords={[rowIndex, cellIndex]}
                    handleGridSquareEnter={handleGridSquareEnter}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameGrid;
