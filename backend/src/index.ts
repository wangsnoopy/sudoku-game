import express, { Request, Response } from 'express';
import cors from 'cors';
import { Sudoku } from './sudoku';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to generate a new puzzle
app.get('/api/puzzle', (req: Request, res: Response) => {
  const sudoku = new Sudoku();
  const puzzle = sudoku.generatePuzzle(40);
  res.json({ puzzle });
  return;
});

// Endpoint to solve a puzzle
app.post('/api/solve', (req: Request, res: Response) => {
  const { board } = req.body;
  if (!board || !Array.isArray(board) || board.length !== 9 || board.some((row: any) => !Array.isArray(row) || row.length !== 9)) {
    res.status(400).json({ error: 'Invalid board format' });
    return;
  }
  const sudoku = new Sudoku();
  const solution = sudoku.solve(board);
  if (solution) {
    res.json({ solution });
    return;
  }
  res.status(400).json({ error: 'No solution exists' });
  return;
});

// Endpoint to validate a move
app.post('/api/validate', (req: Request, res: Response) => {
  const { board, row, col, num } = req.body;
  if (!board || row < 0 || row > 8 || col < 0 || col > 8 || num < 1 || num > 9) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const sudoku = new Sudoku();
  const isValid = sudoku.isValidMove(board, row, col, num);
  res.json({ isValid });
  return;
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});