// DynamoDB 类型定义
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

/**
 * DynamoDB 表信息
 */
export interface TableInfo {
  /**
   * 表名
   */
  TableName: string;
  
  /**
   * 表状态
   */
  TableStatus: string;
  
  /**
   * 键架构
   */
  KeySchema: {
    AttributeName: string;
    KeyType: 'HASH' | 'RANGE';
  }[];
  
  /**
   * 属性定义
   */
  AttributeDefinitions: {
    AttributeName: string;
    AttributeType: 'S' | 'N' | 'B';
  }[];
  
  /**
   * 创建时间
   */
  CreationDateTime: Date;
  
  /**
   * 项目数量
   */
  ItemCount: number;
  
  /**
   * 表大小（字节）
   */
  TableSizeBytes: number;
}

/**
 * 创建表参数
 */
export interface CreateTableParams {
  /**
   * 表名
   */
  TableName: string;
  
  /**
   * 键架构
   */
  KeySchema: {
    AttributeName: string;
    KeyType: 'HASH' | 'RANGE';
  }[];
  
  /**
   * 属性定义
   */
  AttributeDefinitions: {
    AttributeName: string;
    AttributeType: 'S' | 'N' | 'B';
  }[];
  
  /**
   * 预配置吞吐量
   */
  ProvisionedThroughput: {
    ReadCapacityUnits: number;
    WriteCapacityUnits: number;
  };
}

/**
 * DynamoDB 数据项
 */
export interface DynamoDBItem {
  [key: string]: any;
}

/**
 * 查询参数
 */
export interface QueryParams {
  /**
   * 表名
   */
  TableName: string;
  
  /**
   * 键条件表达式
   */
  KeyConditionExpression?: string;
  
  /**
   * 表达式属性值
   */
  ExpressionAttributeValues?: Record<string, any>;
  
  /**
   * 表达式属性名称
   */
  ExpressionAttributeNames?: Record<string, string>;
  
  /**
   * 投影表达式
   */
  ProjectionExpression?: string;
  
  /**
   * 排序顺序
   */
  ScanIndexForward?: boolean;
}

/**
 * 扫描参数
 */
export interface ScanParams {
  /**
   * 表名
   */
  TableName: string;
  
  /**
   * 筛选表达式
   */
  FilterExpression?: string;
  
  /**
   * 表达式属性值
   */
  ExpressionAttributeValues?: Record<string, any>;
  
  /**
   * 表达式属性名称
   */
  ExpressionAttributeNames?: Record<string, string>;
  
  /**
   * 投影表达式
   */
  ProjectionExpression?: string;
}