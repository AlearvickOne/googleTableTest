import axios from 'axios';
import { ICellData } from '@google-table/shared-types';
import { BACK_URL } from '../../../config';

export class ExcelTableService {
  private readonly URL_BACKEND_GOOGLE_SHEETS = `${BACK_URL}/google-sheets`;

  async getNamesSheets() {
    try {
      const response = await axios.get(this.URL_BACKEND_GOOGLE_SHEETS + `/get-names-sheets`);
      return response.data;
    } catch (e: any) {
      throw new Error(`Ошибка при загрузке данных из Google Sheets, невозможно загрузить названия листов`);
    }
  }

  async getDataGoogleSheets(sheetName: string) {
    try {
      const response = await axios.get(this.URL_BACKEND_GOOGLE_SHEETS + `/get-sheet-data?sheetName=${sheetName}`);

      return response.data.map((cell: ICellData) => ({ ...cell }));
    } catch (e: any) {
      throw new Error(`Ошибка при загрузке данных из Google Sheets, проверьте совпадение названий листов.`);
    }
  }

  async updateCell(updatedCell: ICellData) {
    try {
      const res = await axios.post(this.URL_BACKEND_GOOGLE_SHEETS + '/update-single-cell', updatedCell);

      return res.data;
    } catch (e: any) {
      throw new Error(
        `Ошибка при обновлении ячейки в Google Sheets, попробуйте еще раз. Проверьте, совпадает ли название листа.`
      );
    }
  }
}

export const excelTableService = new ExcelTableService();
