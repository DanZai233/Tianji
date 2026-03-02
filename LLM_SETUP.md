# 大模型 API 配置指南

## 功能概述

天机应用现在支持配置多个主流大模型 API 供应商，包括：

- **Gemini** (Google) - 默认启用
- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic Claude**
- **火山引擎豆包** (字节跳动)
- **百度文心一言**
- **阿里通义千问**
- **腾讯混元**

## 快速开始

### 1. 访问配置页面

点击左侧边栏底部的 **模型配置** 按钮（或访问 `/settings/llm` 路由）。

### 2. 配置 API Key

在配置页面中：

1. 选择您要配置的供应商（例如火山引擎豆包）
2. 输入 API Key
3. 选择或自定义模型名称
4. 点击 **已启用** 开关启用该供应商
5. 点击 **保存配置** 按钮

### 3. 使用配置

配置保存后，所有对话功能会自动使用已启用的供应商。如果有多个供应商启用，系统会优先使用第一个启用的供应商。

## 各供应商获取 API Key 指南

### 火山引擎豆包

1. 访问 [火山引擎控制台](https://console.volcengine.com/ark)
2. 创建或选择一个应用
3. 在应用详情页面获取 API Key
4. 默认端点：`https://ark.cn-beijing.volces.com/api/v3`
5. 推荐模型：`doubao-pro-4k-241215`、`doubao-lite-4k-241215`

**示例代码（TypeScript）**：
```typescript
const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "doubao-pro-4k-241215",
    messages: [{ role: "user", content: "你好" }],
  }),
});
```

### OpenAI

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的 API Key
3. 默认端点：`https://api.openai.com/v1`
4. 推荐模型：`gpt-4o-mini`、`gpt-4o`、`gpt-3.5-turbo`

**示例代码**：
```typescript
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "你好" }],
  }),
});
```

### Anthropic Claude

1. 访问 [Anthropic Console](https://platform.claude.com/settings/keys)
2. 创建 API Key
3. 默认端点：`https://api.anthropic.com/v1/messages`
4. 推荐模型：`claude-sonnet-4-20250514`、`claude-opus-4-20250514`

**示例代码**：
```typescript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: "你好" }],
  }),
});
```

### 百度文心一言

1. 访问 [百度智能云千帆大模型](https://console.bce.baidu.com/qianfan/)
2. 创建应用获取 API Key
3. 默认端点：`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat`
4. 推荐模型：`ernie-4.0-turbo-8k`、`ernie-speed-128k`

### 阿里通义千问

1. 访问 [阿里云百炼](https://bailian.console.aliyun.com/)
2. 创建 API Key
3. 默认端点：`https://dashscope.aliyuncs.com/compatible-mode/v1`
4. 推荐模型：`qwen-plus`、`qwen-max`

### 腾讯混元

1. 访问 [腾讯云控制台](https://console.cloud.tencent.com/hunyuan)
2. 创建 API Key
3. 默认端点：`https://hunyuan.tencentcloudapi.com`
4. 推荐模型：`hunyuan-lite`、`hunyuan-standard`

## 数据存储

- 所有配置保存在浏览器的 **localStorage** 中
- 配置仅存储在本地，不会上传到任何服务器
- 清除浏览器数据会删除配置

## 环境变量

您也可以通过环境变量配置 API Keys：

```bash
# .env 文件
GEMINI_API_KEY="your_gemini_key"
OPENAI_API_KEY="your_openai_key"
ANTHROPIC_API_KEY="your_anthropic_key"
VOLCENGINE_API_KEY="your_volcengine_key"
BAIDU_API_KEY="your_baidu_key"
ALIYUN_API_KEY="your_aliyun_key"
TENCENT_API_KEY="your_tencent_key"
```

## 切换供应商

1. 进入 **模型配置** 页面
2. 禁用当前启用的供应商
3. 启用新的供应商
4. 保存配置

## 故障排除

### 问题：对话时显示"天机受到干扰"

**原因**：API Key 无效或配置错误

**解决方法**：
1. 检查 API Key 是否正确
2. 确认供应商已启用
3. 查看浏览器控制台错误信息

### 问题：找不到火山引擎等国内供应商的选项

**原因**：版本过旧

**解决方法**：
1. 确保使用最新版本的应用
2. 清除缓存后刷新页面

## 技术实现

应用使用统一的 `LLMService` 类封装了所有供应商的 API 调用，支持：

- ✅ 统一的接口格式
- ✅ 自动切换供应商
- ✅ 本地配置存储
- ✅ 流式输出（部分供应商）
- ✅ 对话历史上下文

## 支持的模型特性

| 供应商 | 对话 | 系统指令 | 流式输出 | 函数调用 |
|--------|------|----------|----------|----------|
| Gemini | ✅ | ✅ | ✅ | ✅ |
| OpenAI | ✅ | ✅ | ✅ | ✅ |
| Anthropic | ✅ | ✅ | ✅ | ✅ |
| 火山引擎 | ✅ | ✅ | ✅ | ✅ |
| 百度文心 | ✅ | ✅ | ✅ | ✅ |
| 阿里通义 | ✅ | ✅ | ✅ | ✅ |
| 腾讯混元 | ✅ | ✅ | ✅ | ✅ |

## 反馈与支持

如有问题或建议，请在应用中反馈。
