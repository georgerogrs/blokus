import React, { useState } from "react";
import Block from "../Block";
import EmptyBlock from "../Block/EmptyBlock";
import { L_PIECE, PLUS_PIECE, T_PIECE, ZIG_PIECE } from "../../gameSettings";

interface ShapeProps {
  handleOnShapeClick: (gamePiece: number[][]) => void;
}

const rotateGamePiece = (gamePiece: number[][]) => {
  const newGamePiece = [];
  for (let i = 0; i < gamePiece[0].length; i++) {
    const array = [];
    for (let j = 0; j < gamePiece.length; j++) {
      array.push(gamePiece[j][i]);
    }
    newGamePiece.push(array.reverse());
  }
  return newGamePiece;
};

const Shape = ({ handleOnShapeClick }: ShapeProps) => {
  const [gamePiece, setGamePiece] = useState<number[][]>(PLUS_PIECE);
  const [degrees, setDegrees] = useState<number>(0);
  const [transitionTime, setTransitionTime] = useState<number>(1);

  const handleOnDoubleClick = () => {
    setDegrees(degrees + 90);
    setTransitionTime(0.1);
    setTimeout(() => {
      const rotatedGamePiece = rotateGamePiece(gamePiece);
      setGamePiece(rotatedGamePiece);
      setTransitionTime(0);
      setDegrees(degrees);
    }, 100);
  };

  return (
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
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
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
  );
};

export default Shape;
