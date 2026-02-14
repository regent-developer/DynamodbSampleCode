// App 主组件
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-13

import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/appContext';
import HomePage from './pages/HomePage';
import TableManagementPage from './pages/TableManagementPage';
import DataOperationPage from './pages/DataOperationPage';
import SettingsPage from './pages/SettingsPage';

// 页面类型
type PageType = 'home' | 'tables' | 'data' | 'settings';

// 应用内容组件
const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // 根据主题配置更新 html 元素的 dark 类
  useEffect(() => {
    if (state.config.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.config.theme]);

  // 渲染当前页面
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'tables':
        return <TableManagementPage />;
      case 'data':
        return <DataOperationPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-700 font-bold text-xl">D</span>
            </div>
            <h1 className="text-2xl font-bold">DynamoDB 管理工具</h1>
          </div>
          <nav className="w-full md:w-auto">
            <ul className="flex flex-wrap justify-center md:justify-end gap-2">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === 'home' ? 'bg-white text-blue-700 font-medium' : 'hover:bg-blue-700/50'}`}
                >
                  首页
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('tables')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === 'tables' ? 'bg-white text-blue-700 font-medium' : 'hover:bg-blue-700/50'}`}
                >
                  表管理
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('data')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === 'data' ? 'bg-white text-blue-700 font-medium' : 'hover:bg-blue-700/50'}`}
                >
                  数据操作
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === 'settings' ? 'bg-white text-blue-700 font-medium' : 'hover:bg-blue-700/50'}`}
                >
                  设置
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {renderCurrentPage()}
        </div>
      </main>
      <footer className="bg-gray-200 dark:bg-gray-800 p-6 mt-12 border-t border-gray-300 dark:border-gray-700">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">© 2026 DynamoDB 管理工具 | 版本 1.0.0</p>
          <p className="text-xs mt-2">使用 React 18 + TypeScript + Tailwind CSS 构建</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;