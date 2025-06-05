import { ICellData } from '@google-table/shared-types';
import { ExcelTableRow } from './ExcelTableRow';
import { excelTableStore } from '../ExcelTable.store';

interface ExcelTableBodyProps {
  localData: ICellData[];
  isLoading: boolean;
  onChange: (row: number, col: number, value: string) => void;
  onBlur: (row: number, col: number) => void;
}

export function ExcelTableBody({ localData, isLoading, onChange, onBlur }: ExcelTableBodyProps) {
  return (
    <tbody>
      {Array.from({ length: excelTableStore.rowsQuantity }).map((_, rowNumber) => (
        <ExcelTableRow
          key={rowNumber}
          rowIndex={rowNumber}
          localData={localData}
          isLoading={isLoading}
          onChange={onChange}
          onBlur={onBlur}
        />
      ))}
    </tbody>
  );
}
