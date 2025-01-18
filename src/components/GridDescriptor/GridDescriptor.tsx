import React from "react";
import { IPlayersState } from "../../hooks/useGameState";
import { useMatrixOperations } from "../../hooks/useMatrixOperations";

interface Props {
  playersState: IPlayersState;
  currentPlayer: number;
  playerColor: string;
  gameGrid: number[][];
  handleGiveUpTurn: (currentPlayer: number) => void;
}

const GridDescriptor = ({
  playersState,
  currentPlayer,
  playerColor,
  gameGrid,
  handleGiveUpTurn,
}: Props) => {
  const { checkMatrixEmpty } = useMatrixOperations();
  return (
    <>
      {playersState[currentPlayer] && (
        <div className="flex flex-row items-center w-full px-20">
          <div className="flex flex-col items-start mb-2.5">
            <h1
              className="text-[40px]  mr-5 font-bold drop-shadow-4xl"
              style={{ color: playerColor }}
            >
              Player {currentPlayer}
            </h1>
            <h6 className="text-slate-400 text-[20px] mr-5 font-bold">
              {checkMatrixEmpty(gameGrid, currentPlayer)
                ? "Drag a piece in the bottom left corner."
                : "Your turn! Place a shape on the grid."}
            </h6>
          </div>
          <div className="flex flex-1" />
          <div className="flex flex-col items-center">
            <h6 className="text-white text-[45px] my-2.5 font-black drop-shadow-lg">
              {playersState[currentPlayer].score}
            </h6>
          </div>
        </div>
      )}
      <div className="w-full px-20">
        <button
          onClick={() => handleGiveUpTurn(currentPlayer)}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full"
          type="button"
        >
          Give up
        </button>
      </div>
    </>
  );
};

export default GridDescriptor;
