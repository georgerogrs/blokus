import React from "react";
import { BLOCK_SIZE, SELECT_BG_COLOR } from "../../gameSettings";

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
        opacity: backgroundColor === SELECT_BG_COLOR ? 0.3 : 1,
      }}
      onClick={onClick}
    />
  );
};

export default GridSquare;
