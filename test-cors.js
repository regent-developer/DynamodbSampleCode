// 测试 CORS 行为
// 作者：KO
// 创建时间：2026-02-14

const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

// 测试不同的端点配置
const testEndpoints = [
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];

async function testEndpoint(endpoint) {
  console.log(`\n测试端点: ${endpoint}`);
  
  try {
    const client = new DynamoDBClient({
      endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
      }
    });
    
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    
    console.log('✅ 连接成功！');
    console.log('表列表:', response.TableNames || []);
    
    return true;
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
    return false;
  }
}

async function main() {
  console.log('测试不同端点的连接情况...');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n测试完成。');
}

main();