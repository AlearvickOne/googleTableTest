import axios from 'axios';
import { BACK_URL } from '../config';

class AppService {
  private readonly URL_TEST_CONNECTION = `${BACK_URL}/test-connection`;

  async testConnection() {
    try {
      await axios.get(this.URL_TEST_CONNECTION);
      return true;
    } catch (e: any) {
      return false;
    }
  }
}

export const appService = new AppService();
