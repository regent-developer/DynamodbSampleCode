// 应用状态管理 Context
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, AppContextType } from './types';
import { loadConfig, saveConfig } from '../utils/configManager';
import { createDynamoDBService } from '../services/dynamodbService';

// 初始状态
const initialState: AppState = {
  config: loadConfig(),
  dynamoDBService: null,
  tables: [],
  currentTable: null,
  currentTableInfo: null,
  tableData: [],
  loading: {
    config: false,
    tables: false,
    tableInfo: false,
    tableData: false,
    operation: false
  },
  error: null
};

// Reducer 函数
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CONFIG':
      return {
        ...state,
        config: action.payload
      };
    case 'SET_DYNAMODB_SERVICE':
      return {
        ...state,
        dynamoDBService: action.payload
      };
    case 'SET_TABLES':
      return {
        ...state,
        tables: action.payload
      };
    case 'SET_CURRENT_TABLE':
      return {
        ...state,
        currentTable: action.payload,
        currentTableInfo: null,
        tableData: []
      };
    case 'SET_CURRENT_TABLE_INFO':
      return {
        ...state,
        currentTableInfo: action.payload
      };
    case 'SET_TABLE_DATA':
      return {
        ...state,
        tableData: action.payload
      };
    case 'ADD_TABLE_DATA':
      return {
        ...state,
        tableData: [...state.tableData, action.payload]
      };
    case 'UPDATE_TABLE_DATA':
      return {
        ...state,
        tableData: state.tableData.map(item => {
          // 简单实现：假设项目有唯一标识符
          const itemKeys = Object.keys(item).filter(key => 
            state.currentTableInfo?.KeySchema.some(k => k.AttributeName === key)
          );
          
          const isSameItem = itemKeys.every(key => item[key] === action.payload[key]);
          return isSameItem ? action.payload : item;
        })
      };
    case 'REMOVE_TABLE_DATA':
      return {
        ...state,
        tableData: state.tableData.filter(item => {
          // 简单实现：假设项目有唯一标识符
          const itemKeys = Object.keys(item).filter(key => 
            state.currentTableInfo?.KeySchema.some(k => k.AttributeName === key)
          );
          
          return !itemKeys.every(key => item[key] === action.payload[key]);
        })
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'RESET_ERROR':
      return {
        ...state,
        error: null
      };
    case 'RESET_STATE':
      return {
        ...initialState,
        config: state.config
      };
    default:
      return state;
  }
};

// 创建 Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 组件
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始化 DynamoDB 服务
  useEffect(() => {
    const initDynamoDBService = () => {
      try {
        const service = createDynamoDBService(state.config.dynamodb);
        dispatch({ type: 'SET_DYNAMODB_SERVICE', payload: service });
      } catch (error) {
        console.error('Failed to initialize DynamoDB service:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize DynamoDB service' });
      }
    };

    initDynamoDBService();
  }, [state.config.dynamodb]);

  // 刷新表列表
  const refreshTables = async () => {
    if (!state.dynamoDBService) {
      dispatch({ type: 'SET_ERROR', payload: 'DynamoDB service not initialized' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: { tables: true } });
    dispatch({ type: 'RESET_ERROR' });

    try {
      const tables = await state.dynamoDBService.listTables();
      dispatch({ type: 'SET_TABLES', payload: tables });
    } catch (error) {
      console.error('Failed to list tables:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to list tables' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { tables: false } });
    }
  };

  // 选择表
  const selectTable = async (tableName: string) => {
    if (!state.dynamoDBService) {
      dispatch({ type: 'SET_ERROR', payload: 'DynamoDB service not initialized' });
      return;
    }

    dispatch({ type: 'SET_CURRENT_TABLE', payload: tableName });
    dispatch({ type: 'SET_LOADING', payload: { tableInfo: true } });
    dispatch({ type: 'RESET_ERROR' });

    try {
      const tableInfo = await state.dynamoDBService.getTableInfo(tableName);
      dispatch({ type: 'SET_CURRENT_TABLE_INFO', payload: tableInfo });
      await refreshTableData();
    } catch (error) {
      console.error('Failed to get table info:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get table info' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { tableInfo: false } });
    }
  };

  // 刷新表数据
  const refreshTableData = async () => {
    if (!state.dynamoDBService || !state.currentTable) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: { tableData: true } });
    dispatch({ type: 'RESET_ERROR' });

    try {
      const data = await state.dynamoDBService.scan({
        TableName: state.currentTable
      });
      dispatch({ type: 'SET_TABLE_DATA', payload: data });
    } catch (error) {
      console.error('Failed to scan table data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to scan table data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { tableData: false } });
    }
  };

  // 更新配置
  const updateConfig = (config: AppState['config']) => {
    dispatch({ type: 'SET_CONFIG', payload: config });
    saveConfig(config);
  };

  // 初始加载表列表
  useEffect(() => {
    if (state.dynamoDBService) {
      refreshTables();
    }
  }, [state.dynamoDBService]);

  const value: AppContextType = {
    state,
    dispatch,
    refreshTables,
    selectTable,
    refreshTableData,
    updateConfig
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义 Hook
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;