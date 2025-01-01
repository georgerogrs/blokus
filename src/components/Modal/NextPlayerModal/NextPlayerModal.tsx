import { useEffect, useState } from "react";

interface Props {
  currentPlayer: number;
  setPlayerChanged: (state: boolean) => void;
}

const NextPlayerModal = ({ currentPlayer, setPlayerChanged }: Props) => {
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(-20);

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
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10"
      style={{
        opacity: opacity,
        transition: "opacity 0.2s ease",
      }}
    >
      <h6
        className="m-0 font-bold text-4xl text-white"
        style={{
          opacity: opacity,
          transform: `translateY(${translateY}px)`,
          transition: "opacity 0.4s ease, transform 0.5s ease",
        }}
      >
        Player {currentPlayer} turn
      </h6>
    </div>
  );
};

export default NextPlayerModal;
