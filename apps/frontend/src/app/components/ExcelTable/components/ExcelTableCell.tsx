import { ICellData } from '@google-table/shared-types';

interface ExcelTableCellProps {
  row: number;
  col: number;
  cell?: ICellData;
  isLoading: boolean;
  onChange: (row: number, col: number, value: string) => void;
  onBlur: (row: number, col: number) => void;
}

export function ExcelTableCell({ row, col, cell, isLoading, onChange, onBlur }: ExcelTableCellProps) {
  const isFormula = cell?.isFormula ?? false;

  return (
    <td className="border border-gray-300 p-0">
      <textarea
        value={cell?.value ?? ''}
        rows={2}
        cols={20}
        readOnly={isFormula || isLoading}
        onChange={(e) => !isFormula && onChange(row, col, e.target.value)}
        onBlur={() => !isFormula && onBlur(row, col)}
        className={`w-full h-full resize-none px-2 py-1 text-sm font-normal leading-tight outline-none
          ${
            isFormula
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:bg-yellow-50'
          }`}
        spellCheck={false}
      />
    </td>
  );
}
