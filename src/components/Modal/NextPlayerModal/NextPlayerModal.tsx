import { useEffect, useState } from "react";

interface Props {
  currentPlayer: number;
  setPlayerChanged: (state: boolean) => void;
}

const NextPlayerModal = ({ currentPlayer, setPlayerChanged }: Props) => {
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(-20);

  const playerColor =
    currentPlayer === 1
      ? "red"
      : currentPlayer === 2
      ? "blue"
      : currentPlayer === 3
      ? "green"
      : currentPlayer === 4
      ? "yellow"
      : "unknown";

  useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
      setTranslateY(0);
    }, 0);

    setTimeout(() => {
      setOpacity(0);
      setTranslateY(20);
    }, 1000);

    setTimeout(() => {
      setPlayerChanged(false);
    }, 1500);
  }, [setPlayerChanged]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded"
      style={{
        opacity: opacity,
        transition: "opacity 0.2s ease",
      }}
    >
      <h6
        className="m-0 font-bold text-4xl text-white flex flex-row"
        style={{
          opacity: opacity,
          transform: `translateY(${translateY}px)`,
          transition: "opacity 0.4s ease, transform 0.5s ease",
        }}
      >
        <p className="mr-2" style={{ color: playerColor }}>
          Player {currentPlayer}
        </p>
        's turn
      </h6>
    </div>
  );
};

export default NextPlayerModal;
