import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { GoogleSheetsService } from './googleSheets.service';
import type { ICellData } from '@google-table/shared-types';
import type { Request } from 'express';

@Controller('google-sheets')
export class GoogleSheetsController {
  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
  sheetName: string | undefined = '';

  @Get('get-names-sheets')
  async getNamesSheets() {
    if (!this.GOOGLE_SPREADSHEET_ID) {
      throw new Error('Отсутствует ID google sheets');
    }

    return await this.googleSheetsService.getNamesSheets(this.GOOGLE_SPREADSHEET_ID);
  }

  @Get('get-sheet-data')
  async getGoogleSheets(@Req() req: Request) {
    this.sheetName = req.query.sheetName as string;

    if (!this.GOOGLE_SPREADSHEET_ID) {
      throw new Error('Отсутствует ID google sheets');
    }

    if (!this.sheetName) {
      throw new Error('Отсутствует название листа');
    }

    return await this.googleSheetsService.getSheetData(this.GOOGLE_SPREADSHEET_ID, this.sheetName);
  }

  @Post('update-single-cell')
  async updateSingleCell(@Body() body: ICellData) {
    if (!this.GOOGLE_SPREADSHEET_ID) {
      throw new Error('Отсутствует ID google sheets');
    }

    if (!this.sheetName) {
      throw new Error('Отсутствует название листа');
    }

    if (!body) {
      throw new Error('Отсутствуют данные для изменения');
    }

    return await this.googleSheetsService.updateSingleCell(this.GOOGLE_SPREADSHEET_ID, this.sheetName, body);
  }
}
