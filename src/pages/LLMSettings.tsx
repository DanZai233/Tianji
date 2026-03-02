import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Settings, Key, Eye, EyeOff, Check, X, Plus, Trash2 } from "lucide-react";
import { 
  LLMProviderConfig, 
  LLMProviderType, 
  DEFAULT_PROVIDERS,
  PROVIDER_INFO,
} from "../lib/llm-providers";

const STORAGE_KEY = "tianji_llm_providers";

export default function LLMSettings() {
  const [providers, setProviders] = useState<LLMProviderConfig[]>([]);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<LLMProviderType | "all">("all");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProviders(parsed);
      } catch {
        setProviders(DEFAULT_PROVIDERS);
      }
    } else {
      setProviders(DEFAULT_PROVIDERS);
    }
  }, []);

  const handleApiKeyChange = (type: LLMProviderType, value: string) => {
    setProviders(prev =>
      prev.map(p => (p.type === type ? { ...p, apiKey: value } : p))
    );
    setIsDirty(true);
  };

  const handleModelChange = (type: LLMProviderType, value: string) => {
    setProviders(prev =>
      prev.map(p => (p.type === type ? { ...p, model: value } : p))
    );
    setIsDirty(true);
  };

  const handleToggleEnabled = (type: LLMProviderType) => {
    setProviders(prev =>
      prev.map(p => (p.type === type ? { ...p, enabled: !p.enabled } : p))
    );
    setIsDirty(true);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
    setIsDirty(false);
  };

  const handleReset = () => {
    setProviders(DEFAULT_PROVIDERS);
    setIsDirty(true);
  };

  const toggleApiKeyVisibility = (type: LLMProviderType) => {
    setShowApiKeys(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const enabledProviders = providers.filter(p => p.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-light tracking-widest">大模型配置</h1>
          </div>
          <p className="text-neutral-400 tracking-wider">
            配置您的 AI 大模型 API，当前已启用 {enabledProviders.length} 个供应商
          </p>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm tracking-wider whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-indigo-500/30 text-indigo-300"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            全部
          </button>
          {providers.map(provider => (
            <button
              key={provider.type}
              onClick={() => setActiveTab(provider.type)}
              className={`px-4 py-2 rounded-lg text-sm tracking-wider whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === provider.type
                  ? "bg-indigo-500/30 text-indigo-300"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {provider.enabled && (
                <Check className="w-3 h-3 text-emerald-400" />
              )}
              {PROVIDER_INFO[provider.type].name}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {providers
            .filter(p => activeTab === "all" || activeTab === p.type)
            .map((provider, index) => (
              <motion.div
                key={provider.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 ${
                  !provider.enabled && "opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      provider.enabled ? "bg-emerald-400" : "bg-neutral-600"
                    }`} />
                    <h2 className="text-xl font-medium tracking-wider">
                      {PROVIDER_INFO[provider.type].name}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleToggleEnabled(provider.type)}
                    className={`px-4 py-2 rounded-lg text-sm tracking-wider transition-colors flex items-center gap-2 ${
                      provider.enabled
                        ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                        : "bg-neutral-500/20 text-neutral-400 hover:bg-neutral-500/30"
                    }`}
                  >
                    {provider.enabled ? (
                      <>
                        <Check className="w-4 h-4" />
                        已启用
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        已禁用
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2 tracking-wider">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys[provider.type] ? "text" : "password"}
                        value={provider.apiKey}
                        onChange={(e) => handleApiKeyChange(provider.type, e.target.value)}
                        placeholder={`输入 ${PROVIDER_INFO[provider.type].name} API Key`}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                      <button
                        onClick={() => toggleApiKeyVisibility(provider.type)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                      >
                        {showApiKeys[provider.type] ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      环境变量：{PROVIDER_INFO[provider.type].envVarName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-400 mb-2 tracking-wider">
                      模型名称
                    </label>
                    <input
                      type="text"
                      value={provider.model}
                      onChange={(e) => handleModelChange(provider.type, e.target.value)}
                      placeholder="例如：gemini-2.0-flash"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      默认：{PROVIDER_INFO[provider.type].modelPrefix}*
                    </p>
                  </div>

                  {provider.type === "volcengine" && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-indigo-300 mb-2">
                        火山引擎配置说明
                      </h3>
                      <ul className="text-xs text-neutral-400 space-y-1">
                        <li>• API Key 从火山方舟控制台获取</li>
                        <li>• 默认端点：https://ark.cn-beijing.volces.com/api/v3</li>
                        <li>• 支持豆包系列模型（doubao-pro, doubao-lite 等）</li>
                        <li>• 兼容 OpenAI 格式</li>
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors tracking-wider font-medium"
          >
            保存配置
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors tracking-wider text-white/80"
          >
            重置为默认
          </button>
        </div>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-4 tracking-wider">配置说明</h3>
          <div className="text-sm text-neutral-400 space-y-2">
            <p>• 支持的主流供应商：Gemini、OpenAI、Anthropic Claude、火山引擎豆包、百度文心一言、阿里通义千问、腾讯混元</p>
            <p>• 配置会保存在浏览器本地存储（localStorage）</p>
            <p>• 可以启用多个供应商，在对话时会自动使用已启用的供应商</p>
            <p>• API Key 仅保存在本地，不会上传到服务器</p>
          </div>
        </div>
      </div>
    </div>
  );
}
