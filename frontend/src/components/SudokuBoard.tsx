import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SudokuCell } from './SudokuCell';

const SudokuBoard: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(0).map(() => Array(9).fill(0))
  );
  const [initialBoard, setInitialBoard] = useState<boolean[][]>(
    Array(9).fill(false).map(() => Array(9).fill(false))
  );
  const [validity, setValidity] = useState<boolean[][]>(
    Array(9).fill(true).map(() => Array(9).fill(true))
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const fetchPuzzle = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/puzzle');
      const puzzle = response.data.puzzle;
      setBoard(puzzle);
      setInitialBoard(puzzle.map((row: number[]) => row.map((val: number) => val !== 0)));
      setValidity(Array(9).fill(true).map(() => Array(9).fill(true)));
      setMessage(null);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      setMessage('Error fetching puzzle');
    }
  };

  const handleCellChange = async (row: number, col: number, value: number) => {
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = value;
    setBoard(newBoard);

    try {
      const response = await axios.post('http://localhost:3000/api/validate', {
        board: newBoard,
        row,
        col,
        num: value,
      });
      const newValidity = validity.map(row => [...row]);
      newValidity[row][col] = response.data.isValid;
      setValidity(newValidity);
      setMessage(null);
    } catch (error) {
      console.error('Error validating move:', error);
      setMessage('Error validating move');
    }
  };

  const checkSolvable = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/solve', { board });
      if (response.data.solution) {
        setMessage('Successful solve');
      } else {
        setMessage('Failed');
      }
    } catch (error) {
      console.error('Error checking solvability:', error);
      setMessage('Error checking solvability');
    }
  };

  const solvePuzzle = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/solve', { board });
      if (response.data.solution) {
        setBoard(response.data.solution);
        setValidity(Array(9).fill(true).map(() => Array(9).fill(true)));
        setMessage('Solution displayed');
      } else {
        setMessage('Failed');
      }
    } catch (error) {
      console.error('Error solving puzzle:', error);
      setMessage('Error solving puzzle');
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Sudoku Game</h1>
      <div className="grid grid-cols-9 w-[360px] h-[360px] border-2 border-gray-400 aspect-square">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              row={rowIndex}
              col={colIndex}
              isInitial={initialBoard[rowIndex][colIndex]}
              isValid={validity[rowIndex][colIndex]}
              onChange={handleCellChange}
            />
          ))
        )}
      </div>
      {message && (
        <div
          className={`mt-2 text-lg ${
            message.includes('Successful') || message.includes('Solution')
              ? 'text-green-500'
              : 'text-red-500'
          }`}
        >
          {message}
        </div>
      )}
      <div className="mt-4 space-x-4">
        <button
          onClick={fetchPuzzle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          New Puzzle
        </button>
        <button
          onClick={checkSolvable}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
        >
          Solve
        </button>
        <button
          onClick={solvePuzzle}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
        >
          Answer
        </button>
      </div>
    </div>
  );
};

export default SudokuBoard;