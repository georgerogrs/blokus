import { useState } from "react";
import { useBoardState } from "./useGameState";

export const useGamePieceState = () => {
  const { updateClickedShapeCoords } = useBoardState();

  const [blockClicked, setBlockClicked] = useState<boolean>(false);
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);

  const handleBlockClick = (gamePiece: number[][], shapeCoords: number[]) => {
    setBlockClicked(true);
    setSelectedGamePiece(gamePiece);
    updateClickedShapeCoords(shapeCoords);
  };

  const resetBlockClicked = () => {
    setBlockClicked(false);
  };

  const shuffleObject = (obj: Record<string, any>): Record<string, any> => {
    const entries = Object.entries(obj);
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return Object.fromEntries(entries);
  };

  return {
    blockClicked,
    selectedGamePiece,
    handleBlockClick,
    resetBlockClicked,
    shuffleObject,
  };
};
