import React, { useEffect, useState } from "react";
import Block from "../Block";
import EmptyBlock from "../Block/EmptyBlock";
import Draggable from "react-draggable";
import { usePieceLogic } from "../../hooks/usePieceLogic";
import { IPlayersState } from "../../hooks/useBoardState";

interface ShapeProps {
  type: number[][];
  playerNumber: number;
  playersState: IPlayersState;
  position: { x: number; y: number };
  handleBlockClick: (gamePiece: number[][], shapeCoords: number[]) => void;
}

const Shape = ({
  type,
  playerNumber,
  playersState,
  position,
  handleBlockClick,
}: ShapeProps) => {
  const { turnPiece } = usePieceLogic();
  const [gamePiece, setGamePiece] = useState<number[][]>(type);
  const [degrees, setDegrees] = useState<number>(0);
  const [transitionTime, setTransitionTime] = useState<number>(1);
  const [disableDraggable, setDisableDraggable] = useState<boolean>(true);

  const handleOnDoubleClick = () => {
    setDegrees(degrees + 90);
    setTransitionTime(0.1);
    setTimeout(() => {
      const rotatedGamePiece = turnPiece(gamePiece, 1);
      setGamePiece(rotatedGamePiece);
      setTransitionTime(0);
      setDegrees(degrees);
    }, 100);
  };

  const onBlockEnter = () => {
    setDisableDraggable(false);
  };

  const onBlockLeave = () => {
    setDisableDraggable(true);
  };

  const hideShape = playersState[playerNumber].playedShapes.includes(gamePiece)
    ? true
    : false;

  return (
    <Draggable
      position={position}
      handle=".handle"
      scale={1}
      disabled={disableDraggable}
      grid={[4, 4]}
    >
      <div className="handle">
        {!hideShape && (
          <div
            style={{
              cursor: disableDraggable ? "default" : "pointer",
              transform: `rotate(${degrees}deg)`,
              transition: `${transitionTime}s`,
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
                      return (
                        <Block
                          key={cellIndex}
                          gamePiece={gamePiece}
                          shapeCoords={[rowIndex, cellIndex]}
                          playerNumber={playerNumber}
                          onBlockEnter={onBlockEnter}
                          onBlockLeave={onBlockLeave}
                          handleBlockClick={handleBlockClick}
                        />
                      );
                    } else {
                      return <EmptyBlock key={cellIndex} />;
                    }
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default Shape;
