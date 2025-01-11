import React, { useCallback, useEffect, useState } from "react";

import GameGrid from "../components/GameGrid";
import Shape from "../components/Shape";
import ShapeContainer from "../components/ShapeContainer";
import { usePieceLogic } from "../hooks/usePieceLogic";
import { SHAPES } from "../utils/shapes";
import { useMatrixOperations } from "../hooks/useMatrixOperations";
import { IPlayersState, useBoardState } from "../hooks/useBoardState";

const Game = () => {
  const { deepCopyMatrix, checkMatrixEmpty } = useMatrixOperations();
  const {
    gameGrid,
    updateGameGrid,
    playersState,
    updatePlayerScore,
    hideGamePiece,
    shapePosition,
    updateCursorInGrid,
    currentCoords,
    updateCurrentCoords,
    clickedShapeCoords,
    updateClickedShapeCoords,
    placePieceOnGrid,
    resetGameGrid,
    resetPlayersState,
  } = useBoardState();
  const { turnPiece, randomRotatePiece } = usePieceLogic();

  const initialPlayersInGame = [1, 2, 3, 4];

  const [blockClicked, setBlockClicked] = useState<boolean>(false);
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);
  const [playersInGame, setPlayersInGame] =
    useState<number[]>(initialPlayersInGame);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [winner, setWinner] = useState<number | null>(null);
  const [winningScore, setWinningScore] = useState<number>(0);
  const lastPlayer = initialPlayersInGame[initialPlayersInGame.length - 1];

  const shuffleObject = (obj: Record<string, any>): Record<string, any> => {
    const entries = Object.entries(obj);
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return Object.fromEntries(entries);
  };

  const [mixedShapes] = useState(shuffleObject(SHAPES));

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

  const resetPlayersInGame = () => setPlayersInGame(initialPlayersInGame);

  const changeTurn = useCallback(
    (currentPlayer: number) => {
      if (playersInGame.indexOf(currentPlayer) + 1 === playersInGame.length) {
        setCurrentPlayer(playersInGame[0]);
        return playersInGame[0];
      } else {
        const positionsToRotate =
          playersInGame[playersInGame.indexOf(currentPlayer) + 1] -
          currentPlayer;
        setCurrentPlayer(
          playersInGame[playersInGame.indexOf(currentPlayer) + 1]
        );
        return positionsToRotate;
      }
    },
    [playersInGame]
  );

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

  const handleGiveUpTurn = (currentPlayer: number) => {
    const playersInGameCopy = playersInGame.filter(
      (value) => value !== currentPlayer
    );
    if (playersInGame.length === 1) {
      const winner = findWinner(playersState);
      setWinner(winner.playerNumber);
      setWinningScore(winner.score);
    }
    setPlayersInGame(playersInGameCopy);
    const positionsToRotate = changeTurn(currentPlayer);
    updateGameGrid(turnPiece(gameGrid, positionsToRotate));
  };

  const handleGridEnter = () => {
    updateCursorInGrid(true);
  };

  const handleGridLeave = () => {
    updateCursorInGrid(false);
  };

  const handleGridSquareEnter = (coords: number[]) => {
    if (coords) {
      updateCurrentCoords(coords);
    }
  };

  const handleBlockClick = (gamePiece: number[][], shapeCoords: number[]) => {
    setBlockClicked(true);
    setSelectedGamePiece(gamePiece);
    updateClickedShapeCoords(shapeCoords);
  };

  const handleRestartGame = () => {
    setCurrentPlayer(1);
    resetGameGrid();
    resetPlayersState();
    resetPlayersInGame();
    setTurnNumber(1);
  };

  const incrementTurn = useCallback(() => {
    setTurnNumber(turnNumber + 1);
  }, [turnNumber]);

  useEffect(() => {
    const handleBlockHoldMouseUp = (event: MouseEvent) => {
      if (blockClicked) {
        const gameGridCopy = deepCopyMatrix(gameGrid);

        const { updatedGameGrid, updatedScore } = placePieceOnGrid(
          gameGridCopy,
          currentCoords,
          selectedGamePiece,
          clickedShapeCoords,
          playersState[currentPlayer].score,
          currentPlayer
        );

        // updatedGameGrid not null -> place piece success
        if (!!updatedGameGrid) {
          updatePlayerScore(updatedScore, currentPlayer); // Update score
          hideGamePiece(selectedGamePiece, currentPlayer); // Hide placed piece
          let positionsToRotate = changeTurn(currentPlayer);
          if (playersInGame.length === 1) {
            positionsToRotate = 0;
          }
          updateGameGrid(turnPiece(updatedGameGrid, positionsToRotate)); // Update gameGrid
          if (currentPlayer === lastPlayer) {
            incrementTurn();
          }
        }

        setBlockClicked(false);
      }
    };

    if (blockClicked) {
      // Add the mouseup event listener when block is clicked
      window.addEventListener("mouseup", handleBlockHoldMouseUp);
    } else {
      // Remove the event listener when blockClicked is false
      window.removeEventListener("mouseup", handleBlockHoldMouseUp);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("mouseup", handleBlockHoldMouseUp);
    };
  }, [
    blockClicked,
    changeTurn,
    clickedShapeCoords,
    currentCoords,
    currentPlayer,
    deepCopyMatrix,
    gameGrid,
    hideGamePiece,
    incrementTurn,
    lastPlayer,
    placePieceOnGrid,
    playersInGame.length,
    playersState,
    selectedGamePiece,
    turnPiece,
    updateGameGrid,
    updatePlayerScore,
  ]);

  return (
    <div className="flex flex-row">
      <div className="w-screen flex flex-col justify-start items-center m-1 mt-3">
        <h6
          className="text-white text-2xl font-bold"
          style={{ textShadow: "black 0px 4px" }}
        >
          Turn: {turnNumber}
        </h6>
        <GameGrid
          gameGrid={gameGrid}
          currentPlayer={currentPlayer}
          handleGridSquareEnter={handleGridSquareEnter}
          handleGridEnter={handleGridEnter}
          handleGridLeave={handleGridLeave}
        />
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
            <div style={{ display: "flex", flex: 1 }} />
            <div className="flex flex-col items-center">
              <h6 className="text-white text-[45px] my-2.5 font-black drop-shadow-2xl">
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
      </div>

      {playersState[currentPlayer] && (
        <ShapeContainer>
          {Object.entries(mixedShapes).map(([name, gamePiece]) => (
            <div key={name} style={{ margin: 20 }}>
              <Shape
                type={randomRotatePiece(gamePiece)}
                playerNumber={currentPlayer}
                playersState={playersState}
                selectedGamePiece={selectedGamePiece}
                position={shapePosition}
                blockClicked={blockClicked}
                handleBlockClick={handleBlockClick}
              />
            </div>
          ))}
        </ShapeContainer>
      )}
      {playersInGame.length < 1 && (
        <div className="fixed top-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-80 z-20">
          <div
            className="absolute top-1/4 pb-7 px-7 rounded-lg bg-opacity-100 flex flex-col items-center"
            style={{ backgroundColor: "#282c34" }}
          >
            <h1
              className="text-white my-2.5 font-bold text-[60px]"
              style={{ textShadow: "black 0px 8px" }}
            >
              Game Over
            </h1>
            <h4
              className="text-white mt-2.5 font-bold text-[35px] flex flex-row"
              style={{ textShadow: "black 0px 4px" }}
            >
              {winner === null ? "Draw!" : `Player ${winner} wins!`}
            </h4>
            <h6
              className="text-white mb-2.5 font-bold text-[20px] flex flex-row"
              style={{ color: "grey" }}
            >
              Winning Score: {winningScore}
            </h6>
            <button
              onClick={() => {
                handleRestartGame();
              }}
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded mt-5"
              type="button"
              style={{ width: "80%" }}
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
