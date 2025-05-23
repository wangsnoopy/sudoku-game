type Board = number[][];

export class Sudoku {
  private board: Board;

  constructor() {
    this.board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));
  }

  public generatePuzzle(difficulty: number = 40): Board {
    this.fillBoard();
    this.removeNumbers(difficulty);
    return this.board.map(row => [...row]);
  }

  private fillBoard(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (this.isSafe(row, col, num)) {
              this.board[row][col] = num;
              if (this.fillBoard()) {
                return true;
              }
              this.board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private removeNumbers(count: number): void {
    let removed = 0;
    while (removed < count) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (this.board[row][col] !== 0) {
        this.board[row][col] = 0;
        removed++;
      }
    }
  }

  private isSafe(row: number, col: number, num: number): boolean {
    for (let x = 0; x < 9; x++) {
      if (this.board[row][x] === num) return false;
    }
    for (let x = 0; x < 9; x++) {
      if (this.board[x][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  }

  private shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public solve(board: Board): Board | null {
    this.board = board.map(row => [...row]);
    if (this.solveSudoku()) {
      return this.board.map(row => [...row]);
    }
    return null;
  }

  private solveSudoku(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isSafe(row, col, num)) {
              this.board[row][col] = num;
              if (this.solveSudoku()) {
                return true;
              }
              this.board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  public isValidMove(board: Board, row: number, col: number, num: number): boolean {
    const tempBoard = board.map(row => [...row]);
    tempBoard[row][col] = num;
    return this.isSafe(row, col, num);
  }
}