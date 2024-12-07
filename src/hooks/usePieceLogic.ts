import { useRandom } from "./useRandom";
import { useMatrixOperations } from "./useMatrixOperations";

export const usePieceLogic = () => {
  const { getRandomInt } = useRandom();
  const { deepCopyMatrix } = useMatrixOperations();

  const rotateGamePiece = (gamePiece: number[][]) => {
    const rotatedGamePiece = [];
    for (let i = 0; i < gamePiece[0].length; i++) {
      const array = [];
      for (let j = 0; j < gamePiece.length; j++) {
        array.push(gamePiece[j][i]);
      }
      rotatedGamePiece.push(array.reverse());
    }
    return rotatedGamePiece;
  };

  const turnPiece = (gamePiece: number[][], amount: number) => {
    let gamePieceCopy = deepCopyMatrix(gamePiece);
    for (let i = 0; i < amount; i++) {
      gamePieceCopy = rotateGamePiece(gamePieceCopy);
    }
    return gamePieceCopy;
  };

  const randomRotatePiece = (gamePiece: number[][]) => {
    const randomInt = getRandomInt(3);
    return turnPiece(gamePiece, randomInt);
  };

  return { rotateGamePiece, randomRotatePiece };
};
