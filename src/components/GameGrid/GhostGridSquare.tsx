import React from "react";
import { BLOCK_SIZE, SELECT_BG_COLOR } from "../../gameSettings";

interface GhostGridSquareProps {
  coords: number[];
  handleGridSquareEnter: (coords: number[]) => void;
  handleGridSquareLeave: (coords: number[]) => void;
}

const GhostGridSquare = ({
  coords,
  handleGridSquareEnter,
  handleGridSquareLeave,
}: GhostGridSquareProps) => {
  return (
    <div
      style={{
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        backgroundColor: "black",
        opacity: 0.05,
        zIndex: 3,
      }}
      onMouseEnter={() => handleGridSquareEnter(coords)}
      onMouseLeave={() => handleGridSquareLeave(coords)}
    />
  );
};

export default GhostGridSquare;
