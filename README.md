# DynamoDB 管理工具

一个基于 React 18 + TypeScript + Tailwind CSS 开发的 DynamoDB 管理工具，支持本地 DynamoDB 实例的可视化管理。

## 功能特性

- 📁 **表管理**：创建、列出、删除表
- 📊 **数据操作**：对表中的数据进行增删改查
- ⚙️ **配置管理**：支持配置 DynamoDB 连接信息
- 🎨 **主题切换**：支持浅色和深色主题
- 🔄 **实时状态**：实时显示操作结果和错误信息

## 技术栈

- **前端**：React 18 + TypeScript + Tailwind CSS
- **构建工具**：Vite
- **状态管理**：React Context API + useReducer
- **配置管理**：本地存储
- **DynamoDB 客户端**：AWS SDK v3
- **图标库**：Lucide React

## 快速开始

### 1. 启动本地 DynamoDB

使用 Docker 启动本地 DynamoDB 实例：

```bash
docker-compose up -d
```

### 2. 安装依赖

```bash
cd web
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问：http://localhost:3000

## 项目结构

```
solo_DynamoDB/
├── web/                # React 前端应用
│   ├── src/            # 源代码
│   │   ├── context/    # 状态管理
│   │   ├── pages/      # 页面组件
│   │   ├── services/   # 服务封装
│   │   ├── types/      # 类型定义
│   │   ├── utils/      # 工具函数
│   │   ├── App.tsx     # 应用主组件
│   │   └── main.tsx    # 应用入口
│   ├── dist/           # 构建输出
│   ├── package.json    # 项目配置
│   └── vite.config.ts  # Vite 配置
├── data/               # DynamoDB 数据目录
├── doc/                # 文档
├── docker-compose.yml  # Docker 配置
└── README.md           # 项目说明
```

## 配置说明

在应用的 "设置" 页面中，您可以配置以下 DynamoDB 连接信息：

- **端点**：DynamoDB 服务的 URL，本地实例默认为 http://localhost:8000
- **区域**：AWS 区域，本地实例可以使用任意值
- **访问密钥**：AWS 访问密钥，本地实例可以使用任意值
- **密钥**：AWS 密钥，本地实例可以使用任意值

## 使用指南

### 创建表

1. 导航到 "表管理" 页面
2. 点击 "创建表" 按钮
3. 填写表名、主键等信息
4. 点击 "确认" 按钮

### 管理数据

1. 导航到 "数据操作" 页面
2. 选择要操作的表
3. 可以执行以下操作：
   - **创建**：填写数据并点击 "创建" 按钮
   - **读取**：填写主键并点击 "读取" 按钮
   - **更新**：填写主键和要更新的数据，点击 "更新" 按钮
   - **删除**：填写主键并点击 "删除" 按钮
   - **查询**：填写查询条件并点击 "查询" 按钮

### 切换主题

1. 导航到 "设置" 页面
2. 在 "主题设置" 部分选择要使用的主题
3. 页面会立即应用新主题

## 注意事项

- 本地 DynamoDB 实例默认运行在端口 8000
- 本地开发时，访问密钥和密钥可以使用任意值
- 配置修改后部分更改需要刷新页面才能生效
- 请确保 Docker 服务正在运行，并且 DynamoDB 容器已启动

## 故障排除

### 连接错误

如果遇到连接错误，请检查：

1. DynamoDB 容器是否正在运行
2. 端点 URL 是否正确设置为 http://localhost:8000
3. 网络连接是否正常

### 表操作错误

如果遇到表操作错误，请检查：

1. 表名是否符合 DynamoDB 的命名规范
2. 主键定义是否正确
3. 权限是否足够

## 许可证

MIT License

## 作者

KO

## 版本

1.0.0