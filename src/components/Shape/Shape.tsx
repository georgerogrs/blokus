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
  selectedGamePiece: number[][];
  blockClicked: boolean;
  handleBlockClick: (gamePiece: number[][], shapeCoords: number[]) => void;
}

const Shape = ({
  type,
  playerNumber,
  playersState,
  position,
  selectedGamePiece,
  blockClicked,
  handleBlockClick,
}: ShapeProps) => {
  const { turnPiece } = usePieceLogic();
  const [gamePiece, setGamePiece] = useState<number[][]>(type);
  const [degrees, setDegrees] = useState<number>(0);
  const [transitionTime, setTransitionTime] = useState<number>(1);
  const [disableDraggable, setDisableDraggable] = useState<boolean>(true);
  const [scale, setScale] = useState(0.8);

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

  useEffect(() => {
    setTransitionTime(0.1);
    if (blockClicked && selectedGamePiece === gamePiece) {
      setScale(1);
    } else {
      setScale(0.8);
    }
    setTransitionTime(0);
  }, [blockClicked, selectedGamePiece, gamePiece]);

  return (
    <Draggable
      position={position}
      handle=".handle"
      scale={1}
      disabled={disableDraggable}
<<<<<<< HEAD
      grid={[6, 6]}
=======
      grid={[4, 4]}
>>>>>>> 0762128d9364c4d04b4e85b0977783f804935ad7
    >
      <div className="handle">
        {!hideShape && (
          <div
            style={{
              cursor: disableDraggable ? "default" : "pointer",
              transform: `rotate(${degrees}deg) scale(${scale})`,
              transition: `${transitionTime}s`,
              margin: -10,
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
