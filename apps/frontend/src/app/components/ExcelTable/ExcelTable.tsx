import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { excelTableStore } from './ExcelTable.store';
import { ICellData } from '@google-table/shared-types';
import { ExcelTableBody } from './components/ExcelTableBody';
import { Loading } from '../Loading/Loading';
import { ExcelTableHead } from './components/ExcelTableHead';

export const ExcelTable = observer(() => {
  const [localData, setLocalData] = useState<ICellData[]>([]);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [sheetName, setSheetName] = useState<string>('Лист1');

  useEffect(() => {
    excelTableStore.getNamesSheets().then();
  }, []);

  // Необходимо для обновления после получения данных из бека
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    setLocalData([...excelTableStore.data]);
  }, [excelTableStore.data]);

  const loadDataBySheetName = () => {
    excelTableStore.getDataGoogleSheets(sheetName).then(() => {
      setLocalData([...excelTableStore.data]);
    });
  };

  /* Функция для ввода значений в поле таблицы, работает с react useState, после в onBlur грузится уже на backend.
  Необходимо для того, что бы не получать ошибки с запоздалым рендерингом React */
  const handleChange = (row: number, col: number, value: string) => {
    setLocalData((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((cellData) => cellData.row === row && cellData.col === col);
      if (index !== -1) {
        updated[index] = { ...updated[index], value };
      } else {
        updated.push({ row, col, value, isFormula: false });
      }
      return updated;
    });
  };

  // Будет сохраняться только после выхода из фокуса инпута
  const handleBlur = (row: number, col: number) => {
    const cell = localData.find((cellData) => cellData.row === row && cellData.col === col);
    if (!cell) return;

    const storeCell = excelTableStore.data.find((cellData) => cellData.row === row && cellData.col === col);
    const currentValue = cell.value;
    const storeValue = storeCell?.value ?? '';

    if (currentValue === storeValue) {
      return;
    }

    excelTableStore.updateCell(row, col, currentValue).then();
  };

  return (
    <div className="px-[18px] mt-10 flex flex-col">
      <label className="text-[18px] mb-2 font-medium">Выберите название листа</label>

      <div className="flex gap-x-5 mb-4 items-center">
        <select
          className="w-[500px] border-[1px] p-2 rounded-md border-violet-500 text-black outline-none focus:outline-violet-500"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
        >
          <option value="" disabled>
            Выберите лист
          </option>
          {excelTableStore.namesSheets.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          className="border-2 py-2 px-10 rounded-md border-violet-500 hover:text-white hover:bg-violet-500"
          onClick={() => loadDataBySheetName()}
        >
          Получить данные
        </button>

        <div className="flex gap-x-5 mb-2 text-red-500 font-medium text-[18px]">{excelTableStore.errorMessage}</div>
      </div>

      <div className="overflow-auto  relative rounded-lg">
        {excelTableStore.isLoading && <Loading />}

        <table className="border-collapse border border-gray-300 w-full">
          <ExcelTableHead />

          <ExcelTableBody
            localData={localData}
            isLoading={excelTableStore.isLoading}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </table>
      </div>
    </div>
  );
});
