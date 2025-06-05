import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './components/googleSheets/googleSheets.service';
import { GoogleSheetsController } from './components/googleSheets/googleSheets.controller';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController, GoogleSheetsController],
  providers: [GoogleSheetsService],
})
export class AppModule {}
