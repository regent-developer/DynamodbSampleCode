// DynamoDB 服务封装
// 作者：KO
// 创建时间：2026-02-06
// 修改时间：2026-02-06

import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
  DeleteTableCommand,
  DescribeTableCommand
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand as QueryDocumentCommand,
  ScanCommand as ScanDocumentCommand
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBConfig } from '../types/config';
import {
  TableInfo,
  CreateTableParams,
  DynamoDBItem,
  QueryParams,
  ScanParams
} from '../types/dynamodb';

/**
 * DynamoDB 服务类
 */
class DynamoDBService {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;

  /**
   * 构造函数
   * @param config DynamoDB 配置
   */
  constructor(config: DynamoDBConfig) {
    this.client = new DynamoDBClient({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId || 'dummy',
        secretAccessKey: config.secretAccessKey || 'dummy'
      }
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  /**
   * 创建表
   * @param params 创建表参数
   * @returns Promise<void>
   */
  async createTable(params: CreateTableParams): Promise<void> {
    const command = new CreateTableCommand(params);
    await this.client.send(command);
  }

  /**
   * 列出所有表
   * @returns 表名数组
   */
  async listTables(): Promise<string[]> {
    const command = new ListTablesCommand({});
    const response = await this.client.send(command);
    return response.TableNames || [];
  }

  /**
   * 删除表
   * @param tableName 表名
   * @returns Promise<void>
   */
  async deleteTable(tableName: string): Promise<void> {
    const command = new DeleteTableCommand({ TableName: tableName });
    await this.client.send(command);
  }

  /**
   * 获取表信息
   * @param tableName 表名
   * @returns 表信息
   */
  async getTableInfo(tableName: string): Promise<TableInfo> {
    const command = new DescribeTableCommand({ TableName: tableName });
    const response = await this.client.send(command);
    if (!response.Table) {
      throw new Error(`Table ${tableName} not found`);
    }
    return {
      TableName: response.Table.TableName!,
      TableStatus: response.Table.TableStatus!,
      KeySchema: response.Table.KeySchema!.map(schema => ({
        AttributeName: schema.AttributeName!,
        KeyType: schema.KeyType!
      })),
      AttributeDefinitions: response.Table.AttributeDefinitions!.map(def => ({
        AttributeName: def.AttributeName!,
        AttributeType: def.AttributeType!
      })),
      CreationDateTime: response.Table.CreationDateTime!,
      ItemCount: response.Table.ItemCount!,
      TableSizeBytes: response.Table.TableSizeBytes!
    };
  }

  /**
   * 创建数据项
   * @param tableName 表名
   * @param item 数据项
   * @returns Promise<void>
   */
  async putItem(tableName: string, item: DynamoDBItem): Promise<void> {
    const command = new PutCommand({
      TableName: tableName,
      Item: item
    });
    await this.docClient.send(command);
  }

  /**
   * 获取数据项
   * @param tableName 表名
   * @param key 键
   * @returns 数据项
   */
  async getItem(tableName: string, key: DynamoDBItem): Promise<DynamoDBItem | undefined> {
    const command = new GetCommand({
      TableName: tableName,
      Key: key
    });
    const response = await this.docClient.send(command);
    return response.Item;
  }

  /**
   * 更新数据项
   * @param tableName 表名
   * @param key 键
   * @param updateExpression 更新表达式
   * @param expressionAttributeValues 表达式属性值
   * @returns Promise<void>
   */
  async updateItem(
    tableName: string,
    key: DynamoDBItem,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>
  ): Promise<void> {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW'
    });
    await this.docClient.send(command);
  }

  /**
   * 删除数据项
   * @param tableName 表名
   * @param key 键
   * @returns Promise<void>
   */
  async deleteItem(tableName: string, key: DynamoDBItem): Promise<void> {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key
    });
    await this.docClient.send(command);
  }

  /**
   * 查询数据
   * @param params 查询参数
   * @returns 数据项数组
   */
  async query(params: QueryParams): Promise<DynamoDBItem[]> {
    const command = new QueryDocumentCommand(params);
    const response = await this.docClient.send(command);
    return response.Items || [];
  }

  /**
   * 扫描数据
   * @param params 扫描参数
   * @returns 数据项数组
   */
  async scan(params: ScanParams): Promise<DynamoDBItem[]> {
    const command = new ScanDocumentCommand(params);
    const response = await this.docClient.send(command);
    return response.Items || [];
  }

  /**
   * 关闭客户端连接
   */
  async close(): Promise<void> {
    await this.client.destroy();
  }
}

/**
 * 创建 DynamoDB 服务实例
 * @param config DynamoDB 配置
 * @returns DynamoDB 服务实例
 */
export const createDynamoDBService = (config: DynamoDBConfig): DynamoDBService => {
  return new DynamoDBService(config);
};

export default DynamoDBService;