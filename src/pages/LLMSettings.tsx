import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Settings, Key, Eye, EyeOff, Check, X, RotateCcw } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"all" | "free" | LLMProviderType>("all");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 检查是否有新供应商，如果没有则添加
        const hasNewProviders = DEFAULT_PROVIDERS.some(
          dp => !parsed.some((p: LLMProviderConfig) => p.type === dp.type)
        );
        if (hasNewProviders) {
          // 合并旧配置和新供应商
          const merged = [
            ...parsed,
            ...DEFAULT_PROVIDERS.filter(dp => !parsed.some((p: LLMProviderConfig) => p.type === dp.type))
          ];
          setProviders(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } else {
          setProviders(parsed);
        }
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

  const handleBaseURLChange = (type: LLMProviderType, value: string) => {
    setProviders(prev =>
      prev.map(p => (p.type === type ? { ...p, baseURL: value } : p))
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
    localStorage.removeItem(STORAGE_KEY);
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
  const freeProviders = providers.filter(p => PROVIDER_INFO[p.type].isFree);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-light tracking-widest">大模型配置</h1>
          </div>
          <div className="flex gap-4 text-sm text-neutral-400">
            <span>已启用 <span className="text-emerald-400">{enabledProviders.length}</span> 个供应商</span>
            <span>免费模型 <span className="text-emerald-400">{freeProviders.filter(p => p.apiKey).length}</span> 个可用</span>
          </div>
        </motion.div>

        {/* 免费供应商推荐区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              推荐
            </span>
            <h2 className="text-lg font-medium tracking-wider text-emerald-200">免费模型供应商</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {freeProviders.map((provider) => (
              <button
                key={provider.type}
                onClick={() => setActiveTab(provider.type)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  provider.apiKey
                    ? "bg-emerald-500/20 border-emerald-500/50 hover:border-emerald-400"
                    : "bg-white/5 border-white/10 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium tracking-wider">{PROVIDER_INFO[provider.type].name}</span>
                  {provider.apiKey && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">
                    {provider.apiKey ? "已配置" : "未配置"}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                    免费
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 text-xs text-neutral-400">
            💡 提示：硅基流动、深度求索、智谱 AI、Moonshot AI 均提供新用户免费额度，推荐优先配置
          </div>
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
            全部 ({providers.length})
          </button>
          <button
            onClick={() => setActiveTab("free")}
            className={`px-4 py-2 rounded-lg text-sm tracking-wider whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === "free"
                ? "bg-emerald-500/30 text-emerald-300"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <span className="text-emerald-400">🆓</span>
            免费 ({freeProviders.length})
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
              {provider.enabled && provider.apiKey && (
                <Check className="w-3 h-3 text-emerald-400" />
              )}
              {PROVIDER_INFO[provider.type].name}
              {PROVIDER_INFO[provider.type].isFree && (
                <span className="text-emerald-400 text-xs">🆓</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {providers
            .filter(p => activeTab === "all" || activeTab === "free" && PROVIDER_INFO[p.type].isFree || activeTab === p.type)
            .map((provider, index) => (
              <motion.div
                key={provider.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
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
                    {PROVIDER_INFO[provider.type].isFree && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                        免费
                      </span>
                    )}
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

                  <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-400 mb-2 tracking-wider">
                        API Base URL
                      </label>
                      <input
                        type="text"
                        value={provider.baseURL || PROVIDER_INFO[provider.type].defaultBaseURL}
                        onChange={(e) => handleBaseURLChange(provider.type, e.target.value)}
                        placeholder={PROVIDER_INFO[provider.type].defaultBaseURL}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  {PROVIDER_INFO[provider.type].isFree && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-emerald-300 mb-2">
                        💰 免费额度说明
                      </h3>
                      <ul className="text-xs text-neutral-400 space-y-1">
                        {provider.type === "siliconflow" && (
                          <>
                            <li>• 新用户注册送 2000 万 tokens</li>
                            <li>• 支持 Qwen、GLM、Yi 等开源模型</li>
                            <li>• 速度极快，国内访问友好</li>
                          </>
                        )}
                        {provider.type === "deepseek" && (
                          <>
                            <li>• 新用户注册送 200 万 tokens</li>
                            <li>• DeepSeek-V3 性能优秀</li>
                            <li>• 价格亲民，性价比高</li>
                          </>
                        )}
                        {provider.type === "zhipu" && (
                          <>
                            <li>• 注册送 100 万 tokens</li>
                            <li>• GLM-4-Flash 免费使用</li>
                            <li>• 智谱 AI 官方服务稳定</li>
                          </>
                        )}
                        {provider.type === "moonshot" && (
                          <>
                            <li>• 新用户送 15 元体验金</li>
                            <li>• Moonshot 长文本能力强</li>
                            <li>• 月之暗面官方服务</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}

                  {!PROVIDER_INFO[provider.type].isFree && !provider.apiKey && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <p className="text-xs text-amber-300">
                        ⚠️ 此供应商需要付费，请先获取 API Key 并配置
                      </p>
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
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors tracking-wider text-white/80 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重置为默认
          </button>
        </div>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-4 tracking-wider">💡 使用建议</h3>
          <div className="text-sm text-neutral-400 space-y-2">
            <p>• 推荐优先配置硅基流动、深度求索、智谱 AI、Moonshot 等免费供应商</p>
            <p>• 可以在占卜页面的模型选择框中切换使用不同的模型</p>
            <p>• 配置会保存在浏览器本地存储（localStorage）</p>
            <p>• API Key 仅保存在本地，不会上传到服务器</p>
            <p>• 可以启用多个供应商，系统会按顺序选择可用的模型</p>
          </div>
        </div>
      </div>
    </div>
  );
}
