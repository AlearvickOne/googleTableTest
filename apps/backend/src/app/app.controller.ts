import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test-connection')
  testConnection() {
    return 'Server is running';
  }
}
