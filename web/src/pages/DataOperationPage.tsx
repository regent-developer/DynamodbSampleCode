// 数据操作页面组件
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { DynamoDBItem } from '../types/dynamodb';

const DataOperationPage: React.FC = () => {
  const { state, selectTable, refreshTableData } = useAppContext();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [operationType, setOperationType] = useState<'create' | 'read' | 'update' | 'delete' | 'query'>('create');
  
  // 表单状态
  const [formData, setFormData] = useState<DynamoDBItem>({});
  const [keyData, setKeyData] = useState<DynamoDBItem>({});
  const [updateData, setUpdateData] = useState<DynamoDBItem>({});
  const [queryData, setQueryData] = useState({
    keyConditionExpression: '',
    expressionAttributeValues: ''
  });

  // 当选中表变化时，更新本地状态
  useEffect(() => {
    if (state.currentTable) {
      setSelectedTable(state.currentTable);
    }
  }, [state.currentTable]);

  // 处理表选择
  const handleTableSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tableName = e.target.value;
    if (tableName) {
      await selectTable(tableName);
    }
  };

  // 处理表单输入变化
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理键输入变化
  const handleKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理更新数据输入变化
  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理查询输入变化
  const handleQueryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQueryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理创建数据
  const handleCreateData = async () => {
    if (!state.currentTable) return;

    try {
      await state.dynamoDBService?.putItem(state.currentTable, formData);
      await refreshTableData();
      setFormData({});
      alert('创建成功！');
    } catch (error) {
      console.error('Failed to create data:', error);
      alert('创建失败，请检查控制台输出');
    }
  };

  // 处理读取数据
  const handleReadData = async () => {
    if (!state.currentTable) return;

    try {
      const item = await state.dynamoDBService?.getItem(state.currentTable, keyData);
      if (item) {
        setFormData(item);
      } else {
        alert('未找到数据');
      }
    } catch (error) {
      console.error('Failed to read data:', error);
      alert('读取失败，请检查控制台输出');
    }
  };

  // 处理更新数据
  const handleUpdateData = async () => {
    if (!state.currentTable) return;

    try {
      // 构建更新表达式
      const updateExpressions: string[] = [];
      const expressionAttributeValues: DynamoDBItem = {};

      Object.entries(updateData).forEach(([key, value]) => {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
      });

      if (updateExpressions.length === 0) {
        alert('请输入要更新的数据');
        return;
      }

      const updateExpression = `SET ${updateExpressions.join(', ')}`;

      await state.dynamoDBService?.updateItem(
        state.currentTable,
        keyData,
        updateExpression,
        expressionAttributeValues
      );

      await refreshTableData();
      setKeyData({});
      setUpdateData({});
      alert('更新成功！');
    } catch (error) {
      console.error('Failed to update data:', error);
      alert('更新失败，请检查控制台输出');
    }
  };

  // 处理删除数据
  const handleDeleteData = async () => {
    if (!state.currentTable) return;

    try {
      await state.dynamoDBService?.deleteItem(state.currentTable, keyData);
      await refreshTableData();
      setKeyData({});
      alert('删除成功！');
    } catch (error) {
      console.error('Failed to delete data:', error);
      alert('删除失败，请检查控制台输出');
    }
  };

  // 处理查询数据
  const handleQueryData = async () => {
    if (!state.currentTable) return;

    try {
      const params = {
        TableName: state.currentTable,
        KeyConditionExpression: queryData.keyConditionExpression
      };

      // 解析表达式属性值
      if (queryData.expressionAttributeValues) {
        try {
          params.ExpressionAttributeValues = JSON.parse(queryData.expressionAttributeValues);
        } catch (error) {
          alert('表达式属性值格式错误，请使用 JSON 格式');
          return;
        }
      }

      const data = await state.dynamoDBService?.query(params);
      if (data) {
        // 这里可以将查询结果显示在界面上
        console.log('Query result:', data);
        alert(`查询成功，找到 ${data.length} 条数据`);
      }
    } catch (error) {
      console.error('Failed to query data:', error);
      alert('查询失败，请检查控制台输出');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">数据操作</h2>
        <p className="text-gray-600 dark:text-gray-300">对表中的数据进行增删改查操作</p>
      </div>

      {/* 表选择 */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          选择表
        </label>
        <select
          value={selectedTable}
          onChange={handleTableSelect}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="">请选择表</option>
          {state.tables.map(tableName => (
            <option key={tableName} value={tableName}>
              {tableName}
            </option>
          ))}
        </select>
      </div>

      {state.currentTable && (
        <>
          {/* 操作类型选择 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              操作类型
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'create', label: '创建' },
                { value: 'read', label: '读取' },
                { value: 'update', label: '更新' },
                { value: 'delete', label: '删除' },
                { value: 'query', label: '查询' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setOperationType(option.value as any)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${operationType === option.value ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 操作表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
            {operationType === 'create' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">创建数据</h3>
                
                {/* 动态表单，根据表结构生成 */}
                {state.currentTableInfo?.KeySchema.map(key => (
                  <div key={key.AttributeName}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {key.AttributeName} ({key.KeyType === 'HASH' ? '分区键' : '排序键'})
                    </label>
                    <input
                      type="text"
                      name={key.AttributeName}
                      value={formData[key.AttributeName] || ''}
                      onChange={handleFormInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder={`输入 ${key.AttributeName}`}
                    />
                  </div>
                ))}

                {/* 其他属性（如果有） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    其他属性（可选）
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleFormInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="输入 name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="value"
                        value={formData.value || ''}
                        onChange={handleFormInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="输入 value"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateData}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  创建
                </button>
              </div>
            )}

            {operationType === 'read' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">读取数据</h3>
                
                {/* 键输入 */}
                {state.currentTableInfo?.KeySchema.map(key => (
                  <div key={key.AttributeName}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {key.AttributeName} ({key.KeyType === 'HASH' ? '分区键' : '排序键'})
                    </label>
                    <input
                      type="text"
                      name={key.AttributeName}
                      value={keyData[key.AttributeName] || ''}
                      onChange={handleKeyInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder={`输入 ${key.AttributeName}`}
                    />
                  </div>
                ))}

                <button
                  onClick={handleReadData}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  读取
                </button>

                {/* 读取结果 */}
                {Object.keys(formData).length > 0 && (
                  <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="font-medium mb-2">读取结果</h4>
                    <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                      {JSON.stringify(formData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {operationType === 'update' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">更新数据</h3>
                
                {/* 键输入 */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">键</h4>
                  {state.currentTableInfo?.KeySchema.map(key => (
                    <div key={key.AttributeName} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {key.AttributeName} ({key.KeyType === 'HASH' ? '分区键' : '排序键'})
                      </label>
                      <input
                        type="text"
                        name={key.AttributeName}
                        value={keyData[key.AttributeName] || ''}
                        onChange={handleKeyInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder={`输入 ${key.AttributeName}`}
                      />
                    </div>
                  ))}
                </div>

                {/* 更新数据 */}
                <div>
                  <h4 className="font-medium mb-2">更新数据</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={updateData.name || ''}
                        onChange={handleUpdateInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="输入 name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="value"
                        value={updateData.value || ''}
                        onChange={handleUpdateInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="输入 value"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdateData}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  更新
                </button>
              </div>
            )}

            {operationType === 'delete' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">删除数据</h3>
                
                {/* 键输入 */}
                {state.currentTableInfo?.KeySchema.map(key => (
                  <div key={key.AttributeName}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {key.AttributeName} ({key.KeyType === 'HASH' ? '分区键' : '排序键'})
                    </label>
                    <input
                      type="text"
                      name={key.AttributeName}
                      value={keyData[key.AttributeName] || ''}
                      onChange={handleKeyInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder={`输入 ${key.AttributeName}`}
                    />
                  </div>
                ))}

                <button
                  onClick={handleDeleteData}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  删除
                </button>
              </div>
            )}

            {operationType === 'query' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">查询数据</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    键条件表达式
                  </label>
                  <input
                    type="text"
                    name="keyConditionExpression"
                    value={queryData.keyConditionExpression}
                    onChange={handleQueryInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="例如：id = :id"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    表达式属性值 (JSON 格式)
                  </label>
                  <textarea
                    name="expressionAttributeValues"
                    value={queryData.expressionAttributeValues}
                    onChange={handleQueryInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="例如：{\":id\": \"123\"}"
                  ></textarea>
                </div>

                <button
                  onClick={handleQueryData}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  查询
                </button>
              </div>
            )}
          </div>

          {/* 表数据列表 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">表数据</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {state.currentTableInfo?.KeySchema.map(key => (
                      <th key={key.AttributeName} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {key.AttributeName}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      其他属性
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {state.tableData.length === 0 ? (
                    <tr>
                      <td colSpan={state.currentTableInfo?.KeySchema.length + 1} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    state.tableData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {state.currentTableInfo?.KeySchema.map(key => (
                          <td key={key.AttributeName} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item[key.AttributeName]}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <pre className="text-xs">
                            {JSON.stringify(
                              Object.fromEntries(
                                Object.entries(item).filter(([key]) => 
                                  !state.currentTableInfo?.KeySchema.some(k => k.AttributeName === key)
                                )
                              ),
                              null, 2
                            )}
                          </pre>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataOperationPage;