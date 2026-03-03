export type LLMProviderType = 
  | "gemini" 
  | "openai" 
  | "anthropic" 
  | "volcengine"
  | "baidu"
  | "aliyun"
  | "tencent";

export interface LLMProviderConfig {
  type: LLMProviderType;
  name: string;
  apiKey: string;
  baseURL?: string;
  model: string;
  enabled: boolean;
}

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMResponse {
  text: string;
  model: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export const PROVIDER_INFO: Record<LLMProviderType, {
  name: string;
  defaultBaseURL: string;
  modelPrefix: string;
  envVarName: string;
}> = {
  gemini: {
    name: "Gemini",
    defaultBaseURL: "https://generativelanguage.googleapis.com",
    modelPrefix: "gemini-",
    envVarName: "GEMINI_API_KEY",
  },
  openai: {
    name: "OpenAI",
    defaultBaseURL: "https://api.openai.com/v1",
    modelPrefix: "gpt-",
    envVarName: "OPENAI_API_KEY",
  },
  anthropic: {
    name: "Anthropic Claude",
    defaultBaseURL: "https://api.anthropic.com",
    modelPrefix: "claude-",
    envVarName: "ANTHROPIC_API_KEY",
  },
  volcengine: {
    name: "火山引擎豆包",
    defaultBaseURL: "https://ark.cn-beijing.volces.com/api/v3",
    modelPrefix: "doubao-",
    envVarName: "VOLCENGINE_API_KEY",
  },
  baidu: {
    name: "百度文心一言",
    defaultBaseURL: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat",
    modelPrefix: "ernie-",
    envVarName: "BAIDU_API_KEY",
  },
  aliyun: {
    name: "阿里通义千问",
    defaultBaseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    modelPrefix: "qwen-",
    envVarName: "ALIYUN_API_KEY",
  },
  tencent: {
    name: "腾讯混元",
    defaultBaseURL: "https://hunyuan.tencentcloudapi.com",
    modelPrefix: "hunyuan-",
    envVarName: "TENCENT_API_KEY",
  },
};

export const DEFAULT_PROVIDERS: LLMProviderConfig[] = [
  {
    type: "gemini",
    name: "Gemini",
    apiKey: "",
    baseURL: "https://generativelanguage.googleapis.com",
    model: "gemini-2.0-flash",
    enabled: true,
  },
  {
    type: "openai",
    name: "OpenAI",
    apiKey: "",
    baseURL: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    enabled: false,
  },
  {
    type: "anthropic",
    name: "Claude",
    apiKey: "",
    baseURL: "https://api.anthropic.com",
    model: "claude-sonnet-4-20250514",
    enabled: false,
  },
  {
    type: "volcengine",
    name: "火山豆包",
    apiKey: "",
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    model: "doubao-pro-4k-241215",
    enabled: false,
  },
  {
    type: "baidu",
    name: "文心一言",
    apiKey: "",
    baseURL: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat",
    model: "ernie-4.0-turbo-8k",
    enabled: false,
  },
  {
    type: "aliyun",
    name: "通义千问",
    apiKey: "",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
    enabled: false,
  },
  {
    type: "tencent",
    name: "腾讯混元",
    apiKey: "",
    baseURL: "https://hunyuan.tencentcloudapi.com",
    model: "hunyuan-lite",
    enabled: false,
  },
];
