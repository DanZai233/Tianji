# 天机 - 多模型 AI 占卜应用

![首页](屏幕截图%202026-03-04%20103058.png)

支持多种主流大模型的在线占卜应用，提供星象占星、塔罗秘仪、奇门遁甲、周易八卦等功能。

🔗 **在线体验**: https://ai.studio/apps/f9086b8e-2d1e-4405-b32d-989ec2785745

## ✨ 特性

- 🎯 **四大占卜模块**: 星象、塔罗、奇门、周易
- 🤖 **多模型支持**: 支持 7 家主流大模型供应商
- 🔐 **本地配置**: API Key 仅存储在本地，安全隐私
- 💬 **智能对话**: 基于占卜结果的 AI 解惑对话
- 📱 **响应式设计**: 完美支持桌面和移动端

## 🚀 快速开始

### 环境要求

- Node.js 18+

### 安装

```bash
# 1. 克隆项目
git clone <repository-url>
cd Tianji

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入至少一个 API Key

# 4. 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 🤖 支持的模型供应商

| 供应商 | 模型示例 | 状态 |
|--------|----------|------|
| **Gemini** (Google) | gemini-2.0-flash | ✅ 默认 |
| **OpenAI** | gpt-4o-mini, gpt-3.5-turbo | ✅ |
| **Anthropic Claude** | claude-sonnet-4-20250514 | ✅ |
| **火山引擎豆包** | doubao-pro-4k-241215 | ✅ |
| **百度文心一言** | ernie-4.0-turbo-8k | ✅ |
| **阿里通义千问** | qwen-plus, qwen-max | ✅ |
| **腾讯混元** | hunyuan-lite | ✅ |

## 🔧 配置指南

### 方式一：界面配置（推荐）

1. 启动应用后，点击左侧边栏底部的 **模型配置**
2. 选择供应商，输入 API Key
3. 启用供应商并保存

### 方式二：环境变量

编辑 `.env.local` 文件：

```bash
# Gemini (默认)
GEMINI_API_KEY="your_gemini_api_key"

# OpenAI
OPENAI_API_KEY="your_openai_api_key"

# Anthropic
ANTHROPIC_API_KEY="your_anthropic_api_key"

# 火山引擎豆包
VOLCENGINE_API_KEY="your_volcengine_api_key"

# 百度文心一言
BAIDU_API_KEY="your_baidu_api_key"

# 阿里通义千问
ALIYUN_API_KEY="your_aliyun_api_key"

# 腾讯混元
TENCENT_API_KEY="your_tencent_api_key"
```

## 📚 详细文档

查看 [LLM_SETUP.md](./LLM_SETUP.md) 获取：
- 各供应商 API Key 获取教程
- 火山引擎等国内供应商接入示例
- 故障排除指南
- 技术实现细节

## 📁 项目结构

```
Tianji/
├── src/
│   ├── components/       # React 组件
│   │   ├── ChatBox.tsx   # AI 对话组件
│   │   ├── Layout.tsx    # 布局组件
│   │   └── ...
│   ├── pages/            # 页面组件
│   │   ├── Home.tsx      # 首页
│   │   ├── Astrology.tsx # 星象占星
│   │   ├── Tarot.tsx     # 塔罗
│   │   ├── QiMen.tsx     # 奇门遁甲
│   │   ├── IChing.tsx    # 周易
│   │   └── LLMSettings.tsx  # 模型配置
│   ├── lib/              # 工具库
│   │   ├── llm-providers.ts  # 供应商配置
│   │   ├── llm-service.ts    # LLM 服务层
│   │   └── utils.ts
│   └── App.tsx
├── .env.example          # 环境变量示例
├── LLM_SETUP.md          # 详细配置文档
└── package.json
```

## 🛠️ 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run lint

# 清理构建文件
npm run clean
```

## 📦 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **路由**: React Router DOM 7
- **样式**: Tailwind CSS 4
- **动画**: Motion
- **UI 组件**: Lucide React
- **Markdown**: React Markdown

## 🌟 使用火山引擎豆包

1. 访问 [火山方舟控制台](https://console.volcengine.com/ark) 注册账号
2. 创建应用并获取 API Key
3. 在应用配置页面启用"火山豆包"供应商
4. 填入 API Key 和模型名称（推荐：`doubao-pro-4k-241215`）

火山引擎兼容 OpenAI 格式，支持低成本高并发的模型调用。

## ⚠️ 注意事项

- API Key 仅保存在浏览器本地存储（localStorage），不会上传到任何服务器
- 清除浏览器数据会删除配置，请妥善保管 API Key
- 建议在生产环境使用后端代理 API 调用，避免暴露 API Key

## 📝 License

MIT

## 🔗 相关链接

- [火山引擎文档](https://www.volcengine.com/docs/82379)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Anthropic 文档](https://docs.anthropic.com)
- [百度千帆文档](https://cloud.baidu.com/doc/WENXINWORKSHOP)
