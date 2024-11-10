import React, { useState } from "react";
import Block from "../Block";
import EmptyBlock from "../Block/EmptyBlock";

interface ShapeProps {
  handleOnShapeClick: (gamePiece: number[][]) => void;
}

const Shape = ({ handleOnShapeClick }: ShapeProps) => {
  const [degrees, setDegrees] = useState<number>(0);
  const [gamePiece, setGamePiece] = useState<number[][]>([
    [1, 1],
    [1, 0],
    [1, 0],
  ]);

  const handleOnDoubleClick = () => {
    setDegrees(degrees + 90);
  };

  return (
    <div
      className="cursor-pointer transition-transform"
      style={{
        transform: `rotate(${degrees}deg)`,
      }}
      onClick={() => handleOnShapeClick(gamePiece)}
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
