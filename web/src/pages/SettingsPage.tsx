// 设置页面组件
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { AppConfig } from '../types/config';

const SettingsPage: React.FC = () => {
  const { state, updateConfig } = useAppContext();
  const [formConfig, setFormConfig] = useState<AppConfig>(state.config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 当配置变化时，更新表单状态
  useEffect(() => {
    setFormConfig(state.config);
  }, [state.config]);

  // 处理配置变化
  const handleConfigChange = (section: 'dynamodb' | 'theme', field: string, value: any) => {
    setFormConfig(prev => {
      if (section === 'dynamodb') {
        return {
          ...prev,
          dynamodb: {
            ...prev.dynamodb,
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          theme: value as 'light' | 'dark'
        };
      }
    });
  };

  // 处理主题变化
  const handleThemeChange = (theme: 'light' | 'dark') => {
    const updatedConfig = {
      ...formConfig,
      theme
    };
    setFormConfig(updatedConfig);
    updateConfig(updatedConfig);
  };

  // 保存配置
  const handleSaveConfig = () => {
    updateConfig(formConfig);
    setSaveSuccess(true);
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // 重置为默认配置
  const handleResetConfig = () => {
    const defaultConfig: AppConfig = {
      dynamodb: {
        endpoint: 'http://localhost:8000',
        region: 'us-east-1',
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
      },
      theme: 'light'
    };
    setFormConfig(defaultConfig);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">设置</h2>
        <p className="text-gray-600 dark:text-gray-300">配置 DynamoDB 连接信息和应用主题</p>
      </div>

      {saveSuccess && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-green-200 dark:border-green-800 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 dark:text-green-400">✅</span>
            </div>
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">配置保存成功！</h4>
              <p className="text-green-600 dark:text-green-400">配置已成功保存，部分更改可能需要刷新页面才能生效</p>
            </div>
          </div>
        </div>
      )}

      {/* DynamoDB 配置 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6">DynamoDB 连接配置</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              端点 URL
            </label>
            <input
              type="text"
              value={formConfig.dynamodb.endpoint}
              onChange={(e) => handleConfigChange('dynamodb', 'endpoint', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
              placeholder="输入 DynamoDB 端点 URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              区域
            </label>
            <input
              type="text"
              value={formConfig.dynamodb.region}
              onChange={(e) => handleConfigChange('dynamodb', 'region', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
              placeholder="输入区域"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              访问密钥
            </label>
            <input
              type="text"
              value={formConfig.dynamodb.accessKeyId}
              onChange={(e) => handleConfigChange('dynamodb', 'accessKeyId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
              placeholder="输入访问密钥"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              密钥
            </label>
            <input
              type="text"
              value={formConfig.dynamodb.secretAccessKey}
              onChange={(e) => handleConfigChange('dynamodb', 'secretAccessKey', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
              placeholder="输入密钥"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-md transition-all duration-300"
            >
              保存配置
            </button>
            <button
              onClick={handleResetConfig}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              重置默认
            </button>
          </div>
        </div>
      </div>

      {/* 主题设置 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6">主题设置</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-6 rounded-xl transition-all duration-300 border-2 ${formConfig.theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">☀️</span>
              </div>
              <h4 className="font-medium">浅色主题</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">适合明亮的环境，减轻眼睛疲劳</p>
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-6 rounded-xl transition-all duration-300 border-2 ${formConfig.theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-200 text-xl">🌙</span>
              </div>
              <h4 className="font-medium">深色主题</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">适合黑暗的环境，减少屏幕亮度</p>
          </button>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-yellow-600 dark:text-yellow-400 text-xl">💡</span>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-3">提示</h4>
            <ul className="space-y-2 text-sm text-yellow-600 dark:text-yellow-400">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>本地 DynamoDB 默认端点为 http://localhost:8000</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>本地开发时，访问密钥和密钥可以使用任意值</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>配置修改后部分更改需要刷新页面才能生效</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>本地开发时，端点应设置为 http://localhost:8000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;