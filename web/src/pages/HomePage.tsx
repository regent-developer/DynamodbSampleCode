// 首页组件
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import React from 'react';
import { useAppContext } from '../context/appContext';

const HomePage: React.FC = () => {
  const { state } = useAppContext();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">首页</h2>
        <p className="text-gray-600 dark:text-gray-300">欢迎使用 DynamoDB 管理工具</p>
      </div>

      {/* 状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 连接状态 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-xl">🔌</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">连接状态</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${state.dynamoDBService ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${state.dynamoDBService ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {state.dynamoDBService ? '已连接' : '未连接'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                端点: {state.config.dynamodb.endpoint}
              </p>
            </div>
          </div>
        </div>

        {/* 表统计 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 dark:text-green-400 text-xl">📁</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">表统计</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {state.tables.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                个表
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 表管理 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-purple-600 dark:text-purple-400 text-xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">表管理</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            创建、列出、删除表，管理表结构
          </p>
        </div>

        {/* 数据操作 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-orange-600 dark:text-orange-400 text-xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">数据操作</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            对表中的数据进行增删改查操作
          </p>
        </div>

        {/* 配置管理 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-indigo-600 dark:text-indigo-400 text-xl">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">配置管理</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            配置 DynamoDB 连接信息和应用主题
          </p>
        </div>

        {/* 主题切换 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-teal-600 dark:text-teal-400 text-xl">🎨</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">主题切换</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            在浅色和深色主题之间切换
          </p>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">快速操作</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <h4 className="font-medium mb-2">启动本地 DynamoDB</h4>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
              docker-compose up -d
            </pre>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <h4 className="font-medium mb-2">启动开发服务器</h4>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
              cd web && npm run dev
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;