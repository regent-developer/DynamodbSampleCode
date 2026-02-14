// 配置类型定义
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

/**
 * DynamoDB 配置
 */
export interface DynamoDBConfig {
  /**
   * DynamoDB 服务端点 URL
   */
  endpoint: string;
  
  /**
   * AWS 区域
   */
  region: string;
  
  /**
   * AWS 访问密钥
   */
  accessKeyId: string;
  
  /**
   * AWS 密钥
   */
  secretAccessKey: string;
}

/**
 * 应用配置
 */
export interface AppConfig {
  /**
   * DynamoDB 配置
   */
  dynamodb: DynamoDBConfig;
  
  /**
   * 应用主题
   */
  theme: 'light' | 'dark';
}