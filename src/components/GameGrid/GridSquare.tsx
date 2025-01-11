import React from "react";
import { BLOCK_SIZE, SELECT_BG_COLOR } from "../../utils/gameSettings";

interface GridSquareProps {
  backgroundColor: string;
  nonePlaced: boolean;
}

const GridSquare = ({ backgroundColor, nonePlaced }: GridSquareProps) => {
  return (
    <>
      <div
        className="border-black"
        style={{
          borderWidth: 1,
          width: BLOCK_SIZE,
          height: BLOCK_SIZE,
          backgroundColor: backgroundColor,
          opacity: backgroundColor === SELECT_BG_COLOR ? 0.3 : 0.75,
        }}
      />
    </>
  );
};

export default GridSquare;
