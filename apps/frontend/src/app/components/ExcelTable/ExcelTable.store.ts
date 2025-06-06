import { makeAutoObservable, runInAction } from 'mobx';
import { ICellData } from '@google-table/shared-types';
import { excelTableService } from './ExcelTable.service';

class ExcelTableStore {
  namesSheets: string[] = [];
  data: ICellData[] = [];
  isLoading = false;

  rowsQuantity = 20;
  colsQuantity = 20;

  errorMessage = '';

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  async getNamesSheets() {
    try {
      this.setIsLoading(true);
      const namesSheets = await excelTableService.getNamesSheets();

      runInAction(() => {
        this.namesSheets = Array.isArray(namesSheets) ? namesSheets : [];
      });
    } catch (e: any) {
      this.errorMessage = e.message;
    } finally {
      this.setIsLoading(false);
    }
  }

  // Загрузка полей из страницы
  async getDataGoogleSheets(sheetName: string) {
    try {
      if (!sheetName) return;

      this.setIsLoading(true);

      const data = await excelTableService.getDataGoogleSheets(sheetName);

      runInAction(() => {
        this.data = Array.isArray(data) ? data : [];
        this.errorMessage = '';
      });
    } catch (e: any) {
      this.errorMessage = e.message;
      this.data = [];
    } finally {
      this.setIsLoading(false);
    }
  }

  // Обновление поля и получение новых данных через back
  async updateCell(row: number, col: number, value: string | number) {
    try {
      const existingCell = this.data.find((cellData) => cellData.row === row && cellData.col === col);

      if (existingCell?.isFormula) return;

      const updatedCell: ICellData = { row, col, value, isFormula: false };

      this.setIsLoading(true);

      runInAction(() => {
        if (existingCell) {
          existingCell.value = value;
        } else {
          this.data.push(updatedCell);
        }
      });

      const data = await excelTableService.updateCell(updatedCell);

      runInAction(() => {
        this.data = data;
        this.errorMessage = '';
      });
    } catch (e: any) {
      this.errorMessage = e.message;
    } finally {
      this.setIsLoading(false);
    }
  }
}

export const excelTableStore = new ExcelTableStore();
