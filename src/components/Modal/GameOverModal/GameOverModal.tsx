import React from "react";

interface Props {
  winner: number | null;
  winningScore: number;
  handleRestartGame: () => void;
}

const GameOverModal = ({ winner, winningScore, handleRestartGame }: Props) => {
  return (
    <div className="fixed top-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-80 z-20">
      <div className="absolute top-1/4 pb-7 px-7 rounded-lg bg-opacity-100 flex flex-col items-center bg-[#282c34]">
        <h1 className="text-white my-2.5 font-bold text-[60px] drop-shadow-lg">
          Game Over
        </h1>
        <h4 className="text-white mt-2.5 font-bold text-[35px] flex flex-row drop-shadow-lg">
          {winner === null ? "Draw!" : `Player ${winner} wins!`}
        </h4>
        <h6 className="text-white mb-2.5 font-bold text-[20px] flex flex-row color text-slate-500">
          Winning Score: {winningScore}
        </h6>
        <button
          onClick={() => {
            handleRestartGame();
          }}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded mt-5 w-4/5"
          type="button"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
