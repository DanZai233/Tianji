import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import AstrologyRitual from "../components/AstrologyRitual";
import ChatBox from "../components/ChatBox";
import ReactMarkdown from "react-markdown";
import { LLMService } from "../lib/llm-service";
import { LLMProviderConfig, DEFAULT_PROVIDERS, LLMMessage, PROVIDER_INFO } from "../lib/llm-providers";

const STORAGE_KEY = "tianji_llm_providers";

function getActiveProvider(): LLMProviderConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const providers: LLMProviderConfig[] = saved ? JSON.parse(saved) : DEFAULT_PROVIDERS;
    const enabled = providers.find(p => p.enabled && p.apiKey);
    return enabled || null;
  } catch {
    return DEFAULT_PROVIDERS.find(p => p.enabled && p.apiKey) || null;
  }
}

const ZODIACS = [
  "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座",
  "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"
];

export default function Astrology() {
  const [zodiac, setZodiac] = useState("");
  const [aspect, setAspect] = useState("综合运势");
  const [timeframe, setTimeframe] = useState("今日");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [needsConfig, setNeedsConfig] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState<LLMProviderConfig[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const providers: LLMProviderConfig[] = saved ? JSON.parse(saved) : DEFAULT_PROVIDERS;
      const enabled = providers.filter(p => p.enabled && p.apiKey);
      setEnabledProviders(enabled);
      if (enabled.length > 0 && !selectedModel) {
        setSelectedModel(enabled[0].type);
      }
    } catch {
      setEnabledProviders(DEFAULT_PROVIDERS.filter(p => p.enabled && p.apiKey));
    }
  }, [selectedModel]);

  const calculate = async () => {
    if (!zodiac) return;
    setIsCalculating(true);

    const provider = enabledProviders.find(p => p.type === selectedModel);
    
    if (!provider) {
      setNeedsConfig(true);
      setIsCalculating(false);
      return;
    }

    try {
      const llmService = new LLMService(provider);
      const messages: LLMMessage[] = [
        { role: "user", content: `请作为一位资深占星师，为【${zodiac}】预测【${timeframe}】的【${aspect}】。结合当前的星象运行（可以虚构一些合理的星象如水星逆行、木星进入某宫等增加真实感），给出详细的运势解析和应对建议。排版优美，使用 Markdown 格式。` }
      ];
      
      const response = await llmService.sendMessage(messages);
      setResult(response.text || "星象模糊，请重试。");
    } catch (error) {
      console.error(error);
      setResult("抱歉，星辰轨迹被遮蔽，请稍后再试。");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto min-h-full flex flex-col">
      <AnimatePresence>
        {isCalculating && !result && (
          <AstrologyRitual onComplete={() => {}} />
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-light tracking-[0.2em] mb-4 text-blue-200">星象占星</h1>
        <p className="text-blue-300/60 tracking-wider">仰望星空，寻找命运的指引</p>
      </header>

      {!result && !needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <label className="block text-sm text-blue-300/70 mb-3 tracking-wider">请选择您的星座</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {ZODIACS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setZodiac(s)}
                    className={`py-3 px-2 rounded-xl border transition-all duration-300 tracking-wider text-sm ${
                      zodiac === s
                        ? "bg-blue-500/30 border-blue-400/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "bg-white/5 border-white/10 text-blue-200/70 hover:bg-white/10 hover:border-blue-300/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm text-blue-300/70 mb-3 tracking-wider">选择模型</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                >
                  {enabledProviders.map((p) => (
                    <option key={p.type} value={p.type}>
                      {p.name} {PROVIDER_INFO[p.type].isFree ? "（免费）" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-blue-300/70 mb-3 tracking-wider">预测维度</label>
                <div className="flex gap-2">
                  {["综合运势", "感情", "事业"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setAspect(d)}
                      className={`flex-1 py-2 px-3 rounded-lg border transition-all duration-300 tracking-wider text-xs ${
                        aspect === d
                          ? "bg-blue-500/30 border-blue-400/50 text-blue-100"
                          : "bg-white/5 border-white/10 text-blue-200/70 hover:bg-white/10"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-blue-300/70 mb-3 tracking-wider">时间范围</label>
                <div className="flex gap-2">
                  {["今日", "本周", "本月"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`flex-1 py-2 px-3 rounded-lg border transition-all duration-300 tracking-wider text-xs ${
                        timeframe === t
                          ? "bg-blue-500/30 border-blue-400/50 text-blue-100"
                          : "bg-white/5 border-white/10 text-blue-200/70 hover:bg-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={calculate}
              disabled={!zodiac || isCalculating}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 tracking-widest font-medium shadow-lg"
            >
              开始推运
            </button>
          </div>
        </div>
      ) : needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-medium text-white/80 mb-2">需要配置 API Key</h2>
          <p className="text-sm text-neutral-400 mb-6">请先配置大模型 API 才能使用此功能</p>
          <Link
            to="/settings/llm"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors tracking-wider font-medium"
          >
            去配置
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-medium tracking-wider text-blue-100">{zodiac}</h2>
                <p className="text-blue-300/60 tracking-wider mt-1">{timeframe}{aspect}</p>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setZodiac("");
                }}
                className="text-blue-300/50 hover:text-blue-200 transition-colors text-sm tracking-wider"
              >
                重新测算
              </button>
            </div>
            <div className="prose prose-invert prose-blue max-w-none">
              <ReactMarkdown>{result || ""}</ReactMarkdown>
            </div>
          </div>

          <ChatBox
            context={`星座：${zodiac}\n维度：${aspect}\n时间：${timeframe}\n\n预测结果：\n${result}`}
            systemInstruction="你是一位专业的占星师，正在为用户解读星象预测结果。请基于上面的星象预测内容，回答用户的疑问，给出更详细的解释和建议。"
          />
        </motion.div>
      )}
    </div>
  );
}
