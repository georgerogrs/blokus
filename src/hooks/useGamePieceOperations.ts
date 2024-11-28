export const useGamePieceOperations = () => {
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

  return { rotateGamePiece };
};
