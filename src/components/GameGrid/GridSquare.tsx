import React from "react";
import { BLOCK_SIZE } from "../../gameSettings";

interface GridSquareProps {
  backgroundColor: string;
  onClick: () => void;
}

const GridSquare = ({ backgroundColor, onClick }: GridSquareProps) => {
  return (
    <div
      className="border-black"
      style={{
        borderWidth: "0.5px",
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        backgroundColor: backgroundColor,
      }}
      onClick={onClick}
    />
  );
};

export default GridSquare;
