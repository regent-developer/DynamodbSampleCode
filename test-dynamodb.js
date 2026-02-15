// 测试 DynamoDB 服务连接
// 作者：KO
// 创建时间：2026-02-14

const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

// 配置 DynamoDB 客户端
const client = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  }
});

// 测试列出表
async function testListTables() {
  console.log('测试 DynamoDB 服务连接...');
  console.log('端点:', 'http://localhost:8000');
  
  try {
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    console.log('✅ 连接成功！');
    console.log('表列表:', response.TableNames || []);
    console.log('测试完成。');
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
    console.error('错误详情:', error);
  }
}

// 运行测试
testListTables();