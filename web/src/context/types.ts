// 状态管理类型定义
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import { AppConfig } from '../types/config';
import { TableInfo, DynamoDBItem } from '../types/dynamodb';
import DynamoDBService from '../services/dynamodbService';

/**
 * 应用状态
 */
export interface AppState {
  /**
   * 应用配置
   */
  config: AppConfig;
  
  /**
   * DynamoDB 服务实例
   */
  dynamoDBService: DynamoDBService | null;
  
  /**
   * 表列表
   */
  tables: string[];
  
  /**
   * 当前选中的表
   */
  currentTable: string | null;
  
  /**
   * 当前表信息
   */
  currentTableInfo: TableInfo | null;
  
  /**
   * 表数据
   */
  tableData: DynamoDBItem[];
  
  /**
   * 加载状态
   */
  loading: {
    config: boolean;
    tables: boolean;
    tableInfo: boolean;
    tableData: boolean;
    operation: boolean;
  };
  
  /**
   * 错误信息
   */
  error: string | null;
}

/**
 * 应用操作类型
 */
export type AppAction =
  | { type: 'SET_CONFIG'; payload: AppConfig }
  | { type: 'SET_DYNAMODB_SERVICE'; payload: DynamoDBService | null }
  | { type: 'SET_TABLES'; payload: string[] }
  | { type: 'SET_CURRENT_TABLE'; payload: string | null }
  | { type: 'SET_CURRENT_TABLE_INFO'; payload: TableInfo | null }
  | { type: 'SET_TABLE_DATA'; payload: DynamoDBItem[] }
  | { type: 'ADD_TABLE_DATA'; payload: DynamoDBItem }
  | { type: 'UPDATE_TABLE_DATA'; payload: DynamoDBItem }
  | { type: 'REMOVE_TABLE_DATA'; payload: DynamoDBItem }
  | { type: 'SET_LOADING'; payload: Partial<AppState['loading']> }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_ERROR' }
  | { type: 'RESET_STATE' };

/**
 * 应用上下文类型
 */
export interface AppContextType {
  /**
   * 应用状态
   */
  state: AppState;
  
  /**
   * 状态更新函数
   */
  dispatch: React.Dispatch<AppAction>;
  
  /**
   * 刷新表列表
   */
  refreshTables: () => Promise<void>;
  
  /**
   * 选择表
   */
  selectTable: (tableName: string) => Promise<void>;
  
  /**
   * 刷新表数据
   */
  refreshTableData: () => Promise<void>;
  
  /**
   * 更新配置
   */
  updateConfig: (config: AppConfig) => void;
}