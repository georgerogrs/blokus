import React from "react";
import { BLOCK_SIZE } from "../../utils/gameSettings";

interface Props {
  gamePiece: number[][];
  shapeCoords: number[];
  playerNumber: number;
  onBlockEnter: () => void;
  onBlockLeave: () => void;
  handleBlockClick: (gamePiece: number[][], coords: number[]) => void;
}

const Block = ({
  gamePiece,
  shapeCoords,
  playerNumber,
  onBlockEnter,
  onBlockLeave,
  handleBlockClick,
}: Props) => {
  const getColor = (playerNumber: number) => {
    switch (playerNumber) {
      case 4:
        return "yellow";
      case 3:
        return "green";
      case 2:
        return "blue";
      case 1:
        return "red";
    }
  };

  const color = getColor(playerNumber);

  return (
    <div
      className="rounded-sm border-black"
      style={{
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        backgroundColor: color,
        borderWidth: "1px",
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
