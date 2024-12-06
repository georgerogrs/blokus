import React, { useEffect, useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid";
import Shape from "./components/Shape";
import ShapeContainer from "./components/ShapeContainer";
import { useGamePieceOperations } from "./hooks/useGamePieceOperations";
import { useArrayOperations } from "./hooks/useArrayOperations";
import { useBoardOperations } from "./hooks/useBoardOperations";
import { SHAPES } from "./shapes";

const createGameGrid = (width: number, height: number) => {
  const grid = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
};

function App() {
  const { rotateGamePiece } = useGamePieceOperations();
  const { findAllTouchingCells } = useBoardOperations();
  const { withinMatrixBounds, arrayInArray } = useArrayOperations();

  const [gameGrid, setGameGrid] = useState<number[][]>(createGameGrid(20, 20));
  const [selectedGamePiece, setSelectedGamePiece] = useState<number[][]>([]);
  const [hiddenGamePieces, setHiddenGamePieces] = useState<number[][][]>([]);
  const [currentCoords, setCurrentCoords] = useState<number[]>([]);
  const [blockClicked, setBlockClicked] = useState<boolean>(false);
  const [clickedShapeCoords, setClickedShapeCoords] = useState<number[]>([]);
  const [cursorInGrid, setCursorInGrid] = useState<boolean>(false);
  const initialPosition = { x: 0, y: 0 };
  const [gamePieceDefaultPosition, setGamePieceDefaultPosition] =
    useState(initialPosition);
  const [score, setScore] = useState<number>(0);

  useState<boolean>(false);

  const handleGridEnter = () => {
    setCursorInGrid(true);
  };

  const handleGridLeave = () => {
    setCursorInGrid(false);
  };

  const handleGridSquareEnter = (coords: number[]) => {
    if (coords) {
      setCurrentCoords(coords);
    }
  };

  const handleBlockClick = (gamePiece: number[][], shapeCoords: number[]) => {
    setBlockClicked(true);
    setSelectedGamePiece(gamePiece);
    setClickedShapeCoords(shapeCoords);
  };

  const checkGameGridEmpty = (gameGrid: number[][]) => {
    let isEmpty = true;
    gameGrid.forEach((row) =>
      row.forEach((cell) => {
        if (cell === 1) {
          isEmpty = false;
        }
      })
    );

    return isEmpty;
  };

  const deepCopyMatrix = (matrix: number[][]) => matrix.map((row) => [...row]);

  useEffect(() => {
    const resetGamePieces = () => {
      setGamePieceDefaultPosition(initialPosition);
    };

    const countScoreOnGrid = (gameGrid: number[][]) => {
      let score = 0;
      gameGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell === 1) {
            score += 1;
          }
        })
      );

      return score;
    };

    const checkValidStartingCoords = (
      gameGrid: number[][],
      gamePiece: number[][],
      startingCoord: number[]
    ) => {
      if (
        startingCoord[0] === gameGrid.length - gamePiece.length &&
        startingCoord[1] === 0 && // Starting coords
        gamePiece[gamePiece.length - 1][0] === 1 // Corner of game piece is  filled
      ) {
        return true;
      }
      return false;
    };

    const sortMatrix = (matrix: number[][]) => {
      for (let i = 0; i < matrix.length; i++) {
        matrix.sort((a, b) => a[i] - b[i]);
      }
      return matrix;
    };

    const compareMatrices = (matrixA: number[][], matrixB: number[][]) => {
      // Sort matrices
      const sortedMatrixA = sortMatrix([...matrixA]);
      const sortedMatrixB = sortMatrix([...matrixB]);

      for (let i = 0; i < sortedMatrixA.length; i++) {
        for (let j = 0; j < sortedMatrixA[i].length; j++) {
          if (sortedMatrixB[i][j] !== sortedMatrixA[i][j]) {
            return false;
          }
        }
      }

      return true;
    };

    const getNumberOfShapesOnBoard = (gameGrid: number[][]) => {
      const piecesOnBoard: number[][][] = [];

      for (let i = 0; i < gameGrid.length; i++) {
        for (let j = 0; j < gameGrid[0].length; j++) {
          if (gameGrid[i][j] === 1) {
            const touchingCells = findAllTouchingCells(gameGrid, [i, j]);

            let pieceAccountedFor = false;
            for (let k = 0; k < piecesOnBoard.length; k++) {
              if (compareMatrices(piecesOnBoard[k], touchingCells)) {
                pieceAccountedFor = true;
              }
            }
            if (!pieceAccountedFor) piecesOnBoard.push(touchingCells);
          }
        }
      }

      return piecesOnBoard.length;
    };

    const findGapsInGridRows = (gameGrid: number[][]) => {
      let prevRowFilled = true;
      for (let i = gameGrid.length - 1; i >= 0; i--) {
        const rowFilled = gameGrid[i].some((cell) => cell === 1);
        if (!prevRowFilled && rowFilled) return true;
        prevRowFilled = rowFilled;
      }
      return false;
    };

    const findGapsInGridColumns = (gameGrid: number[][]) => {
      const ThreeSixtyRotatedGameGrid = rotateGamePiece(
        rotateGamePiece(rotateGamePiece(gameGrid))
      );
      return findGapsInGridRows(ThreeSixtyRotatedGameGrid);
    };

    const findGapsInGrid = (gameGrid: number[][]) => {
      const gapsInRows = findGapsInGridRows(gameGrid);
      const gapsInColumns = findGapsInGridColumns(gameGrid);

      return gapsInRows || gapsInColumns;
    };

    const getCoordDiagonals = (coord: number[]) => {
      const upperLeft: number[] = [coord[0] - 1, coord[1] - 1];
      const upperRight: number[] = [coord[0] - 1, coord[1] + 1];
      const lowerLeft: number[] = [coord[0] + 1, coord[1] - 1];
      const lowerRight: number[] = [coord[0] + 1, coord[1] + 1];

      return [upperLeft, upperRight, lowerLeft, lowerRight];
    };

    const traceGameGrid = (gameGrid: number[][], startingCoord: number[]) => {
      const visitedCells = findAllTouchingCells(gameGrid, startingCoord);

      let finalRun = false;
      while (!finalRun) {
        finalRun = true;
        visitedCells.forEach((coord) => {
          const coordDiagonals = getCoordDiagonals(coord);
          const additionalCoords = coordDiagonals.filter((coord) => {
            if (
              coord[0] > 0 &&
              coord[1] > 0 &&
              withinMatrixBounds(gameGrid, coord)
            ) {
              if (
                !arrayInArray(visitedCells, coord) &&
                gameGrid[coord[0]][coord[1]] === 1
              ) {
                findAllTouchingCells(gameGrid, coord).forEach((coord) =>
                  visitedCells.push(coord)
                );
                return coord;
              }
            }
          });
          if (additionalCoords.length > 0) finalRun = false;
        });
      }

      return visitedCells;
    };

    const checkCorrectPlacement = (
      gameGrid: number[][],
      coords: number[][]
    ) => {
      for (let i = 0; i < gameGrid.length; i++) {
        for (let j = 0; j < gameGrid[0].length; j++) {
          if (gameGrid[i][j] === 1 && !arrayInArray(coords, [i, j])) {
            return false;
          }
        }
      }
      return true;
    };

    const placePieceOnGrid = (
      gameGridCopy: number[][],
      coordsOnGrid: number[],
      gamePiece: number[][],
      clickedShapeCoord: number[]
    ) => {
      // Work out how much to go up
      const goUp = coordsOnGrid[0] - clickedShapeCoord[0];

      // Work out how much to go left
      const goLeft = coordsOnGrid[1] - clickedShapeCoord[1];

      const startingCoord = [goUp, goLeft];

      if (
        !isNaN(startingCoord[0]) &&
        !isNaN(startingCoord[1]) &&
        cursorInGrid
      ) {
        const startingTurn = checkGameGridEmpty(gameGrid);
        if (startingTurn) {
          const validStartingPoint = checkValidStartingCoords(
            gameGridCopy,
            gamePiece,
            startingCoord
          );
          if (!validStartingPoint) {
            resetGamePieces();
            return;
          }
        }

        let scoreToAdd = 0;
        // Place gamePiece from starting coordinate
        for (let i = 0; i < gamePiece.length; i++) {
          for (let j = 0; j < gamePiece[i].length; j++) {
            if (gamePiece[i][j] === 1) {
              scoreToAdd++;
              if (!gameGridCopy[startingCoord[0] + i]) return;
              if (
                gameGridCopy[startingCoord[0] + i][startingCoord[1] + j] !== 0
              )
                return;
              gameGridCopy[startingCoord[0] + i][startingCoord[1] + j] = 1;
            }
          }
        }

        if (!startingTurn) {
          const amountOfShapes = getNumberOfShapesOnBoard(gameGridCopy);
          if (amountOfShapes !== hiddenGamePieces.length + 1) {
            resetGamePieces();
            return;
          }

          if (findGapsInGrid(gameGridCopy)) {
            resetGamePieces();
            return;
          }

          const tracedCoords = traceGameGrid(gameGridCopy, [
            gameGridCopy.length - 1,
            0,
          ]);

          if (!checkCorrectPlacement(gameGridCopy, tracedCoords)) {
            resetGamePieces();
            return;
          }
        }

        const updatedScore = score + scoreToAdd;

        const newScore = countScoreOnGrid(gameGridCopy);

        if (newScore !== updatedScore) {
          resetGamePieces();
          return;
        }

        setScore(updatedScore);
        return gameGridCopy;
      } else {
        resetGamePieces();
        return;
      }
    };

    const handleBlockMouseUp = (event: MouseEvent) => {
      if (blockClicked) {
        const gameGridCopy = deepCopyMatrix(gameGrid);
        const updatedGameGrid = placePieceOnGrid(
          gameGridCopy,
          currentCoords,
          selectedGamePiece,
          clickedShapeCoords
        );
        if (!!updatedGameGrid) {
          setGameGrid(updatedGameGrid);

          const hiddenGamePiecesCopy = [...hiddenGamePieces];
          hiddenGamePiecesCopy.push(selectedGamePiece);
          setHiddenGamePieces(hiddenGamePiecesCopy);
        }

        setBlockClicked(false);
      }
    };

    if (blockClicked) {
      // Add the mouseup event listener when block is clicked
      window.addEventListener("mouseup", handleBlockMouseUp);
    } else {
      // Remove the event listener when blockClicked is false
      window.removeEventListener("mouseup", handleBlockMouseUp);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("mouseup", handleBlockMouseUp);
    };
  }, [
    blockClicked,
    selectedGamePiece,
    currentCoords,
    clickedShapeCoords,
    gameGrid,
    hiddenGamePieces,
    cursorInGrid,
    gamePieceDefaultPosition,
    score,
  ]);

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <h6 style={{ color: "white", fontSize: 20 }}>Score: {score}</h6>
        <GameGrid
          gameGrid={gameGrid}
          handleGridSquareEnter={handleGridSquareEnter}
          handleGridEnter={handleGridEnter}
          handleGridLeave={handleGridLeave}
        />

        <ShapeContainer>
          {Object.entries(SHAPES).map(([name, shapeType]) => (
            <div style={{ margin: 20 }}>
              <Shape
                key={name}
                type={shapeType}
                rotateGamePiece={rotateGamePiece}
                hiddenGamePieces={hiddenGamePieces}
                handleBlockClick={handleBlockClick}
                position={gamePieceDefaultPosition}
              />
            </div>
          ))}
        </ShapeContainer>
      </div>
    </>
  );
}

export default App;
