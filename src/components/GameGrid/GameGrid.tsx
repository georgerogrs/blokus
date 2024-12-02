import React, { useEffect, useState } from "react";
import GridSquare from "./GridSquare";
import { SELECT_BG_COLOR } from "../../gameSettings";
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
    <div style={{ position: "relative", right: "20px", bottom: "15px" }}>
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
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div
        style={{ position: "relative", top: "-826px", marginBottom: "-826px" }} // TODO: Fix this
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
