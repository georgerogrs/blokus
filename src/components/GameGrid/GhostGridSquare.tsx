import React from "react";
import { BLOCK_SIZE, SELECT_BG_COLOR } from "../../gameSettings";

interface GhostGridSquareProps {
  coords: number[];
  handleGridSquareEnter: (coords: number[]) => void;
}

const GhostGridSquare = ({
  coords,
  handleGridSquareEnter,
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
    />
  );
};

export default GhostGridSquare;
