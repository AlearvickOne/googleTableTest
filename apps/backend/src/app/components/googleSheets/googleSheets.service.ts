import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import fs from 'fs/promises';
import { ICellData } from '@google-table/shared-types';

@Injectable()
export class GoogleSheetsService {
  // Авторизация в гугле
  private async _authGoogleSheets() {
    const credentialsFile = await fs.readFile(__dirname + '/../credentials.json', 'utf8');
    const credentials = JSON.parse(credentialsFile);

    const jwtClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    await jwtClient.authorize();
    return google.sheets({ version: 'v4', auth: jwtClient });
  }

  // Парсинг данных под интерфейс ICellData
  private _parseGridData(gridData: any): ICellData[] {
    const result: ICellData[] = [];

    if (!gridData?.rowData) return result;

    gridData.rowData.forEach((row: any, rowIndex: number) => {
      const cells = row.values || [];
      cells.forEach((cell: any, colIndex: number) => {
        const value = cell.effectiveValue?.stringValue ?? cell.effectiveValue?.numberValue ?? '';

        const isFormula = !!cell.userEnteredValue?.formulaValue;

        result.push({
          row: rowIndex + 1,
          col: colIndex + 1,
          value,
          isFormula,
        });
      });
    });

    return result;
  }

  // Получение названия листов
  async getNamesSheets(sheetId: string) {
    const sheets = await this._authGoogleSheets();

    const res = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    return res.data.sheets?.map((sheet) => sheet.properties?.title || '') ?? [];
  }

  // Получение данных с листа
  async getSheetData(sheetId: string, sheetName: string) {
    const sheets = await this._authGoogleSheets();

    const res = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      includeGridData: true,
      ranges: [`${sheetName}!A1:T20`],
    });

    const gridData = res.data.sheets?.[0]?.data?.[0];
    return this._parseGridData(gridData);
  }

  // Обновление одной ячейки и получение данных с листа
  async updateSingleCell(sheetId: string, sheetName: string, cell: ICellData) {
    const sheets = await this._authGoogleSheets();

    // Преобразование номера колонки в буквенное представление и формирование в формате A1 нотации для поиска колонки
    const colLetter = String.fromCharCode(64 + cell.col); // A=65
    const a1Notation = `${sheetName}!${colLetter}${cell.row}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: a1Notation,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[cell.value]],
      },
    });

    const res = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      includeGridData: true,
      ranges: [`${sheetName}!A1:T20`],
    });

    const gridData = res.data.sheets?.[0]?.data?.[0];
    return this._parseGridData(gridData);
  }
}
