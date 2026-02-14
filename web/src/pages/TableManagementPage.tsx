// 表管理页面组件
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import React, { useState } from 'react';
import { useAppContext } from '../context/appContext';
import { CreateTableParams } from '../types/dynamodb';

const TableManagementPage: React.FC = () => {
  const { state, refreshTables, selectTable } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // 创建表表单状态
  const [createTableForm, setCreateTableForm] = useState({
    tableName: '',
    partitionKey: '',
    partitionKeyType: 'S' as 'S' | 'N' | 'B',
    sortKey: '',
    sortKeyType: 'S' as 'S' | 'N' | 'B',
    readCapacity: 5,
    writeCapacity: 5
  });

  // 处理创建表表单输入变化
  const handleCreateTableInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateTableForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理创建表
  const handleCreateTable = async () => {
    if (!createTableForm.tableName || !createTableForm.partitionKey) {
      alert('表名和分区键不能为空');
      return;
    }

    try {
      const params: CreateTableParams = {
        TableName: createTableForm.tableName,
        KeySchema: [
          {
            AttributeName: createTableForm.partitionKey,
            KeyType: 'HASH'
          }
        ],
        AttributeDefinitions: [
          {
            AttributeName: createTableForm.partitionKey,
            AttributeType: createTableForm.partitionKeyType
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: createTableForm.readCapacity,
          WriteCapacityUnits: createTableForm.writeCapacity
        }
      };

      // 添加排序键（如果有）
      if (createTableForm.sortKey) {
        params.KeySchema.push({
          AttributeName: createTableForm.sortKey,
          KeyType: 'RANGE'
        });
        params.AttributeDefinitions.push({
          AttributeName: createTableForm.sortKey,
          AttributeType: createTableForm.sortKeyType
        });
      }

      // 调用服务创建表
      await state.dynamoDBService?.createTable(params);
      
      // 刷新表列表
      await refreshTables();
      
      // 关闭模态框并重置表单
      setShowCreateModal(false);
      setCreateTableForm({
        tableName: '',
        partitionKey: '',
        partitionKeyType: 'S',
        sortKey: '',
        sortKeyType: 'S',
        readCapacity: 5,
        writeCapacity: 5
      });
    } catch (error) {
      console.error('Failed to create table:', error);
      alert('创建表失败，请检查控制台输出');
    }
  };

  // 处理删除表
  const handleDeleteTable = async (tableName: string) => {
    if (!confirm(`确定要删除表 ${tableName} 吗？此操作不可恢复。`)) {
      return;
    }

    try {
      await state.dynamoDBService?.deleteTable(tableName);
      await refreshTables();
    } catch (error) {
      console.error('Failed to delete table:', error);
      alert('删除表失败，请检查控制台输出');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">表管理</h2>
        <p className="text-gray-600 dark:text-gray-300">管理 DynamoDB 表</p>
      </div>

      {/* 操作栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshTables()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            刷新列表
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-md transition-all duration-300"
          >
            创建表
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          共 {state.tables.length} 个表
        </div>
      </div>

      {/* 表列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  表名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {state.tables.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    暂无表
                  </td>
                </tr>
              ) : (
                state.tables.map((tableName) => (
                  <tr key={tableName} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {tableName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => selectTable(tableName)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          查看
                        </button>
                        <button
                          onClick={() => handleDeleteTable(tableName)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建表模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">创建表</h3>
            
            <form className="space-y-4">
              {/* 表名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  表名
                </label>
                <input
                  type="text"
                  name="tableName"
                  value={createTableForm.tableName}
                  onChange={handleCreateTableInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="输入表名"
                />
              </div>

              {/* 分区键 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    分区键
                  </label>
                  <input
                    type="text"
                    name="partitionKey"
                    value={createTableForm.partitionKey}
                    onChange={handleCreateTableInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="输入分区键"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    分区键类型
                  </label>
                  <select
                    name="partitionKeyType"
                    value={createTableForm.partitionKeyType}
                    onChange={handleCreateTableInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="S">字符串 (S)</option>
                    <option value="N">数字 (N)</option>
                    <option value="B">二进制 (B)</option>
                  </select>
                </div>
              </div>

              {/* 排序键 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    排序键 (可选)
                  </label>
                  <input
                    type="text"
                    name="sortKey"
                    value={createTableForm.sortKey}
                    onChange={handleCreateTableInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="输入排序键"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    排序键类型
                  </label>
                  <select
                    name="sortKeyType"
                    value={createTableForm.sortKeyType}
                    onChange={handleCreateTableInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="S">字符串 (S)</option>
                    <option value="N">数字 (N)</option>
                    <option value="B">二进制 (B)</option>
                  </select>
                </div>
              </div>

              {/* 预配置吞吐量 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    读取容量
                  </label>
                  <input
                    type="number"
                    name="readCapacity"
                    value={createTableForm.readCapacity}
                    onChange={handleCreateTableInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    写入容量
                  </label>
                  <input
                    type="number"
                    name="writeCapacity"
                    value={createTableForm.writeCapacity}
                    onChange={handleCreateTableInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleCreateTable}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagementPage;