import { excelTableStore } from '../ExcelTable.store';

export function ExcelTableHead() {
  const getColumnLabel = (index: number) => {
    let label = '';
    do {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    return label;
  };

  return (
    <thead>
      <tr>
        <th className="w-12 bg-gray-100 border border-gray-300"></th>
        {Array.from({ length: excelTableStore.colsQuantity }).map((_, collNumber) => (
          <th
            key={collNumber}
            className="w-24 px-3 py-2 bg-gray-100 border border-gray-300 text-center font-medium text-gray-700 select-none"
          >
            {getColumnLabel(collNumber)}
          </th>
        ))}
      </tr>
    </thead>
  );
}
