import { IPlayersState } from "./useGameState";

export const useWinner = () => {
  const findWinner = (playersState: IPlayersState) => {
    let winner = ""; // Will hold the player ID of the winner
    let highestScore = -Infinity; // Initialize with a very low score
    let draw = false; // Flag to indicate if there's a draw
    let highScorersCount = 0; // Count players with the highest score

    for (const playerId in playersState) {
      const player = playersState[playerId];

      if (player.score > highestScore) {
        highestScore = player.score;
        winner = playerId;
        highScorersCount = 1; // Reset to 1 since we found a new highest score
        draw = false; // Reset draw flag since we found a higher score
      } else if (player.score === highestScore) {
        highScorersCount++; // Increment count of players with the highest score
        draw = highScorersCount > 1; // Set draw to true if more than one player has the highest score
      }
    }

    const playerNumber = draw ? null : parseInt(winner);

    return { playerNumber, score: highestScore, isDraw: draw };
  };

  return { findWinner };
};
