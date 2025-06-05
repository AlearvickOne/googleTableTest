import { ExcelTable } from './components/ExcelTable/ExcelTable';
import { appService } from './App.service';
import { useEffect, useState } from 'react';

export function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    appService.testConnection().then((status) => setIsConnected(status));
  }, []);

  return (
    <div>
      {isConnected ? (
        <ExcelTable />
      ) : (
        <div className="text-black flex flex-col justify-center items-center h-screen w-full font-medium text-[30px]">
          <p>Ошибка в работе сервера</p>
          <p>Попробуйте обновить страницу</p>
        </div>
      )}
    </div>
  );
}

export default App;
