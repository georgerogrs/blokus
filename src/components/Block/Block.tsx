import React from "react";
import { BLOCK_SIZE } from "../../utils/gameSettings";

interface Props {
  gamePiece: number[][];
  shapeCoords: number[];
  color: string;
  onBlockEnter: () => void;
  onBlockLeave: () => void;
  handleBlockClick: (gamePiece: number[][], coords: number[]) => void;
}

const Block = ({
  gamePiece,
  shapeCoords,
  color,
  onBlockEnter,
  onBlockLeave,
  handleBlockClick,
}: Props) => {
  return (
    <div
      className="rounded-sm border-black"
      style={{
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        backgroundColor: color,
        borderWidth: "0.5px",
      }}
      onMouseEnter={onBlockEnter}
      onMouseLeave={onBlockLeave}
      onMouseDown={() => {
        handleBlockClick(gamePiece, shapeCoords);
      }}
    />
  );
};

export default Block;
