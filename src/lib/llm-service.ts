import { LLMProviderConfig, LLMMessage, LLMResponse, LLMProviderType } from "./llm-providers";

export class LLMService {
  private config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;
  }

  async sendMessage(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    switch (this.config.type) {
      case "gemini":
        return this.sendGemini(messages, systemInstruction);
      case "openai":
        return this.sendOpenAI(messages, systemInstruction);
      case "anthropic":
        return this.sendAnthropic(messages, systemInstruction);
      case "volcengine":
        return this.sendVolcengine(messages, systemInstruction);
      case "baidu":
        return this.sendBaidu(messages, systemInstruction);
      case "aliyun":
        return this.sendAliyun(messages, systemInstruction);
      case "tencent":
        return this.sendTencent(messages, systemInstruction);
      case "siliconflow":
        return this.sendSiliconFlow(messages, systemInstruction);
      case "deepseek":
        return this.sendDeepSeek(messages, systemInstruction);
      case "zhipu":
        return this.sendZhipu(messages, systemInstruction);
      case "moonshot":
        return this.sendMoonshot(messages, systemInstruction);
      default:
        throw new Error(`Unsupported provider: ${this.config.type}`);
    }
  }

  private async sendGemini(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: this.config.apiKey });
    
    const chat = ai.chats.create({
      model: this.config.model,
      config: {
        systemInstruction: systemInstruction || undefined,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const response = await chat.sendMessage({ message: lastMessage.content });
    
    return {
      text: response.text,
      model: this.config.model,
    };
  }

  private async sendOpenAI(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(`${this.config.baseURL || "https://api.openai.com/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: allMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: this.config.model,
      usage: {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
      },
    };
  }

  private async sendAnthropic(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: 2048,
        system: systemInstruction || undefined,
        messages: messages.map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.content[0].text,
      model: this.config.model,
      usage: {
        input_tokens: data.usage.input_tokens,
        output_tokens: data.usage.output_tokens,
      },
    };
  }

  private async sendVolcengine(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(`${this.config.baseURL || "https://ark.cn-beijing.volces.com/api/v3"}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: allMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`火山引擎 API error: ${response.statusText} - ${error}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: this.config.model,
      usage: {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
      },
    };
  }

  private async sendBaidu(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const lastMessage = messages[messages.length - 1];
    
    let url = `${this.config.baseURL || "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat"}/${this.config.model}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        system: systemInstruction || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`百度文心一言 API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.result,
      model: this.config.model,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      },
    };
  }

  private async sendAliyun(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(`${this.config.baseURL || "https://dashscope.aliyuncs.com/compatible-mode/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: allMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`阿里通义千问 API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: this.config.model,
      usage: {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
      },
    };
  }

  private async sendTencent(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(this.config.baseURL || "https://hunyuan.tencentcloudapi.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        Model: this.config.model,
        Messages: allMessages.map(m => ({
          Role: m.role === "assistant" ? "assistant" : "user",
          Content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`腾讯混元 API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.Choices?.[0]?.Message?.Content || data.Response?.Choices?.[0]?.Message?.Content,
      model: this.config.model,
      usage: {
        input_tokens: data.Usage?.InputTokens || 0,
        output_tokens: data.Usage?.OutputTokens || 0,
      },
    };
  }

  private async sendSiliconFlow(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: allMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`硅基流动 API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: this.config.model,
      usage: {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
      },
    };
  }

  private async sendDeepSeek(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: allMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`深度求索 API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: this.config.model,
      usage: {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
      },
    };
  }

  private async sendZhipu(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: allMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`智谱 AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.data?.choices?.[0]?.content || data.choices[0].message.content,
      model: this.config.model,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      },
    };
  }

  private async sendMoonshot(messages: LLMMessage[], systemInstruction?: string): Promise<LLMResponse> {
    const allMessages = systemInstruction
      ? [{ role: "system" as const, content: systemInstruction }, ...messages]
      : messages;

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: allMessages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`Moonshot API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      model: this.config.model,
      usage: {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
      },
    };
  }
}
