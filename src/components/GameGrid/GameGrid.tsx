import React, { useEffect, useState } from "react";
import GridSquare from "./GridSquare";
import GhostGridSquare from "./GhostGridSquare";
import NextPlayer from "../Modal/NextPlayerModal";

interface GameGridProps {
  gameGrid: number[][] | undefined;
  currentPlayer: number;
  handleGridSquareEnter: (coords: number[]) => void;
  handleGridEnter: () => void;
  handleGridLeave: () => void;
}

const GameGrid = ({
  gameGrid,
  currentPlayer,
  handleGridSquareEnter,
  handleGridEnter,
  handleGridLeave,
}: GameGridProps) => {
  const [playerChanged, setPlayerChanged] = useState(false);

  useEffect(() => {
    setPlayerChanged(true);
  }, [currentPlayer]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          className="m-3 border-black cursor-pointer"
          style={{ borderWidth: 1 }}
        >
          {gameGrid?.map((row, rowIndex) => {
            return (
              <div key={rowIndex} style={{ display: "flex" }}>
                {row.map((cell, cellIndex) => {
                  let backgroundColor = "transparent";
                  let nonePlaced = false;
                  if (cell === 1) {
                    backgroundColor = "red";
                  } else if (cell === 2) {
                    backgroundColor = "blue";
                  } else if (cell === 3) {
                    backgroundColor = "green";
                  } else if (cell === 4) {
                    backgroundColor = "yellow";
                  }
                  if (
                    rowIndex === gameGrid.length - 1 &&
                    cellIndex === 0 &&
                    cell === 0
                  ) {
                    nonePlaced = true;
                  } else {
                    nonePlaced = false;
                  }
                  return (
                    <GridSquare
                      key={cellIndex}
                      backgroundColor={backgroundColor}
                      nonePlaced={nonePlaced}
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
        {playerChanged && (
          <NextPlayer
            currentPlayer={currentPlayer}
            setPlayerChanged={setPlayerChanged}
          />
        )}
      </div>
    </>
  );
};

export default GameGrid;
