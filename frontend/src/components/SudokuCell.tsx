import React, { ChangeEvent, useCallback } from 'react';

interface SudokuCellProps {
  value: number;
  row: number;
  col: number;
  isInitial: boolean;
  isValid: boolean;
  onChange: (row: number, col: number, value: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  row,
  col,
  isInitial,
  isValid,
  onChange,
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '' || /^[1-9]$/.test(val)) {
        onChange(row, col, val === '' ? 0 : parseInt(val, 10));
      }
    },
    [row, col, onChange]
  );

  const baseClass = 'w-10 h-10 text-center text-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 box-border';
  const bgClass = isInitial ? 'bg-gray-200 font-bold cursor-not-allowed' : 'bg-white';
  const textClass = !isValid && value !== 0 ? 'text-red-500' : 'text-black';
  const borderRight = col % 3 === 2 && col !== 8 ? 'border-r-2 border-gray-400' : '';
  const borderBottom = row % 3 === 2 && row !== 8 ? 'border-b-2 border-gray-400' : '';

  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value === 0 ? '' : value}
      onChange={handleChange}
      disabled={isInitial}
      aria-label={`Sudoku cell at row ${row + 1}, column ${col + 1}`}
      className={`${baseClass} ${bgClass} ${textClass} ${borderRight} ${borderBottom} border-gray-300 transition-colors duration-200`}
    />
  );
};