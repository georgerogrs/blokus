import React, { useEffect, useState } from "react";
import GridSquare from "./GridSquare";
import { SELECT_BG_COLOR } from "../../gameSettings";
import GhostGridSquare from "./GhostGridSquare";

interface GameGridProps {
  gameGrid: number[][] | undefined;
  handleGridSquareEnter: (coords: number[]) => void;
  handleGridSquareLeave: (coords: number[]) => void;
}

const GameGrid = ({
  gameGrid,
  handleGridSquareEnter,
  handleGridSquareLeave,
}: GameGridProps) => {
  return (
    <>
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
                    handleGridSquareLeave={handleGridSquareLeave}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GameGrid;
