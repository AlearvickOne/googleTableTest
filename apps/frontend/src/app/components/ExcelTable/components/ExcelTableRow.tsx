import { ICellData } from '@google-table/shared-types';
import { ExcelTableCell } from './ExcelTableCell';
import { excelTableStore } from '../ExcelTable.store';

interface ExcelTableRowProps {
  rowIndex: number;
  localData: ICellData[];
  isLoading: boolean;
  onChange: (row: number, col: number, value: string) => void;
  onBlur: (row: number, col: number) => void;
}

export function ExcelTableRow({ rowIndex, localData, isLoading, onChange, onBlur }: ExcelTableRowProps) {
  return (
    <tr key={rowIndex} className="odd:bg-white even:bg-gray-50 hover:bg-yellow-50 transition-colors">
      <th className="bg-gray-100 border border-gray-300 text-center font-medium text-gray-600 select-none">
        {rowIndex + 1}
      </th>
      {Array.from({ length: excelTableStore.colsQuantity }).map((_, collNumber) => {
        const cell = localData.find((cell) => cell.row === rowIndex + 1 && cell.col === collNumber + 1);
        return (
          <ExcelTableCell
            key={collNumber}
            row={rowIndex + 1}
            col={collNumber + 1}
            cell={cell}
            isLoading={isLoading}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
      })}
    </tr>
  );
}
