import React from "react";
import Scoreboard from "../../Scoreboard";

interface Props {
  handleRestartGame: () => void;
}

const GameOverModal = ({ handleRestartGame }: Props) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-50 z-20">
      <div
        className="absolute top-1/3 py-7 px-7 rounded bg-opacity-100 flex flex-col items-center"
        style={{ backgroundColor: "#282c34" }}
      >
        <h1 className="text-white text-[60px] my-2.5 text-center font-bold">
          Game Over
        </h1>
        <Scoreboard />
        <button
          onClick={() => {
            handleRestartGame();
          }}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded w-full"
          type="button"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
