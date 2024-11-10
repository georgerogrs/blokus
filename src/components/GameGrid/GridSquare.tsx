import React from "react";
import { BLOCK_SIZE } from "../../gameSettings";

interface GridSquareProps {
  backgroundColor: string;
}

const GridSquare = ({ backgroundColor }: GridSquareProps) => {
  return (
    <div
      className="border-black"
      style={{
        borderWidth: "0.5px",
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        backgroundColor: backgroundColor,
      }}
    />
  );
};

export default GridSquare;
