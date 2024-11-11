import React, { useState } from "react";
import Block from "../Block";
import EmptyBlock from "../Block/EmptyBlock";
import { L_PIECE, PLUS_PIECE, T_PIECE, ZIG_PIECE } from "../../gameSettings";

interface ShapeProps {
  type: number[][];
  hiddenGamePieces: number[][][];
  handleOnShapeClick: (gamePiece: number[][]) => void;
  rotateGamePiece: (gamePiece: number[][]) => number[][];
  removeUnplacedPieces: () => void;
}

const Shape = ({
  type,
  hiddenGamePieces,
  handleOnShapeClick,
  rotateGamePiece,
  removeUnplacedPieces,
}: ShapeProps) => {
  const [gamePiece, setGamePiece] = useState<number[][]>(type);
  const [degrees, setDegrees] = useState<number>(0);
  const [transitionTime, setTransitionTime] = useState<number>(1);

  const handleOnDoubleClick = () => {
    setDegrees(degrees + 90);
    setTransitionTime(0.1);
    removeUnplacedPieces();
    setTimeout(() => {
      const rotatedGamePiece = rotateGamePiece(gamePiece);
      setGamePiece(rotatedGamePiece);
      setTransitionTime(0);
      setDegrees(degrees);
    }, 100);
  };

  const hideShape = hiddenGamePieces.includes(gamePiece) ? true : false;

  return (
    <>
      {!hideShape && (
        <div
          className="cursor-pointer"
          style={{
            transform: `rotate(${degrees}deg)`,
            transition: `${transitionTime}s`,
          }}
          onClick={() => {
            handleOnShapeClick(gamePiece);
          }}
          onDoubleClick={handleOnDoubleClick}
        >
          {gamePiece.map((row, rowIndex) => {
            return (
              <div
                key={rowIndex}
                style={{ display: "flex", flexDirection: "row" }}
              >
                {row.map((cell, cellIndex) => {
                  if (cell === 1) {
                    return <Block key={cellIndex} />;
                  } else {
                    return <EmptyBlock key={cellIndex} />;
                  }
                })}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Shape;
